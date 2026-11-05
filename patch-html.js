// Берёт ../kikitori/index.html, подключает нативную озвучку и пишет html.js
// Замены устойчивы к форматированию (отступы, переносы строк).
const fs = require('fs');
let h = fs.readFileSync('../kikitori/index.html', 'utf8');

function replaceOnce(re, replacement, what) {
  if (!re.test(h)) throw new Error(what + ' not found');
  h = h.replace(re, replacement);
}

// speak(): в приложении озвучивает expo-speech через мост
replaceOnce(
  /function speak\(text\)\s*\{\s*if\s*\(!\('speechSynthesis' in window\)\)\s*return;/,
  `function speak(text){
        if(window.ReactNativeWebView){
          $('play').classList.add('speaking');
          window.ReactNativeWebView.postMessage(JSON.stringify({type:'speak', text, rate}));
          return;
        }
        if(!('speechSynthesis' in window)) return;`,
  'speak()'
);

// колбэк окончания речи
replaceOnce(
  /\(function\s*\(\)\s*\{\s*const \$ = id/,
  'window.__ttsDone = () => document.getElementById("play").classList.remove("speaking");\n(function(){\n  const $ = id',
  'IIFE start'
);

// предупреждение о голосе: по умолчанию скрыто, показывает его нативный код
replaceOnce(/<\/style>/, '#warn{display:none!important}\n#warn.show{display:block!important}\n</style>', '</style>');
replaceOnce(
  /<div class="warn" id="warn" hidden>\s*<p>[\s\S]*?<\/p>/,
  '<div class="warn" id="warn" hidden>\n<p>No Japanese voice is installed on this phone, so the numbers will not sound Japanese. Settings → Text-to-speech (or Language &amp; input → Text-to-speech) → Google Text-to-speech → Install voice data → 日本語. Then restart the app.</p>',
  'warn block'
);

fs.writeFileSync('html.js', 'export default ' + JSON.stringify(h) + ';\n');
console.log('html.js written,', h.length, 'chars');
