import Prism from 'prismjs';
import 'prismjs/components/prism-c';
import 'prismjs/components/prism-python.js';
import 'prismjs/components/prism-bash.js';
import 'prismjs/components/prism-nasm.js';
import 'prismjs/components/prism-docker.js';
import 'prismjs/components/prism-json.js';
import 'prismjs/components/prism-markup-templating.js';
import 'prismjs/plugins/line-numbers/prism-line-numbers.css';
import 'prismjs/plugins/line-numbers/prism-line-numbers.js';

import renderMathInElement from 'katex/dist/contrib/auto-render.js';

// Allow ```asm and ```shell shorthand to map to existing grammars.
if (Prism.languages.nasm && !Prism.languages.asm) Prism.languages.asm = Prism.languages.nasm;
if (Prism.languages.bash && !Prism.languages.shell) Prism.languages.shell = Prism.languages.bash;
if (Prism.languages.bash && !Prism.languages.sh) Prism.languages.sh = Prism.languages.bash;
if (Prism.languages.docker && !Prism.languages.dockerfile) Prism.languages.dockerfile = Prism.languages.docker;

const CALLOUT_TYPES = {
  NOTE:     { label: 'Note',     icon: 'ℹ' },
  TIP:      { label: 'Tip',      icon: '✦' },
  WARNING:  { label: 'Warning',  icon: '⚠' },
  IMPORTANT:{ label: 'Important',icon: '!'  },
  CAUTION:  { label: 'Caution',  icon: '✕' },
  LESSON:   { label: 'Lesson',   icon: '➜' }
};

function slugify(text) {
  return (text || '')
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

export function enhanceCodeBlocks() {
  document.querySelectorAll('pre code').forEach((block) => {
    const parent = block.parentElement;
    if (parent && !parent.querySelector('.copy-button')) {
      const button = document.createElement('button');
      button.innerText = 'Copy';
      button.className = 'copy-button';
      parent.appendChild(button);

      button.addEventListener('click', () => {
        const text = block.textContent || '';
        navigator.clipboard.writeText(text).then(() => {
          button.innerText = 'Copied!';
          setTimeout(() => (button.innerText = 'Copy'), 1500);
        });
      });
    }
  });

  // Normalise unlabelled fences (mdsvex emits `language-undefined`) so they
  // render as plain code without a misleading "Undefined" label.
  document.querySelectorAll('pre.language-undefined, code.language-undefined').forEach((el) => {
    el.classList.remove('language-undefined');
    el.classList.add('language-plain');
  });

  document.querySelectorAll('pre[class*="language-"]').forEach((block) => {
    block.classList.add('line-numbers');
  });

  document.querySelectorAll('pre[class*="language-"]').forEach((block) => {
    const match = block.className.match(/language-(\w+)/);
    if (!match) return;
    const lang = match[1];
    if (lang === 'plain') return;
    const display = lang === 'asm' ? 'ASM'
      : lang === 'sh' || lang === 'shell' ? 'Bash'
      : lang === 'dockerfile' ? 'Dockerfile'
      : lang.charAt(0).toUpperCase() + lang.slice(1);
    block.setAttribute('data-lang', `</> ${display}`);
  });

  Prism.highlightAll();
}

export function enhanceCallouts(root = document) {
  root.querySelectorAll('.markdown-body blockquote').forEach((bq) => {
    if (bq.dataset.callout) return;
    const firstP = bq.querySelector(':scope > p');
    if (!firstP) return;
    const m = firstP.textContent.match(/^\s*\[!(NOTE|TIP|WARNING|IMPORTANT|CAUTION|LESSON)\]\s*(.*)/i);
    if (!m) return;
    const type = m[1].toUpperCase();
    const meta = CALLOUT_TYPES[type];
    const rest = m[2];

    bq.dataset.callout = type.toLowerCase();
    bq.classList.add('callout', `callout-${type.toLowerCase()}`);

    const header = document.createElement('div');
    header.className = 'callout-header';
    header.innerHTML = `<span class="callout-icon">${meta.icon}</span><span class="callout-label">${meta.label}</span>`;
    bq.insertBefore(header, firstP);

    if (rest && rest.trim()) {
      firstP.textContent = rest.trim();
    } else {
      firstP.remove();
    }
  });
}

export function enhanceHeadings(root = document) {
  const used = new Set();
  root.querySelectorAll('.markdown-body h2, .markdown-body h3').forEach((h) => {
    if (h.id) {
      used.add(h.id);
      return;
    }
    const base = slugify(h.textContent || '');
    if (!base) return;
    let id = base;
    let n = 2;
    while (used.has(id)) id = `${base}-${n++}`;
    used.add(id);
    h.id = id;

    const anchor = document.createElement('a');
    anchor.href = `#${id}`;
    anchor.className = 'heading-anchor';
    anchor.setAttribute('aria-label', `link to ${h.textContent}`);
    anchor.innerText = '#';
    h.appendChild(anchor);
  });
}

export function renderMath() {
  renderMathInElement(document.body, {
    delimiters: [
      { left: '$$', right: '$$', display: true },
      { left: '$', right: '$', display: false }
    ]
  });
}
