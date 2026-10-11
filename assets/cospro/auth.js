/* COS Pro 스터디 — 수강생 로그인(Supabase). 잠긴 회차 데이터는 승인된 로그인 사용자에게만 DB에서 내려옵니다. */
(function () {
  var CDN = 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.45.4/dist/umd/supabase.min.js';
  var cfg = window.COSPRO_AUTH_CONFIG || {};
  var api = { configured: !!(cfg.url && cfg.anonKey) };

  function loadLib() {
    return new Promise(function (ok, fail) {
      if (window.supabase && window.supabase.createClient) return ok();
      var s = document.createElement('script');
      s.src = CDN; s.onload = ok; s.onerror = function () { fail(new Error('lib')); };
      document.head.appendChild(s);
    });
  }

  /* ctx: {root, n, shell(inner), esc, open(lesson)} */
  api.run = function (ctx) {
    var esc = ctx.esc, root = ctx.root, n = ctx.n, client, mode = 'in';
    function show(inner) { root.innerHTML = ctx.shell(inner); }
    function msgHtml(m, bad) { return m ? '<p class="cp-lock-msg" role="status"' + (bad ? ' style="color:#b3261e"' : '') + '>' + esc(m) + '</p>' : '<p class="cp-lock-msg" id="cp-lock-msg"></p>'; }

    function form(msg, bad) {
      var up = mode === 'up';
      show('<p>이 회차는 승인된 수강생만 볼 수 있습니다. ' + (up ? '가입 후 이메일 인증을 마치고, 승인을 기다려 주세요.' : '로그인해 주세요.') + '</p>' +
        '<form class="cp-lock-form" id="cp-auth-form">' +
        '<input type="email" id="cp-email" autocomplete="email" placeholder="이메일" required>' +
        '<input type="password" id="cp-pw" autocomplete="' + (up ? 'new-password' : 'current-password') + '" placeholder="비밀번호 (6자 이상)" minlength="6" required>' +
        '<button type="submit" id="cp-go" class="cp-btn">' + (up ? '가입하기' : '로그인') + '</button></form>' +
        msgHtml(msg, bad) +
        '<p class="cp-note"><a href="#" id="cp-switch">' + (up ? '이미 계정이 있어요 → 로그인' : '처음이에요 → 가입하기') + '</a></p>' +
        '<p class="cp-note">수강 승인은 <a href="https://open.kakao.com/o/sZhJVf7" target="_blank" rel="noopener">카카오톡 문의</a>로 가입한 이메일을 알려 주세요.</p>');
      document.getElementById('cp-switch').addEventListener('click', function (e) { e.preventDefault(); mode = up ? 'in' : 'up'; form(''); });
      document.getElementById('cp-auth-form').addEventListener('submit', function (e) {
        e.preventDefault();
        var email = document.getElementById('cp-email').value.trim(), pw = document.getElementById('cp-pw').value;
        document.getElementById('cp-go').disabled = true;
        var p = up ? client.auth.signUp({ email: email, password: pw, options: { emailRedirectTo: location.href } })
                   : client.auth.signInWithPassword({ email: email, password: pw });
        p.then(function (r) {
          if (r.error) { form(up ? '가입하지 못했습니다: ' + r.error.message : '이메일 또는 비밀번호가 맞지 않거나, 이메일 인증이 아직입니다.', true); return; }
          if (up) { mode = 'in'; form('가입 메일을 보냈습니다. 메일의 인증 링크를 누른 뒤 여기서 로그인해 주세요.'); return; }
          fetchLesson();
        }, function () { form('연결에 실패했습니다. 잠시 후 다시 시도해 주세요.', true); });
      });
    }

    function pending() {
      show('<p>로그인되었지만 아직 수강 승인이 되지 않았습니다.</p><p class="cp-note">카카오톡 문의로 가입한 이메일을 알려 주시면 승인해 드립니다. 승인 후 새로 고침해 주세요.</p>' +
        '<p><button type="button" class="cp-btn" id="cp-retry">다시 확인</button> <button type="button" class="cp-btn" id="cp-out">로그아웃</button></p>');
      document.getElementById('cp-retry').addEventListener('click', fetchLesson);
      document.getElementById('cp-out').addEventListener('click', logout);
    }

    function logout() { client.auth.signOut().then(function () { form(''); }); }

    function fetchLesson() {
      show('<p>확인하는 중…</p>');
      client.from('cospro_lessons').select('data').eq('n', n).maybeSingle().then(function (r) {
        if (r.error) { pending(); return; }
        if (!r.data) { pending(); return; }
        ctx.open(r.data.data);
        var nav = document.querySelector('header nav');
        if (nav && !document.getElementById('cp-logout')) {
          var a = document.createElement('a'); a.href = '#'; a.id = 'cp-logout'; a.textContent = '로그아웃';
          a.addEventListener('click', function (e) { e.preventDefault(); client.auth.signOut().then(function () { location.reload(); }); });
          nav.insertBefore(a, nav.lastElementChild);
        }
      }, function () { form('연결에 실패했습니다.', true); });
    }

    if (!api.configured) { show('<p>로그인 설정이 아직 완료되지 않았습니다.</p>'); return; }
    show('<p>확인하는 중…</p>');
    loadLib().then(function () {
      client = window.supabase.createClient(cfg.url, cfg.anonKey);
      client.auth.getSession().then(function (r) {
        if (r.data && r.data.session) fetchLesson(); else form('');
      });
    }, function () { show('<p>로그인 모듈을 불러오지 못했습니다. 네트워크를 확인해 주세요.</p>'); });
  };

  window.CosproAuth = api;
})();
