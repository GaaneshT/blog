
import Prism from 'prismjs';
import 'prismjs/themes/prism-tomorrow.css';
import 'prismjs/components/prism-c';
import 'prismjs/components/prism-python.js';
import 'prismjs/plugins/line-numbers/prism-line-numbers.css';
import 'prismjs/plugins/line-numbers/prism-line-numbers.js';


import renderMathInElement from 'katex/dist/contrib/auto-render.js';


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

  document.querySelectorAll('pre[class*="language-"]').forEach((block) => {
    block.classList.add('line-numbers');
  });

  // Add a data-lang attribute based on the language class (for display purposes)
  document.querySelectorAll('pre[class*="language-"]').forEach((block) => {
    const match = block.className.match(/language-(\w+)/);
    if (match) {
      const lang = match[1];
      block.setAttribute('data-lang', `</> ${lang.charAt(0).toUpperCase() + lang.slice(1)}`);
    }
  });

  Prism.highlightAll();
}


export function renderMath() {
  renderMathInElement(document.body, {
    delimiters: [
      { left: '$$', right: '$$', display: true },
      { left: '$', right: '$', display: false }
    ]
  });
}
