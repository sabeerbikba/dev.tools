import { useReducer, useEffect, useRef } from 'react';
import * as ts from 'typescript';
import MonacoEditor from '@monaco-editor/react';

import CopyBtn from '../common/CopyBtn';
import { compilerOption, compilerOptionTicks } from '../data/typescriptPlayground';
import useLocalStorageReducer from '../hooks/useLocalStorageReducer';

const initCode = `const message: string = 'hello world';
// console.log(message);
// `.trim();

function createInitialState(compilerOptions) {
   const initialState = {};

   for (const category in compilerOptions) {
      compilerOptions[category].forEach(option => {
         initialState[option.label] = option.check;
      });
   }

   return initialState;
};

const initialState = {
   consoleLogs: [],
   showOptions: false,
   copyBtnDisabled: false,
};

let localStorageInitialState = createInitialState(compilerOptionTicks);
localStorageInitialState = {
   inputCode: initCode,
   outputCode: '',
   target: compilerOption.Target.options[4],
   JSX: compilerOption.JSX.options[2],
   module: compilerOption.Module.options[8],
   ...localStorageInitialState,
};

const actionTypes = {
   SET_COPY_BTN_DISABLED: 'SET_COPY_BTN_DISABLED',
   UPDATE_SHOW_OPTIONS: 'UPDATE_SHOW_OPTIONS',
   MANAGE_CONSOLE_LOGS: 'MANAGE_CONSOLE_LOGS',

   // localStorage
   UPDATE_COMPILER_TICKS: 'UPDATE_COMPILER_TICKS',
   UPDATE_COMPILER_OPTIONS: 'UPDATE_COMPILER_OPTIONS',
   UPDATE_CODE: 'UPDATE_CODE',
}

function reducer(state, action) {
   switch (action.type) {
      case actionTypes.MANAGE_CONSOLE_LOGS: {
         if (action.payload === 'clear') {
            return {
               ...state,
               consoleLogs: [],
            };
         } else {
            return {
               ...state,
               consoleLogs: [
                  ...state.consoleLogs,
                  ...action.logs,
               ],
            };
         }
      }
      case actionTypes.UPDATE_SHOW_OPTIONS: {
         return {
            ...state,
            showOptions: action.payload.hasOwnProperty('value') ? action.payload.value : !state.showOptions,
         };
      }
      case actionTypes.SET_COPY_BTN_DISABLED: {
         return { ...state, copyBtnDisabled: action.value };
      }
      default: {
         console.error('Unknown action: reducer : ' + action.type);
         console.warn('you not added action.type: ' + action.type + ' add and try');
         return state;
      }
   }
}

function localStorageReducer(state, action) {
   switch (action.type) {
      case actionTypes.UPDATE_COMPILER_TICKS: {
         return { ...state, [action.field]: action.value };
      }
      case actionTypes.UPDATE_COMPILER_OPTIONS: {
         return { ...state, [action.field]: action.value };
      }
      case actionTypes.UPDATE_CODE: {
         return { ...state, [action.field]: action.value };
      }
      default: {
         console.error('Unknown action: localStorageRedcer : ' + action.type);
         console.warn('you not added action.type: ' + action.type + ' add and try');
         return state;
      }
   }
}

export default function TypescriptPlayground() {
   const tsConfigRef = useRef(null);
   const [state, dispatch] = useReducer(reducer, initialState)
   const [localStorageState, localStorageDispatch] = useLocalStorageReducer('typescriptPlayground', localStorageReducer, localStorageInitialState);

   const {
      consoleLogs,
      showOptions,
      copyBtnDisabled
   } = state;
   const {
      inputCode,
      outputCode,

      //                 COMPILER_OPTIONS
      target,
      JSX,
      module,
      preserveWatchOutput,
      pretty,
      noErrorTruncation,
      declaration,
      inlineSourceMap,
      removeComments,
      importHelpers,
      downlevelIteration,
      inlineSources,
      stripInternal,
      noEmitHelpers,
      preserveConstEnums,
      preserveValueImports,
      isolatedModules,
      verbatimModuleSyntax,
      allowSyntheticDefaultImports,
      esModuleInterop,
      strict,
      noImplicitAny,
      strictNullChecks,
      strictFunctionTypes,
      strictBindCallApply,
      strictPropertyInitialization,
      noImplicitThis,
      useUnknownInCatchVariables,
      alwaysStrict,
      noUnusedLocals,
      noUnusedParameters,
      exactOptionalPropertyTypes,
      noImplicitReturns,
      noFallthroughCasesInSwitch,
      noUncheckedIndexedAccess,
      noImplicitOverride,
      noPropertyAccessFromIndexSignature,
      allowUnusedLabels,
      allowUnreachableCode,
      allowUmdGlobalAccess,
      allowImportingTsExtensions,
      resolvePackageJsonExports,
      resolvePackageJsonImports,
      allowArbitraryExtensions,
      experimentalDecorators,
      emitDecoratorMetadata,
      noLib,
      useDefineForClassFields,
      disableSourceOfProjectReferenceRedirect,
      noImplicitUseStrict,
      suppressExcessPropertyErrors,
      suppressImplicitAnyIndexErrors,
      noStrictGenericChecks,
      keyofStringsOnly,
   } = localStorageState;

   const options = {
      minimap: {
         enabled: false,
      },
      lineNumber: true,
   };

   const handleCodeChange = newCode => {
      updateCode('inputCode', newCode);
      compileCode(newCode);
   };

   function clearInputs() {
      updateCode('inputCode', '');
      updateCode('outputCode', '');
   }

   useEffect(() => {
      compileCode(inputCode);
   }, [inputCode, target, JSX, module]);

   function compileCode(code) {
      try {
         const compilerOptions = {
            target: ts.ScriptTarget[target],
            module: ts.ModuleKind[module],
            jsx: ts.JsxEmit[JSX],
            preserveWatchOutput,
            pretty,
            noErrorTruncation,
            declaration,
            inlineSourceMap,
            removeComments,
            importHelpers,
            downlevelIteration,
            inlineSources,
            stripInternal,
            noEmitHelpers,
            preserveConstEnums,
            preserveValueImports,
            isolatedModules,
            verbatimModuleSyntax,
            allowSyntheticDefaultImports,
            esModuleInterop,
            strict,
            noImplicitAny,
            strictNullChecks,
            strictFunctionTypes,
            strictBindCallApply,
            strictPropertyInitialization,
            noImplicitThis,
            useUnknownInCatchVariables,
            alwaysStrict,
            noUnusedLocals,
            noUnusedParameters,
            exactOptionalPropertyTypes,
            noImplicitReturns,
            noFallthroughCasesInSwitch,
            noUncheckedIndexedAccess,
            noImplicitOverride,
            noPropertyAccessFromIndexSignature,
            allowUnusedLabels,
            allowUnreachableCode,
            allowUmdGlobalAccess,
            allowImportingTsExtensions,
            resolvePackageJsonExports,
            resolvePackageJsonImports,
            allowArbitraryExtensions,
            experimentalDecorators,
            emitDecoratorMetadata,
            noLib,
            useDefineForClassFields,
            disableSourceOfProjectReferenceRedirect,
            noImplicitUseStrict,
            suppressExcessPropertyErrors,
            suppressImplicitAnyIndexErrors,
            noStrictGenericChecks,
            keyofStringsOnly,
         };

         const compiledCode = ts.transpileModule(code, { compilerOptions });
         const outputCode = compiledCode.outputText;
         updateCode('outputCode', outputCode);
      } catch (error) {
         console.error('Error compiling code:', error);
      }
   };

   function clearLogs() {
      dispatch({ type: actionTypes.MANAGE_CONSOLE_LOGS, payload: 'clear' });
   }

   function runCode() {
      try {
         const consoleLog = [...consoleLogs];
         const originalConsoleLog = console.log;
         console.log = (...args) => {
            consoleLog.push(...args);
            originalConsoleLog(...args);
         };
         eval(outputCode);
         clearLogs();
         dispatch({ type: actionTypes.MANAGE_CONSOLE_LOGS, logs: consoleLog });
      } catch (error) {
         console.error('Error running code:', error);
      }
   }

   function getColor(value) {
      if (typeof value === 'string') return 'white';
      if (typeof value === 'number') return 'green';
      if (typeof value === 'object') return 'rgb(73, 124, 174)';
      return 'white';
   }

   useEffect(() => {
      if (showOptions) {
         document.addEventListener('mousedown', handleClickOutside);
      } else {
         document.removeEventListener('mousedown', handleClickOutside);
      }

      return () => {
         document.removeEventListener('mousedown', handleClickOutside);
      };
   }, [showOptions]);

   function handleClickOutside(event) {
      setTimeout(() => {
         if (tsConfigRef.current && !tsConfigRef.current.contains(event.target)) {
            dispatch({ type: actionTypes.UPDATE_SHOW_OPTIONS, payload: { value: false } })
         }
      }, 100);
      compileCode(inputCode);
   };

   function handleChangeCompilerOptionTicks(e) {
      const { name, checked } = e.target;
      localStorageDispatch({
         type: actionTypes.UPDATE_COMPILER_TICKS,
         field: name,
         value: checked,
      });
      compileCode(inputCode);
   };

   function handleClickOnListItem(event, label) {
      event.stopPropagation();
      const isNewCheckedState = !localStorageState[label];

      localStorageDispatch({
         type: actionTypes.UPDATE_COMPILER_TICKS,
         field: label,
         value: isNewCheckedState,
      });
      compileCode(inputCode);
   }

   function updateChangeCompilerOption(field, value) {
      localStorageDispatch({
         type: actionTypes.UPDATE_COMPILER_OPTIONS,
         field,
         value,
      });
   }

   function updateCode(field, value) {
      localStorageDispatch({
         type: actionTypes.UPDATE_CODE,
         field,
         value,
      });
   }

   const styles = {
      main: 'monaco-container', inputHeadFlex: "flex gap-4 items-center mb-3", inputHeadText: "font-bold text-xl text-white",
      outputDiv: 'monaco-style monaco-result', btns: { height: '37px', width: '120px' },
      configMain: { height: "100%", overflow: 'scroll', width: '100%', color: '#d5d5d5' }, dropdownsDiv: { display: 'flex', margin: '10px 0' },
      dropdownsLabel: { flex: '1', margin: '5px', }, dropdownsSelect: { marginLeft: '12px', marginTop: '10px', height: '20px', borderRadius: '4px', textAlign: 'center', color: 'black', minWidth: '100px' },
      checkboxDiv: { borderBottom: '2px solid white' }, checkboxH4: { fontSize: '17.5px', fontWeight: 'bold' }, checkboxOl: { display: 'flex', flexWrap: 'wrap', marginBottom: '20px' },
      checkboxLi: { display: 'flex', width: '49%' }, checkboxLabel: { position: "relative", width: "100%", position: 'relative', margin: 'auto 0' }, checkboxLabelSpan: { width: '100%', display: 'inline-block', fontWeight: 'bold', fontStyle: 'oblique' },
      btnsDiv: { display: 'flex', justifyContent: 'space-around', margin: '15px 0' },
      btnsClass: "rounded-md bg-indigo-500 px-3.5 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500",
      consoleDiv: { border: '2px solid grey', borderRadius: '5px', overflowY: 'scroll', height: '37%', color: 'white', backgroundColor: '#232327' },
      consoleH2: { fontSize: '20px', margin: '0 8px', paddingLeft: '4px', borderBottom: '1px solid white' },
   }

   return (
      <div className={styles.main} style={{ minWidth: '1620px' }}>
         <div className={styles.outputDiv} style={{ height: '92%' }}>
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
               <p className={styles.inputHeadText}>{!showOptions ? 'Output:' : 'TS Config'}</p>
               {showOptions && (
                  <p style={{ color: 'grey' }}>{`version: ${ts.version}`}</p>
               )}
            </div>
            {!showOptions ? (
               <MonacoEditor
                  language="javascript"
                  theme="vs-dark"
                  value={outputCode}
                  options={{ readOnly: true, ...options }}
               />
            ) : (
               <div ref={tsConfigRef} style={styles.configMain}>
                  <div className="info" id="config-container">
                     <div style={styles.dropdownsDiv}>
                        {Object.entries(compilerOption).map(([key, { options, text }]) => {
                           const stateValue =
                              key === 'Target' ? target :
                                 key === 'JSX' ? JSX :
                                    module;

                           const handleChangeCompilerOption = (event) => {
                              const value = event.target.value;

                              if (key === 'Target') updateChangeCompilerOption('target', value);
                              else if (key === 'JSX') updateChangeCompilerOption('JSX', value);
                              else if (key === 'Module') updateChangeCompilerOption('module', value);
                           };

                           return (
                              <label key={key} style={styles.dropdownsLabel}>
                                 <span style={{ fontWeight: 'bold' }}>{key}:</span>
                                 <select value={stateValue} onChange={handleChangeCompilerOption} style={styles.dropdownsSelect}>
                                    {options.map((option, index) => (
                                       <option key={index} value={option}>
                                          {option}
                                       </option>
                                    ))}
                                 </select>
                                 <span>
                                    <p style={{ textIndent: '5px' }}>{text}</p>
                                 </span>
                              </label>
                           );
                        })}
                     </div>
                     <div style={styles.checkboxDiv}>
                        {Object.entries(compilerOptionTicks).map(([category, items]) => (
                           <div key={category}>
                              <h4 style={styles.checkboxH4}>{category}</h4>
                              <ol style={styles.checkboxOl}>
                                 {items.map(({ label, text }) => (
                                    <li key={label} onClick={(e) => handleClickOnListItem(e, label)} style={styles.checkboxLi}>
                                       <input
                                          type="checkbox"
                                          name={label}
                                          checked={localStorageState[label] || false}
                                          onChange={handleChangeCompilerOptionTicks}
                                          style={{ marginRight: '8px' }}
                                       />
                                       <label style={styles.checkboxLabel} htmlFor={`option-${label}`}>
                                          <span style={styles.checkboxLabelSpan} >{label}</span>
                                          <a
                                             href={'https://www.typescriptlang.org/tsconfig/#' + label}
                                             className="compiler_info_link"
                                             alt={`Look up ${label} in the TSConfig Reference`}
                                             target="_blank"
                                             style={{ position: 'absolute', top: '0', right: '10px' }}
                                             onClick={(e) => e.stopPropagation()}
                                          >
                                             <svg
                                                width="20px"
                                                height="20px"
                                                viewBox="0 0 20 20"
                                                version="1.1"
                                                xmlns="http://www.w3.org/2000/svg"
                                                xmlnsXlink="http://www.w3.org/1999/xlink"
                                             >
                                                <g stroke="none" strokeWidth={1} fill="none" fillRule="evenodd">
                                                   <circle stroke="#0B6F57" cx={10} cy={10} r={9} />
                                                   <path
                                                      d="M9.99598394,6 C10.2048193,6 10.4243641,5.91700134 10.6546185,5.75100402 C10.8848728,5.58500669 11,5.33601071 11,5.00401606 C11,4.66666667 10.8848728,4.41499331 10.6546185,4.24899598 C10.4243641,4.08299866 10.2048193,4 9.99598394,4 C9.79250335,4 9.57563588,4.08299866 9.34538153,4.24899598 C9.11512718,4.41499331 9,4.66666667 9,5.00401606 C9,5.33601071 9.11512718,5.58500669 9.34538153,5.75100402 C9.57563588,5.91700134 9.79250335,6 9.99598394,6 Z M10.6877323,16 L10.6877323,14.8898836 L10.6877323,8 L9.30483271,8 L9.30483271,9.11011638 L9.30483271,16 L10.6877323,16 Z"
                                                      fill="#0B6F57"
                                                      fillRule="nonzero"
                                                   />
                                                </g>
                                             </svg>
                                          </a>
                                          <br />
                                          <p dangerouslySetInnerHTML={{ __html: text }}></p>
                                       </label>
                                    </li>
                                 ))}
                              </ol>
                           </div>
                        ))}
                     </div>
                  </div>
               </div>
            )};
            <div style={styles.btnsDiv}>
               <button type="button" className={styles.btnsClass} style={styles.btns} onClick={clearInputs}>
                  ClearCode
               </button>
               <CopyBtn
                  btnText='CopyCode'
                  copyText={outputCode}
                  styles={styles.btns}
                  className={styles.btnsClass}
                  setCopyBtnDisabled={isDisabled => dispatch({ type: actionTypes.SET_COPY_BTN_DISABLED, value: isDisabled })}
                  copyBtnDisabled={copyBtnDisabled || outputCode === ''}
               />
               <button style={styles.btns} className={styles.btnsClass} onClick={runCode}>
                  RunCode
               </button>
               <button style={styles.btns} className={styles.btnsClass} onClick={clearLogs}>
                  ClearLogs
               </button>
               <button
                  onClick={() => dispatch({ type: actionTypes.UPDATE_SHOW_OPTIONS, payload: {} })}
                  className={styles.btnsClass} style={{ ...styles.btns, color: 'white', borderRadius: '7px', }}>
                  TypeOptions
               </button>
            </div>
            <div style={styles.consoleDiv}>
               <h2 style={styles.consoleH2}>LOGS</h2>
               <ol>
                  {consoleLogs.slice().reverse().map((log, index) => (
                     <li style={{ borderBottom: '1px solid grey' }} key={index}>
                        <span style={{ marginLeft: '19px', color: getColor(log) }}>{JSON.stringify(log)}</span>
                     </li>
                  ))}
               </ol>
            </div>
         </div>
      </div>
   );
}

export function TypescriptPlaygroundFallback() {
   useEffect(() => {
      const style = document.createElement('style');
      style.innerHTML = `
            @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }
        `;
      document.head.appendChild(style);

      return () => {
         document.head.removeChild(style);
      };
   }, []);

   const styles = {
      spinnerStyle: {
         border: '4px solid rgba(0, 0, 0, 0.1)', width: '40px', height: '40px', borderRadius: '50%',
         borderLeftColor: '#09f', animation: 'spin 1s ease infinite', marginBottom: '20px',
      },
      messageStyle: { fontSize: '18px', color: '#ffffff', },
      containerStyle: {
         display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
         height: '100vh', backgroundColor: '#2a2a2a', fontFamily: "'Arial', sans-serif",
      }
   }
   return (
      <div style={styles.containerStyle}>
         <div style={styles.spinnerStyle}></div>
         <p style={styles.messageStyle}>Donwloading typescirpt...</p>
      </div>
   );
}