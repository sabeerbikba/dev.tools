import { useEffect } from 'react';
import puppeteer from 'puppeteer';

const SearchWords = () => {
    useEffect(() => {
        const searchKeyword = async (url, keyword) => {
            const browser = await puppeteer.launch();
            const page = await browser.newPage();
            await page.goto(url);

            const content = await page.content();
            if (content.includes(keyword)) {
                console.log(`Keyword "${keyword}" found on ${url}`);
            } else {
                console.log(`Keyword "${keyword}" not found on ${url}`);
            }

            await browser.close();
        };

        const url = 'http://example.com'; // Replace with your website URL
        const keyword = 'your_keyword';   // Replace with your desired keyword

        searchKeyword(url, keyword);
    }, []);

    return <div>React Puppeteer Search</div>;
};

export default SearchWords;


// import { useState } from 'react';
// import puppeteer from 'puppeteer';

// export default function SearchWords() {
//     const [url, setUrl] = useState('');
//     const [keyword, setKeyword] = useState('');
//     const [output, setOutput] = useState('');

//     async function searchKeyword() {
//         const browser = await puppeteer.launch();
//         const page = await browser.newPage();
//         await page.goto(url);

//         const content = await page.content();
//         if (content.includes(keyword)) {
//             setOutput(`Keyword "${keyword}" found on ${url}`);
//         } else {
//             setOutput(`Keyword "${keyword}" not found on ${url}`);
//         }

//         await browser.close();
//     }


//     return (
//         <>
//             <input
//                 type="text"
//                 value={url}
//                 onChange={e => setUrl(e.target.value)}
//             />
//             <br />
//             <input
//                 type="text"
//                 value={keyword}
//                 onChange={e => setKeyword(e.target.value)}
//             />
//             <button onClick={() => searchKeyword} >handleSearch</button>
//             <p style={{ color: 'white' }}>
//                 {output}
//             </p>
//         </>
//     );
// }