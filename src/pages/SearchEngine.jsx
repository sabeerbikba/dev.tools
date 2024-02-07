import { useState, useRef, useEffect } from 'react';
import MonacoEditor from '@monaco-editor/react';
import searchEngines, { __baseUrl, defaultIcon, files } from '../data/searchEngine';

export default function SearchEngine() {
    const [query, setQuery] = useState('');
    const [selectedEngine, setSelectedEngine] = useState(searchEngines[0].engines[0]);
    const [editorVisible, setEditorVisible] = useState(false);
    const [language, setLanguage] = useState(Object.keys(files)[0]);
    const [editorKey, setEditorKey] = useState(Date.now()); // Key for re-rendering the MonacoEditor
    const [editorValue, setEditorValue] = useState('');
    const editorRef = useRef(null);

    const searchImg = __baseUrl + (selectedEngine?.icon || defaultIcon);
    const advanceSearch = selectedEngine.advanceSearchBtn;
    const btnDisabled = !selectedEngine || query === '';
    const file = files[language];
    const value = files[language].value;


    useEffect(() => { editorRef.current?.focus(); }, [file]);
    useEffect(() => { setEditorValue(value); }, [value]);

    const handleFileChange = (event) => {
        setLanguage(event.target.value);
        setEditorKey(Date.now()); // Update the key to re-render MonacoEditor
    };

    function handleSearch() {
        // if (selectedEngine) {
        const addQuery = editorVisible ? query + '```' + editorValue + '```' : query;
        // console.log(addQuery);
        const searchQuery = encodeURIComponent(addQuery);
        const searchUrl = `${selectedEngine.url}${searchQuery}`;
        window.open(searchUrl, '_blank');
        // }
    }

    useEffect(() => {
        const editorElement = editorRef.current;

        // Check if the editor reference is available
        if (editorElement) {
            // Add event listener for keydown event
            editorElement.addEventListener('keydown', handleKeyDown);
        }

        // Cleanup: Remove the event listener when the component unmounts
        return () => {
            if (editorElement) {
                editorElement.removeEventListener('keydown', handleKeyDown);
            }
        };
    }, []); // Empty dependency array ensures the effect runs only once when the component mounts

    function handleKeyDown(event) {
        // Check if Control key and Pipe key are pressed together
        if (event.ctrlKey && event.key === '|') {
            // Prevent the default behavior of the Control + Pipe key combination
            // event.preventDefault();

            // Call your specific function here
            handleSearch();
        }
    }



    useEffect(() => {
        if (selectedEngine.name === 'Phind (Code)') {
            setEditorVisible(true)
        } else {
            setEditorVisible(false)
        }
    }, [selectedEngine]); //if phind selected then code editor automatically apearce 



    const tailwindcss = {
        main: 'm-4 flex h-full w-full',
        main2: 'box-border',
        selectDiv: ' flex  items-center mb-4 gap-4 h-12',
        select: `w-fit rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6`,
        textArea: 'resize-none px-4 py-2 rounded-lg border-0 bg-gray-700 text-white shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 ',
        btn: 'rounded-md bg-indigo-500 px-3.5 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500 h-12',
        img: 'inline h-4 mr-1.5'
    };

    return (
        <div className={tailwindcss.main}>
            <div className={`${tailwindcss.main2} w-3/5`}>
                <div className={`${tailwindcss.selectDiv}`}>

                    <p className="font-bold text-xl text-white"> InputQuery: </p>
                    {/* Engine selection */}
                    <select onChange={(e) => setSelectedEngine(JSON.parse(e.target.value))} className={`${tailwindcss.select}`}>
                        {searchEngines.map((group, groupIndex) => (
                            <optgroup key={groupIndex} label={group.groupName}>
                                {group.engines.map((engine, engineIndex) => (
                                    <option key={engineIndex} value={JSON.stringify(engine)}>
                                        {engine.name}
                                    </option>
                                ))}
                            </optgroup>
                        ))}
                    </select>

                    {/* File selection */}
                    <select value={language} onChange={handleFileChange} className={tailwindcss.select} disabled={!editorVisible}>
                        {Object.keys(files).map((key) => (
                            <option key={key} value={key}>
                                {key}
                            </option>
                        ))}
                    </select>

                    {/* Code editor toggle */}
                    <label className='text-white'>
                        <input
                            type="checkbox"
                            checked={editorVisible}
                            onChange={() => setEditorVisible(prevVal => !prevVal)}
                        />{' '}codeEditor</label>

                </div>

                {/* Query input */}
                <textarea
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    className={tailwindcss.textArea}
                    placeholder='  Enter search query'
                    style={{ width: '96%', height: '18%' }}
                />

                {/* Code editor */}
                {editorVisible && (
                    <div style={{ height: '69%', width: '96%', border: '1px solid white', fontSize: ' 5px' }}>
                        <MonacoEditor
                            key={editorKey} // Key for re-rendering the editor
                            theme='vs-dark'
                            options={{ minimap: { enabled: false, }, lineNumber: true, }}
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

            {/* Search buttons and advanced search link */}
            <div className={`${tailwindcss.main2} w-2/5`}>
                {/* Search and Clear buttons */}
                <div className='mb-2'>
                    <button onClick={handleSearch} disabled={btnDisabled} className={`${btnDisabled ? 'btn-disabled' : ''} ${tailwindcss.btn} mr-2 w-2/3`} style={{ width: '60%' }}>
                        <img src={searchImg} className={`${tailwindcss.img}`} />Search</button>
                    <button disabled={btnDisabled} onClick={() => setQuery('')} className={`${btnDisabled ? 'btn-disabled' : ''} ${tailwindcss.btn} w-1/3`}
                    >Clear</button>
                </div>

                {/* Advanced search link */}
                {advanceSearch !== undefined && (
                    <button className={`${tailwindcss.btn}`}><a className='text-white' href={advanceSearch} target='__blank'> AdvanceSearch</a></button>
                )}

                {/* Task description */}
                <div className='text-white'>
                    <br />
                    <h2>Task:</h2>
                    {/* Task list */}
                    * enter to serach
                    * 🔵 need to add sprites to images ( add all images in single images)
                    * correct the scrren width by removing scrool bars
                    * vsCode suggestion not text width need to change
                    * open serach last opened window
                    * code disabled for (not for search engines and other seaach engines other all need to off )
                </div>
            </div>
        </div>
    );
}
