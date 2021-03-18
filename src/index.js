import { searchHeadings } from './search';

function getHeadingId(heading) {
  return heading.replace(/\s/g, '').slice(0, 10);
}

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
  return `${`<ol type="${bulletType}">`.repeat(elements[0].level - 1)}${elements.filter(element => element.name !== title).map(element => `<li><a href="#${getHeadingId(element.name)}">${element.name}</a></li>`).join('')}${"</ol>".repeat(elements[0].level - 1)}`;
}

/**
 * renderTableOfContents
 * @param {*} tocWrapperId The wrapper ID to edit 
 * @param {*} md A String version of markdown to parse
 * @param {{title: String,  bulletType: String}} tocOptions An object of options for toc render, with title being the title of the Table of Contents, bulletType being type of bullet shown (eg. 1 = number, I = Roman numerals, i = lowercase Roman numerals)
 * @param {String} tocInput Raw input from codeBlock (not used currently)
 */
function renderTableOfContents(md, tocOptions) {
  return `<h${tocOptions.headingSize}>
            ${tocOptions.title}
          </h${tocOptions.headingSize}>
          <ol type="${tocOptions.bulletType}">
            ${groupByLevel(searchHeadings(stripHtmlTags(md))).map(headings => generateList(headings, tocOptions)).join('')}
          </ol>`;
}

function insertTableOfContents(editor, md,pluginOptions) {
  const el = document.querySelector(`#toc`);
  if (!el) { // if first time called, insert div
    editor.setMarkdown(`\`\`\`toc\nTable of contents will be here\n\`\`\`\n${editor.getMarkdown()}`);
  } else {
    // this should be actually setting the MD
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
  // TODO: can we trust markdownValue?
  // TODO: this still doesn't seem to work for Editor instance. i think it's because the replacer probably hasn't run yet
  // since we need the full document MD to be loaded into the editor to find headings, we wait to render the TOC
  editor.on('load', () => {
    console.log('load ran');
    updateTableOfContents(editor.markdownValue, pluginOptions)
  })
  if (editor.isViewer()) {
    return;
  }

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
export function tableOfContentsPlugin(editor, pluginOptions={title: "Table of Contents", headingSize: 1, bulletType: "1"}) {
  const { codeBlockManager } = Object.getPrototypeOf(editor).constructor;
  codeBlockManager.setReplacer('toc', (tocInput) => {
    console.log('I ran!');
    return `<span id="toc"></span>`;
  });
  initUI(editor, pluginOptions);
}

export const tableOfContentsPluginCustomHTMLRenderer = {
    heading(node, context) {
      if (context.entering) {
        return {
          type: 'html',
          content: `<h${node.level}><a style="text-decoration: none; color: black; cursor: auto;" id="${getHeadingId(node.firstChild.literal)}">`
        };
      } else {
        return {
          type: 'html',
          content: `</a></h${node.level}>`
        };
      }
    },
}