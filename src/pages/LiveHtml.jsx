import { useState } from "react";
import MonacoEditor from "@monaco-editor/react";
import beautify from "js-beautify";

import useLocalStorageState from "@/hooks/useLocalStorageState";
import EditorSplitViewLayout from "@/components/EditorSplitViewLayout";
import CopyBtn from "@/common/CopyBtn";

const initCode = `<h2>Hello world!</h2>`;

const LiveHtml = () => {
  const [code, setCode] = useLocalStorageState("liveHtmlCode2", initCode);
  const [copyBtnDisabled, setCopyBtnDisabled] = useState(false);

  const formatCode = () => {
    const beautifiedCode = beautify.html(code);
    setCode(beautifiedCode);
  };

  const styles = {
    btn: {
      backgroundColor: `${!code.trim() ? "#4446a6" : "rgb(99, 102, 241)"}`,
    },
  };

  return (
    <EditorSplitViewLayout
      editorBtns={
        <>
          <button
            style={styles.btn}
            onClick={() => setCode("")}
            disabled={code.trim() === ""}
          >
            Clear
          </button>
          <button
            style={styles.btn}
            onClick={formatCode}
            disabled={code.trim() === ""}
          >
            Format
          </button>
          <CopyBtn
            className="!h-[92%]"
            copyText={code}
            styles={styles.btn}
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
        <iframe
          srcDoc={`<html><head></head><body style="color: white;">${code}</body></html>`}
          sandbox="allow-scripts"
          title="Live Preview"
          width={"100%"}
          height={"100%"}
        />
      }
    />
  );
};

export default LiveHtml;
