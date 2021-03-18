import React from 'react';
import EditorExample from "./EditorExample";
import ViewerExample from "./ViewerExample";


class App extends React.Component {
  state = {
    viewerMode: true,
  };

  render() {
    const { viewerMode } = this.state;
    return (
      <>
        <button type="button" onClick={() => this.setState({viewerMode: !viewerMode})}>Toggle Viewer/Editor</button>
        {
          viewerMode ?
            <ViewerExample />
            :
            <EditorExample />
        }
      </>
    );
  }
};

export default App;
