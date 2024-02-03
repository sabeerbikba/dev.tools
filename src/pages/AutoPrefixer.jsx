import { useState, useEffect } from 'react';
import { version as autoprefixerVersion } from 'autoprefixer/package.json';
import { version as postcssVersion } from 'postcss/package.json';
import store from 'store';

import 'prismjs/themes/prism.css';
import 'monaco-editor/min/vs/editor/editor.main.css';

import MonacoEditor from '@monaco-editor/react';

export default function AutoPrefixerTool() {
    const DEFAULT_BROWSERS = ['last 4 versions'];
    const CSS_EXAMPLE = '/* Your default CSS example here */';

    const [browserList, setBrowserList] = useState(
        store.get('autoprefixer:browsers', DEFAULT_BROWSERS)
    );
    const [withComments, setWithComments] = useState(
        store.get('autoprefixer:withComments', true)
    );

    const [cssCode, setCssCode] = useState(CSS_EXAMPLE);
    const [prefixedCode, setPrefixedCode] = useState('');
    const [error, setError] = useState(null);

    useEffect(() => {
        setBrowserList(store.get('autoprefixer:browsers', DEFAULT_BROWSERS));
        setWithComments(store.get('autoprefixer:withComments', true));
        handlePrefix(); // Call handlePrefix on initial render
    }, [browserList, withComments, cssCode]);

    const handleCssChange = (value) => {
        setCssCode(value);
    };

    const handlePrefix = async () => {
        try {
            const [autoprefixer, postcss] = await Promise.all([
                import('autoprefixer'),
                import('postcss'),
            ]);

            const params = {
                overrideBrowserslist: browserList,
                grid: 'autoplace',
            };

            const autoprefixerInstance = autoprefixer.default(params);
            const compiled = await postcss.default([autoprefixerInstance]).process(cssCode);

            let html = '';
            if (withComments) html += generateOutputComment();
            html += textPrepare(compiled.css);
            setPrefixedCode(html);
            setError(null);
        } catch (error) {
            setError(error.message);
        }
    };

    const generateOutputComment = () => {
        return `/*
      * Prefixed by https://autoprefixer.github.io
      * PostCSS: v${postcssVersion},
      * Autoprefixer: v${autoprefixerVersion}
      * Browsers: ${browserList}
      */
      `;
    };

    const textPrepare = (text = '') => {
        return text.replace(/</g, '&lt;').replace(/>/g, '&gt;');
    };

    const containerStyle = {
        display: 'flex',
        height: '90%',
    };

    const editorStyle = {
        width: '50%',
        boxSizing: 'border-box',
    };

    const resultStyle = {
        width: '50%',
        padding: '16px',
        overflow: 'auto',
    };

    const options4Editor = {
        minimap: {
            enabled: false,
        },
        lineNumber: true,
    };

    const options4Result = {
        minimap: {
            enabled: false,
        },
        lineNumber: true,
        readOnly: true,
    };


    return (
        <>
            <div style={containerStyle}>
                <div style={editorStyle}>
                    <MonacoEditor
                        language="css"
                        theme="vs-dark"
                        value={cssCode}
                        onChange={handleCssChange}
                        options={options4Editor}
                    />
                    {error && <p className="error">{error}</p>}
                </div>
                <div style={resultStyle}>
                    <MonacoEditor
                        language="css"
                        theme="vs-dark"
                        value={prefixedCode}
                        options={options4Result}
                    />
                </div>
            </div>
            <p>need to chekc again what improvments needed $remvoe this line after completer$</p>
        </>
    );
}
