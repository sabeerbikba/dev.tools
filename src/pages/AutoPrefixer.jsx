import { useState, useEffect } from 'react';
import { version as autoprefixerVersion } from 'autoprefixer/package.json';
import { version as postcssVersion } from 'postcss/package.json';
import store from 'store';
import MonacoEditor from '@monaco-editor/react';

import CopyBtn from '../components/CopyBtn';

/** TASK.TODO:
 * setError not correctly shown in html 
 * convert into reduducer 
 */

export default function AutoPrefixerTool() {
    const DEFAULT_BROWSERS = ['last 4 versions'];
    const CSS_EXAMPLE = '/* Your default CSS example here */';
    const [browserList, setBrowserList] = useState(store.get('autoprefixer:browsers', DEFAULT_BROWSERS));
    const [withComments, setWithComments] = useState(store.get('autoprefixer:withComments', true));
    const [cssCode, setCssCode] = useState(CSS_EXAMPLE);
    const [prefixedCode, setPrefixedCode] = useState('');
    const [error, setError] = useState(null);
    const [isCopyBtnDisabled, setIsCopyBtnDisabled] = useState(false);

    useEffect(() => {
        setBrowserList(browserList);
        setWithComments(withComments);
        handlePrefix(browserList, withComments, cssCode);

    }, [cssCode, browserList, withComments]);

    const handlePrefix = async (browserList, withComments, cssCode) => {
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

    const textPrepare = (text = '') => { return text.replace(/</g, '&lt;').replace(/>/g, '&gt;'); };

    const options = {
        minimap: {
            enabled: false,
        },
        lineNumber: true,
    };

    return (
        <>
            <div className={'monaco-container'}>
                <div className='monaco-style monaco-editor'>
                    <div className="flex justify-between items-center mb-4 gap-4 h-12" style={{ backgroundColor: '#2a2a2a' }}>
                        <div className="flex gap-4 items-center">
                            <p className="font-bold text-xl text-white"> Input: </p>
                            <button
                                type="button"
                                className="rounded-md bg-indigo-500 px-3.5 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
                                onClick={() => setCssCode("")}
                            >
                                Clear
                            </button>
                        </div>
                    </div>
                    <MonacoEditor
                        language="css"
                        theme="vs-dark"
                        value={cssCode}
                        onChange={e => setCssCode(e)}
                        options={options}
                    />
                </div>
                <div className='monaco-style monaco-result'>

                    <p className="font-bold text-xl text-white h-12"> Output: </p>
                    <MonacoEditor
                        language="css"
                        theme="vs-dark"
                        value={prefixedCode}
                        options={{ ...options, readOnly: true }}
                    />
                    <CopyBtn
                        copyText={prefixedCode}
                        svg
                        setCopyBtnDisabled={isDisable => setIsCopyBtnDisabled(isDisable)}
                        copyBtnDisabled={isCopyBtnDisabled || prefixedCode === ''}
                        styles={{ backgroundColor: `${isCopyBtnDisabled || prefixedCode === '' ? '#4446a6' : '#6366f1'}`, margin: '10px 10px 0 0' }}
                    />
                    <label className='text-white'>
                        <input
                            type="checkbox"
                            checked={withComments}
                            onChange={() => setWithComments((prevVal) => !prevVal)}
                        />
                        {' '}
                        include comment with configuration to the result
                    </label>
                    {error}
                </div>
            </div>
        </>
    );
}

