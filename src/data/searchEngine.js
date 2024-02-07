export const __baseUrl = './src/assets/searchEngine/'
export const defaultIcon = 'search.svg';

const searchEngines = [
    {
        groupName: 'Web Search Engines',
        engines: [
            { name: 'Google', url: 'https://www.google.com/search?q=', icon: 'google.png', advanceSearchBtn: 'https://www.google.com/advanced_search' },
            { name: 'Bing', url: 'https://www.bing.com/search?q=', icon: 'bing.png' },
            { name: 'DuckDuckGo', url: 'https://duckduckgo.com/?q=', icon: 'duckduckgo.png' },
        ]
    }, {
        groupName: 'Other Search Engines',
        engines: [
            { name: 'Phind (Code)', url: 'https://phind.com/search?q=', icon: 'phind.png' },
            { name: 'WolframAlpha (Math)', url: 'https://www.wolframalpha.com/input/?i=', icon: 'wolframalpha.ico' }
        ]
    },
    {
        groupName: 'Package Managers',
        engines: [
            { name: 'npm', url: 'https://www.npmjs.com/search?q=', icon: 'npm.png' },
            { name: 'PyPI', url: 'https://pypi.org/search/?q=', icon: 'pypi.ico' },
        ]
    },
    {
        groupName: 'Images & GIF Search',
        engines: [
            { name: 'Google Images', url: 'https://www.google.com/search?tbm=isch&q=', icon: 'google.png', advanceSearchBtn: 'https://www.google.com/advanced_image_search' },
            { name: 'Unsplash', url: 'https://unsplash.com/s/photos/', icon: 'unsplash.png' },
            { name: 'Pinterest', url: 'https://www.pinterest.com/search/pins/?q=', icon: 'pinterest.png' },
            { name: 'Getty Images', url: 'https://www.gettyimages.com/photos/', icon: 'getty.png' },
            { name: 'Giphy', url: 'https://giphy.com/search/', icon: 'giphy.png' },
            { name: 'Pixabay', url: 'https://pixabay.com/images/search/', icon: 'pixabay.png' },
            { name: 'Yandex.Images', url: 'https://yandex.com/images/search?text=', icon: 'yandex.png' },
            { name: 'Yahoo Image Search', url: 'https://images.search.yahoo.com/search/images?p=', icon: 'yahoo.ico' },
            { name: 'DuckDuckGo Images', url: 'https://duckduckgo.com/?iax=images&ia=images&q=', icon: 'duckduckgo.png' },
            { name: 'Bing Images', url: 'https://www.bing.com/images/search?q=', icon: 'bing.png' },
        ]
    },
    {
        groupName: 'Development Platforms',
        engines: [
            { name: 'GitHub', url: 'https://github.com/search?q=', icon: 'github.png' },
            { name: 'GitLab', url: 'https://gitlab.com/search?search=', icon: 'gitlab.png' },
            { name: 'Stack Overflow', url: 'https://stackoverflow.com/search?q=', icon: 'stack-overflow.png' },
            { name: 'CodePen', url: 'https://codepen.io/search/pens?q=', icon: 'codepen.png' },
            { name: 'CodeSandbox', url: 'https://codesandbox.io/search?query=', icon: 'code-sandbox.png' },
        ]
    },


    {
        groupName: 'Dev. Resources & Commuinty',
        engines: [
            { name: 'Dev.to', url: 'https://dev.to/search?q=', icon: 'devto.png' },
            { name: 'Hacker News', url: 'https://hn.algolia.com/?q=', icon: 'ycombinator.svg' },
            { name: 'MDN Web Docs', url: 'https://developer.mozilla.org/en-US/search?q=', icon: 'mdn.png' },
            { name: 'CSS-tricks', url: 'https://css-tricks.com/?s=', icon: 'css-tricks.ico' },
        ]
    },

    {
        groupName: 'Video Platforms',
        engines: [
            { name: 'YouTube', url: 'https://www.youtube.com/results?search_query=', icon: 'youtube.png' },
        ]
    },
];
export default searchEngines;

export const files = {
    "JavaScript": {
        language: "javascript",
        value: `// add some javascript code `
    },
    "CSS": {
        language: "css",
        value: `/* add some css code  */`
    },
    "HTML": {
        language: "html",
        value: `<!-- add some some html code  -->`
    },
    "TypeScript": {
        language: "typescript",
        value: `// add some TypeScript code`
    },
    "LESS": {
        language: "less",
        value: `/* add some LESS code */`
    },
    "SCSS": {
        language: "scss",
        value: `/* add some SCSS code */`
    },
    "JSON": {
        language: "json",
        value: `{
  "key": "value"
}`
    },
    "XML": {
        language: "xml",
        value: `<!-- add some XML code -->`
    },
    "PHP": {
        language: "php",
        value: `<?php
// add some PHP code
?>`
    },
    "C#": {
        language: "csharp",
        value: `// add some C# code`
    },
    "C++": {
        language: "cpp",
        value: `// add some C++ code`
    },
    "Razor": {
        language: "razor",
        value: `<!-- add some Razor code -->`
    },
    "Markdown": {
        language: "markdown",
        value: `# add some Markdown code`
    },
    "Diff": {
        language: "diff",
        value: `// add some Diff code`
    },
    "Java": {
        language: "java",
        value: `// add some Java code`
    },
    "VB": {
        language: "vb",
        value: `' add some VB code`
    },
    "CoffeeScript": {
        language: "coffeescript",
        value: `# add some CoffeeScript code`
    },
    "Handlebars": {
        language: "handlebars",
        value: `<!-- add some Handlebars code -->`
    },
    "Batch": {
        language: "batch",
        value: `REM add some Batch code`
    },
    "Pug": {
        language: "pug",
        value: `// add some Pug code`
    },
    "F#": {
        language: "fsharp",
        value: `// add some F# code`
    },
    "Lua": {
        language: "lua",
        value: `-- add some Lua code`
    },
    "Powershell": {
        language: "powershell",
        value: `# add some Powershell code`
    },
    "Python": {
        language: "python",
        value: `# add some Python code`
    },
    "Ruby": {
        language: "ruby",
        value: `# add some Ruby code`
    },
    "SASS": {
        language: "sass",
        value: `// add some SASS code`
    },
    "R": {
        language: "r",
        value: `# add some R code`
    },
    "Objective-C": {
        language: "objective-c",
        value: `// add some Objective-C code`
    }
};
