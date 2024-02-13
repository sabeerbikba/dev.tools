export const defaultImgClassName = 'search';

const searchEngines = [
    {
        groupName: 'Web Search Engines',
        engines: [{
            name: 'DuckDuckGo',
            key: '!!d',
            url: 'https://duckduckgo.com/?q=',
            imgClassName: 'duckduckgo',
            description: 'DuckDuckGo is a privacy-focused search engine that emphasizes protecting searchers\' personal information and avoiding the filter bubble.'
        }, {
            name: 'Google',
            key: '!!g',
            url: 'https://www.google.com/search?q=',
            imgClassName: 'google',
            advanceSearchBtn: 'https://www.google.com/advanced_search',
            description: 'Google is a leading search engine known for its speed, accuracy, and vast index of web pages.'
        }, {
            name: 'Bing',
            key: '!!b',
            url: 'https://www.bing.com/search?q=',
            imgClassName: 'bing',
            description: 'Bing offers a comprehensive search experience with features like visual search and integration with Microsoft services.'
        }]
    }, {
        groupName: 'Other Search Engines',
        engines: [{
            name: 'Phind (Code)',
            key: '!!p',
            url: 'https://phind.com/search?q=',
            imgClassName: 'phind',
            description: 'Phind is a specialized search engine for developers, focusing on code-related queries.'
        }, {
            name: 'You.com',
            key: '!!y',
            url: 'https://you.com/search?q=',
            imgClassName: '',
            description: 'You.com is a search engine that allows users to find information tailored to their interests and preferences.'
        }, {
            name: 'WolframAlpha (Math)',
            key: '!!w',
            url: 'https://www.wolframalpha.com/input/?i=',
            imgClassName: 'wolframalpha',
            description: 'WolframAlpha is a computational knowledge engine that answers factual queries directly by computing the answer from structured data.'
        }]
    }, {
        groupName: 'Package Managers',
        engines: [{
            name: 'npm',
            key: '!!n',
            url: 'https://www.npmjs.com/search?q=',
            imgClassName: 'npm',
            description: 'npm is the package manager for JavaScript, hosting over  1 million open source packages.'
        }, {
            name: 'PyPI',
            key: '!!p2',
            url: 'https://pypi.org/search/?q=',
            imgClassName: 'pypi',
            description: 'PyPI is the Python Package Index, a repository of software for the Python programming language.'
        }]
    }, {
        groupName: 'Images & GIF Search',
        engines: [{
            name: 'Google Images',
            key: '!!gi',
            url: 'https://www.google.com/search?tbm=isch&q=',
            imgClassName: 'google',
            advanceSearchBtn: 'https://www.google.com/advanced_image_search',
            description: 'Google Images provides a vast library of photos, videos, and animated GIFs.'
        }, {
            name: 'Unsplash',
            key: '!!ui',
            url: 'https://unsplash.com/s/photos/',
            imgClassName: 'unsplash',
            description: 'Unsplash offers high-resolution photos taken by a community of photographers around the world.'
        }, {
            name: 'Pinterest',
            key: '!!pi',
            url: 'https://www.pinterest.com/search/pins/?q=',
            imgClassName: 'pinterest',
            description: 'Pinterest is a social media platform where users share and discover new interests by posting (pinning) images or videos to their own or others\' boards.'
        }, {
            name: 'Getty Images',
            key: '!!g1i',
            url: 'https://www.gettyimages.com/photos/',
            imgClassName: 'getty',
            description: 'Getty Images is a global provider of high-quality stock images, videos, and editorial content.'
        }, {
            name: 'Giphy',
            key: '!!g2i',
            url: 'https://giphy.com/search/',
            imgClassName: 'giphy',
            description: 'Giphy is a platform for sharing and discovering GIFs, which are short looping animations.'
        }, {
            name: 'Pixabay',
            key: '!!p3',
            url: 'https://pixabay.com/images/search/',
            imgClassName: 'pixabay',
            description: 'Pixabay offers free stock photos, vectors, and art illustrations without copyright restrictions.'
        }, {
            name: 'Yandex.Images',
            key: '!!yi',
            url: 'https://yandex.com/images/search?text=',
            imgClassName: 'yandex',
            description: 'Yandex.Images is a Russian search engine that provides access to a wide range of images.'
        }, {
            name: 'Yahoo Image Search',
            key: '!!y2i',
            url: 'https://images.search.yahoo.com/search/images?p=',
            imgClassName: 'yahoo',
            description: 'Yahoo Image Search helps users find images across the internet.'
        }, {
            name: 'DuckDuckGo Images',
            key: '!!di',
            url: 'https://duckduckgo.com/?iax=images&ia=images&q=',
            imgClassName: 'duckduckgo',
            description: 'DuckDuckGo Images is a privacy-conscious image search engine that respects user privacy.'
        }, {
            name: 'Bing Images',
            key: '!!bi',
            url: 'https://www.bing.com/images/search?q=',
            imgClassName: 'bing',
            description: 'Bing Images offers a variety of image search options, including filters for size, color, type, and more.'
        }]
    }, {
        groupName: 'Development Platforms',
        engines: [{
            name: 'GitHub',
            key: '!!g1',
            url: 'https://github.com/search?q=',
            imgClassName: 'github',
            description: 'GitHub is a web-based hosting service for version control using Git, offering access to millions of software projects and facilitating collaboration among developers.'
        }, {
            name: 'GitLab',
            key: '!!g2',
            url: 'https://gitlab.com/search?search=',
            imgClassName: 'gitlab',
            description: 'GitLab is a web-based DevOps lifecycle tool that provides a Git-repository manager providing wiki, issue-tracking and continuous integration/continuous deployment pipeline features.'
        }, {
            name: 'Stack Overflow',
            key: '!!s',
            url: 'https://stackoverflow.com/search?q=',
            imgClassName: 'stack_overflow',
            description: 'Stack Overflow is a community of developers helping each other solve coding problems through a question-and-answer format.'
        }, {
            name: 'CodePen',
            key: '!!c',
            url: 'https://codepen.io/search/pens?q=',
            imgClassName: 'codepen',
            description: 'CodePen is an online community for testing and showcasing user-created HTML, CSS, and JavaScript code snippets, often used for front-end web development.'
        }, {
            name: 'CodeSandbox',
            key: '!!c2',
            url: 'https://codesandbox.io/search?query=',
            imgClassName: 'code_sandbox',
            description: 'CodeSandbox is an online code editor and prototyping tool that makes creating and sharing web apps faster.'
        }]
    }, {
        groupName: 'Dev. Resources & Community',
        engines: [{
            name: 'Dev.to',
            key: '!!d2',
            url: 'https://dev.to/search?q=',
            imgClassName: 'devto',
            description: 'Dev.to is an online community for software developers to share articles, tutorials, and discussions.'
        }, {
            name: 'Hacker News',
            key: '!!h',
            url: 'https://hn.algolia.com/?q=',
            imgClassName: 'ycombinator',
            description: 'Hacker News is a social news website focusing on computer science and entrepreneurship, run by Paul Graham\'s investment fund and startup incubator, Y Combinator.'
        }, {
            name: 'MDN Web Docs',
            key: '!!m',
            url: 'https://developer.mozilla.org/en-US/search?q=',
            imgClassName: 'mdn',
            description: 'MDN Web Docs is a comprehensive resource for developers, providing documentation, tutorials, and guides on web standards.'
        }, {
            name: 'CSS-tricks',
            key: '!!c3',
            url: 'https://css-tricks.com/?s=',
            imgClassName: 'css_tricks',
            description: 'CSS-Tricks is a website dedicated to teaching web designers and developers about CSS, including tips, tricks, and best practices.'
        }]
    }, {
        groupName: 'Video Platforms',
        engines: [{
            name: 'YouTube',
            key: '!!y2',
            url: 'https://www.youtube.com/results?search_query=',
            imgClassName: 'youtube',
            description: 'YouTube is a video-sharing platform where users can upload, view, rate, share, comment on videos, and subscribe to other users.'
        }]
    }
];
export default searchEngines;


export const files = {
    "JavaScript": {
        language: "javascript",
        key: '!!.js',
        // value: `// add some javascript code `
    },
    "CSS": {
        language: "css",
        key: '!!.css',
        value: `/* add some css code  */`
    },
    "HTML": {
        language: "html",
        key: '!!.html',
        value: `<!-- add some some html code  -->`
    },
    "TypeScript": {
        language: "typescript",
        key: '!!.ts',
        value: `// add some TypeScript code`
    },
    "LESS": {
        language: "less",
        key: '!!.less',
        value: `/* add some LESS code */`
    },
    "SCSS": {
        language: "scss",
        key: '!!.scss',
        value: `/* add some SCSS code */`
    },
    "JSON": {
        language: "json",
        key: '!!.json',
        value: `{
  "key": "value"
}` },
    "XML": {
        language: "xml",
        key: '!!.xml',
        value: `<!-- add some XML code -->`
    },
    "PHP": {
        language: "php",
        key: '!!.php',
        value: `<?php
// add some PHP code
?>`},
    "C#": {
        language: "csharp",
        key: '!!.cs',
        value: `// add some C# code`
    },
    "C++": {
        language: "cpp",
        key: '!!.cpp',
        value: `// add some C++ code`
    },
    "Razor": {
        language: "razor",
        key: '!!.cshtml',
        value: `<!-- add some Razor code -->`
    },
    "Markdown": {
        language: "markdown",
        key: '!!.md',
        value: `# add some Markdown code`
    },
    "Diff": {
        language: "diff",
        key: '!!.diff',
        value: `// add some Diff code`
    },
    "Java": {
        language: "java",
        key: '!!.java',
        value: `// add some Java code`
    },
    "VB": {
        language: "vb",
        key: '!!.vb',
        value: `' add some VB code`
    },
    "CoffeeScript": {
        language: "coffeescript",
        key: '!!.coffee',
        value: `# add some CoffeeScript code`
    },
    "Handlebars": {
        language: "handlebars",
        key: '!!.hbs',
        value: `<!-- add some Handlebars code -->`
    },
    "Batch": {
        language: "batch",
        key: '!!.bat',
        value: `REM add some Batch code`
    },
    "Pug": {
        language: "pug",
        key: '!!.pug',
        value: `// add some Pug code`
    },
    "F#": {
        language: "fsharp",
        key: '!!.fs',
        value: `// add some F# code`
    },
    "Lua": {
        language: "lua",
        key: '!!.lua',
        value: `-- add some Lua code`
    },
    "Powershell": {
        language: "powershell",
        key: '!!.ps1',
        value: `# add some Powershell code`
    },
    "Python": {
        language: "python",
        key: '!!.py',
        value: `# add some Python code`
    },
    "Ruby": {
        language: "ruby",
        key: '!!.rb',
        value: `# add some Ruby code`
    },
    "SASS": {
        language: "sass",
        key: '!!.sass',
        value: `// add some SASS code`
    },
    "R": {
        language: "r",
        key: '!!.r',
        value: `# add some R code`
    },
    "Objective-C": {
        language: "objective-c",
        key: '!!.m',
        value: `// add some Objective-C code`
    }
};