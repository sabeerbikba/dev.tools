const actionTypes = {
   SET_COPY_BTN_DISABLED: 'SET_COPY_BTN_DISABLED',
   UPDATE_SHOW_OPTIONS: 'UPDATE_SHOW_OPTIONS',
   MANAGE_CONSOLE_LOGS: 'MANAGE_CONSOLE_LOGS',

   // localStorage
   UPDATE_COMPILER_TICKS: 'UPDATE_COMPILER_TICKS',
   UPDATE_COMPILER_OPTIONS: 'UPDATE_COMPILER_OPTIONS',
   UPDATE_CODE: 'UPDATE_CODE',

}

const initCode = `const message: string = 'hello world';
// console.log(message);
// `.trim();

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
   inputCode: initCode,
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


export default function Test2() {
   const [localStorageState, localStorageDispatch] = useLocalStorageReducer('typescriptPlayground', localStorageReducer, localStorageInitialState); // TODO: need to use localStorage reducer 


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

   function compileCode(code) {
      try {
         const result = ts.transpileModule(code, {
            compilerOptions: {
               target: ts.ScriptTarget[target],
               jsx: ts.JsxEmit[JSX],
               module: ts.ModuleKind[module],
               // Output Formatting
               preserveWatchOutput: preserveWatchOutput,
               pretty: pretty,
               noErrorTruncation: noErrorTruncation,
               // Emit
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
               // Interop Constraints
               isolatedModules: isolatedModules,
               verbatimModuleSyntax: verbatimModuleSyntax,
               allowSyntheticDefaultImports: allowSyntheticDefaultImports,
               esModuleInterop: esModuleInterop,
               // Type Checking
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
               // Language and Environment
               experimentalDecorators: experimentalDecorators,
               emitDecoratorMetadata: emitDecoratorMetadata,
               noLib: noLib,
               useDefineForClassFields: useDefineForClassFields,
               // Projects
               disableSourceOfProjectReferenceRedirect: disableSourceOfProjectReferenceRedirect,
               // Backwards Compatibility
               noImplicitUseStrict: noImplicitUseStrict,
               suppressExcessPropertyErrors: suppressExcessPropertyErrors,
               suppressImplicitAnyIndexErrors: suppressImplicitAnyIndexErrors,
               noStrictGenericChecks: noStrictGenericChecks,
               keyofStringsOnly: keyofStringsOnly,
            }
         });
         updateCode('outputCode', result.outputText);
      } catch (error) {
         console.error('Error compiling code:', error);
      }
   };

   return (
      <>
         sabeer bikba
      </>
   )
};