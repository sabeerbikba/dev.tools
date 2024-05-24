import { useState, useReducer, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { toast, Bounce } from 'react-toastify';
import MonacoEditor from '@monaco-editor/react';
import {
   Accordion, AccordionItem, AccordionItemHeading,
   AccordionItemButton, AccordionItemPanel
} from 'react-accessible-accordion';

import useLocalStorageState from '../hooks/useLocalStorageState';
import searchEngines, { files } from '../data/searchEngine';
import useOpenLink from '../hooks/useOpenLink';

const actionTypes = {
   SET_SEARCH_QUERY: 'SET_SEARCH_QUERY',
   SET_SELECTED_ENGINE: 'SET_SELECTED_ENGINE', // localStorage's
   TOGGLE_EDITOR_VISIBILITY: 'TOGGLE_EDITOR_VISIBILITY',
   SET_LANGUAGE: 'SET_LANGUAGE',
   SET_EDITOR_VALUE: 'SET_EDITOR_VALUE',
   SET_EDITOR_INPUTS: 'SET_EDITOR_INPUTS',
   SET_HISTORY_INDEX: 'SET_HISTORY_INDEX',
   SET_SAVE_INPUT: 'SET_SAVE_INPUT',
   SET_SHOULD_FOCUS_EDITOR: 'SET_SHOULD_FOCUS_EDITOR',
   SET_SLASH_INFO: 'SET_SLASH_INFO',
};

const initialState = {
   searchQuery: '',
   editorVisible: false,
   language: Object.keys(files)[0],
   editorKey: Date.now(),
   editorValue: '',
   editorInputs: false,
   historyIndex: -1,
   saveInput: '',
   shouldFocusEditor: false,
   showSlahsInfo: true
};

function searchReducer(state, action) {
   switch (action.type) {
      case actionTypes.SET_SEARCH_QUERY: {
         return { ...state, searchQuery: action.payload };
      }
      case actionTypes.TOGGLE_EDITOR_VISIBILITY: {
         return { ...state, editorVisible: action.payload };
      }
      case actionTypes.SET_LANGUAGE: {
         return { ...state, language: action.payload, editorKey: Date.now() };
      }
      case actionTypes.SET_EDITOR_VALUE: {
         return { ...state, editorValue: action.payload };
      }
      case actionTypes.SET_EDITOR_INPUTS: {
         return { ...state, editorInputs: action.payload };
      }
      case actionTypes.SET_HISTORY_INDEX: {
         return { ...state, historyIndex: action.payload };
      }
      case actionTypes.SET_SAVE_INPUT: {
         return { ...state, saveInput: action.payload };
      }
      case actionTypes.SET_SHOULD_FOCUS_EDITOR: {
         return { ...state, shouldFocusEditor: action.payload }
      }
      case actionTypes.SET_SLASH_INFO: {
         return { ...state, showSlahsInfo: action.payload }
      }
      default: {
         console.error('Unknown action: ' + action.type);
         console.warn('you not added action.type: ' + action.type + ' add and try');
         return state;
      }
   }
}

export default function SearchEngine() {
   const textAreaRef = useRef(null);
   const editorRef = useRef(null);
   const openLink = useOpenLink();
   const [history, setHistory] = useLocalStorageState('history', [], 30);
   const [selectedEngine, setSelectedEngine] = useLocalStorageState('selectedEngine', searchEngines[0].engines[0]);
   const [state, dispatch] = useReducer(searchReducer, initialState);
   const {
      searchQuery,
      editorVisible,
      language,
      editorKey,
      editorValue,
      editorInputs,
      historyIndex,
      saveInput,
      shouldFocusEditor,
      showSlahsInfo,
   } = state;

   const advanceSearch = selectedEngine.advanceSearchBtn;
   const btnDisabled = !selectedEngine || searchQuery === '';
   const file = files[language];
   const validEngineNames = ['Google', 'Bing', 'DuckDuckGo', 'Phind (Code)', 'You.com'];
   const visibleEditor = ['Phind (Code)', 'You.com'];


   function handleEditorMount(editor) {
      editorRef.current = editor;
      dispatch({ type: actionTypes.SET_SHOULD_FOCUS_EDITOR, payload: true })
   }

   function handleSearch() {
      if (searchQuery.trim() !== '') {
         setHistory([searchQuery, ...history]);
         dispatch({ type: actionTypes.SET_SEARCH_QUERY, payload: '' });
         dispatch({ type: actionTypes.SET_HISTORY_INDEX, payload: -1 });
      }
      const addQuery = editorVisible && editorValue !== '' ? searchQuery + ' ```\n' + language + ' ' + editorValue + '\n```' : searchQuery;

      const finalSearchQuery = encodeURIComponent(addQuery);
      const searchUrl = `${selectedEngine.url}${finalSearchQuery}`;
      window.open(searchUrl, '__blank');
   }

   function handleFileChange(event) {
      const newLanguage = event.target.value;
      dispatch({ type: actionTypes.SET_LANGUAGE, payload: newLanguage });
   }

   function handleKeyDown(event) {

      if (event.key === 'ArrowUp') {
         if (historyIndex < history.length - 1) {
            dispatch({ type: actionTypes.SET_HISTORY_INDEX, payload: historyIndex + 1 });
            dispatch({ type: actionTypes.SET_SEARCH_QUERY, payload: history[historyIndex + 1] });
         }
      } else if (event.key === 'ArrowDown') {
         if (historyIndex > 0) {
            dispatch({ type: actionTypes.SET_HISTORY_INDEX, payload: historyIndex - 1 });
            dispatch({ type: actionTypes.SET_SEARCH_QUERY, payload: history[historyIndex - 1] });
         } else if (historyIndex === 0) {
            dispatch({ type: actionTypes.SET_HISTORY_INDEX, payload: -1 });
            dispatch({ type: actionTypes.SET_SEARCH_QUERY, payload: saveInput });
         }
      }
   }

   function handleInputChange(event) {
      const inputValue = event.target.value;
      let newSelectedEngine = null;
      dispatch({ type: actionTypes.SET_SAVE_INPUT, payload: inputValue });

      if (/!![\w\d\S]*\s$/gi.test(inputValue)) {
         const keyStartIndex = inputValue.indexOf("!!");
         const keyEndIndex = inputValue.indexOf(" ", keyStartIndex);
         const key = inputValue.substring(keyStartIndex, keyEndIndex !== -1 ? keyEndIndex : undefined).trim();
         const keyLowerCase = key.toLowerCase();

         if (keyLowerCase === '!!clear') {
            dispatch({ type: actionTypes.SET_SEARCH_QUERY, payload: "" });
            return;
         }

         if (keyLowerCase === '!!code') {
            if (validEngineNames.includes(selectedEngine.name)) {
               dispatch({ type: actionTypes.TOGGLE_EDITOR_VISIBILITY, payload: !state.editorVisible });

               if (editorRef.current && editorVisible) {

                  if (shouldFocusEditor) {
                     editorRef.current.focus();
                     editorRef.current.revealLineInCenter(1);
                  }

               }
               dispatch({ type: actionTypes.SET_SEARCH_QUERY, payload: inputValue.replace(key, ' ').trim() });
               return;
            } else {
               dispatch({ type: actionTypes.SET_SEARCH_QUERY, payload: inputValue.replace(key, ' ').trim() });
               toast.warn(`There is no reason to use codeEditor when selected ${selectedEngine.name}`, {
                  position: "bottom-right",
                  autoClose: 3000,
                  hideProgressBar: false,
                  closeOnClick: true,
                  pauseOnHover: true,
                  draggable: true,
                  progress: undefined,
                  theme: "dark",
                  transition: Bounce,
               });
               return;
            }
         }

         const specialKeys = searchEngines.flatMap(group => group.engines.map(engine => engine.key.toLowerCase()));
         if (specialKeys.includes(keyLowerCase)) {
            const engine = searchEngines.flatMap(group => group.engines).find(engine => engine.key.toLowerCase() === keyLowerCase);
            newSelectedEngine = engine;
         }

         if (newSelectedEngine) {
            setSelectedEngine(newSelectedEngine);
            const newQuery = inputValue.replace(key, '').trim();
            dispatch({ type: actionTypes.SET_SEARCH_QUERY, payload: newQuery });
            return;
         } else {
            dispatch({ type: actionTypes.SET_SEARCH_QUERY, payload: inputValue.replace(key, '!!').trim() });
            toast.warn('Key not found!', {
               position: "bottom-right",
               autoClose: 1400,
               hideProgressBar: false,
               closeOnClick: true,
               pauseOnHover: true,
               draggable: true,
               progress: undefined,
               theme: "dark",
               transition: Bounce,
            });
            return;
         }
      }
      dispatch({ type: actionTypes.SET_SEARCH_QUERY, payload: inputValue });
   }

   function handleCodeChange(code) {
      const inputCode = code;
      let newSelectedEngine = null;

      if (/!![\w\d\S]*\s$/gi.test(inputCode)) {
         const keyStartIndex = inputCode.indexOf("!!");
         const keyEndIndex = inputCode.indexOf(" ", keyStartIndex);
         const key = inputCode.substring(keyStartIndex, keyEndIndex !== -1 ? keyEndIndex : undefined).trim();
         const keyLowerCase = key.toLowerCase();

         if (keyLowerCase === '!!clear') {
            dispatch({ type: actionTypes.SET_EDITOR_VALUE, payload: '' });
            return;
         }

         if (keyLowerCase === '!!code') {
            dispatch({ type: actionTypes.TOGGLE_EDITOR_VISIBILITY, payload: !state.editorVisible });
            dispatch({ type: actionTypes.SET_EDITOR_VALUE, payload: inputCode.replace(key, '').trim() });
            textAreaRef.current.focus();
            return;
         }

         // check if key pressed valid by checking serchEngines and files array
         const language = Object.keys(files).find(fileKey => files[fileKey].key.toLowerCase() === keyLowerCase);
         const specialKeys = searchEngines.flatMap(group => group.engines.map(engine => engine.key.toLowerCase()));
         if (specialKeys.includes(keyLowerCase)) {
            const engine = searchEngines.flatMap(group => group.engines).find(engine => engine.key.toLowerCase() === keyLowerCase);
            newSelectedEngine = engine;
         } //

         if (language) {
            dispatch({ type: actionTypes.SET_LANGUAGE, payload: language });
            dispatch({ type: actionTypes.SET_EDITOR_VALUE, payload: inputCode.replace(key, '').trim() });
            return;
         } else if (newSelectedEngine) {
            if (validEngineNames.includes(newSelectedEngine.name)) {
               dispatch({ type: actionTypes.TOGGLE_EDITOR_VISIBILITY, payload: true })
               setSelectedEngine(newSelectedEngine);
               dispatch({ type: actionTypes.SET_EDITOR_VALUE, payload: inputCode.replace(key, '').trim() });
               return;
            } else {
               dispatch({ type: actionTypes.SET_EDITOR_VALUE, payload: inputCode.replace(key, ' ').trim() });
               setSelectedEngine(newSelectedEngine);
               dispatch({ type: actionTypes.TOGGLE_EDITOR_VISIBILITY, payload: !state.editorVisible })
               textAreaRef.current.focus();
               return;
            }
         } else {
            dispatch({ type: actionTypes.SET_EDITOR_VALUE, payload: inputCode.replace(key, '!!').trim() });
            toast.warn('Key not found!', {
               position: "bottom-right",
               autoClose: 1400,
               hideProgressBar: false,
               closeOnClick: true,
               pauseOnHover: true,
               draggable: true,
               progress: undefined,
               theme: "dark",
               transition: Bounce,
            });
            return;
         }
      }
      dispatch({ type: actionTypes.SET_EDITOR_VALUE, payload: inputCode })
   }

   useEffect(() => {
      dispatch({ type: actionTypes.SET_EDITOR_INPUTS, payload: !validEngineNames.includes(selectedEngine.name) });
      if (editorVisible) {
         dispatch({ type: actionTypes.TOGGLE_EDITOR_VISIBILITY, payload: validEngineNames.includes(selectedEngine.name) });
      } else {
         dispatch({ type: actionTypes.TOGGLE_EDITOR_VISIBILITY, payload: visibleEditor.includes(selectedEngine.name) });
      }
   }, [selectedEngine]);

   useEffect(() => {
      function handleSlashKey(event) {
         if (event.key === '/') {
            if (event.target.tagName !== 'INPUT' && event.target.tagName !== 'TEXTAREA') {
               textAreaRef.current.focus();
               event.preventDefault();
            }
         }
      }

      const allowedKeys = [
         '~', '!', '@', '#', '$', '%', '^', '&', '*', '(', ')', '_', '+',
         'Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P', '{', '}', '|',
         'A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L', ':', '"',
         'Z', 'X', 'C', 'V', 'B', 'N', 'M', '<', '>', '?',
         '`', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '-', '=',
         'q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p', '[', ']', '\'',
         'a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', ';', "'",
         'z', 'x', 'c', 'v', 'b', 'n', 'm', ',', '.', '/',
         ' ',
      ];

      function handleOtherKeys(event) {
         if (allowedKeys.includes(event.key)) {
            if ((!textAreaRef.current?.contains(event.target) &&
               !editorRef.current?.contains(event.target)) &&
               event.key !== '/') {
               if (!event.ctrlKey && !event.altKey && !event.shiftKey) {
                  if (showSlahsInfo) {
                     dispatch({ type: actionTypes.SET_SLASH_INFO, payload: false });
                     toast.info('Press / to jump to the search box!', {
                        position: "bottom-right",
                        autoClose: 4000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                        theme: "dark",
                        transition: Bounce,
                     });
                  }
               }
            }
         }
      }

      document.addEventListener('keydown', handleSlashKey);
      document.addEventListener('keydown', handleOtherKeys);

      return () => {
         document.removeEventListener('keydown', handleSlashKey);
         document.removeEventListener('keydown', handleOtherKeys);
      };
   }, [textAreaRef, editorRef, showSlahsInfo]);

   useEffect(() => {
      editorRef.current?.focus();
   }, [language]);

   useEffect(() => {
      if (shouldFocusEditor && editorRef.current) {
         editorRef.current.focus();
         editorRef.current.revealLineInCenter(1);
         dispatch({ type: actionTypes.SET_SHOULD_FOCUS_EDITOR, payload: false })
      }
   }, [shouldFocusEditor]);

   const tailwindcss = {
      main: 'pl-4 pt-4 flex h-full w-full',
      main2: 'box-border',
      selectDiv: ' flex items-center mb-4 gap-4 h-12',
      p: "font-bold text-xl text-white",
      select: `w-fit rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6`,
      textArea: 'resize-none px-4 py-2 rounded-lg border-0 bg-gray-700 text-white shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6 ',
      btn: 'rounded-md bg-indigo-500 text-sm font-semibold text-white shadow-sm hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500 h-12',
      img: 'inline h-4 mr-1.5',
      textWhite: 'text-white'
   };

   const styles = {
      textArea: { width: '96%', height: '18%' },
      editorDiv: { height: '69%', width: '96%', border: '1px solid white', fontSize: ' 5px' },
      imgDiv: { marginRight: '30%', marginLeft: '10%' },
      descreptionDiv: { marginTop: '40px', textAlign: 'center', width: '94.5%' },
   }

   return (
      <div className={tailwindcss.main} style={{ minWidth: '1620px' }}>
         <div className={`${tailwindcss.main2} w-3/5`}>
            <div className={tailwindcss.selectDiv}>
               <p className={tailwindcss.p}> InputQuery: </p>
               <select
                  onChange={(e) => setSelectedEngine(JSON.parse(e.target.value))}
                  value={JSON.stringify(selectedEngine)}
                  className={tailwindcss.select}
               >
                  {searchEngines.map((group, groupIndex) => (
                     <optgroup key={groupIndex} label={group.groupName}>
                        {group.engines.map((engine, engineIndex) => (
                           <option key={engineIndex} value={JSON.stringify(engine)}>
                              {engine.name + ' [' + engine.key + ']'}
                           </option>
                        ))}
                     </optgroup>
                  ))}
               </select>
               <select
                  value={language}
                  onChange={handleFileChange}
                  className={tailwindcss.select}
                  disabled={!editorVisible || editorInputs}
               >
                  {Object.keys(files).map((key) => (
                     <option key={key} value={key}>
                        {key + ' [' + file.key + ']'}
                     </option>
                  ))}
               </select>
               <label className={tailwindcss.textWhite}>
                  <input
                     disabled={editorInputs}
                     type="checkbox"
                     checked={editorVisible}
                     onChange={() => dispatch({ type: actionTypes.TOGGLE_EDITOR_VISIBILITY, payload: !state.editorVisible })}
                  />{' '}codeEditor</label>
            </div>
            <textarea
               ref={textAreaRef}
               value={searchQuery}
               onChange={handleInputChange}
               onKeyDown={handleKeyDown}
               className={tailwindcss.textArea}
               placeholder="  Enter search query"
               style={styles.textArea}
            />
            {editorVisible && (
               <div style={styles['editorDiv']}>
                  <MonacoEditor
                     key={editorKey}
                     theme="vs-dark"
                     options={{ minimap: { enabled: false }, lineNumber: true }}
                     path={file.name}
                     value={editorValue}
                     onChange={handleCodeChange}
                     defaultLanguage={file.language}
                     onMount={handleEditorMount}
                  />
               </div>
            )}
         </div >
         <div className={`${tailwindcss.main2} w-2/5 relative`} >
            <div className="mb-2 flex">
               <button
                  onClick={handleSearch}
                  disabled={btnDisabled}
                  className={`${btnDisabled ? 'btn-disabled' : ''} ${tailwindcss.btn} mr-2 flex pt-3.5`}
                  style={{ width: '61.5%' }}
               >
                  <div style={styles.imgDiv} className={`eng-bg-${selectedEngine.imgClassName === '' ? 'search' : selectedEngine.imgClassName}`}></div>
                  Search
               </button>
               <button
                  disabled={btnDisabled}
                  onClick={() => dispatch({ type: actionTypes.SET_SEARCH_QUERY, payload: '' })}
                  className={`${btnDisabled ? 'btn-disabled' : ''} ${tailwindcss.btn} w-1/3`}
               >
                  Clear
               </button>
            </div>
            {advanceSearch !== undefined && (
               <button
                  className={tailwindcss.btn}
                  onClick={() => openLink(advanceSearch)}
                  style={{ width: '96%' }}
               >AdvanceSearch
               </button>
            )}
            <div className={tailwindcss.textWhite}>
               <div style={styles.descreptionDiv}>
                  {selectedEngine.description}
               </div>
               <SearchEngineShortcutsAccordion />
            </div>
         </div>
      </div>
   );
}

function SearchEngineShortcutsAccordion() {
   const [expandedSection, setExpandedSection] = useState(-1);

   function handleAccordionChange(index) {
      setExpandedSection(expandedSection === index ? -1 : index);
   }

   return (
      <>
         <Accordion className='accordion4Eng' allowZeroExpanded={true} preExpanded={expandedSection === -1 ? [] : [expandedSection]} onChange={handleAccordionChange}>
            <AccordionItem className='accordion_item4Eng' >
               <AccordionItemPanel className='accordion_panel4Eng' >
                  <ShortcutComponent />
               </AccordionItemPanel>
               <AccordionItemHeading>
                  <AccordionItemButton className='accordion_button4Eng' >
                     Inputs Shortcuts
                  </AccordionItemButton>
               </AccordionItemHeading>
            </AccordionItem>
         </Accordion>
      </>
   );
}

const tailwindcss2 = {
   shortcutComponent: "p-4 sm:p-6",
   shortcutComponentDiv: "grid grid-flow-row grid-cols-[repeat(auto-fit,minmax(250px,1fr))] gap-x-9",
   parts: "flex flex-col overflow-hidden",
   shortcutItem: "flex items-center justify-between overflow-hidden text-token-text-secondary ",
   title: "flex flex-shrink items-center overflow-hidden text-sm",
   keys: "ml-3 flex flex-row gap-2",
   key: "my-2 flex h-8 items-center inline justify-center rounded-[4px] border border-black/10 text-token-text-secondary dark:border-white/10 min-w-[50px]",
}

function ShortcutComponent() {
   const flattenedEngines = searchEngines.flatMap(group => group.engines);
   const midpoint = Math.ceil(flattenedEngines.length / 2);
   const firstHalf = flattenedEngines.slice(0, midpoint);
   const secondHalf = flattenedEngines.slice(midpoint);


   const flattenedFiles = Object.keys(files).map(key => ({
      title: key,
      keys: files[key].key
   }));
   const filesMidPoint = Math.ceil(flattenedFiles.length / 2);
   const filesFirstHalf = flattenedFiles.slice(0, filesMidPoint);
   const filesHalf = flattenedFiles.slice(filesMidPoint);

   const style = { border: '1px solid #aaaaaa', borderRadius: '4px', padding: '4px', paddingTop: '0', paddingBottom: '0', marginRight: '5px' };

   return (
      <div className={tailwindcss2.shortcutComponent}>
         <div className={tailwindcss2.shortcutItem}>
            <div className={`text-center block mx-auto`}>
               <span style={style}> ℹ </span>
               Commands work only when typed at the end of the inputs
            </div>
         </div>
         <hr className=' hr' />
         <div className={tailwindcss2.shortcutItem}>
            <div className={tailwindcss2.title}>
               Navigate recent searches with Up/Down Arrows.
            </div>
            <div className={tailwindcss2.keys}>
               <div className={tailwindcss2.key}>▲</div>
               <div className={tailwindcss2.key}>▼</div>
            </div>
         </div>
         <div className={tailwindcss2.shortcutComponentDiv} >
            <div className={tailwindcss2.parts} >
               <ShortcutItem
                  title='To focus on Search box'
                  keys={['/']}
               />
               <ShortcutItem
                  title='Open close code editor'
                  keys={['!!code']}
               />
               {firstHalf.map((engine, index) => (
                  <div key={engine.key}>
                     <ShortcutItem
                        key={index}
                        title={`Select search ${engine.name} engine`}
                        keys={[engine.key]}
                     />
                  </div>
               ))}
            </div>
            <div className={tailwindcss2.parts} >
               <ShortcutItem
                  title='Clear input'
                  keys={['!!clear']}
               />
               {secondHalf.map((engine, index) => (
                  <div key={engine.key}>
                     <ShortcutItem
                        key={index}
                        title={`Select search ${engine.name} engine`}
                        keys={[engine.key]}
                     />
                  </div>
               ))}
            </div>
         </div>
         <hr className='hr' />
         <div className={tailwindcss2.shortcutComponentDiv} >
            <div className={tailwindcss2.parts} >
               <ShortcutItem
                  title='Open close code editor'
                  keys={['!!code']}
               />
               {filesFirstHalf.map((item, index) => (
                  <ShortcutItem
                     key={index}
                     title={`Select language ${item.title}`}
                     keys={[item.keys]}
                  />
               ))}
            </div>
            <div className={tailwindcss2.parts} >
               <ShortcutItem
                  title='Clear input'
                  keys={['!!clear']}
               />
               {filesHalf.map((item, index) => (
                  <ShortcutItem
                     key={index}
                     title={`Select language ${item.title}`}
                     keys={[item.keys]}
                  />
               ))}
            </div>
         </div>
      </div>
   );
}

function ShortcutItem({ title, keys }) {
   return (
      <div className={tailwindcss2.shortcutItem}>
         <div className={tailwindcss2.title}>
            <div className="truncate">{title}</div>
         </div>
         <div className={tailwindcss2.keys}>
            {keys.map((key, index) => (
               <div key={index} className={tailwindcss2.key}>
                  <span className="text-xs">{key}</span>
               </div>
            ))}
         </div>
      </div>
   );
}
ShortcutItem.propTypes = {
   title: PropTypes.string.isRequired,
   keys: PropTypes.arrayOf(PropTypes.string).isRequired,
};