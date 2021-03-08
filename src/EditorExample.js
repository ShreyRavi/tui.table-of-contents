import React, { useState, useEffect } from 'react';
import 'codemirror/lib/codemirror.css';
import '@toast-ui/editor/dist/toastui-editor.css';
import { Editor } from '@toast-ui/react-editor';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Divider from '@material-ui/core/Divider';
import tableOfContentsPlugin from './tuiTableOfContents';

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
  return (
    <div className={classes.root}>
      <Typography variant="h1">ToastUI Editor Table of Contents Example</Typography>
      <Typography variant="body2">v1.0.0</Typography>
      <Divider className={classes.divider} />

      <Editor
          previewStyle="vertical"
          height="500px"
          initialEditType="wysiwyg"
          plugins={[tableOfContentsPlugin]}
          usageStatistics={false}
        />
    </div>
  );
};

export default EditorExample;
