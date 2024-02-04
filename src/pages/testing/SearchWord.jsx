import { useEffect } from 'react';
import puppeteer from 'puppeteer';

const App = () => {
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

export default App;
