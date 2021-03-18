import React from 'react';
import 'codemirror/lib/codemirror.css';
import '@toast-ui/editor/dist/toastui-editor.css';
import { Viewer } from '@toast-ui/react-editor';
import {tableOfContentsPlugin, tableOfContentsPluginCustomHTMLRenderer} from 'tui-table-of-contents';

const testMd = `
\`\`\`toc
Table of Contents will be here
\`\`\`

# header1
## header2
some *content*.
some more
let's
make
it
really
llonnnggggggg


### header3

# revived
`

const ViewerExample = () => {
  return (
    <div>
      <h1>ToastUI Viewer Table of Contents Example</h1>
      <small>v1.0.0</small>
      <Viewer
        height="500px"
        initialEditType="wysiwyg"
        initialValue={testMd}
        plugins={[tableOfContentsPlugin]}
        customHTMLRenderer={tableOfContentsPluginCustomHTMLRenderer}
        usageStatistics={false}
      />
    </div>
  );
};

export default ViewerExample;
