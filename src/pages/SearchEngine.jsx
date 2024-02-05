import { useState } from 'react';
import searchEngines, { __baseUrl } from '../data/searchEngine';

const SearchEngine = () => {
    const [query, setQuery] = useState('');
    const [selectedEngine, setSelectedEngine] = useState('Google');
    // let searchImg =  __baseUrl + searchEngines[selectedEngine.index].icon;
    // console.log(searchImg);

    const handleSearch = () => {
        if (selectedEngine) {
            const searchQuery = encodeURIComponent(query);

            const searchUrl = `${selectedEngine.url}${searchQuery}`;
            // console.log(searchQuery);
            // Open the selected search engine result in a new tab
            window.open(searchUrl, '_blank');
        }
        setQuery('');
    };

    let disabled = !selectedEngine || query === '';

    const tailwindcss = {
        main: 'm-4',
        search: 'block',
        selectDiv: 'flex gap-4 items-center',
        select: `w-fit rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6`,
        input: 'px-4 py-2 mx-2 rounded-lg border-0 bg-gray-700 text-white shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6',
        btn: 'rounded-md bg-indigo-500 px-3.5 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500',
    }

    return (
        <div className={tailwindcss.main}>
            <div className={tailwindcss.search}>
                <div className={tailwindcss.selectDiv} style={{ display: 'inline' }}>
                    <select
                        onChange={(e) => setSelectedEngine(JSON.parse(e.target.value))}
                        className={tailwindcss.select}
                    >
                        {/* <option value={null}>Select Search Engine</option> */}
                        {searchEngines.map((engine, index) => (
                            <option key={index} value={JSON.stringify(engine)}>
                                {engine.name}
                            </option>
                        ))}
                    </select>
                </div>
                <input
                    type="text" value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    className={tailwindcss.input}
                />
                <button
                    onClick={handleSearch}
                    disabled={disabled}
                    className={`${disabled ? 'btn-disabled' : ''} ${tailwindcss.btn} `}
                >
                    {/* <img src={searchImg} style={{ display: 'inline' }} /> */}
                    Search</button>
                <button
                    onClick={() => setQuery('')}
                    className={`${!disabled ? 'btn-disabled' : ''} ${tailwindcss.btn}`}
                >Clear</button>
            </div>
            <div>
                <br />
                <br />
                <h2>Task:</h2>
                *need to implemnt advance query for google
                * enter to serach
                * images in serach button
                * active disalbed color ✅
                * need to crate array for styles ✅
            </div>
        </div>
    );
};

export default SearchEngine;
