const initialState = {
   consoleLogs: [],
   showOptions: false,
   copyBtnDisabled: false,
};

function reducer(state, action) {
   switch (action.type) {
      case actionTypes.UPDATE_CONSOLE_LOGS: {
         // return {
         //    ...state,
         //    consoleLogs: [
         //       ...state,
         //       action.logs,
         //    ],
         // };

         return {
            ...state,
            consoleLogs: [
               ...state.consoleLogs,
               ...action.logs,
            ],
         };
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

export default function Test2() {
   const [state, dispatch] = useReducer(reducer, initialState)

   const {
      consoleLogs,
      showOptions,
      copyBtnDisabled
   } = state;

   function runCode() {
      try {
         const consoleLog = [...consoleLogs];
         const originalConsoleLog = console.log;
         console.log = (...args) => {
            consoleLog.push(args);
            originalConsoleLog(...args);
         };
         eval(outputCode);
         dispatch({ type: actionTypes.UPDATE_CONSOLE_LOGS, logs: consoleLog });
      } catch (error) {
         console.error('Error running code:', error);
      }
   }

   function clearLogs() {
      dispatch({ type: actionTypes.UPDATE_CONSOLE_LOGS, logs: [] });
   }

   return (
      <>
         sabeer bikba
      </>
   )
};