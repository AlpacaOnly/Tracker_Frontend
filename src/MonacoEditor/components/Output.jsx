import { useState } from "react";
import { executeCode } from "../api";

const Output = ({ editorRef, language }) => {
  const [output, setOutput] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);

  const runCode = async () => {
    const sourceCode = editorRef.current.getValue();
    if (!sourceCode) return;
    try {
      setIsLoading(true);
      const result = await executeCode(language, sourceCode);
      setOutput(result.output ? result.output.split("\n") : []);
      setIsError(!!result.stderr);
    } catch (error) {
      setIsError(true);
      setOutput([error.message]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="text-center w-full">
      <h3 className="my-5 text-lg font-semibold">
        Output
      </h3>
      <button
        onClick={runCode}
        disabled={isLoading}
        className="px-4 py-2 bg-blue-500 text-white rounded-md disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none"
      >
        {isLoading ? 'Running...' : 'Run Code'}
      </button>
      <div
        className={`w-full h-64 p-4 mt-5 overflow-auto bg-black text-${isError ? 'red' : 'white'} border border-${isError ? 'red' : 'gray-800'} rounded-lg font-mono`}
      >
        {output.length > 0 ? output.map((line, i) => <div key={i}>{line}</div>) : 'Click "Run Code" to see the output here'}
      </div>
    </div>
  );
};

export default Output;
