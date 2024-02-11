import { useReducer, useEffect, useRef } from 'react';
import MonacoEditor from '@monaco-editor/react';
import { toast, Bounce } from 'react-toastify';
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
            throw new Error();
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


    const handleInputChange = (event) => {
        const inputValue = event.target.value;
        let newSelectedEngine = null;

        if (inputValue.includes("!!") && inputValue.endsWith(' ')) {
            const keyStartIndex = inputValue.indexOf("!!");
            const keyEndIndex = inputValue.indexOf(" ", keyStartIndex);
            const key = inputValue.substring(keyStartIndex, keyEndIndex !== -1 ? keyEndIndex : undefined).trim();

            if (key === '!!clear') {
                dispatch({ type: 'SET_SEARCH_QUERY', payload: "" });
                return;
            }

            if (key === '!!code') {
                if (validEngineNames.includes(selectedEngine.name)) {
                    dispatch({ type: 'TOGGLE_EDITOR_VISIBILITY' });
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

            const specialKeys = searchEngines.flatMap(group => group.engines.map(engine => engine.key));
            if (specialKeys.includes(key)) {
                newSelectedEngine = key;
            }

            if (newSelectedEngine) {
                const engine = searchEngines.flatMap(group => group.engines).find(engine => engine.key === newSelectedEngine);
                dispatch({ type: 'SET_SELECTED_ENGINE', payload: engine });
                dispatch({ type: 'SET_SEARCH_QUERY', payload: inputValue.replace(newSelectedEngine, '').trim() });
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
    };

    const handleFileChange = (event) => {
        const newLanguage = event.target.value;
        dispatch({ type: 'SET_LANGUAGE', payload: newLanguage });
        dispatch({ type: 'SET_EDITOR_KEY', payload: Date.now() });
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

    console.log(styles['editorDiv']);

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
            <div className={`${tailwindcss.main2} w-2/5`}>
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
                    <button className={`${tailwindcss.btn}`} style={{width: '94.5%'}}>
                        <a className={tailwindcss.textWhite} href={advanceSearch} target="__blank"> AdvanceSearch</a>
                    </button>
                )}
                <div className={tailwindcss.textWhite}>
                    {selectedEngine.description}

                </div>
            </div>
        </div>
    );
}