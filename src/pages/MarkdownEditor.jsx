import { useState } from 'react';
import MonacoEditor from '@monaco-editor/react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { materialOceanic } from 'react-syntax-highlighter/dist/esm/styles/prism';

import useLocalStorageState from "../hooks/useLocalStorageState";
import CopyBtn from '../common/CopyBtn';
import '../styles/github-markdown-dark.css'

const initCode = `## Hello World!`

export default function MarkdownEditor() {
   const [markdown, setMarkdown] = useLocalStorageState('MarkdownEditor', initCode);
   const [copyBtnDisabled, setCopyBtnDisabled] = useState(false)

   const handleChange = (value) => {
      setMarkdown(value);
   };

   const renderers = {
      code({ node, inline, className, children, ...props }) {
         const match = /language-(\w+)/.exec(className || '');
         return !inline && match ? (
            <SyntaxHighlighter style={materialOceanic} language={match[1]} PreTag="div" {...props}>
               {String(children).replace(/\n$/, '')}
            </SyntaxHighlighter>
         ) : (
            <code className={className} {...props}>
               {children}
            </code>
         );
      }
   };

   const styles = {
      outputDiv: 'monaco-style monaco-result', btns: { height: '37px', width: '120px', backgroundColor: !markdown === '' ? '#6366f1' : '#4446a6' },
      btnsDiv: { display: 'flex', justifyContent: 'space-around', marginBottom: '15px' },
      btnsClass: "rounded-md bg-indigo-500 px-3.5 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500",
      btns: { backgroundColor: markdown === '' ? '#4446a6' : '', width: '30%' }
   }

   return (
      <div className="monaco-container" style={{ minWidth: '1620px' }}>
         <div className={styles.outputDiv} style={{ height: '98%' }}>
            <div style={styles.btnsDiv}>
               <button
                  style={styles.btns}
                  className={styles.btnsClass}
                  onClick={() => setMarkdown('')}
                  disabled={markdown === ''}
               >
                  Clear
               </button>
               <CopyBtn
                  copyText={markdown}
                  styles={styles.btns}
                  className={styles.btnsClass}
                  setCopyBtnDisabled={isDisabled => setCopyBtnDisabled(isDisabled)}
                  copyBtnDisabled={copyBtnDisabled || markdown === ''}
               />
            </div>
            <div style={{ height: '92.5%' }}>
               <MonacoEditor
                  language="Markdown"
                  theme="vs-dark"
                  options={{ minimap: { enabled: false }, lineNumbers: true }}
                  onChange={handleChange}
                  value={markdown}
               />
            </div>
         </div>
         <div className={styles.outputDiv + ' markdown-body'} style={{ height: '96.5%', overflow: 'scroll', margin: '20px', padding: '0 10px', boxShadow: '0 0 40px 20px #272b30' }}>
            <ReactMarkdown
               children={markdown}
               remarkPlugins={[remarkGfm]}
               rehypePlugins={[rehypeRaw]}
               components={renderers}
            />
         </div>
      </div>
   );
}
