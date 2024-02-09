export const __baseUrl = './src/assets/searchEngine/'
export const defaultimgClassName = 'search.svg';

const searchEngines = [{
    groupName: 'Web Search Engines',
    engines: [
        { name: 'Google', key: '!!g', url: 'https://www.google.com/search?q=', imgClassName: 'google', advanceSearchBtn: 'https://www.google.com/advanced_search' },
        { name: 'Bing', key: '!!b', url: 'https://www.bing.com/search?q=', imgClassName: 'bing' },
        { name: 'DuckDuckGo', key: '!!d', url: 'https://duckduckgo.com/?q=', imgClassName: 'duckduckgo' },
    ]
}, {
    groupName: 'Other Search Engines',
    engines: [
        { name: 'Phind (Code)', key: '!!p', url: 'https://phind.com/search?q=', imgClassName: 'phind' },
        { name: 'WolframAlpha (Math)', key: '!!w', url: 'https://www.wolframalpha.com/input/?i=', imgClassName: 'wolframalpha' }
    ]
}, {
    groupName: 'Package Managers',
    engines: [
        { name: 'npm', key: '!!n', url: 'https://www.npmjs.com/search?q=', imgClassName: 'npm' },
        { name: 'PyPI', key: '!!p2', url: 'https://pypi.org/search/?q=', imgClassName: 'pypi' },
    ]
}, {
    groupName: 'Images & GIF Search',
    engines: [
        { name: 'Google Images', key: '!!gi', url: 'https://www.google.com/search?tbm=isch&q=', imgClassName: 'google', advanceSearchBtn: 'https://www.google.com/advanced_image_search' },
        { name: 'Unsplash', key: '!!ui', url: 'https://unsplash.com/s/photos/', imgClassName: 'unsplash' },
        { name: 'Pinterest', key: '!!pi', url: 'https://www.pinterest.com/search/pins/?q=', imgClassName: 'pinterest' },
        { name: 'Getty Images', key: '!!g1i', url: 'https://www.gettyimages.com/photos/', imgClassName: 'getty' },
        { name: 'Giphy', key: '!!g2i', url: 'https://giphy.com/search/', imgClassName: 'giphy' },
        { name: 'Pixabay', key: '!!p3', url: 'https://pixabay.com/images/search/', imgClassName: 'pixabay' },
        { name: 'Yandex.Images', key: '!!yi', url: 'https://yandex.com/images/search?text=', imgClassName: 'yandex' },
        { name: 'Yahoo Image Search', key: '!!y2i', url: 'https://images.search.yahoo.com/search/images?p=', imgClassName: 'yahoo' },
        { name: 'DuckDuckGo Images', key: '!!di', url: 'https://duckduckgo.com/?iax=images&ia=images&q=', imgClassName: 'duckduckgo' },
        { name: 'Bing Images', key: '!!bi', url: 'https://www.bing.com/images/search?q=', imgClassName: 'bing' },
    ]
}, {
    groupName: 'Development Platforms',
    engines: [
        { name: 'GitHub', key: '!!g1', url: 'https://github.com/search?q=', imgClassName: 'github' },
        { name: 'GitLab', key: '!!g2', url: 'https://gitlab.com/search?search=', imgClassName: 'gitlab' },
        { name: 'Stack Overflow', key: '!!s', url: 'https://stackoverflow.com/search?q=', imgClassName: 'stack_overflow' },
        { name: 'CodePen', key: '!!c', url: 'https://codepen.io/search/pens?q=', imgClassName: 'codepen' },
        { name: 'CodeSandbox', key: '!!c2', url: 'https://codesandbox.io/search?query=', imgClassName: 'code_sandbox' },
    ]
}, {
    groupName: 'Dev. Resources & Commuinty',
    engines: [
        { name: 'Dev.to', key: '!!d2', url: 'https://dev.to/search?q=', imgClassName: 'devto' },
        { name: 'Hacker News', key: '!!h', url: 'https://hn.algolia.com/?q=', imgClassName: 'ycombinator' },
        { name: 'MDN Web Docs', key: '!!m', url: 'https://developer.mozilla.org/en-US/search?q=', imgClassName: 'mdn' },
        { name: 'CSS-tricks', key: '!!c3', url: 'https://css-tricks.com/?s=', imgClassName: 'css_tricks' },
    ]
}, {
    groupName: 'Video Platforms',
    engines: [
        { name: 'YouTube', key: '!!y', url: 'https://www.youtube.com/results?search_query=', imgClassName: 'youtube' },
    ]
},];
export default searchEngines;


export const files = {
    "JavaScript": { language: "javascript", value: `// add some javascript code ` },
    "CSS": { language: "css", value: `/* add some css code  */` },
    "HTML": { language: "html", value: `<!-- add some some html code  -->` },
    "TypeScript": { language: "typescript", value: `// add some TypeScript code` },
    "LESS": { language: "less", value: `/* add some LESS code */` },
    "SCSS": { language: "scss", value: `/* add some SCSS code */` },
    "JSON": {
        language: "json",
        value: `{
  "key": "value"
}` },
    "XML": { language: "xml", value: `<!-- add some XML code -->` },
    "PHP": {
        language: "php", value: `<?php
// add some PHP code
?>`},
    "C#": { language: "csharp", value: `// add some C# code` },
    "C++": { language: "cpp", value: `// add some C++ code` },
    "Razor": { language: "razor", value: `<!-- add some Razor code -->` },
    "Markdown": { language: "markdown", value: `# add some Markdown code` },
    "Diff": { language: "diff", value: `// add some Diff code` },
    "Java": { language: "java", value: `// add some Java code` },
    "VB": { language: "vb", value: `' add some VB code` },
    "CoffeeScript": { language: "coffeescript", value: `# add some CoffeeScript code` },
    "Handlebars": { language: "handlebars", value: `<!-- add some Handlebars code -->` },
    "Batch": { language: "batch", value: `REM add some Batch code` },
    "Pug": { language: "pug", value: `// add some Pug code` },
    "F#": { language: "fsharp", value: `// add some F# code` },
    "Lua": { language: "lua", value: `-- add some Lua code` },
    "Powershell": { language: "powershell", value: `# add some Powershell code` },
    "Python": { language: "python", value: `# add some Python code` },
    "Ruby": { language: "ruby", value: `# add some Ruby code` },
    "SASS": { language: "sass", value: `// add some SASS code` },
    "R": { language: "r", value: `# add some R code` },
    "Objective-C": { language: "objective-c", value: `// add some Objective-C code` }
};



//     // const tailwindcss = {
//     //     main: 'm-4 flex h-full w-full',
//     //     main2: 'box-border',
//     //     selectDiv: ' flex  items-center mb-4 gap-4 h-12',
//     //     select: `w-fit rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6`,
//     //     textArea: 'resize-none px-4 py-2 rounded-lg border-0 bg-gray-700 text-white shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 ',
//     //     btn: 'rounded-md bg-indigo-500 px-3.5 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500 h-12',
//     //     img: 'inline h-4 mr-1.5'
//     // };

