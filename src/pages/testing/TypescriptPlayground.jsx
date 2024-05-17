import { useState, useEffect, lazy, Suspense } from 'react';
import * as ts from 'typescript';
import MonacoEditor from '@monaco-editor/react';
import CopyBtn from '../../common/CopyBtn';
import '../../styles-typescript-playground.css'

export default function TypescriptPlayground() {
   const [inputCode, setInputCode] = useState('');
   const [outputCode, setOutputCode] = useState('');
   const [copyBtnDisabled, setCopyBtnDisabled] = useState(false);
   const [consoleLogs, setConsoleLogs] = useState([]);

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
      compileCode(getInitialCode());
   }, []);

   const handleCodeChange = newCode => {
      setInputCode(newCode);
      compileCode(newCode);
   };

   function clearInputs() {
      setInputCode('');
      setOutputCode('');
   }

   function compileCode(code) {
      try {
         const result = ts.transpileModule(code, {
            compilerOptions: {
               target: ts.ScriptTarget.ES2017, // Specifies the ECMAScript target version for the emitted JavaScript code. Common values are ES3, ES5, ES2015, ES2016, ES2017, ES2018, ES2019, ES2020, or ESNext.
               module: ts.ModuleKind.None, // Specifies how modules should be generated. Common values are None, CommonJS, AMD, System, UMD, ES6, ES2015, ES2020, ESNext.
               jsx: ts.JsxEmit.None, // Specifies how JSX should be emitted. Common values are None, Preserve, React, ReactNative.

               strictPropertyInitialization: true,
               allowUnreachableCode: false,
               allowUnusedLabels: false,
               skipLibCheck: false,
               downlevelIteration: false,
               noEmitHelpers: false,
               noLib: false,
               noStrictGenericChecks: false,
               preserveConstEnums: false,
               strict: true, // Enables all strict type-checking options. Enabling this flag is recommended for best practices.
               esModuleInterop: false, // Enables compatibility with ES modules and CommonJS modules.
               // allowSyntheticDefaultImports: true, // Allows default imports from modules with no default export. This is needed for compatibility with some CommonJS modules.
               experimentalDecorators: false, // Enables support for experimental decorators. This is commonly used with libraries like Angular or MobX.
               emitDecoratorMetadata: false, // Enables the emission of metadata for decorators. Required for reflection with decorators.
               strictNullChecks: true, // Enables strict null checks, which help catch common errors like null or undefined values.
               strictFunctionTypes: true, // Enables strict checking of function types, including checking the return type of functions.
               noImplicitAny: true, // Raises an error on expressions and declarations with an implied 'any' type.
               noImplicitThis: true, // Raises an error when 'this' is used in a context where its type is not explicitly declared.
               noUnusedLocals: false, // Raises an error when a local variable is declared but never used.
               noUnusedParameters: false, // Raises an error when a function parameter is declared but never used.
               noImplicitReturns: true, // Raises an error when a function does not have a reachable endpoint (return statement or throw).
               noFallthroughCasesInSwitch: true, // Raises an error when a switch statement contains fallthrough cases.
               inlineSourceMap: false, // [ not Imp ] // Generates inline source map in the emitted JavaScript files.
               forceConsistentCasingInFileNames: true, // Forces consistency in the casing of file names.
               removeComments: false, // Removes comments from the emitted JavaScript files.
            }
         });

         setOutputCode(result.outputText);
      } catch (error) {
         console.error('Error compiling code:', error);
      }
   };

   function runCode() {
      try {
         const consoleLog = [...consoleLogs];
         const originalConsoleLog = console.log;
         console.log = (...args) => {
            consoleLog.push(args);
            originalConsoleLog(...args);
         };
         eval(outputCode);
         setConsoleLogs(consoleLog);
      } catch (error) {
         console.error('Error running code:', error);
      }
   }

   function clearLogs() {
      setConsoleLogs([]);
   }

   const styles = {
      main: 'monaco-container', inputDiv: 'monaco-style monaco-editor',
      inputHead: "flex justify-between items-center mt-4 gap-4 h-12",
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
      btns: { height: '37px', width: '120px' },
   }

   console.log(styles.btns);

   return (
      // <>
         <div className={styles.main} style={{ minWidth: '1620px' }}>
            <div className={styles.outputDiv} style={{ height: '90%' }}>
                              <div className={styles.inputHeadFlex}>
                  <p className={styles.inputHeadText}>Input: </p>

               </div>
               <MonacoEditor
                  language="typescript"
                  theme="vs-dark"
                  value={inputCode}
                  onChange={handleCodeChange}
                  options={options}
               />
            </div>
            <div className={styles.outputDiv} style={{ height: '60%' }}>
                              <div className={styles.inputHeadFlex}>
                  <p className={styles.inputHeadText}>Output: </p>
               </div>
               <MonacoEditor
                  language="javascript"
                  theme="vs-dark"
                  value={outputCode}
                  options={{ readOnly: true, ...options }}
               />

               <div style={{ display: 'flex', justifyContent: 'space-around' }}>
                  <button
                     type="button"
                     className={styles.inputHeadBtn}
                     style={styles.btns}
                     onClick={clearInputs}
                  >
                     Clear
                  </button>
                  <button
                     style={styles.btns}
                     className={styles.inputHeadBtn}
                     onClick={runCode}
                  >
                     Run
                  </button>
                  <button
                     style={styles.btns}
                     className={styles.inputHeadBtn}
                     onClick={clearLogs}
                  >
                     ClearLogs
                  </button>
                  <CopyBtn
                     copyText={outputCode}
                     styles={styles.btns}
                     setCopyBtnDisabled={isDisabled => setCopyBtnDisabled(isDisabled)}
                     copyBtnDisabled={copyBtnDisabled || outputCode === ''}
                  />
                  <div style={{ ...styles.btns, backgroundColor: 'rgb(99, 102, 241)', color: 'white', padding: '5px', borderRadius: '7px', display: 'inline' }}>
                     Options
                  </div>
               </div>

               <div style={{ marginTop: '20px', border: '1px solid red', overflowY: 'scroll', maxHeight: '39%' }}>
                  <h2>Console Logs:</h2>
                  <ol>
                     {consoleLogs.map((log, index) => (
                        <li key={index}>{JSON.stringify(log)}</li>
                     ))}
                  </ol>
               </div>
            </div>
         </div>
      // </>
   );
}

export function TypescriptPlaygroundFallback() {
   return <b style={{ color: 'white' }}>donwloading typescirpt...</b>;
}


/** TODO:
 * when relaod page also need to refresh 
 * also when press clear input button need to refresh typescript reason: show error like redeclare some time 
 * need to remove unused styles from object 
 * PropTypes
 * need to crate custom fallback for this component create here and use in app.jsx
 * last code need to show 
 * show which version is using 
 * remvoe unused styles from styles array 
 * hover button color change 
 * 
 */


