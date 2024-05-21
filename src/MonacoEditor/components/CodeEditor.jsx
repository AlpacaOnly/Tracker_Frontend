import { useRef, useState } from "react";
import MonacoEditor from 'react-monaco-editor';
import { CODE_SNIPPETS } from "../constants";
import Output from "./Output";

const CodeEditor = () => {
  const editorRef = useRef(null); // Ensure it's initialized with null for clarity
  const [value, setValue] = useState(CODE_SNIPPETS.javascript || ""); // Initialize with default JS code or empty string
  const language = "javascript";

  const handleEditorDidMount = (editor) => {
    editorRef.current = editor;
    editor.focus(); // Auto-focus the editor on mount
  };

  return (
    <div>
     <MonacoEditor
  height="25vh"
  theme="vs-dark"
  language={language}
  defaultValue={CODE_SNIPPETS[language]} // Provide a default value from snippets
  value={value}
  onChange={setValue}
  editorDidMount={handleEditorDidMount} // Properly attach the ref and focus
  options={{
    minimap: {
      enabled: false, // Minimap disabled for cleaner UI
    },
    lineNumbers: "on", // Enable line numbers for better readability
    roundedSelection: false,
    scrollBeyondLastLine: false,
    readOnly: false,
    cursorStyle: 'line', // Cursor style as a line
    automaticLayout: true, // Auto-adjust layout on window resize
    wordWrap: 'on', // Wrap long lines
    folding: true, // Enable code folding
    showFoldingControls: 'always' // Always show code folding controls
  }}
  className="shadow-lg rounded-lg overflow-hidden" // Tailwind classes for styling
/>

      <Output editorRef={editorRef} language={language} />
    </div>
  );
};

export default CodeEditor;
