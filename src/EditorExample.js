import React, { useState, useEffect } from 'react';
import 'codemirror/lib/codemirror.css';
import '@toast-ui/editor/dist/toastui-editor.css';
import { Editor } from '@toast-ui/react-editor';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Divider from '@material-ui/core/Divider';
import tuiTableOfContentsPlugin from './tuiTableOfContents';
import { parse, TextNode } from 'node-html-parser';

const useStyles = makeStyles({
  root: {
    paddingLeft: "10%",
    width: '80%',
  },
  table: {
    maxWidth: 300,
  },
  tableHeader: {
    fontWeight: "bold"
  },
  divider: {
    paddingTop: "5px",
    paddingBottom: "5px"
  }
});

const EditorExample = () => {
  const classes = useStyles();
  const editorRef = React.createRef();
  useEffect(() => {
    const editor = editorRef.current?.getInstance();
    const eventManager = editor.eventManager;
    eventManager.addEventType('insertTableOfContents');
    eventManager.listen('insertTableOfContents', () => {
        const insertTableOfContents = () => {
          //HTML Approach
          const html = parse(editor.getHtml());
          console.log(html);
          console.log(html.childNodes);
          console.log(html.childNodes.filter((node) => ((node.tagName) && (node.tagName.match(/^[h|H][1-6]$/g)))));
          console.log(html.childNodes.filter((node) => ((node.tagName) && (node.tagName.match(/^[h|H][1-6]$/g)) && (node.rawText !== "Table of Contents"))));

          const headings = html.childNodes.filter((node) => ((node.tagName) && (node.tagName.match(/^[h|H][1-6]$/g)) && (node.rawText !== "Table of Contents"))).map((node) => node.rawText);
          const tableOfContentHtmlString = `<h1>Table of Contents</h1><ol>${headings.map((heading) => `<li>${heading}</li>`).join('')}</ol>`;
          const newHtml = html.firstChild.rawText === "Table of Contents" ? html.childNodes.slice(4).reduce((htmlResult, node) => {
            if (node.outerHTML) {
              return htmlResult + node.outerHTML;
            } else if (node.innerText) {
              return htmlResult + node.innerText;
            } else {
              return htmlResult;
            }
          }, '') : html.outerHTML;
          editor.setHtml(tableOfContentHtmlString + newHtml);
        };
        insertTableOfContents();
    });
  }, []);
  return (
    <div className={classes.root}>
      <Typography variant="h1">ToastUI Editor Table of Contents Example</Typography>
      <Typography variant="body2">v1.0.0</Typography>
      <Divider className={classes.divider} />

      <Editor
          previewStyle="vertical"
          height="400px"
          initialEditType="wysiwyg"
          initialValue=""
          plugins={[() => tuiTableOfContentsPlugin(editorRef)]}
          ref={editorRef}
          toolbarItems={[
            'heading',
            'bold',
            'italic',
            'strike',
            'divider',
            'hr',
            'quote',
            'divider',
            'ul',
            'ol',
            'task',
            'divider',
            'table',
            'image',
            'link',
            'divider',
            'code',
            'codeblock',
            'divider',
            {
              type: 'button',
              options: {
                  event: 'insertTableOfContents',
                  tooltip: 'Insert Table of Contents',
                  text: 'T',
                  style: 'color: black; border-color: black; background: white;'
              }
          }
        ]}
          usageStatistics={false}
        />
    </div>
  );
};

export default EditorExample;
