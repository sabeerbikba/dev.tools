import { useState, useEffect, lazy, Suspense } from 'react';
import * as ts from 'typescript';
import MonacoEditor from '@monaco-editor/react';
import CopyBtn from '../../common/CopyBtn';

export default function Test() {
   const [inputCode, setInputCode] = useState('');
   const [outputCode, setOutputCode] = useState('');

   const options = {
      minimap: {
         enabled: false,
      },
      lineNumber: true,
   };

   const getInitialCode = () => {
      return `const message: string = 'hello world';
console.log(message);
`.trim();
   };

   useEffect(() => {
      setInputCode(getInitialCode());
      compileCode(getInitialCode()); // Compile initial code
   }, []);



   const handleCodeChange = newCode => {
      setInputCode(newCode);
      compileCode(newCode);
   };

   async function compileCode(code) {
      try {
         const result = ts.transpileModule(code, {
            compilerOptions: {
               target: ts.ScriptTarget.ES2017,
               module: ts.ModuleKind.None,
               jsx: ts.JsxEmit.None,
            },
         });

         setOutputCode(result.outputText);
      } catch (error) {
         console.error('Error compiling code:', error);
      }
   };

   const styles = {
      main: 'monaco-container', inputDiv: 'monaco-style monaco-editor',
      inputHead: "flex justify-between items-center mb-4 gap-4 h-12",
      inputHeadFlex: "flex gap-4 items-center", inputHeadText: "font-bold text-xl text-white",
      inputHeadBtn: "rounded-md bg-indigo-500 px-3.5 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500",
      outputDiv: 'monaco-style monaco-result', outputHead: 'flex justify-between px-4 text-white',
      outputHeadText: "font-bold text-xl text-white h-12",
      outputToolTip: { marginLeft: '25px', display: 'inline', border: '2px solid orange', color: 'white', borderRadius: '8px', padding: '7px', fontSize: '0.85rem', backgroundColor: 'rgba(255, 87, 34, 0.1)', marginRight: '20px' },
      outputToolTipTringle: {
         position: 'relative', bottom: '-1.3',
         display: 'inline-block', width: 0, height: 0, borderTop: '7px solid transparent', borderBottom: '7px solid transparent', borderRight: '10px solid orange',
      },
      lastVersionInput: { width: '50px', backgroundColor: '#2a2a2a', outline: 'none', borderBottom: `2px solid red` },
      copyBtn: { backgroundColor: '#4446a6', margin: '10px 10px 0 0' },
   }

   return (
      <>
         <div style={{ display: 'flex', widht: '100%', margin: '0 20px 0' }}>
            <div className={styles.inputHead} style={{ backgroundColor: '#2a2a2a', width: '50%' }}>
               <div className={styles.inputHeadFlex}>
                  <p className={styles.inputHeadText}>Input: </p>
                  <button
                     type="button"
                     className={styles.inputHeadBtn}
                     onClick={() => setInputCode('')}
                  >
                     Clear
                  </button>
               </div>

               {/* {loading && (
                  <div>loading</div>
               )} */}


            </div>
            <div className={styles.inputHead} style={{ backgroundColor: '#2a2a2a', width: '50%' }}>
               <div className={styles.inputHeadFlex}>
                  <p className={styles.inputHeadText}>Input: </p>
                  <button
                     type="button"
                     className={styles.inputHeadBtn}
                     onClick={() => setInputCode('')}
                  >
                     Clear
                  </button>
               </div>
            </div>

         </div>

         <Suspense fallback={<b>loading</b>}>


         <div className={styles.main} style={{ minWidth: '1620px' }}>
            <div className={styles.outputDiv}>
               <MonacoEditor
                  language="typescript"
                  theme="vs-dark"
                  value={inputCode}
                  onChange={handleCodeChange}
                  options={options}
               />
            </div>
            <div className={styles.outputDiv}>
               <MonacoEditor
                  language="javascript"
                  theme="vs-dark"
                  value={outputCode}
                  options={{ readOnly: true, ...options }}
               />
            </div>
         </div>
         </Suspense>

      </>
   );
}


/** TODO:
 * when relaod page also need to refresh 
 * also when press clear input button need to refresh typescript reason: show error like redeclare some time 
 * need to remove unused styles from object 
 * PropTypes
 */


