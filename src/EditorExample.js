import React, { useState, useEffect } from 'react';
import 'codemirror/lib/codemirror.css';
import '@toast-ui/editor/dist/toastui-editor.css';
import { Editor } from '@toast-ui/react-editor';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Divider from '@material-ui/core/Divider';
import tuiTableOfContentsPlugin from './tuiTableOfContents';

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
  return (
    <div className={classes.root}>
      <Typography variant="h1">ToastUI Editor Table of Contents Example</Typography>
      <Typography variant="body2">v1.0.0</Typography>
      <Divider className={classes.divider} />

      <Editor
          previewStyle="vertical"
          height="500px"
          initialEditType="wysiwyg"
          initialValue=""
          onChange={() => tuiTableOfContentsPlugin(editorRef)}
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
                  text: '📖',
                  style: 'color: black; background: white;'
              }
          }
        ]}
          usageStatistics={false}
        />
    </div>
  );
};

export default EditorExample;
