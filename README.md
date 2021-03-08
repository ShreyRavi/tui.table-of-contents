# [tui.tableofcontents](https://shreyravi.github.io/tui.tableofcontents/)

[![npm (scoped)](https://img.shields.io/npm/v/tui-table-of-contents.svg)](https://www.npmjs.com/package/@shreyravi/tui-table-of-contents)
[![npm bundle size (minified)](https://img.shields.io/bundlephobia/min/tui-table-of-contents.svg)](https://www.npmjs.com/package/@shreyravi/tui-table-of-contents)

A table of contents custom plugin for Toast UI. Render a table of contents in real-time.

<p align="center"><img src="https://github.com/ShreyRavi/tui-editor-example/raw/main/screenshot.png" height="93%" width="93%"></img>Screenshot of the demo of tui.tableofcontents Toast-UI Plugin.</p>

## Install
```
$ npm install @shreyravi/tui-table-of-contents
```

## Usage

1. Import the plugin:
```
import tableOfContentsPlugin from 'tui-table-of-contents';
```

2. Insert into `ToastEditor` instance:
```
import { Editor } from '@toast-ui/react-editor';
...
      <Editor
          plugins={[tableOfContentsPlugin]}
      />
...
```

3. Click on the "Toggle Table of Content" at end of Toolbar to show/hide the auto-generated table of contents. 

## License
MIT License. Open Source. Contact [author](mailto:shrey@shreyravi.com) with any concerns.