// tuiCitation user-defined Toast plugin
import ToastEditor from '@toast-ui/editor';

//helper methods
function renderCitations() {
    let count = 0;
    const md = ToastEditor.getMarkdown();
    ToastEditor.setMarkdown(md.replace(/[^>]`\{cite[^}]+\}\}`/g, (match) => {
        count += 1;
        return `<span class="citation">${match}></span><sup>${count}</sup>`;
    }));
}

function renderTableOfContents(tocWrapperId) {
    const el = document.querySelector(`#${tocWrapperId}`);
    el.innerHTML = `<h3>Table Of Contents</h3>`;
}

/**
 * tuiTableOfContents
 * @param {Editor|Viewer} editor - instance of Editor or Viewer from Toast UI
 * @param {Object} options - options for plugin (WIP)
 */
export default function tuiTableOfContents(options) {
    ToastEditor.codeBlockManager.setReplacer('tableofcontents', tocOptions => {
        const tocWrapperId = `toc${Math.random()
            .toString(36)
            .substr(2, 10)}`;
        setTimeout(renderTableOfContents.bind(null, tocWrapperId), 0);
        return `<div id="${tocWrapperId}"></div>`;
    });
}