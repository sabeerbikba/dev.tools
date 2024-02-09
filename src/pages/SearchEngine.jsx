import { useState, useEffect, useRef } from 'react';
import MonacoEditor from '@monaco-editor/react';
import { toast, Bounce } from 'react-toastify';
import searchEngines, { files } from '../data/searchEngine';

console.log();
export default function SearchEngine() {
    const [query, setQuery] = useState('');
    const [selectedEngine, setSelectedEngine] = useState(searchEngines[0].engines[0]);
    const [editorVisible, setEditorVisible] = useState(false);
    const [language, setLanguage] = useState(Object.keys(files)[0]);
    const [editorKey, setEditorKey] = useState(Date.now());
    const [editorValue, setEditorValue] = useState('');
    const [editorInputs, setEditorInputs] = useState(false);
    const editorRef = useRef(null);

    // Safety check to ensure selectedEngine is not undefined
    const safeSelectedEngine = selectedEngine || {};

    // const searchImg = __baseUrl + (safeSelectedEngine.icon || defaultIcon);
    const searchImg = safeSelectedEngine.imgClassName

    const advanceSearch = safeSelectedEngine.advanceSearchBtn;
    const btnDisabled = !safeSelectedEngine || query === '';
    const file = files[language];
    const value = files[language].value;
    const validEngineNames = ['Google', 'Bing', 'DuckDuckGo', 'Phind (Code)'];

    const handleInputChange = (event) => {
        const inputValue = event.target.value;
        let newSelectedEngine = null;

        if (inputValue.includes("!!") && inputValue.endsWith(' ')) {
            const keyStartIndex = inputValue.indexOf("!!");
            const keyEndIndex = inputValue.indexOf(" ", keyStartIndex);
            const key = inputValue.substring(keyStartIndex, keyEndIndex !== -1 ? keyEndIndex : undefined).trim();

            //-----debug---2--------------------------------
            // console.log('keyStartIndex: ' + keyStartIndex);
            // console.log('keyEndIndex: ' + keyEndIndex);
            // console.log('key: ' + key);
            //-----debug-----------------------------------

            if (key === '!!clear') {
                setQuery("");
                return;
            }

            if (key === '!!code') {
                // if (editorVisible && editorInputs) {
                if (validEngineNames.includes(selectedEngine.name)) {
                    setEditorVisible(prevVal => !prevVal);
                    setQuery(inputValue.replace(key, ' ').trim());
                    return;
                } else {
                    setQuery(inputValue.replace(key, ' ').trim());
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
                    return
                }
            }

            const specialKeys = searchEngines.flatMap(group => group.engines.map(engine => engine.key));
            if (specialKeys.includes(key)) {
                newSelectedEngine = key;
            }

            if (newSelectedEngine) {
                const engine = searchEngines.flatMap(group => group.engines).find(engine => engine.key === newSelectedEngine);
                setSelectedEngine(engine);
                setQuery(inputValue.replace(newSelectedEngine, '').trim());
                return;
            } else {
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

        setQuery(inputValue);
    };


    useEffect(() => { editorRef.current?.focus(); }, [file]);
    useEffect(() => { setEditorValue(value); }, [value]);

    useEffect(() => {
        !validEngineNames.includes(selectedEngine.name) ? setEditorInputs(true) : setEditorInputs(false);
        selectedEngine.name === 'Phind (Code)' ? setEditorVisible(true) : setEditorVisible(false);
    }, [selectedEngine]);

    const handleFileChange = (event) => {
        setLanguage(event.target.value);
        setEditorKey(Date.now());
    };

    function handleSearch() {

        const addQuery = editorVisible ? query + ' ```' + file.language + ' ' + editorValue + '```' : query;
        const searchQuery = encodeURIComponent(addQuery);
        const searchUrl = `${selectedEngine.url}${searchQuery}`;
        window.open(searchUrl, '_blank');
    }

    // const tailwindcss = {
    //     main: 'm-4 flex h-full w-full',
    //     main2: 'box-border',
    //     selectDiv: ' flex  items-center mb-4 gap-4 h-12',
    //     select: `w-fit rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6`,
    //     textArea: 'resize-none px-4 py-2 rounded-lg border-0 bg-gray-700 text-white shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 ',
    //     btn: 'rounded-md bg-indigo-500 px-3.5 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500 h-12',
    //     img: 'inline h-4 mr-1.5'
    // };

    return (
        <div className="m-4 flex h-full w-full">
            <div className="box-border w-3/5">
                <div className="flex items-center mb-4 gap-4 h-12">
                    <p className="font-bold text-xl text-white"> InputQuery: </p>
                    <select
                        onChange={(e) => setSelectedEngine(JSON.parse(e.target.value))}
                        value={JSON.stringify(selectedEngine)}
                        className="w-fit rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    >
                        {searchEngines.map((group, groupIndex) => (
                            <optgroup key={groupIndex} label={group.groupName}>
                                {group.engines.map((engine, engineIndex) => (
                                    <option key={engineIndex} value={JSON.stringify(engine)}>
                                        {engine.name + ' ' + engine.key}
                                    </option>
                                ))}
                            </optgroup>
                        ))}
                    </select>
                    <select
                        value={language}
                        onChange={handleFileChange}
                        className="w-fit rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6"
                        disabled={!editorVisible || editorInputs}
                    >
                        {Object.keys(files).map((key) => (
                            <option key={key} value={key}>
                                {key}
                            </option>
                        ))}
                    </select>
                    <label className="text-white">
                        <input
                            disabled={editorInputs}
                            type="checkbox"
                            checked={editorVisible}
                            onChange={() => setEditorVisible(prevVal => !prevVal)}
                        />{' '}codeEditor</label>
                </div>
                <textarea
                    value={query}
                    onChange={handleInputChange}
                    className="resize-none px-4 py-2 rounded-lg border-0 bg-gray-700 text-white shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6"
                    placeholder="  Enter search query"
                    style={{ width: '96%', height: '18%' }}
                />
                {editorVisible && (
                    <div style={{ height: '69%', width: '96%', border: '1px solid white', fontSize: ' 5px' }}>
                        <MonacoEditor
                            key={editorKey}
                            theme="vs-dark"
                            options={{ minimap: { enabled: false }, lineNumber: true }}
                            path={file.name}
                            value={editorValue}
                            onChange={code => setEditorValue(code)}
                            defaultLanguage={file.language}
                            defaultValue={file.value}
                            onMount={(editor) => (editorRef.current = editor)}
                        />
                    </div>
                )}
            </div >
            <div className="box-border w-2/5">
                <div className="mb-2">
                    <button
                        onClick={handleSearch}
                        disabled={btnDisabled}
                        className={`${btnDisabled ? 'btn-disabled' : ''
                            } rounded-md bg-indigo-500 px-3.5 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500 h-12 mr-2 w-2/3`}
                        style={{ width: '60%' }}
                    >
                        {/* <img src={searchImg} className="inline h-4 mr-1.5" />Search */}
                        {/* <div className='inline'> */}
                        <div className={`mr-1.5  ${'eng-bg-' + searchImg}`}></div>Search
                        {/* </div> */}
                    </button>
                    <button
                        disabled={btnDisabled}
                        onClick={() => setQuery('')}
                        className={`${btnDisabled ? 'btn-disabled' : ''
                            } rounded-md bg-indigo-500 px-3.5 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500 h-12 w-1/3`}
                    >
                        Clear
                    </button>
                </div>
                {advanceSearch !== undefined && (
                    <button className="rounded-md bg-indigo-500 px-3.5 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500 h-12">
                        <a className="text-white" href={advanceSearch} target="__blank"> AdvanceSearch</a>
                    </button>
                )}
                <div className="text-white">
                    <br />
                    <h2>Task:</h2>
                    * enter to serach
                    * need to fix the !!g problem
                    * need to add sprites to images ( add all images in single images)
                    * correct the scrren width by removing scrool bars
                    * vsCode suggestion not text width need to change
                    * open serach last opened window
                    * Add duckduckgp bango in search Engines
                    * Slash to enter in search panel
                    * Add simmilar functionality like duckduckgo bango
                    * code disabled for (not for search engines and other seaach engines other all need to off )
                    * need to extract those tailwindcss in array
                    * need to add keyboard shortcut for inputs
                    * problem images 
                     stackoverflow 
                     codesandbox
                     css tricks
                     gipyy
                </div>
            </div>
        </div>
    );
}

