import { useState } from "react";
import MonacoEditor from "@monaco-editor/react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { materialOceanic } from "react-syntax-highlighter/dist/esm/styles/prism";

import "@/styles/github-markdown-dark.css";
import useLocalStorageState from "@/hooks/useLocalStorageState";
import CopyBtn from "@/common/CopyBtn";
import EditorSplitViewLayout from "@/components/EditorSplitViewLayout";

const initCode = `## Hello World!`;

const MarkdownEditor = () => {
  const [markdown, setMarkdown] = useLocalStorageState(
    "MarkdownEditor",
    initCode
  );
  const [copyBtnDisabled, setCopyBtnDisabled] = useState(false);

  const handleChange = (value) => {
    setMarkdown(value);
  };

  const renderers = {
    code({ node, inline, className, children, ...props }) {
      const match = /language-(\w+)/.exec(className || "");
      return !inline && match ? (
        <SyntaxHighlighter
          style={materialOceanic}
          language={match[1]}
          PreTag="div"
          {...props}
        >
          {String(children).replace(/\n$/, "")}
        </SyntaxHighlighter>
      ) : (
        <code className={className} {...props}>
          {children}
        </code>
      );
    },
  };

  const styles = {
    btnsClass:
      "rounded-md bg-indigo-500 px-3.5 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500",
  };

  return (
    <EditorSplitViewLayout
      editorBtns={
        <>
          <button
            className={styles.btnsClass}
            onClick={() => setMarkdown("")}
            disabled={markdown === ""}
          >
            Clear
          </button>
          <CopyBtn
            copyText={markdown}
            className={styles.btnsClass + " !h-[92%]"}
            setCopyBtnDisabled={(isDisabled) => setCopyBtnDisabled(isDisabled)}
            disabled={copyBtnDisabled || markdown === ""}
          />
        </>
      }
      editor={
        <MonacoEditor
          language="Markdown"
          theme="vs-dark"
          options={{ minimap: { enabled: false }, lineNumbers: true }}
          onChange={handleChange}
          value={markdown}
        />
      }
      preview={
        <div className="markdown-body size-full p-2">
          <ReactMarkdown
            children={markdown}
            remarkPlugins={[remarkGfm]}
            rehypePlugins={[rehypeRaw]}
            components={renderers}
          />
        </div>
      }
    />
  );
};

export default MarkdownEditor;
