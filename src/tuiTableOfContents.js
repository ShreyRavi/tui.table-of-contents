import { parse } from 'node-html-parser';

/**
 * tuiTableOfContents
 * @param {Editor|Viewer} editorRef - ref instance of Editor or Viewer from Toast UI
 * @param {Object} options - options for plugin (WIP)
 */
export default function tuiTableOfContents(editorRef, options={}) {
    const edtr = editorRef.current?.getInstance();
    const eventManager = edtr.eventManager;
    try {
        eventManager.addEventType('insertTableOfContents');
    } catch(e) {
        return;
    }
    eventManager.listen('insertTableOfContents', () => {
        const insertTableOfContents = () => {
          const html = parse(edtr.getHtml());

          const headings = html.childNodes.filter((node) => ((node.tagName) && (node.tagName.match(/^[h|H][1-6]$/g)) && (node.rawText !== "Table of Contents"))).map((node) => node.rawText);

          const tableOfContentHtmlString = `<h1>Table of Contents</h1><ol>${headings.map((heading, idx) => `<li><a href="#headingNo${idx}">${heading}</a></li>`).join('')}</ol>`;

          edtr.setHtml(tableOfContentHtmlString);

          const sliceIdx = html.firstChild.rawText === "Table of Contents" ? 4 : 0;
          html.childNodes.slice(sliceIdx).forEach((node, idx) => {
            if (node.outerHTML) {
              if ((node.tagName) && (node.tagName.match(/^[h|H][1-6]$/g))) {
                const headingNo = parseInt(node.tagName.slice(1)) + 1;
                edtr.setMarkdown(edtr.getMarkdown() + `\n${Array(headingNo).join("#")} [${node.innerHTML}](#headingNo${idx})`);
              } else {
                edtr.setHtml(edtr.getHtml() + node.outerHTML);
              }
            } else if (node.innerText) {
                edtr.setHtml(edtr.getHtml() + node.innerText);
            } else {
            }
          });
        };
        insertTableOfContents();
    });
}