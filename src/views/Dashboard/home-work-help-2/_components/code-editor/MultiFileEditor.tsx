// MultiFileEditorContainer.js
import React, { useState } from 'react';
import Editor from '../../../../../components/Editor';
import FileEditor from './CodeEditorWindow';

const MultiFileEditorContainer = () => {
  const [fileName, setFileName] = useState('script.js');
  const [files, setFiles] = useState([
    {
      name: 'file1.js',
      content: 'console.log("File 1 content");',
      language: 'javascript'
    },
    { name: 'file2.py', content: 'print("File 2 content")', language: 'python' }
    // Add more files as needed
  ]);
  const file = files[fileName];

  return (
    <>
      <button
        disabled={fileName === 'script.js'}
        onClick={() => setFileName('script.js')}
      >
        script.js
      </button>
      <button
        disabled={fileName === 'style.css'}
        onClick={() => setFileName('style.css')}
      >
        style.css
      </button>
      <button
        disabled={fileName === 'index.html'}
        onClick={() => setFileName('index.html')}
      >
        index.html
      </button>
      <Editor />
    </>
  );
};

export default MultiFileEditorContainer;
