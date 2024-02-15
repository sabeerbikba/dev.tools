import { useState, useReducer, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { toast, Bounce } from 'react-toastify';
import MonacoEditor from '@monaco-editor/react';
// import '../../node_modules/monaco-editor/min/vs/editor/editor.main.css'
import {
    Accordion, AccordionItem, AccordionItemHeading,
    AccordionItemButton, AccordionItemPanel
} from 'react-accessible-accordion';
import useLocalStorage from '../hooks/useLocalStorage';
import searchEngines, { defaultImgClassName, files } from '../data/searchEngine';

const actionTypes = {
    SET_SEARCH_QUERY: 'SET_SEARCH_QUERY',
    SET_SELECTED_ENGINE: 'SET_SELECTED_ENGINE',
    TOGGLE_EDITOR_VISIBILITY: 'TOGGLE_EDITOR_VISIBILITY',
    SET_LANGUAGE: 'SET_LANGUAGE',
    SET_EDITOR_VALUE: 'SET_EDITOR_VALUE',
    SET_EDITOR_INPUTS: 'SET_EDITOR_INPUTS',
    SET_HISTORY_INDEX: 'SET_HISTORY_INDEX',
    SET_SAVE_INPUT: 'SET_SAVE_INPUT',
    SET_SHOULD_FOCUS_EDITOR: 'SET_SHOULD_FOCUS_EDITOR',
};

function searchReducer(state, action) {
    switch (action.type) {
        case actionTypes.SET_SEARCH_QUERY:
            return { ...state, searchQuery: action.payload };
        case actionTypes.SET_SELECTED_ENGINE:
            return { ...state, selectedEngine: action.payload };
        case actionTypes.TOGGLE_EDITOR_VISIBILITY:
            return { ...state, editorVisible: action.payload };
        case actionTypes.SET_LANGUAGE:
            return { ...state, language: action.payload, editorKey: Date.now() };
        case actionTypes.SET_EDITOR_VALUE:
            return { ...state, editorValue: action.payload };
        case actionTypes.SET_EDITOR_INPUTS:
            return { ...state, editorInputs: action.payload };
        case actionTypes.SET_HISTORY_INDEX:
            return { ...state, historyIndex: action.payload };
        case actionTypes.SET_SAVE_INPUT:
            return { ...state, saveInput: action.payload };
        case actionTypes.SET_SHOULD_FOCUS_EDITOR:
            return { ...state, shouldFocusEditor: action.payload }
        default:
            console.error('Unknown action: ' + action.type);
            console.warn('you not added action.type: ' + action.type + ' add and try')
            return state;
    }
}

const initialState = {
    searchQuery: '',
    selectedEngine: searchEngines[0].engines[0],
    editorVisible: false,
    language: Object.keys(files)[0],
    editorKey: Date.now(),
    editorValue: '',
    editorInputs: false,
    historyIndex: -1,
    saveInput: '',
    shouldFocusEditor: false
};

export default function SearchEngine() {
    const textAreaRef = useRef(null);
    const editorRef = useRef(null);
    const [history, setHistory] = useLocalStorage('history', [], 30);
    const [state, dispatch] = useReducer(searchReducer, initialState);
    const {
        searchQuery,
        selectedEngine,
        editorVisible,
        language,
        editorKey,
        editorValue,
        editorInputs,
        historyIndex,
        saveInput,
        shouldFocusEditor
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
        const addQuery = editorVisible ? searchQuery + ' ```' + language + ' ' + editorValue + '```' : searchQuery;

        const finalSearchQuery = encodeURIComponent(addQuery);
        const searchUrl = `${selectedEngine.url}${finalSearchQuery}`;
        window.open(searchUrl, '_blank');
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

        // if (inputValue.includes("!!") && inputValue.endsWith()) {
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
                dispatch({ type: actionTypes.SET_SELECTED_ENGINE, payload: newSelectedEngine });
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

        // if (inputCode.includes("!!") && inputCode.endsWith(' ')) {
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
                    dispatch({ type: actionTypes.SET_SELECTED_ENGINE, payload: newSelectedEngine });
                    dispatch({ type: actionTypes.SET_EDITOR_VALUE, payload: inputCode.replace(key, '').trim() });
                    return;
                } else {
                    dispatch({ type: actionTypes.SET_EDITOR_VALUE, payload: inputCode.replace(key, ' ').trim() });
                    dispatch({ type: actionTypes.SET_SELECTED_ENGINE, payload: newSelectedEngine });
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
        editorRef.current?.focus();
    }, [language]);

    useEffect(() => {
        if (shouldFocusEditor && editorRef.current) {
            editorRef.current.focus();
            editorRef.current.revealLineInCenter(1);
            dispatch({ type: 'actionTypes.SET_SHOULD_FOCUS_EDITOR', payload: false })
        }
    }, [shouldFocusEditor]);

    useEffect(() => {
        dispatch({ type: actionTypes.SET_EDITOR_INPUTS, payload: !validEngineNames.includes(selectedEngine.name) });
        if (editorVisible) {
            dispatch({ type: actionTypes.TOGGLE_EDITOR_VISIBILITY, payload: validEngineNames.includes(selectedEngine.name) });
        } else {
            dispatch({ type: actionTypes.TOGGLE_EDITOR_VISIBILITY, payload: visibleEditor.includes(selectedEngine.name) });
        }
    }, [selectedEngine]);


    useEffect(() => {
        const handleKeyDown = (event) => {
            if (event.key === '/') {
                if (event.target.tagName !== 'INPUT' && event.target.tagName !== 'TEXTAREA') {
                    textAreaRef.current.focus();
                    event.preventDefault();
                }
            }
        };

        document.addEventListener('keydown', handleKeyDown);
        return () => {
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, []);



    const tailwindcss = {
        main: 'm-4 flex h-full w-full',
        main2: 'box-border',
        selectDiv: ' flex items-center mb-4 gap-4 h-12',
        p: "font-bold text-xl text-white",
        select: `w-fit rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6`,
        textArea: 'resize-none px-4 py-2 rounded-lg border-0 bg-gray-700 text-white shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6 ',
        btn: 'rounded-md bg-indigo-500 px-3.5 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500 h-12',
        img: 'inline h-4 mr-1.5',
        textWhite: 'text-white'
    };

    const styles = {
        'textArea': { width: '96%', height: '18%' },
        'editorDiv': { height: '69%', width: '96%', border: '1px solid white', fontSize: ' 5px' },
        'imgDiv': { marginRight: '30%', marginLeft: '10%' },
        'mainDiv2': { height: '96%', width: '38%' },
        'descreptionDiv': { marginTop: '40px', textAlign: 'center', width: '94.5%' },
    }

    return (
        <div className={tailwindcss.main}>
            <div className={`${tailwindcss.main2} w-3/5`}>
                <div className={tailwindcss.selectDiv}>
                    <p className={tailwindcss.p}> InputQuery: </p>
                    <select
                        onChange={(e) => dispatch({ type: actionTypes.SET_SELECTED_ENGINE, payload: JSON.parse(e.target.value) })}
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
                    style={styles['textArea']}
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
            <div className={`${tailwindcss.main2} w-2/5 relative`} style={styles['mainDiv2']}>
                <div className="mb-2 flex">
                    <button
                        onClick={handleSearch}
                        disabled={btnDisabled}
                        className={`${btnDisabled ? 'btn-disabled' : ''} ${tailwindcss.btn} mr-2 flex pt-3.5`}
                        style={{ width: '60%' }}
                    >
                        <div style={styles['imgDiv']} className={`eng-bg-${selectedEngine.imgClassName === '' ? defaultImgClassName : selectedEngine.imgClassName}`}></div>
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
                    <button className={`${tailwindcss.btn}`} style={{ width: '94.5%' }}>
                        <a className={tailwindcss.textWhite} href={advanceSearch} target="__blank"> AdvanceSearch</a>
                    </button>
                )}
                <div className={tailwindcss.textWhite}>
                    <div style={styles['descreptionDiv']}>
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

    const tailwindcss = {
        shortcutComponent: "p-4 sm:p-6",
        shortcutComponentDiv: "grid grid-flow-row grid-cols-[repeat(auto-fit,minmax(250px,1fr))] gap-x-9",
        parts: "flex flex-col overflow-hidden",
        shortcutItem: "flex  items-center justify-between overflow-hidden text-token-text-secondary ",
        title: "flex flex-shrink items-center overflow-hidden text-sm",
        keys: "ml-3 flex flex-row gap-2",
        key: "my-2 flex h-8 items-center inline justify-center rounded-[4px] border border-black/10 text-token-text-secondary dark:border-white/10 min-w-[50px]",
    }

    const style = { border: '1px solid #aaaaaa', borderRadius: '4px', padding: '4px', paddingTop: '0', paddingBottom: '0', marginRight: '5px' };

    return (
        <div className={tailwindcss.shortcutComponent}>
            <div className={tailwindcss.shortcutItem}>
                <div className={`text-center block mx-auto`}>
                    <span style={style}> ℹ </span>
                    {/* All this input keys triggered only at last line or end of the input  */}
                    Commands work only when typed at the end of the inputs
                </div>
            </div>
            <hr className=' hr' />
            <div className={tailwindcss.shortcutItem}>
                <div className={tailwindcss.title}>
                    Navigate recent searches with Up/Down Arrows.
                </div>
                <div className={tailwindcss.keys}>
                    <div className={tailwindcss.key}>▲</div>
                    <div className={tailwindcss.key}>▼</div>
                </div>
            </div>
            <div className={tailwindcss.shortcutComponentDiv} >
                <div className={tailwindcss.parts} >
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
                <div className={tailwindcss.parts} >
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
            <div className={tailwindcss.shortcutComponentDiv} >
                <div className={tailwindcss.parts} >
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
                <div className={tailwindcss.parts} >
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
    const tailwindcss = {
        shortcutItem: "flex items-center justify-between overflow-hidden text-token-text-secondary",
        title: "flex flex-shrink items-center overflow-hidden text-sm",
        keys: "ml-3 flex flex-row gap-2",
        key: "my-2 flex h-8 items-center justify-center rounded-[4px] border border-black/10 text-token-text-secondary dark:border-white/10 min-w-[50px]",
    }

    return (
        <div className={tailwindcss.shortcutItem}>
            <div className={tailwindcss.title}>
                <div className="truncate">{title}</div>
            </div>
            <div className={tailwindcss.keys}>
                {keys.map((key, index) => (
                    <div key={index} className={tailwindcss.key}>
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