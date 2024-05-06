import { useReducer, useEffect } from 'react';
import { version as autoprefixerVersion } from 'autoprefixer/package.json';
import { version as postcssVersion } from 'postcss/package.json';
import store from 'store';
import MonacoEditor from '@monaco-editor/react';

import CopyBtn from '../common/CopyBtn';
import useLocalStorageReducer from '../hooks/useLocalStorageReducer';

const CSS_EXAMPLE = '/* Your default CSS example here */';

const actionTypes = {
   SET_BROWSER_LIST: 'SET_BROWSER_LIST',
   SET_WITH_COMMENTS: 'SET_WITH_COMMENTS',
   SET_PREFIXED_CODE: 'SET_PREFIXED_CODE',
   SET_ERROR: 'SET_ERROR',
   SET_COPY_BTN_DISABLED: 'SET_COPY_BTN_DISABLED',
   // 4 reducer2 
   SET_LAST_VERSION_ERROR: 'SET_LAST_VERSION_ERROR',
   SET_LAST_VERSION_VALUE: 'SET_LAST_VERSION_VALUE',
   SET_CSS_CODE: 'SET_CSS_CODE',
}

const initialState = {
   browserList: store.get('autoprefixer:browsers', []),
   withComments: store.get('autoprefixer:withComments', true),
   prefixedCode: '',
   error: null,
   isCopyBtnDisabled: false,
};

const initialState2 = {
   lastVersion: { value: 4, error: '' },
   cssCode: CSS_EXAMPLE,
}

function reducer(state, action) {
   switch (action.type) {
      case actionTypes.SET_BROWSER_LIST: {
         return { ...state, browserList: action.payload };
      }
      case actionTypes.SET_WITH_COMMENTS: {
         return { ...state, withComments: action.payload };
      }
      case actionTypes.SET_PREFIXED_CODE: {
         return { ...state, prefixedCode: action.payload };
      }
      case actionTypes.SET_ERROR: {
         return { ...state, error: action.payload };
      }
      case actionTypes.SET_COPY_BTN_DISABLED: {
         return { ...state, isCopyBtnDisabled: action.payload };
      }

      default: {
         console.error('Unknown action: ' + action.type);
         console.warn('you not added action.type: ' + action.type + ' add and try');
         return state;
      }
   }
}

function reducer2(state, action) {
   switch (action.type) {
      case actionTypes.SET_LAST_VERSION_ERROR: {
         return {
            ...state, lastVersion: {
               ...state.lastVersion,
               error: action.payload
            }
         }
      }
      case actionTypes.SET_LAST_VERSION_VALUE: {
         return {
            ...state, lastVersion: {
               ...state.lastVersion,
               value: action.payload
            }
         }
      }
      case actionTypes.SET_CSS_CODE: {
         return { ...state, cssCode: action.payload }
      }
      default: {
         console.error('Unknown action: ' + action.type);
         console.warn('you not added action.type: ' + action.type + ' add and try');
         return state;
      }
   }
}

export default function AutoPrefixerTool() {
   const [state, dispatch] = useReducer(reducer, initialState);
   const [state2, dispatch2] = useLocalStorageReducer('autoPrefixerReducer2', reducer2, initialState2)

   const {
      browserList,
      withComments,
      prefixedCode,
      error, // not needed because same error showing in lastVersionError
      isCopyBtnDisabled,
   } = state;

   const {
      lastVersion,
      cssCode,
   } = state2;

   useEffect(() => {
      handlePrefix(browserList, withComments, cssCode);
   }, [browserList, withComments, cssCode]);

   useEffect(() => {
      const defaultBrowsers = [`last ${lastVersion.value} versions`];
      dispatch({ type: actionTypes.SET_BROWSER_LIST, payload: defaultBrowsers });
   }, [lastVersion.value]);

   async function handlePrefix(browserList, withComments, cssCode) {
      try {
         const [autoprefixer, postcss] = await Promise.all([
            import('autoprefixer'),
            import('postcss'),
         ]);

         const params = {
            overrideBrowserslist: browserList,
            grid: 'autoplace',
         };

         const autoprefixerInstance = autoprefixer.default(params);
         const compiled = await postcss.default([autoprefixerInstance]).process(cssCode);

         let html = '';
         if (withComments) html += generateOutputComment();
         html += textPrepare(compiled.css);
         dispatch({ type: actionTypes.SET_PREFIXED_CODE, payload: html });
         dispatch({ type: actionTypes.SET_ERROR, payload: null });
      } catch (error) {
         dispatch({ type: actionTypes.SET_ERROR, payload: error.message });
      }
   }

   function textPrepare(text = '') {
      return text.replace(/</g, '&lt;').replace(/>/g, '&gt;');
   }

   const generateOutputComment = () => {
      return `/*
 * Processed by: https://github.com/sabeerbikba/dev.tools
 * PostCSS: v${postcssVersion},
 * Autoprefixer: v${autoprefixerVersion}
 * Browsers: ${browserList}
 */

`;
   };


   function handleRevisitDays(value) {
      if (value === '') {
         dispatch2({ type: actionTypes.SET_LAST_VERSION_VALUE, payload: '' })
         dispatch2({ type: actionTypes.SET_LAST_VERSION_ERROR, payload: 'Unknown browser query `last versions' });
         return;
      }
      if (!/^\d{0,3}$/.test(value)) {
         dispatch2({ type: actionTypes.SET_LAST_VERSION_ERROR, payload: 'Only up to three-digit numbers are allowed' });
         return;
      }
      let numericValue = value.replace(/[^0-9]/g, '');
      if (numericValue.startsWith('0')) {
         dispatch2({ type: actionTypes.SET_LAST_VERSION_ERROR, payload: 'Minimum value is 1' });
         return;
      }
      dispatch2({ type: actionTypes.SET_LAST_VERSION_VALUE, payload: numericValue.toString() });
      dispatch2({ type: actionTypes.SET_LAST_VERSION_ERROR, payload: '' });
   }

   const options = {
      minimap: {
         enabled: false,
      },
      lineNumber: true,
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
         position: 'relative', left: `${lastVersion.error === 'Only up to three-digit numbers are allowed' ? '280px' : lastVersion.error === 'Minimum value is 1' ? '140px' : '254px'}`, bottom: '-1.3',
         display: 'inline-block', width: 0, height: 0, borderTop: '7px solid transparent', borderBottom: '7px solid transparent', borderRight: '10px solid orange',
      },
      lastVersionInput: { width: '50px', backgroundColor: '#2a2a2a', outline: 'none', borderBottom: `2px solid ${lastVersion.error ? 'red' : 'grey'}` },
      copyBtn: { backgroundColor: `${isCopyBtnDisabled || prefixedCode === '' ? '#4446a6' : '#6366f1'}`, margin: '10px 10px 0 0' },
   }

   return (
      <div className={styles.main} style={{ minWidth: '1620px' }}>
         <div className={styles.inputDiv}>
            <div className={styles.inputHead} style={{ backgroundColor: '#2a2a2a' }}>
               <div className={styles.inputHeadFlex}>
                  <p className={styles.inputHeadText}>Input: </p>
                  <button
                     type="button"
                     className={styles.inputHeadBtn}
                     onClick={() => dispatch2({ type: actionTypes.SET_CSS_CODE, payload: '' })}
                  >
                     Clear
                  </button>
               </div>
            </div>
            <MonacoEditor
               language="css"
               theme="vs-dark"
               value={cssCode}
               onChange={(e) => dispatch2({ type: actionTypes.SET_CSS_CODE, payload: e })}
               options={options}
            />
         </div>
         <div className={styles.outputDiv}>
            <div className={styles.outputHead}>
               <p className={styles.outputHeadText}> Output: </p>
               <div>
                  {lastVersion.error && (
                     <div style={styles.outputToolTip}>
                        <span style={styles.outputToolTipTringle}></span>
                        {lastVersion.error}
                     </div>
                  )}
                  <label style={{ color: 'cfd8dc' }}>
                     <span style={{ fontSize: '1.2rem', color: 'white' }}>
                        Browserslist:{' '}
                     </span>
                     Last{' '}
                     <input
                        style={styles.lastVersionInput}
                        value={lastVersion.value}
                        type="text"
                        onChange={e => handleRevisitDays(e.target.value)}
                     />
                     version
                  </label>
               </div>
            </div>
            <MonacoEditor
               language="css"
               theme="vs-dark"
               value={prefixedCode}
               options={{ ...options, readOnly: true }}
            />
            <div style={{ display: 'flex' }}>
               <CopyBtn
                  copyText={prefixedCode}
                  svg
                  setCopyBtnDisabled={(isDisable) => dispatch({ type: actionTypes.SET_COPY_BTN_DISABLED, payload: isDisable })}
                  copyBtnDisabled={isCopyBtnDisabled || prefixedCode === ''}
                  styles={styles.copyBtn}
               />
               <label className='text-white' style={{ marginTop: '4px' }}>
                  <input
                     type="checkbox"
                     checked={withComments}
                     onChange={() => dispatch({ type: actionTypes.SET_WITH_COMMENTS, payload: !withComments })}
                     disabled={lastVersion.value === ''}
                  />
                  {' '}
                  include comment with configuration to the result
                  <br />
                  You can also see which browsers you choose by filter string on {' '}
                  <a href="https://browsersl.ist/?q=last%206%20version" target='__blank' style={{ color: 'lightblue', textDecoration: 'underline' }}>
                     browsersl.ist
                  </a>
               </label>
               {/* {error} */}
            </div>
         </div>
      </div>
   );
}