import { useState, useEffect } from 'react';
import { version as autoprefixerVersion } from 'autoprefixer/package.json';
import { version as postcssVersion } from 'postcss/package.json';
import store from 'store';
// import 'monaco-editor/min/vs/editor/editor.main.css'; //need to check good to remove styles 
import MonacoEditor from '@monaco-editor/react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function AutoPrefixerTool() {
    const DEFAULT_BROWSERS = ['last 4 versions'];
    const CSS_EXAMPLE = '/* Your default CSS example here */';
    const [browserList, setBrowserList] = useState(store.get('autoprefixer:browsers', DEFAULT_BROWSERS));
    const [withComments, setWithComments] = useState(store.get('autoprefixer:withComments', true));
    const [cssCode, setCssCode] = useState(CSS_EXAMPLE);
    const [prefixedCode, setPrefixedCode] = useState('');
    const [error, setError] = useState(null);
    const [isCopyBtnDisabled, setIsCopyBtnDisabled] = useState(false);

    async function handleCopyBtn() {
        try {
            setIsCopyBtnDisabled(true);
            await navigator.clipboard.writeText(prefixedCode);
            toast.success('text-copied', {
                position: 'bottom-right',
                theme: 'dark',
                autoClose: 1700,
                onClose: () => setIsCopyBtnDisabled(false),
            });
        } catch {
            setIsCopyBtnDisabled(true);
            toast.warn('text-not-copied', {
                position: 'bottom-right',
                theme: 'dark',
                autoClose: 2400,
                onClose: () => setIsCopyBtnDisabled(false),
            })
        }
    }

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
            {/* <ToastContainer /> */}
            <div className={'monaco-container'}>

                <div className='monaco-style monaco-editor'>

                    <div className="flex justify-between items-center mb-4 gap-4 h-12" style={{backgroundColor: '#2a2a2a'}}>
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
                    <button disabled={isCopyBtnDisabled} className={`monaco-copy-btn text-white ${isCopyBtnDisabled ? 'btn-disabled' : ''}`} onClick={handleCopyBtn}>Copy
                        <svg style={{ display: 'inline', position: 'relative', left: '10px' }} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 0 1-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 0 1 1.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 0 0-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 10.375H9.375a1.125 1.125 0 0 1-1.125-1.125v-9.25m12 6.625v-1.875a3.375 3.375 0 0 0-3.375-3.375h-1.5a1.125 1.125 0 0 1-1.125-1.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H9.75" />
                        </svg>
                    </button>
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

