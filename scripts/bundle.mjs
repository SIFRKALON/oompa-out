// Inlines the game into single HTML files in dist/:
//   dist/oompa-out.html  a standalone page (download, itch.io, offline)
//   dist/artifact.html   the same page without the document wrapper, for
//                        hosts that supply their own <html>/<head>/<body>
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';

const root = new URL('..', import.meta.url);
const read = p => readFileSync(new URL(p, root), 'utf8');
const html = read('index.html');

const between = (a, b) => {
  const i = html.indexOf(a), j = html.indexOf(b);
  if (i < 0 || j < 0) throw new Error(`bundle: marker missing (${a} / ${b})`);
  return html.slice(i + a.length, j);
};
const scripts = [...between('<!-- @@SCRIPTS -->', '<!-- @@END -->').matchAll(/<script src="([^"]+)"><\/script>/g)].map(m => m[1]);
const inline = scripts.map(src => `<script>/* ${src} */\n${read(src).replace(/<\/script/gi, '<\\/script')}\n</script>`).join('\n');
const body = between('<!-- @@BODY -->', '<!-- @@SCRIPTS -->');
const css = `<style>\n${read('css/game.css')}\n</style>`;
const head = html.slice(html.indexOf('<head>') + 6, html.indexOf('</head>'))
  .replace(/<link rel="stylesheet" href="css\/game.css">\n?/, css);

mkdirSync(new URL('dist/', root), { recursive: true });
const standalone = `<!doctype html>\n<html lang="en">\n<head>${head}</head>\n<body>${body}${inline}\n</body>\n</html>\n`;
writeFileSync(new URL('dist/oompa-out.html', root), standalone);

const title = head.match(/<title>.*<\/title>/)[0];
const fonts = head.match(/<link rel="preconnect"[\s\S]*?display=swap">/)[0];
writeFileSync(new URL('dist/artifact.html', root), `${title}\n${fonts}\n${css}\n${body}${inline}\n`);
console.log(`bundled: dist/oompa-out.html ${(standalone.length / 1024).toFixed(0)} KB`);
