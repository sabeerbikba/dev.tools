import { useState } from 'react';
import MonacoEditor from '@monaco-editor/react'
import searchEngines, { __baseUrl, defaultIcon } from '../data/searchEngine';

export default function SearchEngine() {
    const [query, setQuery] = useState('');
    const [codeEditor, setCodeEditor] = useState(false)
    const [editorValue, setEditorValue] = useState('')
    const [selectedEngine, setSelectedEngine] = useState(searchEngines[0].engines[0]);
    const searchImg = __baseUrl + (selectedEngine?.icon || defaultIcon);
    const advanceSearch = selectedEngine.advanceSearchBtn;
    const btnDisabled = !selectedEngine || query === '';
    const editorOptions = {
        minimap: {
            enabled: false,
        },
        lineNumber: true,
    }

    const handleSearch = () => {
        if (selectedEngine) {
            const searchQuery = encodeURIComponent(query);
            const searchUrl = `${selectedEngine.url}${searchQuery}`;
            window.open(searchUrl, '_blank');
        }
        setQuery('');
    };

    const tailwindcss = {
        main: 'm-4 flex h-full w-full',
        main2: 'w-3/6 box-border',
        selectDiv: ' flex  items-center mb-4 gap-4 h-12',
        select: `w-fit rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6`,
        input: 'px-4 py-2 rounded-lg border-0 bg-gray-700 text-white shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 ',
        btn: 'rounded-md bg-indigo-500 px-3.5 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500 h-12',
        img: 'inline h-4 mr-1.5'
    }

    return (
        <div className={tailwindcss.main}>
            <div className={`${tailwindcss.main2}`}>
                <div className={tailwindcss.selectDiv}>

                    <p className="font-bold text-xl text-white"> InputQuery: </p>
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

                    <select className={tailwindcss.select} name="" id="">
                        <option value="sabeer">sabeer</option>
                        <option value="sabeer">sabeer</option>
                        <option value="sabeer">sabeer</option>
                    </select>

                    <label className='text-white'>
                        <input
                            type="checkbox"
                            checked={codeEditor}
                            onChange={() => setCodeEditor(prevVal => !prevVal)}
                        />{' '}codeEditor</label>

                </div>
                <textarea type="text" value={query} onChange={(e) => setQuery(e.target.value)} className={tailwindcss.input} style={{ width: '96%', height: '18%' }} />
                <div style={{ height: '69%', width: '96%', border: '1px solid white' }}>
                    <MonacoEditor
                        theme='vs-dark'
                        value={editorValue}
                        onChange={e => setEditorValue(e)}
                        options={editorOptions}
                    />
                </div>

            </div >
            <div className={tailwindcss.main2}>
                <div className='mb-2'>
                    <button onClick={handleSearch} disabled={btnDisabled} className={`${btnDisabled ? 'btn-disabled' : ''} ${tailwindcss.btn} mr-2 w-2/3`} style={{ width: '60%' }}>
                        <img src={searchImg} className={`${tailwindcss.img}`} />Search</button>
                    <button disabled={btnDisabled} onClick={() => setQuery('')} className={`${btnDisabled ? 'btn-disabled' : ''} ${tailwindcss.btn} w-1/3`}
                    >Clear</button>
                </div>
                {advanceSearch !== undefined && (
                    <button className={`${tailwindcss.btn}`}><a className='text-white' href={advanceSearch} target='__blank'> AdvanceSearch</a></button>
                )}
                <div className='text-white'>

                <br />
                <br />
                <h2>Task:</h2>
                * enter to serach
                * need to add sprites to images ( add all images in single images)
                * correct the scrren width by removing scrool bars
                * need to give logic into monaco editor and codeEditor checkbox
                * need to remove text area resize function bottom right 
                * add all search engines ✅
                * need to implemnt advance query for google
                * make selection better ✅
                * images in serach button ✅
                * active disalbed color ✅
                * need to crate array for styles ✅

                </div>
            </div>
        </div>
    );
}


