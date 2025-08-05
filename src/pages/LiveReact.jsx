import React, { useState } from "react";
import { LiveProvider, LiveError, LivePreview } from "react-live";
import * as Babel from "@babel/standalone";
import MonacoEditor from "@monaco-editor/react";
// TODO: need to add code formatter

import useLocalStorageState from "@/hooks/useLocalStorageState";
import CopyBtn from "@/common/CopyBtn";
import EditorSplitViewLayout from "@/components/EditorSplitViewLayout";

const initCode = `const App = () => (
   <div>
      <h1>Hello, world!</h1>
   </div>
);

render(<App />);
`;

const clearCode = `const App = () => (
   <>

   </>
);

render(<App />);
`;

const LiveReactEditor = () => {
  const [code, setCode] = useLocalStorageState("liveReactCode", initCode);
  const [copyBtnDisabled, setCopyBtnDisabled] = useState(false);

  const styles = {
    btnBtn: {
      border: "1px solid #d3d3d3",
      borderTop: "0",
      position: "absolute",
      right: "0",
      bottom: "0",
      height: "100%",
      padding: "0 7px",
      borderRadius: "5px",
      boxShadow: "-5px 0 5px #d3d3d3",
    },
  };

  return (
    <EditorSplitViewLayout
      editorBtns={
        <>
          <button
            style={{
              backgroundColor: `${
                code.trim() ? "#4446a6" : "rgb(99, 102, 241)"
              }`,
            }}
            onClick={() => setCode(initCode)}
          >
            BoilerPlate
          </button>
          <button
            style={{
              backgroundColor: `${
                !code.trim() ? "#4446a6" : "rgb(99, 102, 241)"
              }`,
              position: "relative",
              paddingRight: "50px",
            }}
            onClick={() => setCode(clearCode)}
          >
            Clear
            <span
              className="!p-3"
              onClick={(e) => {
                e.stopPropagation();
                setCode("");
              }}
              style={styles.btnBtn}
            >
              AllClear
            </span>
          </button>
          <CopyBtn
            copyText={code}
            className="!h-[92%]"
            setCopyBtnDisabled={(isDisabled) => setCopyBtnDisabled(isDisabled)}
            disabled={copyBtnDisabled || code.trim() === ""}
          />
        </>
      }
      editor={
        <MonacoEditor
          language="html"
          theme="vs-dark"
          options={{ minimap: { enabled: false }, lineNumber: true }}
          onChange={setCode}
          value={code}
        />
      }
      preview={
        <>
          <LiveProvider
            code={code}
            transformCode={(code) =>
              Babel.transform(code, {
                presets: ["env", "react"],
              }).code
            }
            noInline
            scope={{ React }}
          >
            <LiveError />
            <LivePreview />
          </LiveProvider>
        </>
      }
    />
  );
};

export default LiveReactEditor;
