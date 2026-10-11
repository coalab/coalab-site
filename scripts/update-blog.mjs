// 네이버 블로그(valuablethings) 새 글 → 홈페이지용 데이터(assets/data/blog.json) + 썸네일(assets/img/blog/auto/) 갱신
// GitHub Actions(.github/workflows/blog-sync.yml)에서 주기적으로 실행됩니다. 직접 실행: node scripts/update-blog.mjs
import { readFile, writeFile, mkdir, readdir, unlink } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";

const BLOG_ID = "valuablethings";
const MAX = 8;
const UA = "Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.0 Mobile/15E148 Safari/604.1";
const DATA = "assets/data/blog.json";
const IMG_DIR = "assets/img/blog/auto";

const decode = (s) => s.replace(/&#x27;|&#39;/g, "'").replace(/&quot;/g, '"').replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&amp;/g, "&");
const cdata = (s) => (s || "").replace(/^<!\[CDATA\[/, "").replace(/\]\]>$/, "").trim();
const tag = (x, t) => { const m = x.match(new RegExp(`<${t}[^>]*>([\\s\\S]*?)</${t}>`)); return m ? cdata(m[1]) : ""; };
const clean = (s) => decode(s.replace(/<[^>]+>/g, " ")).replace(/[​\s]+/g, " ").trim();

async function get(url, opt = {}) {
  const r = await fetch(url, { headers: { "User-Agent": UA, ...(opt.headers || {}) }, signal: AbortSignal.timeout(25000) });
  if (!r.ok) throw new Error(`${url} -> ${r.status}`);
  return r;
}

const rss = await (await get(`https://rss.blog.naver.com/${BLOG_ID}.xml`)).text();
const items = [...rss.matchAll(/<item>([\s\S]*?)<\/item>/g)].slice(0, MAX).map((m) => {
  const x = m[1];
  const link = tag(x, "link");
  const id = (link.match(/\/(\d{9,})/) || [])[1];
  return { id, title: clean(tag(x, "title")).replace(/^\[[^\]]{1,12}\]\s*/, ""), date: new Date(tag(x, "pubDate")).toISOString().slice(0, 10), desc: clean(tag(x, "description")) };
}).filter((i) => i.id && i.title);

let old = { posts: [] };
try { old = JSON.parse(await readFile(DATA, "utf8")); } catch { /* 첫 실행 */ }
const oldById = new Map((old.posts || []).map((p) => [p.id, p]));
await mkdir(IMG_DIR, { recursive: true });

const posts = [];
for (const it of items) {
  const prev = oldById.get(it.id);
  let image = prev?.image || "";
  let remote = prev?.remote || "";
  if (!image || !existsSync(image)) {
    image = "";
    try {
      if (!remote) {
        const html = await (await get(`https://m.blog.naver.com/${BLOG_ID}/${it.id}`)).text();
        const og = (html.match(/property="og:image"\s+content="([^"]+)"/) || [])[1];
        if (og) remote = decode(og).replace(/^http:/, "https:");
      }
      if (remote && !process.env.NO_DOWNLOAD) {
        const r = await get(remote);   // 사이트 주소(Referer)를 보내지 않으면 내려받을 수 있음
        const type = r.headers.get("content-type") || "";
        const ext = type.includes("png") ? "png" : type.includes("webp") ? "webp" : "jpg";
        const buf = Buffer.from(await r.arrayBuffer());
        if (buf.length > 1000 && buf.length < 3_000_000) { image = `${IMG_DIR}/${it.id}.${ext}`; await writeFile(image, buf); }
      }
    } catch (e) { console.warn("썸네일 실패", it.id, e.message); }
  }
  const desc = it.desc.slice(0, 70) + (it.desc.length > 70 ? "…" : "");
  posts.push({ id: it.id, title: it.title, date: it.date, desc, image, remote, url: `https://blog.naver.com/${BLOG_ID}/${it.id}` });
}

if (!posts.length) { console.error("글을 읽지 못해 변경하지 않습니다."); process.exit(0); }

// 더 이상 쓰이지 않는 썸네일 정리
const keep = new Set(posts.map((p) => path.basename(p.image || "")));
if (!process.env.NO_DOWNLOAD) for (const f of await readdir(IMG_DIR)) if (!keep.has(f)) await unlink(path.join(IMG_DIR, f));

const next = JSON.stringify({ posts }, null, 2) + "\n";
let cur = ""; try { cur = await readFile(DATA, "utf8"); } catch { /* 없음 */ }
if (next !== cur) { await mkdir(path.dirname(DATA), { recursive: true }); await writeFile(DATA, next); console.log("갱신:", posts.length, "개"); } else console.log("변경 없음");
