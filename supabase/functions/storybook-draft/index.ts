// Supabase Edge Function: storybook-draft
// 초등 AI 동화책 활동지(ai-storybook.html)에서 호출 → OpenRouter(무료 모델)로 8장면 시나리오 생성
// 비밀 값(OPENROUTER_API_KEY)은 코드가 아니라 Supabase "Secrets"에만 저장합니다.
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const ORIGINS = ["https://coalab.co.kr", "https://www.coalab.co.kr"];
const MODEL = Deno.env.get("OPENROUTER_MODEL") || "openrouter/free";
const IP_LIMIT = 120;   // IP 한 곳(교실 하나)당 시간당 호출 수
const ALL_LIMIT = 600;  // 전체 시간당 호출 수

// 서버에서 허용하는 재료 목록 (여기에 없는 값은 거절 → 이상한 입력이 AI에 전달되지 않음)
const WHO = ["아기 토끼", "작은 곰", "꼬마 로봇", "용감한 고양이", "숲속 다람쥐", "아기 공룡", "마법사 소녀", "우주 탐험가"];
const PLACE = ["깊은 숲속", "바닷속 마을", "구름 위 나라", "우리 동네 놀이터", "달나라", "장난감 가게", "눈 내리는 산", "비밀 도서관"];
const TROUBLE = ["소중한 물건을 잃어버렸어요", "친구와 다퉈서 사이가 멀어졌어요", "길을 잃어버렸어요", "무서워서 해 보지 못한 일이 있어요", "새로 온 친구가 외로워 보여요", "마을에 큰 비밀이 생겼어요"];
const LESSON = ["용기", "친구를 아끼는 마음", "정직", "나누는 기쁨", "포기하지 않는 마음", "서로 다름을 존중하기", "환경을 지키는 마음"];
const GRADE: Record<string, string> = {
  low: "1~2학년이 읽을 수 있게 아주 쉬운 낱말, 한 문장은 짧게, 장면마다 2문장.",
  mid: "3~4학년이 읽을 수 있게 쉬운 낱말로, 장면마다 3문장.",
  high: "5~6학년이 읽을 수 있게 대화와 감정 표현을 넣어, 장면마다 4문장.",
};

function cors(req: Request) {
  const o = req.headers.get("origin") || "";
  return {
    "Access-Control-Allow-Origin": ORIGINS.includes(o) ? o : ORIGINS[0],
    "Access-Control-Allow-Headers": "content-type, authorization, apikey, x-client-info",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Vary": "Origin",
  };
}
function json(req: Request, body: unknown, status = 200) {
  return new Response(JSON.stringify(body), { status, headers: { ...cors(req), "Content-Type": "application/json; charset=utf-8" } });
}
async function sha(s: string) {
  const b = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(s));
  return Array.from(new Uint8Array(b)).slice(0, 8).map((x) => x.toString(16).padStart(2, "0")).join("");
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") return new Response(null, { status: 204, headers: cors(req) });
  if (req.method !== "POST") return json(req, { error: "POST only" }, 405);
  const origin = req.headers.get("origin") || "";
  if (origin && !ORIGINS.includes(origin)) return json(req, { error: "forbidden" }, 403);

  let b: Record<string, string>;
  try { b = await req.json(); } catch { return json(req, { error: "bad json" }, 400); }
  const name = String(b.name || "").trim().slice(0, 12);
  if (!/^[가-힣A-Za-z0-9 ]{1,12}$/.test(name)) return json(req, { error: "이름은 한글·영문·숫자 12자까지예요." }, 400);
  if (!WHO.includes(b.who) || !PLACE.includes(b.place) || !TROUBLE.includes(b.trouble) || !LESSON.includes(b.lesson) || !GRADE[b.grade]) {
    return json(req, { error: "재료 값이 올바르지 않아요." }, 400);
  }

  // 사용량 제한
  const sb = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);
  const ip = (req.headers.get("x-forwarded-for") || "unknown").split(",")[0].trim();
  const okIp = await sb.rpc("storybook_hit", { p_key: "ip:" + await sha(ip), p_limit: IP_LIMIT });
  const okAll = await sb.rpc("storybook_hit", { p_key: "all", p_limit: ALL_LIMIT });
  if (okIp.data === false || okAll.data === false) return json(req, { error: "오늘은 너무 많이 써서 잠시 쉬어야 해요. 조금 뒤에 다시 해 보세요." }, 429);

  const key = Deno.env.get("OPENROUTER_API_KEY");
  if (!key) return json(req, { error: "서버 설정이 아직 끝나지 않았어요." }, 500);

  const system = "너는 초등학생을 위한 따뜻한 동화 작가야. 무섭거나 폭력적이거나 어른 주제는 쓰지 않고, 희망적이고 교훈이 자연스럽게 드러나는 이야기를 써. 반드시 JSON만 출력해.";
  const user = `다음 재료로 동화 시나리오를 만들어 줘.
- 주인공: ${b.who} "${name}" (이름은 지어낸 이름이야)
- 장소: ${b.place}
- 생긴 문제: ${b.trouble}
- 이야기가 알려 주는 마음: ${b.lesson}
규칙:
1) ${GRADE[b.grade]}
2) 정확히 8장면: 발단 2, 전개 2, 위기 1, 절정 1, 결말 2.
3) 출력 형식(JSON만): {"title":"동화 제목","scenes":["장면1 글","장면2 글",...,"장면8 글"]}
4) 장면 글에 번호나 소제목은 붙이지 마.`;

  let res: Response;
  try {
    res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: { "Authorization": "Bearer " + key, "Content-Type": "application/json", "HTTP-Referer": "https://coalab.co.kr", "X-Title": "COALAB AI Storybook" },
      body: JSON.stringify({ model: MODEL, temperature: 0.9, max_tokens: 2000, messages: [{ role: "system", content: system }, { role: "user", content: user }] }),
      signal: AbortSignal.timeout(45000),
    });
  } catch { return json(req, { error: "AI가 대답하지 않아요. 잠시 뒤에 다시 해 보세요." }, 504); }
  if (!res.ok) return json(req, { error: "AI 연결에 문제가 있어요." }, 502);

  const data = await res.json();
  const text: string = data?.choices?.[0]?.message?.content || "";
  const m = text.match(/\{[\s\S]*\}/);
  try {
    const out = JSON.parse(m ? m[0] : text);
    const scenes = Array.isArray(out.scenes) ? out.scenes.map((s: unknown) => String(s).trim()).filter(Boolean) : [];
    if (scenes.length < 8) throw new Error("scenes");
    return json(req, { title: String(out.title || "").slice(0, 40), scenes: scenes.slice(0, 8).map((s: string) => s.slice(0, 600)) });
  } catch { return json(req, { error: "이야기를 만들지 못했어요. 다시 눌러 보세요." }, 502); }
});
