import { useState, useReducer, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { toast, Bounce } from 'react-toastify';
import MonacoEditor from '@monaco-editor/react';
import { Accordion, AccordionItem, AccordionItemHeading, AccordionItemButton, AccordionItemPanel } from 'react-accessible-accordion';
import useLocalStorage from '../hooks/useLocalStorage';
import searchEngines, { defaultImgClassName, files } from '../data/searchEngine';

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
};

function searchReducer(state, action) {
    switch (action.type) {
        case 'SET_SEARCH_QUERY':
            return { ...state, searchQuery: action.payload };
        case 'SET_SELECTED_ENGINE':
            return { ...state, selectedEngine: action.payload };
        case 'TOGGLE_EDITOR_VISIBILITY':
            return { ...state, editorVisible: action.payload };
        case 'SET_LANGUAGE':
            return { ...state, language: action.payload, editorKey: Date.now() };
        case 'SET_EDITOR_VALUE':
            return { ...state, editorValue: action.payload };
        case 'SET_EDITOR_INPUTS':
            return { ...state, editorInputs: action.payload };
        case 'SET_HISTORY_INDEX':
            return { ...state, historyIndex: action.payload };
        case 'SET_SAVE_INPUT':
            return { ...state, saveInput: action.payload };
        default:
            console.error('Unknown action: ' + action.type);
            console.warn('you not added action.type: ' + action.type + ' add and try')
            return state;
    }
}

export default function SearchEngine() {
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
    } = state;

    const [history, setHistory] = useLocalStorage('history', [], 30);
    const editorRef = useRef(null);
    const textAreaRef = useRef(null);

    const advanceSearch = selectedEngine.advanceSearchBtn;
    const btnDisabled = !selectedEngine || searchQuery === '';
    const file = files[language];
    const value = files[language].value;
    const validEngineNames = ['Google', 'Bing', 'DuckDuckGo', 'Phind (Code)', 'You.com'];
    const visibleEditor = ['Phind (Code)', 'You.com'];

    const handleKeyDown = (event) => {
        if (event.key === 'ArrowUp') {
            if (historyIndex < history.length - 1) {
                dispatch({ type: 'SET_HISTORY_INDEX', payload: historyIndex + 1 });
                dispatch({ type: 'SET_SEARCH_QUERY', payload: history[historyIndex + 1] });
            }
        } else if (event.key === 'ArrowDown') {
            if (historyIndex > 0) {
                dispatch({ type: 'SET_HISTORY_INDEX', payload: historyIndex - 1 });
                dispatch({ type: 'SET_SEARCH_QUERY', payload: history[historyIndex - 1] });
            } else if (historyIndex === 0) {
                dispatch({ type: 'SET_HISTORY_INDEX', payload: -1 });
                dispatch({ type: 'SET_SEARCH_QUERY', payload: saveInput });
            }
        }
    };


    function handleInputChange(event) {
        const inputValue = event.target.value;
        let newSelectedEngine = null;

        if (inputValue.includes("!!") && inputValue.endsWith('  ')) {
            const keyStartIndex = inputValue.indexOf("!!");
            const keyEndIndex = inputValue.indexOf(" ", keyStartIndex);
            const key = inputValue.substring(keyStartIndex, keyEndIndex !== -1 ? keyEndIndex : undefined).trim(); console.log(key);
            const keyLowerCase = key.toLowerCase();


            if (keyLowerCase === '!!clear') {
                dispatch({ type: 'SET_SEARCH_QUERY', payload: "" });
                return;
            }

            if (keyLowerCase === '!!code') {
                if (validEngineNames.includes(selectedEngine.name)) {
                    dispatch({ type: 'TOGGLE_EDITOR_VISIBILITY', payload: !state.editorVisible });
                    console.log('key2: ' + key);
                    dispatch({ type: 'SET_SEARCH_QUERY', payload: inputValue.replace(key, ' ').trim() });
                    return;
                } else {
                    dispatch({ type: 'SET_SEARCH_QUERY', payload: inputValue.replace(key, ' ').trim() });
                    toast.warn(`There is no reason to use codeEditor in ${selectedEngine.name}`, {
                        position: "bottom-right",
                        autoClose: 2400,
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
                // console.log();
                dispatch({ type: 'SET_SELECTED_ENGINE', payload: newSelectedEngine });
                const newQuery = inputValue.replace(key, '').trim();
                dispatch({ type: 'SET_SEARCH_QUERY', payload: newQuery });
                return;
            } else {
                dispatch({ type: 'SET_SEARCH_QUERY', payload: inputValue.replace(key, '!!').trim() });
                toast.warn('Key not found!', {
                    position: "bottom-right",
                    autoClose: 2400,
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

        dispatch({ type: 'SET_SEARCH_QUERY', payload: inputValue });
    }


    const handleFileChange = (event) => {
        const newLanguage = event.target.value;
        dispatch({ type: 'SET_LANGUAGE', payload: newLanguage });
    };

    useEffect(() => {
        editorRef.current?.focus();
    }, [language]);

    useEffect(() => {
        dispatch({ type: 'SET_EDITOR_VALUE', payload: value });
    }, [value]);

    useEffect(() => {
        dispatch({ type: 'SET_EDITOR_INPUTS', payload: !validEngineNames.includes(selectedEngine.name) });
        dispatch({ type: 'TOGGLE_EDITOR_VISIBILITY', payload: visibleEditor.includes(selectedEngine.name) });
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

    function handleSearch() {
        if (searchQuery.trim() !== '') {
            setHistory([searchQuery, ...history]);
            dispatch({ type: 'SET_SEARCH_QUERY', payload: '' });
            dispatch({ type: 'SET_HISTORY_INDEX', payload: -1 });
        }
        const addQuery = editorVisible ? searchQuery + ' ```' + language + ' ' + editorValue + '```' : searchQuery;

        const finalSearchQuery = encodeURIComponent(addQuery);
        const searchUrl = `${selectedEngine.url}${finalSearchQuery}`;
        window.open(searchUrl, '_blank');
    }

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
        'editorDiv': { height: '69%', width: '96%', border: '1px solid white', fontSize: ' 5px' },
        'imgDiv': { marginRight: '30%', marginLeft: '10%' },
    }

    return (
        <div className={tailwindcss.main}>
            <div className={`${tailwindcss.main2} w-3/5`}>
                <div className={tailwindcss.selectDiv}>
                    <p className={tailwindcss.p}> InputQuery: </p>
                    <select
                        onChange={(e) => dispatch({ type: 'SET_SELECTED_ENGINE', payload: JSON.parse(e.target.value) })}
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
                                {key}
                            </option>
                        ))}
                    </select>
                    <label className={tailwindcss.textWhite}>
                        <input
                            disabled={editorInputs}
                            type="checkbox"
                            checked={editorVisible}
                            onChange={() => dispatch({ type: 'TOGGLE_EDITOR_VISIBILITY', payload: !state.editorVisible })}
                        />{' '}codeEditor</label>
                </div>
                <textarea
                    ref={textAreaRef}
                    value={searchQuery}
                    onChange={handleInputChange}
                    onKeyDown={handleKeyDown}
                    className={tailwindcss.textArea}
                    placeholder="  Enter search query"
                    style={{ width: '96%', height: '18%' }}
                />
                {editorVisible && (
                    <div style={styles['editorDiv']}>
                        <MonacoEditor
                            key={editorKey}
                            theme="vs-dark"
                            options={{ minimap: { enabled: false }, lineNumber: true }}
                            path={file.name}
                            value={editorValue}
                            onChange={code => dispatch({ type: 'SET_EDITOR_VALUE', payload: code })}
                            defaultLanguage={file.language}
                            defaultValue={file.value}
                            onMount={(editor) => (editorRef.current = editor)}
                        />
                    </div>
                )}
            </div >
            <div className={`${tailwindcss.main2} w-2/5 relative`} style={{ height: '96%', width: '38%' }}>
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
                        onClick={() => dispatch({ type: 'SET_SEARCH_QUERY', payload: '' })}
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
                    <div style={{ marginTop: '40px', textAlign: 'center', width: '94.5%' }}>
                        {selectedEngine.description}
                    </div>
                    <SearchEngineShortcutsAccordion />
                </div>
            </div>
        </div>
    );
}


function SearchEngineShortcutsAccordion() {
    const [expandedSection, setExpandedSection] = useState(-1); // Single state for all accordions

    function handleAccordionChange(index) {
        setExpandedSection(expandedSection === index ? -1 : index);
    }

    return (
        <>
            <Accordion className='accordion_main' allowZeroExpanded={true} preExpanded={expandedSection === -1 ? [] : [expandedSection]} onChange={handleAccordionChange}>
                <AccordionItem>
                    <AccordionItemPanel>
                        <ShortcutComponent />
                    </AccordionItemPanel>
                    <AccordionItemHeading>
                        <AccordionItemButton>
                            Input Shortcuts
                        </AccordionItemButton>
                    </AccordionItemHeading>
                </AccordionItem>
                {/* Additional AccordionItems */}
            </Accordion>
        </>
    );
}

function ShortcutComponent() {
    const flattenedEngines = searchEngines.flatMap(group => group.engines);
    const midpoint = Math.ceil(flattenedEngines.length / 2);
    const firstHalf = flattenedEngines.slice(0, midpoint);
    const secondHalf = flattenedEngines.slice(midpoint);

    const tailwindcss = {
        shortcutComponent: "p-4 sm:p-6",
        shortcutComponentDiv: "grid grid-flow-row grid-cols-[repeat(auto-fit,minmax(250px,1fr))] gap-x-9",
        parts: "flex flex-col overflow-hidden",
        shortcutItem: "flex  items-center justify-between overflow-hidden text-token-text-secondary ",
        title: "flex flex-shrink items-center overflow-hidden text-sm",
        keys: "ml-3 flex flex-row gap-2",
        key: "my-2 flex h-8 items-center inline justify-center rounded-[4px] border border-black/10 text-token-text-secondary dark:border-white/10 min-w-[50px]",
    }

    return (
        <div className={tailwindcss.shortcutComponent}>
            <div className={tailwindcss.shortcutItem}>
                <div className={tailwindcss.title}>
                Navigate recent searches with Up/Down Arrows. 
                </div>
                <div className={tailwindcss.keys}>
                <div className={tailwindcss.key}>▲</div>
                <div className={tailwindcss.key}>▼</div>
                </div>
            </div>
            <hr className='hr'/>
            <div className={tailwindcss.shortcutComponentDiv} >
                <div className={tailwindcss.parts} >
                    <ShortcutItem
                        title='Open close code editor'
                        keys={['!!code']}
                    />
                    {firstHalf.map(engine => (
                        <div key={engine.key}>
                            <ShortcutItem
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
                    {secondHalf.map(engine => (
                        <div key={engine.key}>
                            <ShortcutItem
                                title={`Select search ${engine.name} engine`}
                                keys={[engine.key]}
                            />
                        </div>
                    ))}
                </div>
            </div>
            <hr className="hr" />
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