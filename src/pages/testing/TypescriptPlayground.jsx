import { useState, useReducer, useEffect, useRef } from 'react';
import * as ts from 'typescript';
import MonacoEditor from '@monaco-editor/react';
import CopyBtn from '../../common/CopyBtn';
// import '../../styles-typescript-playground.css';

const compilerOption = {
   Target: {
      options: ["ES3", "ES5", "ES2015", "ES2016", "ES2017", "ES2018", "ES2019", "ES2020", "ES2021", "ES2022", "ESNext", "JSON"],
      text: "Set the JavaScript language version for emitted JavaScript and include compatible library declarations."
   },
   JSX: {
      options: ["None", "Preserve", "React", "ReactNative", "ReactJSX", "ReactJSXDev",],
      text: "Specify what JSX code is generated.",
   },
   Module: {
      options: ["None", "CommonJS", "AMD", "UMD", "System", "ES2015", "ES2020", "ES2022", "ESNext", "Node16", "NodeNext", "Preserve",],
      text: "Specify what module code is generated.",
   }
};

const compilerOptionTicks = {
   "Output Formatting": [{
      check: false,
      label: "preserveWatchOutput",
      text: "Disable wiping the console in watch mode."
   }, {
      check: false,
      label: "pretty",
      text: "Enable color and formatting in TypeScript's output to make compiler errors easier to read."
   }, {
      check: false,
      label: "noErrorTruncation",
      text: "Disable truncating types in error messages."
   }],
   "Emit": [{
      check: true,
      label: "declaration",
      text: "Generate .d.ts files from TypeScript and JavaScript files in your project."
   }, {
      check: false,
      label: "inlineSourceMap",
      text: "Include sourcemap files inside the emitted JavaScript."
   }, {
      check: false,
      label: "removeComments",
      text: "Disable emitting comments."
   }, {
      check: false,
      label: "importHelpers",
      text: "Allow importing helper functions from tslib once per project, instead of including them per-file."
   }, {
      check: false,
      label: "downlevelIteration",
      text: "Emit more compliant, but verbose and less performant JavaScript for iteration."
   }, {
      check: false,
      label: "inlineSources",
      text: "Include source code in the sourcemaps inside the emitted JavaScript."
   }, {
      check: false,
      label: "stripInternal",
      text: "Disable emitting declarations that have <code>@internal</code> in their JSDoc comments."
   }, {
      check: false,
      label: "noEmitHelpers",
      text: "Disable generating custom helper functions like __extends in compiled output."
   }, {
      check: false,
      label: "preserveConstEnums",
      text: "Disable erasing <code>const enum</code> declarations in generated code."
   }, {
      check: false,
      label: "preserveValueImports",
      text: "Preserve unused imported values in the JavaScript output that would otherwise be removed."
   }],
   "Interop Constraints": [{
      check: false,
      label: "isolatedModules",
      text: "Ensure that each file can be safely transpiled without relying on other imports."
   }, {
      check: false,
      label: "verbatimModuleSyntax",
      text: "Do not transform or elide any imports or exports not marked as type-only, ensuring they are written in the output file's format based on the 'module' setting."
   }, {
      check: false,
      label: "allowSyntheticDefaultImports",
      text: "Allow 'import x from y' when a module doesn't have a default export."
   }, {
      check: true,
      label: "esModuleInterop",
      text: "Emit additional JavaScript to ease support for importing CommonJS modules. This enables allowSyntheticDefaultImports for type compatibility."
   }],
   "Type Checking": [{
      check: true,
      label: "strict",
      text: "Enable all strict type-checking options."
   }, {
      check: true,
      label: "noImplicitAny",
      text: "Enable error reporting for expressions and declarations with an implied <code>any</code> type."
   }, {
      check: true,
      label: "strictNullChecks",
      text: "When type checking, take into account <code>null</code> and <code>undefined</code>."
   }, {
      check: true,
      label: "strictFunctionTypes",
      text: "When assigning functions, check to ensure parameters and the return values are subtype-compatible"
   }, {
      check: true,
      label: "strictBindCallApply",
      text: "Check that the arguments for <code>bind</code>, <code>call</code>, and <code>apply</code> methods match the original function."
   }, {
      check: true,
      label: "strictPropertyInitialization",
      text: "Check for class properties that are declared but not set in the constructor."
   }, {
      check: true,
      label: "noImplicitThis",
      text: "Enable error reporting when <code>this</code> is given the type <code>any</code>."
   }, {
      check: false,
      label: "useUnknownInCatchVariables",
      text: "Default catch clause variables as <code>unknown</code> instead of <code>any</code>."
   }, {
      check: true,
      label: "alwaysStrict",
      text: "Ensure 'use strict' is always emitted."
   }, {
      check: false,
      label: "noUnusedLocals",
      text: "Enable error reporting when local variables aren't read."
   }, {
      check: false,
      label: "noUnusedParameters",
      text: "Raise an error when a function parameter isn't read."
   }, {
      check: false,
      label: "exactOptionalPropertyTypes",
      text: "Interpret optional property types as written, rather than adding <code>undefined</code>"
   }, {
      check: true,
      label: "noImplicitReturns",
      text: "Enable error reporting for codepaths that do not explicitly return in a function."
   }, {
      check: false,
      label: "noFallthroughCasesInSwitch",
      text: "Enable error reporting for fallthrough cases in switch statements."
   }, {
      check: false,
      label: "noUncheckedIndexedAccess",
      text: "Add <code>undefined</code> to a type when accessed using an index."
   }, {
      check: false,
      label: "noImplicitOverride",
      text: "Ensure overriding members in derived classes are marked with an override modifier."
   }, {
      check: false,
      label: "noPropertyAccessFromIndexSignature",
      text: "Enforces using indexed accessors for keys declared using an indexed type."
   }, {
      check: false,
      label: "allowUnusedLabels",
      text: "Disable error reporting for unused labels."
   }, {
      check: false,
      label: "allowUnreachableCode",
      text: "Disable error reporting for unreachable code."
   }],
   "Modules": [{
      check: false,
      label: "allowUmdGlobalAccess",
      text: "Allow accessing UMD globals from modules."
   }, {
      check: false,
      label: "allowImportingTsExtensions",
      text: "Allow imports to include TypeScript file extensions."
   }, {
      check: false,
      label: "resolvePackageJsonExports",
      text: "Use the package.json 'exports' field when resolving package imports."
   }, {
      check: false,
      label: "resolvePackageJsonImports",
      text: "Use the package.json 'imports' field when resolving imports."
   }, {
      check: false,
      label: "allowArbitraryExtensions",
      text: "Enable importing files with any extension, provided a declaration file is present."
   }],
   "Language and Environment": [{
      check: false,
      label: "experimentalDecorators",
      text: "Enable experimental support for TC39 stage 2 draft decorators."
   }, {
      check: false,
      label: "emitDecoratorMetadata",
      text: "Emit design-type metadata for decorated declarations in source files."
   }, {
      check: false,
      label: "noLib",
      text: " Disable including any library files, including the default lib.d.ts."
   }, {
      check: false,
      label: "useDefineForClassFields",
      text: "Emit ECMAScript-standard-compliant class fields."
   }],
   "Projects": [{
      check: false,
      label: "disableSourceOfProjectReferenceRedirect",
      text: "Disable preferring source files instead of declaration files when referencing composite projects."
   },],
   "Backwards Compatibility": [{
      check: false,
      label: "noImplicitUseStrict",
      text: "Disable adding 'use strict' directives in emitted JavaScript files."
   }, {
      check: false,
      label: "suppressExcessPropertyErrors",
      text: "Disable reporting of excess property errors during the creation of object literals."
   }, {
      check: false,
      label: "suppressImplicitAnyIndexErrors",
      text: "Suppress <code>noImplicitAny</code> errors when indexing objects that lack index signatures."
   }, {
      check: false,
      label: "noStrictGenericChecks",
      text: "Disable strict checking of generic signatures in function types."
   }, {
      check: false,
      label: "keyofStringsOnly",
      text: "Make keyof only return strings instead of string, numbers or symbols. Legacy option."
   },]
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

const createInitialState = (compilerOptions) => {
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
   inputCode: '',
   outputCode: '',
   target: compilerOption.Target.options[4],
   JSX: compilerOption.JSX.options[2],
   module: compilerOption.Module.options[8],
   ...localStorageInitialState,
};

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
   const [localStorageState, localStorageDispatch] = useReducer(localStorageReducer, localStorageInitialState); // TODO: need to use localStorage reducer 

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
      // Output Formatting
      preserveWatchOutput,
      pretty,
      noErrorTruncation,
      // Emit
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
      // Interop Constraints
      isolatedModules,
      verbatimModuleSyntax,
      allowSyntheticDefaultImports,
      esModuleInterop,
      // Type Checking
      strict,
      noImplicitAny,
      strictNullChecks,
      strictFunctionTypes,
      strictBindCallApply,
      strictPropertyInitialization,
      noImplicitThis,
      useUnknownInCatchVariables,
      alwaysStrict,
      noUnusedLocal,
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
      // Language and Environment
      experimentalDecorators,
      emitDecoratorMetadata,
      noLib,
      useDefineForClassFields,
      // Projects
      disableSourceOfProjectReferenceRedirect,
      // Backwards Compatibility
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

   const getInitialCode = () => {
      return `const message: string = 'hello world';
console.log(message);
`.trim();
   };

   useEffect(() => {
      updateCode('inputCode', getInitialCode());
      compileCode(getInitialCode());
   }, []);

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
         const result = ts.transpileModule(code, {
            compilerOptions: {
               target: ts.ScriptTarget[target],
               jsx: ts.JsxEmit[JSX],
               module: ts.ModuleKind[module],
               // "Output Formatting"
               preserveWatchOutput: preserveWatchOutput,
               pretty: pretty,
               noErrorTruncation: noErrorTruncation,
               // "Emit"
               declaration: declaration,
               inlineSourceMap: inlineSourceMap,
               removeComments: removeComments,
               importHelpers: importHelpers,
               downlevelIteration: downlevelIteration,
               inlineSources: inlineSources,
               stripInternal: stripInternal,
               noEmitHelpers: noEmitHelpers,
               preserveConstEnums: preserveConstEnums,
               preserveValueImports: preserveValueImports,
               // "Interop Constraints"
               isolatedModules: isolatedModules,
               verbatimModuleSyntax: verbatimModuleSyntax,
               allowSyntheticDefaultImports: allowSyntheticDefaultImports,
               esModuleInterop: esModuleInterop,
               // "Type Checking"
               strict: strict,
               noImplicitAny: noImplicitAny,
               strictNullChecks: strictNullChecks,
               strictFunctionTypes: strictFunctionTypes,
               strictBindCallApply: strictBindCallApply,
               strictPropertyInitialization: strictPropertyInitialization,
               noImplicitThis: noImplicitThis,
               useUnknownInCatchVariables: useUnknownInCatchVariables,
               alwaysStrict: alwaysStrict,
               noUnusedLocal: noUnusedLocal,
               noUnusedParameters: noUnusedParameters,
               exactOptionalPropertyTypes: exactOptionalPropertyTypes,
               noImplicitReturns: noImplicitReturns,
               noFallthroughCasesInSwitch: noFallthroughCasesInSwitch,
               noUncheckedIndexedAccess: noUncheckedIndexedAccess,
               noImplicitOverride: noImplicitOverride,
               noPropertyAccessFromIndexSignature: noPropertyAccessFromIndexSignature,
               allowUnusedLabels: allowUnusedLabels,
               allowUnreachableCode: allowUnreachableCode,
               allowUmdGlobalAccess: allowUmdGlobalAccess,
               allowImportingTsExtensions: allowImportingTsExtensions,
               resolvePackageJsonExports: resolvePackageJsonExports,
               resolvePackageJsonImports: resolvePackageJsonImports,
               allowArbitraryExtensions: allowArbitraryExtensions,
               // "Language and Environment"
               experimentalDecorators: experimentalDecorators,
               emitDecoratorMetadata: emitDecoratorMetadata,
               noLib: noLib,
               useDefineForClassFields: useDefineForClassFields,
               // "Projects"
               disableSourceOfProjectReferenceRedirect: disableSourceOfProjectReferenceRedirect,
               // "Backwards Compatibility"
               noImplicitUseStrict: noImplicitUseStrict,
               suppressExcessPropertyErrors: suppressExcessPropertyErrors,
               suppressImplicitAnyIndexErrors: suppressImplicitAnyIndexErrors,
               noStrictGenericChecks: noStrictGenericChecks,
               keyofStringsOnly: keyofStringsOnly,
            }
         });
         updateCode('outputCode', result.outputText);
         console.log('code compailed complete!... ');
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
         dispatch({ type: actionTypes.MANAGE_CONSOLE_LOGS, logs: consoleLog });
      } catch (error) {
         console.error('Error running code:', error);
      }
   }

   function clearLogs() {
      dispatch({ type: actionTypes.MANAGE_CONSOLE_LOGS, payload: 'clear' });
   }

   function handleClickOutside(event) {
      setTimeout(() => {
         if (tsConfigRef.current && !tsConfigRef.current.contains(event.target)) {
            dispatch({ type: actionTypes.UPDATE_SHOW_OPTIONS, payload: { value: false } })
         }
      }, 100);
   };

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

   function handleChangeCompilerOptionTicks(e) {
      const { name, checked } = e.target;
      console.log(name);
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
      btnsClass: "rounded-md bg-indigo-500 px-3.5 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500",
      outputDiv: 'monaco-style monaco-result', btns: { height: '37px', width: '120px' },
   }

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
               <p className={styles.inputHeadText}>{!showOptions ? 'Output:' : 'TS Config'}</p>
            </div>
            {!showOptions ? (
               <MonacoEditor
                  language="javascript"
                  theme="vs-dark"
                  value={outputCode}
                  options={{ readOnly: true, ...options }}
               />
            ) : (
               <div ref={tsConfigRef} style={{ height: "100%", overflow: 'scroll', width: '88%', color: '#d5d5d5' }}>
                  <div className="info" id="config-container">

                     <div style={{ display: 'flex', margin: '10px 0' }}>
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
                              // <label key={key}>
                              // <span>{key}:</span>
                              <label key={key} style={{ flex: '1', margin: '5px', }}>
                                 <span style={{ fontWeight: 'bold' }}>{key}:</span>
                                 <select value={stateValue} onChange={handleChangeCompilerOption} style={{ marginLeft: '12px', marginTop: '10px', height: '20px', borderRadius: '4px', textAlign: 'center', color: 'black', minWidth: '100px' }}>
                                    {options.map((option, index) => (
                                       <option key={index} value={option}>
                                          {option}
                                       </option>
                                    ))}
                                 </select>
                                 <span>
                                    <p>{text}</p>
                                 </span>
                              </label>
                           );
                        })}
                     </div>


                     <div>
                        {Object.entries(compilerOptionTicks).map(([category, items]) => (
                           <div key={category}>
                              {/* <h4>{category}</h4> */}
                              <h4 style={{ fontSize: '17.5px', fontWeight: 'bold' }}>{category}</h4>
                              <ol>
                                 {items.map(({ label, text }) => (
                                    <li key={label} onClick={(e) => handleClickOnListItem(e, label)} style={{ border: '1px solid green' }}>
                                       <input
                                          type="checkbox"
                                          name={label}
                                          checked={localStorageState[label] || false}
                                          onChange={handleChangeCompilerOptionTicks}
                                       />
                                       <label style={{ position: "relative", width: "100%" }} htmlFor={`option-${label}`}>
                                          <span>{label}</span>
                                          <a
                                             href={'https://www.typescriptlang.org/tsconfig/#' + label}
                                             className="compiler_info_link"
                                             alt={`Look up ${label} in the TSConfig Reference`}
                                             target="_blank"
                                             // style={{border: '2px solid red'}}
                                             onClick={(e) => e.stopPropagation()} // Add this line
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
                                          <p>{text}</p>
                                       </label>
                                    </li>
                                 ))}
                              </ol>
                           </div>
                        ))}
                     </div>

                     {/* <div>
                        {Object.entries(compilerOptionTicks).map(([category, items]) => (
                           <div key={category}>
                              <h4>{category}</h4>
                              <ol>
                                 {items.map(({ label, link, linkAlt, text }) => (
                                    <Checkbox key={label} label={label} link={link} linkAlt={linkAlt} text={text} />
                                 ))}
                              </ol>
                           </div>
                        ))}
                     </div> */}

                     {/* <div>
                        <div>
                           <h4 style={{ fontSize: '19px', fontWeight: 'bold' }}>Output Formatting</h4>
                           <ol>
                              <li aria-expanded="false">
                                 <input
                                    type="checkbox"
                                    defaultValue="preserveWatchOutput"
                                    name="preserveWatchOutput"
                                    id="option-preserveWatchOutput"
                                 />
                                 <label
                                    style={{ position: "relative", width: "100%" }}
                                    htmlFor="option-preserveWatchOutput"
                                 >
                                    <span>preserveWatchOutput</span>
                                    <a
                                       href="../tsconfig#preserveWatchOutput"
                                       className="compiler_info_link"
                                       alt="Look up preserveWatchOutput in the TSConfig Reference"
                                       target="_blank"
                                    >
                                       
                                       <svg
                                          width="20px"
                                          height="20px"
                                          viewBox="0 0 20 20"
                                          version="1.1"
                                          xmlns="http://www.w3.org/2000/svg"
                                          xmlnsXlink="http://www.w3.org/1999/xlink"
                                       >
                                          <g
                                             stroke="none"
                                             strokeWidth={1}
                                             fill="none"
                                             fillRule="evenodd"
                                          >
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
                                    <p>Disable wiping the console in watch mode.</p>
                                 </label>
                              </li>
                              <li aria-expanded="false">
                                 <input
                                    type="checkbox"
                                    defaultValue="pretty"
                                    name="pretty"
                                    id="option-pretty"
                                 />
                                 <label
                                    style={{ position: "relative", width: "100%" }}
                                    htmlFor="option-pretty"
                                 >
                                    <span>pretty</span>
                                    <a
                                       href="../tsconfig#pretty"
                                       className="compiler_info_link"
                                       alt="Look up pretty in the TSConfig Reference"
                                       target="_blank"
                                    >
                                       
                                       <svg
                                          width="20px"
                                          height="20px"
                                          viewBox="0 0 20 20"
                                          version="1.1"
                                          xmlns="http://www.w3.org/2000/svg"
                                          xmlnsXlink="http://www.w3.org/1999/xlink"
                                       >
                                          <g
                                             stroke="none"
                                             strokeWidth={1}
                                             fill="none"
                                             fillRule="evenodd"
                                          >
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
                                    <p>
                                       Enable color and formatting in TypeScript's output to make
                                       compiler errors easier to read.
                                    </p>
                                 </label>
                              </li>
                              <li aria-expanded="false">
                                 <input
                                    type="checkbox"
                                    defaultValue="noErrorTruncation"
                                    name="noErrorTruncation"
                                    id="option-noErrorTruncation"
                                 />
                                 <label
                                    style={{ position: "relative", width: "100%" }}
                                    htmlFor="option-noErrorTruncation"
                                 >
                                    <span>noErrorTruncation</span>
                                    <a
                                       href="../tsconfig#noErrorTruncation"
                                       className="compiler_info_link"
                                       alt="Look up noErrorTruncation in the TSConfig Reference"
                                       target="_blank"
                                    >
                                       
                                       <svg
                                          width="20px"
                                          height="20px"
                                          viewBox="0 0 20 20"
                                          version="1.1"
                                          xmlns="http://www.w3.org/2000/svg"
                                          xmlnsXlink="http://www.w3.org/1999/xlink"
                                       >
                                          <g
                                             stroke="none"
                                             strokeWidth={1}
                                             fill="none"
                                             fillRule="evenodd"
                                          >
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
                                    <p>Disable truncating types in error messages.</p>
                                 </label>
                              </li>
                           </ol>
                        </div>
                        <div>
                           <h4>Emit</h4>
                           <ol>
                              <li aria-expanded="false">
                                 <input
                                    type="checkbox"
                                    defaultValue="declaration"
                                    name="declaration"
                                    id="option-declaration"
                                 />
                                 <label
                                    style={{ position: "relative", width: "100%" }}
                                    htmlFor="option-declaration"
                                 >
                                    <span>declaration</span>
                                    <a
                                       href="../tsconfig#declaration"
                                       className="compiler_info_link"
                                       alt="Look up declaration in the TSConfig Reference"
                                       target="_blank"
                                    >
                                       
                                       <svg
                                          width="20px"
                                          height="20px"
                                          viewBox="0 0 20 20"
                                          version="1.1"
                                          xmlns="http://www.w3.org/2000/svg"
                                          xmlnsXlink="http://www.w3.org/1999/xlink"
                                       >
                                          <g
                                             stroke="none"
                                             strokeWidth={1}
                                             fill="none"
                                             fillRule="evenodd"
                                          >
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
                                    <p>
                                       Generate .d.ts files from TypeScript and JavaScript files in
                                       your project.
                                    </p>
                                 </label>
                              </li>
                              <li aria-expanded="false">
                                 <input
                                    type="checkbox"
                                    defaultValue="inlineSourceMap"
                                    name="inlineSourceMap"
                                    id="option-inlineSourceMap"
                                 />
                                 <label
                                    style={{ position: "relative", width: "100%" }}
                                    htmlFor="option-inlineSourceMap"
                                 >
                                    <span>inlineSourceMap</span>
                                    <a
                                       href="../tsconfig#inlineSourceMap"
                                       className="compiler_info_link"
                                       alt="Look up inlineSourceMap in the TSConfig Reference"
                                       target="_blank"
                                    >
                                       
                                       <svg
                                          width="20px"
                                          height="20px"
                                          viewBox="0 0 20 20"
                                          version="1.1"
                                          xmlns="http://www.w3.org/2000/svg"
                                          xmlnsXlink="http://www.w3.org/1999/xlink"
                                       >
                                          <g
                                             stroke="none"
                                             strokeWidth={1}
                                             fill="none"
                                             fillRule="evenodd"
                                          >
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
                                    <p>Include sourcemap files inside the emitted JavaScript.</p>
                                 </label>
                              </li>
                              <li aria-expanded="false">
                                 <input
                                    type="checkbox"
                                    defaultValue="removeComments"
                                    name="removeComments"
                                    id="option-removeComments"
                                 />
                                 <label
                                    style={{ position: "relative", width: "100%" }}
                                    htmlFor="option-removeComments"
                                 >
                                    <span>removeComments</span>
                                    <a
                                       href="../tsconfig#removeComments"
                                       className="compiler_info_link"
                                       alt="Look up removeComments in the TSConfig Reference"
                                       target="_blank"
                                    >
                                       
                                       <svg
                                          width="20px"
                                          height="20px"
                                          viewBox="0 0 20 20"
                                          version="1.1"
                                          xmlns="http://www.w3.org/2000/svg"
                                          xmlnsXlink="http://www.w3.org/1999/xlink"
                                       >
                                          <g
                                             stroke="none"
                                             strokeWidth={1}
                                             fill="none"
                                             fillRule="evenodd"
                                          >
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
                                    <p>Disable emitting comments.</p>
                                 </label>
                              </li>
                              <li aria-expanded="false">
                                 <input
                                    type="checkbox"
                                    defaultValue="importHelpers"
                                    name="importHelpers"
                                    id="option-importHelpers"
                                 />
                                 <label
                                    style={{ position: "relative", width: "100%" }}
                                    htmlFor="option-importHelpers"
                                 >
                                    <span>importHelpers</span>
                                    <a
                                       href="../tsconfig#importHelpers"
                                       className="compiler_info_link"
                                       alt="Look up importHelpers in the TSConfig Reference"
                                       target="_blank"
                                    >
                                       
                                       <svg
                                          width="20px"
                                          height="20px"
                                          viewBox="0 0 20 20"
                                          version="1.1"
                                          xmlns="http://www.w3.org/2000/svg"
                                          xmlnsXlink="http://www.w3.org/1999/xlink"
                                       >
                                          <g
                                             stroke="none"
                                             strokeWidth={1}
                                             fill="none"
                                             fillRule="evenodd"
                                          >
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
                                    <p>
                                       Allow importing helper functions from tslib once per project,
                                       instead of including them per-file.
                                    </p>
                                 </label>
                              </li>
                              <li aria-expanded="false">
                                 <input
                                    type="checkbox"
                                    defaultValue="downlevelIteration"
                                    name="downlevelIteration"
                                    id="option-downlevelIteration"
                                 />
                                 <label
                                    style={{ position: "relative", width: "100%" }}
                                    htmlFor="option-downlevelIteration"
                                 >
                                    <span>downlevelIteration</span>
                                    <a
                                       href="../tsconfig#downlevelIteration"
                                       className="compiler_info_link"
                                       alt="Look up downlevelIteration in the TSConfig Reference"
                                       target="_blank"
                                    >
                                       
                                       <svg
                                          width="20px"
                                          height="20px"
                                          viewBox="0 0 20 20"
                                          version="1.1"
                                          xmlns="http://www.w3.org/2000/svg"
                                          xmlnsXlink="http://www.w3.org/1999/xlink"
                                       >
                                          <g
                                             stroke="none"
                                             strokeWidth={1}
                                             fill="none"
                                             fillRule="evenodd"
                                          >
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
                                    <p>
                                       Emit more compliant, but verbose and less performant JavaScript
                                       for iteration.
                                    </p>
                                 </label>
                              </li>
                              <li aria-expanded="false">
                                 <input
                                    type="checkbox"
                                    defaultValue="inlineSources"
                                    name="inlineSources"
                                    id="option-inlineSources"
                                 />
                                 <label
                                    style={{ position: "relative", width: "100%" }}
                                    htmlFor="option-inlineSources"
                                 >
                                    <span>inlineSources</span>
                                    <a
                                       href="../tsconfig#inlineSources"
                                       className="compiler_info_link"
                                       alt="Look up inlineSources in the TSConfig Reference"
                                       target="_blank"
                                    >
                                       
                                       <svg
                                          width="20px"
                                          height="20px"
                                          viewBox="0 0 20 20"
                                          version="1.1"
                                          xmlns="http://www.w3.org/2000/svg"
                                          xmlnsXlink="http://www.w3.org/1999/xlink"
                                       >
                                          <g
                                             stroke="none"
                                             strokeWidth={1}
                                             fill="none"
                                             fillRule="evenodd"
                                          >
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
                                    <p>
                                       Include source code in the sourcemaps inside the emitted
                                       JavaScript.
                                    </p>
                                 </label>
                              </li>
                              <li aria-expanded="false">
                                 <input
                                    type="checkbox"
                                    defaultValue="stripInternal"
                                    name="stripInternal"
                                    id="option-stripInternal"
                                 />
                                 <label
                                    style={{ position: "relative", width: "100%" }}
                                    htmlFor="option-stripInternal"
                                 >
                                    <span>stripInternal</span>
                                    <a
                                       href="../tsconfig#stripInternal"
                                       className="compiler_info_link"
                                       alt="Look up stripInternal in the TSConfig Reference"
                                       target="_blank"
                                    >
                                       
                                       <svg
                                          width="20px"
                                          height="20px"
                                          viewBox="0 0 20 20"
                                          version="1.1"
                                          xmlns="http://www.w3.org/2000/svg"
                                          xmlnsXlink="http://www.w3.org/1999/xlink"
                                       >
                                          <g
                                             stroke="none"
                                             strokeWidth={1}
                                             fill="none"
                                             fillRule="evenodd"
                                          >
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
                                    <p>
                                       Disable emitting declarations that have <code>@internal</code>{" "}
                                       in their JSDoc comments.
                                    </p>
                                 </label>
                              </li>
                              <li aria-expanded="false">
                                 <input
                                    type="checkbox"
                                    defaultValue="noEmitHelpers"
                                    name="noEmitHelpers"
                                    id="option-noEmitHelpers"
                                 />
                                 <label
                                    style={{ position: "relative", width: "100%" }}
                                    htmlFor="option-noEmitHelpers"
                                 >
                                    <span>noEmitHelpers</span>
                                    <a
                                       href="../tsconfig#noEmitHelpers"
                                       className="compiler_info_link"
                                       alt="Look up noEmitHelpers in the TSConfig Reference"
                                       target="_blank"
                                    >
                                       
                                       <svg
                                          width="20px"
                                          height="20px"
                                          viewBox="0 0 20 20"
                                          version="1.1"
                                          xmlns="http://www.w3.org/2000/svg"
                                          xmlnsXlink="http://www.w3.org/1999/xlink"
                                       >
                                          <g
                                             stroke="none"
                                             strokeWidth={1}
                                             fill="none"
                                             fillRule="evenodd"
                                          >
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
                                    <p>
                                       Disable generating custom helper functions like{" "}
                                       <code>__extends</code> in compiled output.
                                    </p>
                                 </label>
                              </li>
                              <li aria-expanded="false">
                                 <input
                                    type="checkbox"
                                    defaultValue="preserveConstEnums"
                                    name="preserveConstEnums"
                                    id="option-preserveConstEnums"
                                 />
                                 <label
                                    style={{ position: "relative", width: "100%" }}
                                    htmlFor="option-preserveConstEnums"
                                 >
                                    <span>preserveConstEnums</span>
                                    <a
                                       href="../tsconfig#preserveConstEnums"
                                       className="compiler_info_link"
                                       alt="Look up preserveConstEnums in the TSConfig Reference"
                                       target="_blank"
                                    >
                                       
                                       <svg
                                          width="20px"
                                          height="20px"
                                          viewBox="0 0 20 20"
                                          version="1.1"
                                          xmlns="http://www.w3.org/2000/svg"
                                          xmlnsXlink="http://www.w3.org/1999/xlink"
                                       >
                                          <g
                                             stroke="none"
                                             strokeWidth={1}
                                             fill="none"
                                             fillRule="evenodd"
                                          >
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
                                    <p>
                                       Disable erasing <code>const enum</code> declarations in
                                       generated code.
                                    </p>
                                 </label>
                              </li>
                              <li aria-expanded="false">
                                 <input
                                    type="checkbox"
                                    defaultValue="preserveValueImports"
                                    name="preserveValueImports"
                                    id="option-preserveValueImports"
                                 />
                                 <label
                                    style={{ position: "relative", width: "100%" }}
                                    htmlFor="option-preserveValueImports"
                                 >
                                    <span>preserveValueImports</span>
                                    <a
                                       href="../tsconfig#preserveValueImports"
                                       className="compiler_info_link"
                                       alt="Look up preserveValueImports in the TSConfig Reference"
                                       target="_blank"
                                    >
                                       
                                       <svg
                                          width="20px"
                                          height="20px"
                                          viewBox="0 0 20 20"
                                          version="1.1"
                                          xmlns="http://www.w3.org/2000/svg"
                                          xmlnsXlink="http://www.w3.org/1999/xlink"
                                       >
                                          <g
                                             stroke="none"
                                             strokeWidth={1}
                                             fill="none"
                                             fillRule="evenodd"
                                          >
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
                                    <p>
                                       Preserve unused imported values in the JavaScript output that
                                       would otherwise be removed.
                                    </p>
                                 </label>
                              </li>
                           </ol>
                        </div>
                        <div>
                           <h4>Interop Constraints</h4>
                           <ol>
                              <li aria-expanded="false">
                                 <input
                                    type="checkbox"
                                    defaultValue="isolatedModules"
                                    name="isolatedModules"
                                    id="option-isolatedModules"
                                 />
                                 <label
                                    style={{ position: "relative", width: "100%" }}
                                    htmlFor="option-isolatedModules"
                                 >
                                    <span>isolatedModules</span>
                                    <a
                                       href="../tsconfig#isolatedModules"
                                       className="compiler_info_link"
                                       alt="Look up isolatedModules in the TSConfig Reference"
                                       target="_blank"
                                    >
                                       
                                       <svg
                                          width="20px"
                                          height="20px"
                                          viewBox="0 0 20 20"
                                          version="1.1"
                                          xmlns="http://www.w3.org/2000/svg"
                                          xmlnsXlink="http://www.w3.org/1999/xlink"
                                       >
                                          <g
                                             stroke="none"
                                             strokeWidth={1}
                                             fill="none"
                                             fillRule="evenodd"
                                          >
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
                                    <p>
                                       Ensure that each file can be safely transpiled without relying
                                       on other imports.
                                    </p>
                                 </label>
                              </li>
                              <li aria-expanded="false">
                                 <input
                                    type="checkbox"
                                    defaultValue="verbatimModuleSyntax"
                                    name="verbatimModuleSyntax"
                                    id="option-verbatimModuleSyntax"
                                 />
                                 <label
                                    style={{ position: "relative", width: "100%" }}
                                    htmlFor="option-verbatimModuleSyntax"
                                 >
                                    <span>verbatimModuleSyntax</span>
                                    <a
                                       href="../tsconfig#verbatimModuleSyntax"
                                       className="compiler_info_link"
                                       alt="Look up verbatimModuleSyntax in the TSConfig Reference"
                                       target="_blank"
                                    >
                                       
                                       <svg
                                          width="20px"
                                          height="20px"
                                          viewBox="0 0 20 20"
                                          version="1.1"
                                          xmlns="http://www.w3.org/2000/svg"
                                          xmlnsXlink="http://www.w3.org/1999/xlink"
                                       >
                                          <g
                                             stroke="none"
                                             strokeWidth={1}
                                             fill="none"
                                             fillRule="evenodd"
                                          >
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
                                    <p>
                                       Do not transform or elide any imports or exports not marked as
                                       type-only, ensuring they are written in the output file's format
                                       based on the 'module' setting.
                                    </p>
                                 </label>
                              </li>
                              <li aria-expanded="false">
                                 <input
                                    type="checkbox"
                                    defaultValue="allowSyntheticDefaultImports"
                                    name="allowSyntheticDefaultImports"
                                    id="option-allowSyntheticDefaultImports"
                                 />
                                 <label
                                    style={{ position: "relative", width: "100%" }}
                                    htmlFor="option-allowSyntheticDefaultImports"
                                 >
                                    <span>allowSyntheticDefaultImports</span>
                                    <a
                                       href="../tsconfig#allowSyntheticDefaultImports"
                                       className="compiler_info_link"
                                       alt="Look up allowSyntheticDefaultImports in the TSConfig Reference"
                                       target="_blank"
                                    >
                                       
                                       <svg
                                          width="20px"
                                          height="20px"
                                          viewBox="0 0 20 20"
                                          version="1.1"
                                          xmlns="http://www.w3.org/2000/svg"
                                          xmlnsXlink="http://www.w3.org/1999/xlink"
                                       >
                                          <g
                                             stroke="none"
                                             strokeWidth={1}
                                             fill="none"
                                             fillRule="evenodd"
                                          >
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
                                    <p>
                                       Allow 'import x from y' when a module doesn't have a default
                                       export.
                                    </p>
                                 </label>
                              </li>
                              <li aria-expanded="false">
                                 <input
                                    type="checkbox"
                                    defaultValue="esModuleInterop"
                                    name="esModuleInterop"
                                    id="option-esModuleInterop"
                                 />
                                 <label
                                    style={{ position: "relative", width: "100%" }}
                                    htmlFor="option-esModuleInterop"
                                 >
                                    <span>esModuleInterop</span>
                                    <a
                                       href="../tsconfig#esModuleInterop"
                                       className="compiler_info_link"
                                       alt="Look up esModuleInterop in the TSConfig Reference"
                                       target="_blank"
                                    >
                                       
                                       <svg
                                          width="20px"
                                          height="20px"
                                          viewBox="0 0 20 20"
                                          version="1.1"
                                          xmlns="http://www.w3.org/2000/svg"
                                          xmlnsXlink="http://www.w3.org/1999/xlink"
                                       >
                                          <g
                                             stroke="none"
                                             strokeWidth={1}
                                             fill="none"
                                             fillRule="evenodd"
                                          >
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
                                    <p>
                                       Emit additional JavaScript to ease support for importing
                                       CommonJS modules. This enables{" "}
                                       <a href="#allowSyntheticDefaultImports">
                                          <code>allowSyntheticDefaultImports</code>
                                       </a>{" "}
                                       for type compatibility.
                                    </p>
                                 </label>
                              </li>
                           </ol>
                        </div>
                        <div>
                           <h4>Type Checking</h4>
                           <ol>
                              <li aria-expanded="false">
                                 <input
                                    type="checkbox"
                                    defaultValue="strict"
                                    name="strict"
                                    id="option-strict"
                                 />
                                 <label
                                    style={{ position: "relative", width: "100%" }}
                                    htmlFor="option-strict"
                                 >
                                    <span>strict</span>
                                    <a
                                       href="../tsconfig#strict"
                                       className="compiler_info_link"
                                       alt="Look up strict in the TSConfig Reference"
                                       target="_blank"
                                    >
                                       
                                       <svg
                                          width="20px"
                                          height="20px"
                                          viewBox="0 0 20 20"
                                          version="1.1"
                                          xmlns="http://www.w3.org/2000/svg"
                                          xmlnsXlink="http://www.w3.org/1999/xlink"
                                       >
                                          <g
                                             stroke="none"
                                             strokeWidth={1}
                                             fill="none"
                                             fillRule="evenodd"
                                          >
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
                                    <p>Enable all strict type-checking options.</p>
                                 </label>
                              </li>
                              <li aria-expanded="false">
                                 <input
                                    type="checkbox"
                                    defaultValue="noImplicitAny"
                                    name="noImplicitAny"
                                    id="option-noImplicitAny"
                                 />
                                 <label
                                    style={{ position: "relative", width: "100%" }}
                                    htmlFor="option-noImplicitAny"
                                 >
                                    <span>noImplicitAny</span>
                                    <a
                                       href="../tsconfig#noImplicitAny"
                                       className="compiler_info_link"
                                       alt="Look up noImplicitAny in the TSConfig Reference"
                                       target="_blank"
                                    >
                                       
                                       <svg
                                          width="20px"
                                          height="20px"
                                          viewBox="0 0 20 20"
                                          version="1.1"
                                          xmlns="http://www.w3.org/2000/svg"
                                          xmlnsXlink="http://www.w3.org/1999/xlink"
                                       >
                                          <g
                                             stroke="none"
                                             strokeWidth={1}
                                             fill="none"
                                             fillRule="evenodd"
                                          >
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
                                    <p>
                                       Enable error reporting for expressions and declarations with an
                                       implied <code>any</code> type.
                                    </p>
                                 </label>
                              </li>
                              <li aria-expanded="false">
                                 <input
                                    type="checkbox"
                                    defaultValue="strictNullChecks"
                                    name="strictNullChecks"
                                    id="option-strictNullChecks"
                                 />
                                 <label
                                    style={{ position: "relative", width: "100%" }}
                                    htmlFor="option-strictNullChecks"
                                 >
                                    <span>strictNullChecks</span>
                                    <a
                                       href="../tsconfig#strictNullChecks"
                                       className="compiler_info_link"
                                       alt="Look up strictNullChecks in the TSConfig Reference"
                                       target="_blank"
                                    >
                                       
                                       <svg
                                          width="20px"
                                          height="20px"
                                          viewBox="0 0 20 20"
                                          version="1.1"
                                          xmlns="http://www.w3.org/2000/svg"
                                          xmlnsXlink="http://www.w3.org/1999/xlink"
                                       >
                                          <g
                                             stroke="none"
                                             strokeWidth={1}
                                             fill="none"
                                             fillRule="evenodd"
                                          >
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
                                    <p>
                                       When type checking, take into account <code>null</code> and{" "}
                                       <code>undefined</code>.
                                    </p>
                                 </label>
                              </li>
                              <li aria-expanded="false">
                                 <input
                                    type="checkbox"
                                    defaultValue="strictFunctionTypes"
                                    name="strictFunctionTypes"
                                    id="option-strictFunctionTypes"
                                 />
                                 <label
                                    style={{ position: "relative", width: "100%" }}
                                    htmlFor="option-strictFunctionTypes"
                                 >
                                    <span>strictFunctionTypes</span>
                                    <a
                                       href="../tsconfig#strictFunctionTypes"
                                       className="compiler_info_link"
                                       alt="Look up strictFunctionTypes in the TSConfig Reference"
                                       target="_blank"
                                    >
                                       
                                       <svg
                                          width="20px"
                                          height="20px"
                                          viewBox="0 0 20 20"
                                          version="1.1"
                                          xmlns="http://www.w3.org/2000/svg"
                                          xmlnsXlink="http://www.w3.org/1999/xlink"
                                       >
                                          <g
                                             stroke="none"
                                             strokeWidth={1}
                                             fill="none"
                                             fillRule="evenodd"
                                          >
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
                                    <p>
                                       When assigning functions, check to ensure parameters and the
                                       return values are subtype-compatible.
                                    </p>
                                 </label>
                              </li>
                              <li aria-expanded="false">
                                 <input
                                    type="checkbox"
                                    defaultValue="strictBindCallApply"
                                    name="strictBindCallApply"
                                    id="option-strictBindCallApply"
                                 />
                                 <label
                                    style={{ position: "relative", width: "100%" }}
                                    htmlFor="option-strictBindCallApply"
                                 >
                                    <span>strictBindCallApply</span>
                                    <a
                                       href="../tsconfig#strictBindCallApply"
                                       className="compiler_info_link"
                                       alt="Look up strictBindCallApply in the TSConfig Reference"
                                       target="_blank"
                                    >
                                       
                                       <svg
                                          width="20px"
                                          height="20px"
                                          viewBox="0 0 20 20"
                                          version="1.1"
                                          xmlns="http://www.w3.org/2000/svg"
                                          xmlnsXlink="http://www.w3.org/1999/xlink"
                                       >
                                          <g
                                             stroke="none"
                                             strokeWidth={1}
                                             fill="none"
                                             fillRule="evenodd"
                                          >
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
                                    <p>
                                       Check that the arguments for <code>bind</code>,{" "}
                                       <code>call</code>, and <code>apply</code> methods match the
                                       original function.
                                    </p>
                                 </label>
                              </li>
                              <li aria-expanded="false">
                                 <input
                                    type="checkbox"
                                    defaultValue="strictPropertyInitialization"
                                    name="strictPropertyInitialization"
                                    id="option-strictPropertyInitialization"
                                 />
                                 <label
                                    style={{ position: "relative", width: "100%" }}
                                    htmlFor="option-strictPropertyInitialization"
                                 >
                                    <span>strictPropertyInitialization</span>
                                    <a
                                       href="../tsconfig#strictPropertyInitialization"
                                       className="compiler_info_link"
                                       alt="Look up strictPropertyInitialization in the TSConfig Reference"
                                       target="_blank"
                                    >
                                       
                                       <svg
                                          width="20px"
                                          height="20px"
                                          viewBox="0 0 20 20"
                                          version="1.1"
                                          xmlns="http://www.w3.org/2000/svg"
                                          xmlnsXlink="http://www.w3.org/1999/xlink"
                                       >
                                          <g
                                             stroke="none"
                                             strokeWidth={1}
                                             fill="none"
                                             fillRule="evenodd"
                                          >
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
                                    <p>
                                       Check for class properties that are declared but not set in the
                                       constructor.
                                    </p>
                                 </label>
                              </li>
                              <li aria-expanded="false">
                                 <input
                                    type="checkbox"
                                    defaultValue="noImplicitThis"
                                    name="noImplicitThis"
                                    id="option-noImplicitThis"
                                 />
                                 <label
                                    style={{ position: "relative", width: "100%" }}
                                    htmlFor="option-noImplicitThis"
                                 >
                                    <span>noImplicitThis</span>
                                    <a
                                       href="../tsconfig#noImplicitThis"
                                       className="compiler_info_link"
                                       alt="Look up noImplicitThis in the TSConfig Reference"
                                       target="_blank"
                                    >
                                       
                                       <svg
                                          width="20px"
                                          height="20px"
                                          viewBox="0 0 20 20"
                                          version="1.1"
                                          xmlns="http://www.w3.org/2000/svg"
                                          xmlnsXlink="http://www.w3.org/1999/xlink"
                                       >
                                          <g
                                             stroke="none"
                                             strokeWidth={1}
                                             fill="none"
                                             fillRule="evenodd"
                                          >
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
                                    <p>
                                       Enable error reporting when <code>this</code> is given the type{" "}
                                       <code>any</code>.
                                    </p>
                                 </label>
                              </li>
                              <li aria-expanded="false">
                                 <input
                                    type="checkbox"
                                    defaultValue="useUnknownInCatchVariables"
                                    name="useUnknownInCatchVariables"
                                    id="option-useUnknownInCatchVariables"
                                 />
                                 <label
                                    style={{ position: "relative", width: "100%" }}
                                    htmlFor="option-useUnknownInCatchVariables"
                                 >
                                    <span>useUnknownInCatchVariables</span>
                                    <a
                                       href="../tsconfig#useUnknownInCatchVariables"
                                       className="compiler_info_link"
                                       alt="Look up useUnknownInCatchVariables in the TSConfig Reference"
                                       target="_blank"
                                    >
                                       
                                       <svg
                                          width="20px"
                                          height="20px"
                                          viewBox="0 0 20 20"
                                          version="1.1"
                                          xmlns="http://www.w3.org/2000/svg"
                                          xmlnsXlink="http://www.w3.org/1999/xlink"
                                       >
                                          <g
                                             stroke="none"
                                             strokeWidth={1}
                                             fill="none"
                                             fillRule="evenodd"
                                          >
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
                                    <p>
                                       Default catch clause variables as <code>unknown</code> instead
                                       of <code>any</code>.
                                    </p>
                                 </label>
                              </li>
                              <li aria-expanded="false">
                                 <input
                                    type="checkbox"
                                    defaultValue="alwaysStrict"
                                    name="alwaysStrict"
                                    id="option-alwaysStrict"
                                 />
                                 <label
                                    style={{ position: "relative", width: "100%" }}
                                    htmlFor="option-alwaysStrict"
                                 >
                                    <span>alwaysStrict</span>
                                    <a
                                       href="../tsconfig#alwaysStrict"
                                       className="compiler_info_link"
                                       alt="Look up alwaysStrict in the TSConfig Reference"
                                       target="_blank"
                                    >
                                       
                                       <svg
                                          width="20px"
                                          height="20px"
                                          viewBox="0 0 20 20"
                                          version="1.1"
                                          xmlns="http://www.w3.org/2000/svg"
                                          xmlnsXlink="http://www.w3.org/1999/xlink"
                                       >
                                          <g
                                             stroke="none"
                                             strokeWidth={1}
                                             fill="none"
                                             fillRule="evenodd"
                                          >
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
                                    <p>Ensure 'use strict' is always emitted.</p>
                                 </label>
                              </li>
                              <li aria-expanded="false">
                                 <input
                                    type="checkbox"
                                    defaultValue="noUnusedLocals"
                                    name="noUnusedLocals"
                                    id="option-noUnusedLocals"
                                 />
                                 <label
                                    style={{ position: "relative", width: "100%" }}
                                    htmlFor="option-noUnusedLocals"
                                 >
                                    <span>noUnusedLocals</span>
                                    <a
                                       href="../tsconfig#noUnusedLocals"
                                       className="compiler_info_link"
                                       alt="Look up noUnusedLocals in the TSConfig Reference"
                                       target="_blank"
                                    >
                                       
                                       <svg
                                          width="20px"
                                          height="20px"
                                          viewBox="0 0 20 20"
                                          version="1.1"
                                          xmlns="http://www.w3.org/2000/svg"
                                          xmlnsXlink="http://www.w3.org/1999/xlink"
                                       >
                                          <g
                                             stroke="none"
                                             strokeWidth={1}
                                             fill="none"
                                             fillRule="evenodd"
                                          >
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
                                    <p>Enable error reporting when local variables aren't read.</p>
                                 </label>
                              </li>
                              <li aria-expanded="false">
                                 <input
                                    type="checkbox"
                                    defaultValue="noUnusedParameters"
                                    name="noUnusedParameters"
                                    id="option-noUnusedParameters"
                                 />
                                 <label
                                    style={{ position: "relative", width: "100%" }}
                                    htmlFor="option-noUnusedParameters"
                                 >
                                    <span>noUnusedParameters</span>
                                    <a
                                       href="../tsconfig#noUnusedParameters"
                                       className="compiler_info_link"
                                       alt="Look up noUnusedParameters in the TSConfig Reference"
                                       target="_blank"
                                    >
                                       
                                       <svg
                                          width="20px"
                                          height="20px"
                                          viewBox="0 0 20 20"
                                          version="1.1"
                                          xmlns="http://www.w3.org/2000/svg"
                                          xmlnsXlink="http://www.w3.org/1999/xlink"
                                       >
                                          <g
                                             stroke="none"
                                             strokeWidth={1}
                                             fill="none"
                                             fillRule="evenodd"
                                          >
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
                                    <p>Raise an error when a function parameter isn't read.</p>
                                 </label>
                              </li>
                              <li aria-expanded="false">
                                 <input
                                    type="checkbox"
                                    defaultValue="exactOptionalPropertyTypes"
                                    name="exactOptionalPropertyTypes"
                                    id="option-exactOptionalPropertyTypes"
                                 />
                                 <label
                                    style={{ position: "relative", width: "100%" }}
                                    htmlFor="option-exactOptionalPropertyTypes"
                                 >
                                    <span>exactOptionalPropertyTypes</span>
                                    <a
                                       href="../tsconfig#exactOptionalPropertyTypes"
                                       className="compiler_info_link"
                                       alt="Look up exactOptionalPropertyTypes in the TSConfig Reference"
                                       target="_blank"
                                    >
                                       
                                       <svg
                                          width="20px"
                                          height="20px"
                                          viewBox="0 0 20 20"
                                          version="1.1"
                                          xmlns="http://www.w3.org/2000/svg"
                                          xmlnsXlink="http://www.w3.org/1999/xlink"
                                       >
                                          <g
                                             stroke="none"
                                             strokeWidth={1}
                                             fill="none"
                                             fillRule="evenodd"
                                          >
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
                                    <p>
                                       Interpret optional property types as written, rather than adding{" "}
                                       <code>undefined</code>.
                                    </p>
                                 </label>
                              </li>
                              <li aria-expanded="false">
                                 <input
                                    type="checkbox"
                                    defaultValue="noImplicitReturns"
                                    name="noImplicitReturns"
                                    id="option-noImplicitReturns"
                                 />
                                 <label
                                    style={{ position: "relative", width: "100%" }}
                                    htmlFor="option-noImplicitReturns"
                                 >
                                    <span>noImplicitReturns</span>
                                    <a
                                       href="../tsconfig#noImplicitReturns"
                                       className="compiler_info_link"
                                       alt="Look up noImplicitReturns in the TSConfig Reference"
                                       target="_blank"
                                    >
                                       
                                       <svg
                                          width="20px"
                                          height="20px"
                                          viewBox="0 0 20 20"
                                          version="1.1"
                                          xmlns="http://www.w3.org/2000/svg"
                                          xmlnsXlink="http://www.w3.org/1999/xlink"
                                       >
                                          <g
                                             stroke="none"
                                             strokeWidth={1}
                                             fill="none"
                                             fillRule="evenodd"
                                          >
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
                                    <p>
                                       Enable error reporting for codepaths that do not explicitly
                                       return in a function.
                                    </p>
                                 </label>
                              </li>
                              <li aria-expanded="false">
                                 <input
                                    type="checkbox"
                                    defaultValue="noFallthroughCasesInSwitch"
                                    name="noFallthroughCasesInSwitch"
                                    id="option-noFallthroughCasesInSwitch"
                                 />
                                 <label
                                    style={{ position: "relative", width: "100%" }}
                                    htmlFor="option-noFallthroughCasesInSwitch"
                                 >
                                    <span>noFallthroughCasesInSwitch</span>
                                    <a
                                       href="../tsconfig#noFallthroughCasesInSwitch"
                                       className="compiler_info_link"
                                       alt="Look up noFallthroughCasesInSwitch in the TSConfig Reference"
                                       target="_blank"
                                    >
                                       
                                       <svg
                                          width="20px"
                                          height="20px"
                                          viewBox="0 0 20 20"
                                          version="1.1"
                                          xmlns="http://www.w3.org/2000/svg"
                                          xmlnsXlink="http://www.w3.org/1999/xlink"
                                       >
                                          <g
                                             stroke="none"
                                             strokeWidth={1}
                                             fill="none"
                                             fillRule="evenodd"
                                          >
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
                                    <p>
                                       Enable error reporting for fallthrough cases in switch
                                       statements.
                                    </p>
                                 </label>
                              </li>
                              <li aria-expanded="false">
                                 <input
                                    type="checkbox"
                                    defaultValue="noUncheckedIndexedAccess"
                                    name="noUncheckedIndexedAccess"
                                    id="option-noUncheckedIndexedAccess"
                                 />
                                 <label
                                    style={{ position: "relative", width: "100%" }}
                                    htmlFor="option-noUncheckedIndexedAccess"
                                 >
                                    <span>noUncheckedIndexedAccess</span>
                                    <a
                                       href="../tsconfig#noUncheckedIndexedAccess"
                                       className="compiler_info_link"
                                       alt="Look up noUncheckedIndexedAccess in the TSConfig Reference"
                                       target="_blank"
                                    >
                                       
                                       <svg
                                          width="20px"
                                          height="20px"
                                          viewBox="0 0 20 20"
                                          version="1.1"
                                          xmlns="http://www.w3.org/2000/svg"
                                          xmlnsXlink="http://www.w3.org/1999/xlink"
                                       >
                                          <g
                                             stroke="none"
                                             strokeWidth={1}
                                             fill="none"
                                             fillRule="evenodd"
                                          >
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
                                    <p>
                                       Add <code>undefined</code> to a type when accessed using an
                                       index.
                                    </p>
                                 </label>
                              </li>
                              <li aria-expanded="false">
                                 <input
                                    type="checkbox"
                                    defaultValue="noImplicitOverride"
                                    name="noImplicitOverride"
                                    id="option-noImplicitOverride"
                                 />
                                 <label
                                    style={{ position: "relative", width: "100%" }}
                                    htmlFor="option-noImplicitOverride"
                                 >
                                    <span>noImplicitOverride</span>
                                    <a
                                       href="../tsconfig#noImplicitOverride"
                                       className="compiler_info_link"
                                       alt="Look up noImplicitOverride in the TSConfig Reference"
                                       target="_blank"
                                    >
                                       
                                       <svg
                                          width="20px"
                                          height="20px"
                                          viewBox="0 0 20 20"
                                          version="1.1"
                                          xmlns="http://www.w3.org/2000/svg"
                                          xmlnsXlink="http://www.w3.org/1999/xlink"
                                       >
                                          <g
                                             stroke="none"
                                             strokeWidth={1}
                                             fill="none"
                                             fillRule="evenodd"
                                          >
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
                                    <p>
                                       Ensure overriding members in derived classes are marked with an
                                       override modifier.
                                    </p>
                                 </label>
                              </li>
                              <li aria-expanded="false">
                                 <input
                                    type="checkbox"
                                    defaultValue="noPropertyAccessFromIndexSignature"
                                    name="noPropertyAccessFromIndexSignature"
                                    id="option-noPropertyAccessFromIndexSignature"
                                 />
                                 <label
                                    style={{ position: "relative", width: "100%" }}
                                    htmlFor="option-noPropertyAccessFromIndexSignature"
                                 >
                                    <span>noPropertyAccessFromIndexSignature</span>
                                    <a
                                       href="../tsconfig#noPropertyAccessFromIndexSignature"
                                       className="compiler_info_link"
                                       alt="Look up noPropertyAccessFromIndexSignature in the TSConfig Reference"
                                       target="_blank"
                                    >
                                       
                                       <svg
                                          width="20px"
                                          height="20px"
                                          viewBox="0 0 20 20"
                                          version="1.1"
                                          xmlns="http://www.w3.org/2000/svg"
                                          xmlnsXlink="http://www.w3.org/1999/xlink"
                                       >
                                          <g
                                             stroke="none"
                                             strokeWidth={1}
                                             fill="none"
                                             fillRule="evenodd"
                                          >
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
                                    <p>
                                       Enforces using indexed accessors for keys declared using an
                                       indexed type.
                                    </p>
                                 </label>
                              </li>
                              <li aria-expanded="false">
                                 <input
                                    type="checkbox"
                                    defaultValue="allowUnusedLabels"
                                    name="allowUnusedLabels"
                                    id="option-allowUnusedLabels"
                                 />
                                 <label
                                    style={{ position: "relative", width: "100%" }}
                                    htmlFor="option-allowUnusedLabels"
                                 >
                                    <span>allowUnusedLabels</span>
                                    <a
                                       href="../tsconfig#allowUnusedLabels"
                                       className="compiler_info_link"
                                       alt="Look up allowUnusedLabels in the TSConfig Reference"
                                       target="_blank"
                                    >
                                       
                                       <svg
                                          width="20px"
                                          height="20px"
                                          viewBox="0 0 20 20"
                                          version="1.1"
                                          xmlns="http://www.w3.org/2000/svg"
                                          xmlnsXlink="http://www.w3.org/1999/xlink"
                                       >
                                          <g
                                             stroke="none"
                                             strokeWidth={1}
                                             fill="none"
                                             fillRule="evenodd"
                                          >
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
                                    <p>Disable error reporting for unused labels.</p>
                                 </label>
                              </li>
                              <li aria-expanded="false">
                                 <input
                                    type="checkbox"
                                    defaultValue="allowUnreachableCode"
                                    name="allowUnreachableCode"
                                    id="option-allowUnreachableCode"
                                 />
                                 <label
                                    style={{ position: "relative", width: "100%" }}
                                    htmlFor="option-allowUnreachableCode"
                                 >
                                    <span>allowUnreachableCode</span>
                                    <a
                                       href="../tsconfig#allowUnreachableCode"
                                       className="compiler_info_link"
                                       alt="Look up allowUnreachableCode in the TSConfig Reference"
                                       target="_blank"
                                    >
                                       
                                       <svg
                                          width="20px"
                                          height="20px"
                                          viewBox="0 0 20 20"
                                          version="1.1"
                                          xmlns="http://www.w3.org/2000/svg"
                                          xmlnsXlink="http://www.w3.org/1999/xlink"
                                       >
                                          <g
                                             stroke="none"
                                             strokeWidth={1}
                                             fill="none"
                                             fillRule="evenodd"
                                          >
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
                                    <p>Disable error reporting for unreachable code.</p>
                                 </label>
                              </li>
                           </ol>
                        </div>
                        <div>
                           <h4>Modules</h4>
                           <ol>
                              <li aria-expanded="false">
                                 <input
                                    type="checkbox"
                                    defaultValue="allowUmdGlobalAccess"
                                    name="allowUmdGlobalAccess"
                                    id="option-allowUmdGlobalAccess"
                                 />
                                 <label
                                    style={{ position: "relative", width: "100%" }}
                                    htmlFor="option-allowUmdGlobalAccess"
                                 >
                                    <span>allowUmdGlobalAccess</span>
                                    <a
                                       href="../tsconfig#allowUmdGlobalAccess"
                                       className="compiler_info_link"
                                       alt="Look up allowUmdGlobalAccess in the TSConfig Reference"
                                       target="_blank"
                                    >
                                       
                                       <svg
                                          width="20px"
                                          height="20px"
                                          viewBox="0 0 20 20"
                                          version="1.1"
                                          xmlns="http://www.w3.org/2000/svg"
                                          xmlnsXlink="http://www.w3.org/1999/xlink"
                                       >
                                          <g
                                             stroke="none"
                                             strokeWidth={1}
                                             fill="none"
                                             fillRule="evenodd"
                                          >
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
                                    <p>Allow accessing UMD globals from modules.</p>
                                 </label>
                              </li>
                              <li aria-expanded="false">
                                 <input
                                    type="checkbox"
                                    defaultValue="allowImportingTsExtensions"
                                    name="allowImportingTsExtensions"
                                    id="option-allowImportingTsExtensions"
                                 />
                                 <label
                                    style={{ position: "relative", width: "100%" }}
                                    htmlFor="option-allowImportingTsExtensions"
                                 >
                                    <span>allowImportingTsExtensions</span>
                                    <a
                                       href="../tsconfig#allowImportingTsExtensions"
                                       className="compiler_info_link"
                                       alt="Look up allowImportingTsExtensions in the TSConfig Reference"
                                       target="_blank"
                                    >
                                       
                                       <svg
                                          width="20px"
                                          height="20px"
                                          viewBox="0 0 20 20"
                                          version="1.1"
                                          xmlns="http://www.w3.org/2000/svg"
                                          xmlnsXlink="http://www.w3.org/1999/xlink"
                                       >
                                          <g
                                             stroke="none"
                                             strokeWidth={1}
                                             fill="none"
                                             fillRule="evenodd"
                                          >
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
                                    <p>Allow imports to include TypeScript file extensions.</p>
                                 </label>
                              </li>
                              <li aria-expanded="false">
                                 <input
                                    type="checkbox"
                                    defaultValue="resolvePackageJsonExports"
                                    name="resolvePackageJsonExports"
                                    id="option-resolvePackageJsonExports"
                                 />
                                 <label
                                    style={{ position: "relative", width: "100%" }}
                                    htmlFor="option-resolvePackageJsonExports"
                                 >
                                    <span>resolvePackageJsonExports</span>
                                    <a
                                       href="../tsconfig#resolvePackageJsonExports"
                                       className="compiler_info_link"
                                       alt="Look up resolvePackageJsonExports in the TSConfig Reference"
                                       target="_blank"
                                    >
                                       
                                       <svg
                                          width="20px"
                                          height="20px"
                                          viewBox="0 0 20 20"
                                          version="1.1"
                                          xmlns="http://www.w3.org/2000/svg"
                                          xmlnsXlink="http://www.w3.org/1999/xlink"
                                       >
                                          <g
                                             stroke="none"
                                             strokeWidth={1}
                                             fill="none"
                                             fillRule="evenodd"
                                          >
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
                                    <p>
                                       Use the package.json 'exports' field when resolving package
                                       imports.
                                    </p>
                                 </label>
                              </li>
                              <li aria-expanded="false">
                                 <input
                                    type="checkbox"
                                    defaultValue="resolvePackageJsonImports"
                                    name="resolvePackageJsonImports"
                                    id="option-resolvePackageJsonImports"
                                 />
                                 <label
                                    style={{ position: "relative", width: "100%" }}
                                    htmlFor="option-resolvePackageJsonImports"
                                 >
                                    <span>resolvePackageJsonImports</span>
                                    <a
                                       href="../tsconfig#resolvePackageJsonImports"
                                       className="compiler_info_link"
                                       alt="Look up resolvePackageJsonImports in the TSConfig Reference"
                                       target="_blank"
                                    >
                                       
                                       <svg
                                          width="20px"
                                          height="20px"
                                          viewBox="0 0 20 20"
                                          version="1.1"
                                          xmlns="http://www.w3.org/2000/svg"
                                          xmlnsXlink="http://www.w3.org/1999/xlink"
                                       >
                                          <g
                                             stroke="none"
                                             strokeWidth={1}
                                             fill="none"
                                             fillRule="evenodd"
                                          >
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
                                    <p>
                                       Use the package.json 'imports' field when resolving imports.
                                    </p>
                                 </label>
                              </li>
                              <li aria-expanded="false">
                                 <input
                                    type="checkbox"
                                    defaultValue="allowArbitraryExtensions"
                                    name="allowArbitraryExtensions"
                                    id="option-allowArbitraryExtensions"
                                 />
                                 <label
                                    style={{ position: "relative", width: "100%" }}
                                    htmlFor="option-allowArbitraryExtensions"
                                 >
                                    <span>allowArbitraryExtensions</span>
                                    <a
                                       href="../tsconfig#allowArbitraryExtensions"
                                       className="compiler_info_link"
                                       alt="Look up allowArbitraryExtensions in the TSConfig Reference"
                                       target="_blank"
                                    >
                                       
                                       <svg
                                          width="20px"
                                          height="20px"
                                          viewBox="0 0 20 20"
                                          version="1.1"
                                          xmlns="http://www.w3.org/2000/svg"
                                          xmlnsXlink="http://www.w3.org/1999/xlink"
                                       >
                                          <g
                                             stroke="none"
                                             strokeWidth={1}
                                             fill="none"
                                             fillRule="evenodd"
                                          >
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
                                    <p>
                                       Enable importing files with any extension, provided a
                                       declaration file is present.
                                    </p>
                                 </label>
                              </li>
                           </ol>
                        </div>
                        <div>
                           <h4>Language and Environment</h4>
                           <ol>
                              <li aria-expanded="false">
                                 <input
                                    type="checkbox"
                                    defaultValue="experimentalDecorators"
                                    name="experimentalDecorators"
                                    id="option-experimentalDecorators"
                                 />
                                 <label
                                    style={{ position: "relative", width: "100%" }}
                                    htmlFor="option-experimentalDecorators"
                                 >
                                    <span>experimentalDecorators</span>
                                    <a
                                       href="../tsconfig#experimentalDecorators"
                                       className="compiler_info_link"
                                       alt="Look up experimentalDecorators in the TSConfig Reference"
                                       target="_blank"
                                    >
                                       
                                       <svg
                                          width="20px"
                                          height="20px"
                                          viewBox="0 0 20 20"
                                          version="1.1"
                                          xmlns="http://www.w3.org/2000/svg"
                                          xmlnsXlink="http://www.w3.org/1999/xlink"
                                       >
                                          <g
                                             stroke="none"
                                             strokeWidth={1}
                                             fill="none"
                                             fillRule="evenodd"
                                          >
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
                                    <p>
                                       Enable experimental support for TC39 stage 2 draft decorators.
                                    </p>
                                 </label>
                              </li>
                              <li aria-expanded="false">
                                 <input
                                    type="checkbox"
                                    defaultValue="emitDecoratorMetadata"
                                    name="emitDecoratorMetadata"
                                    id="option-emitDecoratorMetadata"
                                 />
                                 <label
                                    style={{ position: "relative", width: "100%" }}
                                    htmlFor="option-emitDecoratorMetadata"
                                 >
                                    <span>emitDecoratorMetadata</span>
                                    <a
                                       href="../tsconfig#emitDecoratorMetadata"
                                       className="compiler_info_link"
                                       alt="Look up emitDecoratorMetadata in the TSConfig Reference"
                                       target="_blank"
                                    >
                                       
                                       <svg
                                          width="20px"
                                          height="20px"
                                          viewBox="0 0 20 20"
                                          version="1.1"
                                          xmlns="http://www.w3.org/2000/svg"
                                          xmlnsXlink="http://www.w3.org/1999/xlink"
                                       >
                                          <g
                                             stroke="none"
                                             strokeWidth={1}
                                             fill="none"
                                             fillRule="evenodd"
                                          >
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
                                    <p>
                                       Emit design-type metadata for decorated declarations in source
                                       files.
                                    </p>
                                 </label>
                              </li>
                              <li aria-expanded="false">
                                 <input
                                    type="checkbox"
                                    defaultValue="noLib"
                                    name="noLib"
                                    id="option-noLib"
                                 />
                                 <label
                                    style={{ position: "relative", width: "100%" }}
                                    htmlFor="option-noLib"
                                 >
                                    <span>noLib</span>
                                    <a
                                       href="../tsconfig#noLib"
                                       className="compiler_info_link"
                                       alt="Look up noLib in the TSConfig Reference"
                                       target="_blank"
                                    >
                                       
                                       <svg
                                          width="20px"
                                          height="20px"
                                          viewBox="0 0 20 20"
                                          version="1.1"
                                          xmlns="http://www.w3.org/2000/svg"
                                          xmlnsXlink="http://www.w3.org/1999/xlink"
                                       >
                                          <g
                                             stroke="none"
                                             strokeWidth={1}
                                             fill="none"
                                             fillRule="evenodd"
                                          >
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
                                    <p>
                                       Disable including any library files, including the default
                                       lib.d.ts.
                                    </p>
                                 </label>
                              </li>
                              <li aria-expanded="false">
                                 <input
                                    type="checkbox"
                                    defaultValue="useDefineForClassFields"
                                    name="useDefineForClassFields"
                                    id="option-useDefineForClassFields"
                                 />
                                 <label
                                    style={{ position: "relative", width: "100%" }}
                                    htmlFor="option-useDefineForClassFields"
                                 >
                                    <span>useDefineForClassFields</span>
                                    <a
                                       href="../tsconfig#useDefineForClassFields"
                                       className="compiler_info_link"
                                       alt="Look up useDefineForClassFields in the TSConfig Reference"
                                       target="_blank"
                                    >
                                       
                                       <svg
                                          width="20px"
                                          height="20px"
                                          viewBox="0 0 20 20"
                                          version="1.1"
                                          xmlns="http://www.w3.org/2000/svg"
                                          xmlnsXlink="http://www.w3.org/1999/xlink"
                                       >
                                          <g
                                             stroke="none"
                                             strokeWidth={1}
                                             fill="none"
                                             fillRule="evenodd"
                                          >
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
                                    <p>Emit ECMAScript-standard-compliant class fields.</p>
                                 </label>
                              </li>
                           </ol>
                        </div>
                        <div>
                           <h4>Projects</h4>
                           <ol>
                              <li aria-expanded="false">
                                 <input
                                    type="checkbox"
                                    defaultValue="disableSourceOfProjectReferenceRedirect"
                                    name="disableSourceOfProjectReferenceRedirect"
                                    id="option-disableSourceOfProjectReferenceRedirect"
                                 />
                                 <label
                                    style={{ position: "relative", width: "100%" }}
                                    htmlFor="option-disableSourceOfProjectReferenceRedirect"
                                 >
                                    <span>disableSourceOfProjectReferenceRedirect</span>
                                    <a
                                       href="../tsconfig#disableSourceOfProjectReferenceRedirect"
                                       className="compiler_info_link"
                                       alt="Look up disableSourceOfProjectReferenceRedirect in the TSConfig Reference"
                                       target="_blank"
                                    >
                                       
                                       <svg
                                          width="20px"
                                          height="20px"
                                          viewBox="0 0 20 20"
                                          version="1.1"
                                          xmlns="http://www.w3.org/2000/svg"
                                          xmlnsXlink="http://www.w3.org/1999/xlink"
                                       >
                                          <g
                                             stroke="none"
                                             strokeWidth={1}
                                             fill="none"
                                             fillRule="evenodd"
                                          >
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
                                    <p>
                                       Disable preferring source files instead of declaration files
                                       when referencing composite projects.
                                    </p>
                                 </label>
                              </li>
                           </ol>
                        </div>
                        <div>
                           <h4>Backwards Compatibility</h4>
                           <ol>
                              <li aria-expanded="false">
                                 <input
                                    type="checkbox"
                                    defaultValue="noImplicitUseStrict"
                                    name="noImplicitUseStrict"
                                    id="option-noImplicitUseStrict"
                                 />
                                 <label
                                    style={{ position: "relative", width: "100%" }}
                                    htmlFor="option-noImplicitUseStrict"
                                 >
                                    <span>noImplicitUseStrict</span>
                                    <a
                                       href="../tsconfig#noImplicitUseStrict"
                                       className="compiler_info_link"
                                       alt="Look up noImplicitUseStrict in the TSConfig Reference"
                                       target="_blank"
                                    >
                                       
                                       <svg
                                          width="20px"
                                          height="20px"
                                          viewBox="0 0 20 20"
                                          version="1.1"
                                          xmlns="http://www.w3.org/2000/svg"
                                          xmlnsXlink="http://www.w3.org/1999/xlink"
                                       >
                                          <g
                                             stroke="none"
                                             strokeWidth={1}
                                             fill="none"
                                             fillRule="evenodd"
                                          >
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
                                    <p>
                                       Disable adding 'use strict' directives in emitted JavaScript
                                       files.
                                    </p>
                                 </label>
                              </li>
                              <li aria-expanded="false">
                                 <input
                                    type="checkbox"
                                    defaultValue="suppressExcessPropertyErrors"
                                    name="suppressExcessPropertyErrors"
                                    id="option-suppressExcessPropertyErrors"
                                 />
                                 <label
                                    style={{ position: "relative", width: "100%" }}
                                    htmlFor="option-suppressExcessPropertyErrors"
                                 >
                                    <span>suppressExcessPropertyErrors</span>
                                    <a
                                       href="../tsconfig#suppressExcessPropertyErrors"
                                       className="compiler_info_link"
                                       alt="Look up suppressExcessPropertyErrors in the TSConfig Reference"
                                       target="_blank"
                                    >
                                       
                                       <svg
                                          width="20px"
                                          height="20px"
                                          viewBox="0 0 20 20"
                                          version="1.1"
                                          xmlns="http://www.w3.org/2000/svg"
                                          xmlnsXlink="http://www.w3.org/1999/xlink"
                                       >
                                          <g
                                             stroke="none"
                                             strokeWidth={1}
                                             fill="none"
                                             fillRule="evenodd"
                                          >
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
                                    <p>
                                       Disable reporting of excess property errors during the creation
                                       of object literals.
                                    </p>
                                 </label>
                              </li>
                              <li aria-expanded="false">
                                 <input
                                    type="checkbox"
                                    defaultValue="suppressImplicitAnyIndexErrors"
                                    name="suppressImplicitAnyIndexErrors"
                                    id="option-suppressImplicitAnyIndexErrors"
                                 />
                                 <label
                                    style={{ position: "relative", width: "100%" }}
                                    htmlFor="option-suppressImplicitAnyIndexErrors"
                                 >
                                    <span>suppressImplicitAnyIndexErrors</span>
                                    <a
                                       href="../tsconfig#suppressImplicitAnyIndexErrors"
                                       className="compiler_info_link"
                                       alt="Look up suppressImplicitAnyIndexErrors in the TSConfig Reference"
                                       target="_blank"
                                    >
                                       
                                       <svg
                                          width="20px"
                                          height="20px"
                                          viewBox="0 0 20 20"
                                          version="1.1"
                                          xmlns="http://www.w3.org/2000/svg"
                                          xmlnsXlink="http://www.w3.org/1999/xlink"
                                       >
                                          <g
                                             stroke="none"
                                             strokeWidth={1}
                                             fill="none"
                                             fillRule="evenodd"
                                          >
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
                                    <p>
                                       Suppress{" "}
                                       <a href="#noImplicitAny">
                                          <code>noImplicitAny</code>
                                       </a>{" "}
                                       errors when indexing objects that lack index signatures.
                                    </p>
                                 </label>
                              </li>
                              <li aria-expanded="false">
                                 <input
                                    type="checkbox"
                                    defaultValue="noStrictGenericChecks"
                                    name="noStrictGenericChecks"
                                    id="option-noStrictGenericChecks"
                                 />
                                 <label
                                    style={{ position: "relative", width: "100%" }}
                                    htmlFor="option-noStrictGenericChecks"
                                 >
                                    <span>noStrictGenericChecks</span>
                                    <a
                                       href="../tsconfig#noStrictGenericChecks"
                                       className="compiler_info_link"
                                       alt="Look up noStrictGenericChecks in the TSConfig Reference"
                                       target="_blank"
                                    >
                                       <svg
                                          width="20px"
                                          height="20px"
                                          viewBox="0 0 20 20"
                                          version="1.1"
                                          xmlns="http://www.w3.org/2000/svg"
                                          xmlnsXlink="http://www.w3.org/1999/xlink"
                                       >
                                          <g
                                             stroke="none"
                                             strokeWidth={1}
                                             fill="none"
                                             fillRule="evenodd"
                                          >
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
                                    <p>
                                       Disable strict checking of generic signatures in function types.
                                    </p>
                                 </label>
                              </li>
                              <li aria-expanded="false">
                                 <input
                                    type="checkbox"
                                    defaultValue="keyofStringsOnly"
                                    name="keyofStringsOnly"
                                    id="option-keyofStringsOnly"
                                 />
                                 <label
                                    style={{ position: "relative", width: "100%" }}
                                    htmlFor="option-keyofStringsOnly"
                                 >
                                    <span>keyofStringsOnly</span>
                                    <a
                                       href="../tsconfig#keyofStringsOnly"
                                       className="compiler_info_link"
                                       alt="Look up keyofStringsOnly in the TSConfig Reference"
                                       target="_blank"
                                    >
                                       <svg
                                          width="20px"
                                          height="20px"
                                          viewBox="0 0 20 20"
                                          version="1.1"
                                          xmlns="http://www.w3.org/2000/svg"
                                          xmlnsXlink="http://www.w3.org/1999/xlink"
                                       >
                                          <g
                                             stroke="none"
                                             strokeWidth={1}
                                             fill="none"
                                             fillRule="evenodd"
                                          >
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
                                    <p>
                                       Make keyof only return strings instead of string, numbers or
                                       symbols. Legacy option.
                                    </p>
                                 </label>
                              </li>
                           </ol>
                        </div>
                     </div> */}
                  </div>
               </div>
            )};

            <div style={{ display: 'flex', justifyContent: 'space-around', margin: '15px 0' }}>
               <button
                  type="button"
                  className={styles.btnsClass}
                  style={styles.btns}
                  onClick={clearInputs}
               >
                  Clear
               </button>
               <button
                  style={styles.btns}
                  className={styles.btnsClass}
                  onClick={runCode}
               >
                  Run
               </button>
               <button
                  style={styles.btns}
                  className={styles.btnsClass}
                  onClick={clearLogs}
               >
                  ClearLogs
               </button>
               <CopyBtn
                  copyText={outputCode}
                  styles={styles.btns}
                  className={styles.btnsClass}
                  setCopyBtnDisabled={isDisabled => dispatch({ type: actionTypes.SET_COPY_BTN_DISABLED, value: isDisabled })}
                  copyBtnDisabled={copyBtnDisabled || outputCode === ''}
               />
               <button
                  onClick={() => dispatch({ type: actionTypes.UPDATE_SHOW_OPTIONS, payload: {} })}
                  className={styles.btnsClass}
                  style={{ ...styles.btns, color: 'white', borderRadius: '7px', }}>
                  Options
               </button>
            </div>

            <div style={{ border: '1px solid red', overflowY: 'scroll', maxHeight: '39%' }}>
               <h2>Console Logs:</h2>
               <ol>
                  {consoleLogs.map((log, index) => (
                     <li key={index}>{JSON.stringify(log)}</li>
                  ))}
               </ol>
            </div>
         </div>
      </div >
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
//  * hover button color change 
 * need to use localstorage reducer 
 * nammings 
//  * clearLogs button crating error 
 * if tick removed not work if tick not tick it work fine compiling code 
 * 
 * 
 * 818cf8
 */


