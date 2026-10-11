/*
 * COS Pro 스터디 — 접근 코드 해독 모듈
 * 잠긴 회차(assets/cospro/locked/lesson-NN.enc.js)는 AES-256-GCM으로 암호화되어 있고,
 * 접근 코드(PBKDF2-SHA256으로 키 생성)를 입력해야 브라우저 안에서만 풀립니다.
 * 코드는 서버로 전송되지 않습니다.
 */
(function () {
  'use strict';

  var encoder = new TextEncoder();
  var decoder = new TextDecoder();

  function fromBase64(s) {
    var bin = atob(s);
    var out = new Uint8Array(bin.length);
    for (var i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
    return out;
  }

  // 공백·하이픈 제거, 소문자로 통일 (빌드 스크립트와 같은 규칙)
  function normalize(code) {
    return String(code || '').trim().replace(/[\s-]+/g, '').toLowerCase();
  }

  function deriveKey(code, salt, iterations) {
    return crypto.subtle.importKey('raw', encoder.encode(normalize(code)), 'PBKDF2', false, ['deriveKey'])
      .then(function (base) {
        return crypto.subtle.deriveKey(
          { name: 'PBKDF2', salt: salt, iterations: iterations, hash: 'SHA-256' },
          base,
          { name: 'AES-GCM', length: 256 },
          false,
          ['decrypt']
        );
      });
  }

  // 성공하면 회차 데이터 객체로, 코드가 틀리면 거절(reject)됩니다.
  function decrypt(pack, code) {
    return deriveKey(code, fromBase64(pack.salt), pack.iter)
      .then(function (key) {
        return crypto.subtle.decrypt({ name: 'AES-GCM', iv: fromBase64(pack.iv) }, key, fromBase64(pack.ct));
      })
      .then(function (buf) {
        return JSON.parse(decoder.decode(buf));
      });
  }

  window.CosproCrypto = {
    decrypt: decrypt,
    normalize: normalize,
    supported: !!(window.crypto && window.crypto.subtle)
  };
})();
