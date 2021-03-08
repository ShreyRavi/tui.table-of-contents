import { searchHeadings } from './search';

function stripHtmlTags(md) {
  let doc = new DOMParser().parseFromString(md, 'text/html');
  return doc.body.textContent || "";
}

function groupByLevel(elements, result=[]) {
  if (!elements.length) {
    return [];
  }
  const levelResult = [elements[0]];
  let i = 0;
  while ((i + 1) < elements.length) {
    if (elements[i].level === elements[i + 1].level) {
      levelResult.push(elements[i + 1]);
      i += 1;
    } else {
      break;
    }
  }
  return result.concat([levelResult], groupByLevel(elements.slice(levelResult.length), result));
}


function generateList(elements, tocOptions) {
  const { title, bulletType } = tocOptions;
  return `${`<ol type="${bulletType}">`.repeat(elements[0].level - 1)}${elements.filter(element => element.name !== title).map(element => `<li>${element.name}</li>`).join('')}${"</ol>".repeat(elements[0].level - 1)}`;
}

/**
 * renderTableOfContents
 * @param {*} tocWrapperId The wrapper ID to edit 
 * @param {*} md A String version of markdown to parse
 * @param {{title: String,  bulletType: String}} tocOptions An object of options for toc render, with title being the title of the Table of Contents, bulletType being type of bullet shown (eg. 1 = number, I = Roman numerals, i = lowercase Roman numerals)
 * @param {String} tocInput Raw input from codeBlock (not used currently)
 */
function renderTableOfContents(md, tocOptions) {
  return `<h${tocOptions.headingSize}> ${tocOptions.title}</h${tocOptions.headingSize}><ol type="${tocOptions.bulletType}">${groupByLevel(searchHeadings(stripHtmlTags(md))).map(headings => generateList(headings, tocOptions)).join('')}</ol>`;
}

function insertTableOfContents(editor, md,pluginOptions) {
  const el = document.querySelector(`#toc`);
  if (!el) { // if first time called, insert div
    editor.setMarkdown(`<span id="toc"></span>\n${editor.getMarkdown()}`);
  } else {
    el.parentElement.removeChild(el);
  }
  updateTableOfContents(md, pluginOptions);
}

function updateTableOfContents(md, pluginOptions) {
  const el = document.querySelector(`#toc`);
  if (!el) { // if not already inserted
    return;  // do nothing
  }
  el.innerHTML = `${renderTableOfContents(md, pluginOptions)}`;
}

function initUI(editor, pluginOptions) {
  editor.getUI().getToolbar().insertItem(-1, {
    type: 'button',
    options: {
        event: 'insertTableOfContents',
        tooltip: 'Toggle Table of Contents',
        text: '📖',
        style: 'color: black; background: white;'
    }
  });
  editor.eventManager.addEventType('insertTableOfContents');
  editor.eventManager.listen('insertTableOfContents', () => insertTableOfContents(editor, editor.getMarkdown(), pluginOptions));
  editor.eventManager.listen('change', () => updateTableOfContents(editor.getMarkdown(), pluginOptions))
}

/**
 * tuiTableOfContents
 * @param {Editor|Viewer} editor Instance of Editor or Viewer from Toast UI
 * @param {{title: String,  headingSize: Number, bulletType: String}} pluginOptions An object of options for toc render, with title being the title of the Table of Contents, headingSize being the size of title, bulletType being type of bullet shown (eg. 1 = number, I = Roman numerals, i = lowercase Roman numerals) (WIP, not fully functional)
 */
export default function tableOfContentsPlugin(editor, pluginOptions={title: "Table of Contents", headingSize: 1, bulletType: "1"}) {
  const { codeBlockManager } = Object.getPrototypeOf(editor).constructor;
  codeBlockManager.setReplacer('toc', (tocInput) => {
    return `<span id="toc"></span>`;
  });
  initUI(editor, pluginOptions);
}