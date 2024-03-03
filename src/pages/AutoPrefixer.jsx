import { useReducer, useEffect } from 'react';
import { version as autoprefixerVersion } from 'autoprefixer/package.json';
import { version as postcssVersion } from 'postcss/package.json';
import store from 'store';
import MonacoEditor from '@monaco-editor/react';

import useLocalStorage from "../hooks/useLocalStorage";
import CopyBtn from '../common/CopyBtn';


const actionTypes = {
    SET_BROWSER_LIST: 'SET_BROWSER_LIST',
    SET_WITH_COMMENTS: 'SET_WITH_COMMENTS',
    SET_PREFIXED_CODE: 'SET_PREFIXED_CODE',
    SET_ERROR: 'SET_ERROR',
    SET_COPY_BTN_DISABLED: 'SET_COPY_BTN_DISABLED',
    SET_LAST_VERSION_ERROR: 'SET_LAST_VERSION_ERROR',
}

const initialState = {
    browserList: store.get('autoprefixer:browsers', []),
    withComments: store.get('autoprefixer:withComments', true),
    prefixedCode: '',
    error: null,
    isCopyBtnDisabled: false,
    lastVersionError: '',
};

function reducer(state, action) {
    switch (action.type) {
        case actionTypes.SET_BROWSER_LIST: {
            return { ...state, browserList: action.payload };
        }
        case actionTypes.SET_WITH_COMMENTS: {
            return { ...state, withComments: action.payload };
        }
        case actionTypes.SET_PREFIXED_CODE: {
            return { ...state, prefixedCode: action.payload };
        }
        case actionTypes.SET_ERROR: {
            return { ...state, error: action.payload };
        }
        case actionTypes.SET_COPY_BTN_DISABLED: {
            return { ...state, isCopyBtnDisabled: action.payload };
        }
        case actionTypes.SET_LAST_VERSION_ERROR: {
            return { ...state, lastVersionError: action.payload }
        }
        default: {
            console.error('Unknown action: ' + action.type);
            console.warn('you not added action.type: ' + action.type + ' add and try');
            return state;
        }
    }
}

export default function AutoPrefixerTool() {
    const CSS_EXAMPLE = '/* Your default CSS example here */';
    const [state, dispatch] = useReducer(reducer, initialState);
    const [lastVersion, setLastVersion] = useLocalStorage('autoPrefixerLastVersion', 4)
    const [cssCode, setCssCode] = useLocalStorage('autoPrefixerCssCode', CSS_EXAMPLE);

    const {
        browserList,
        withComments,
        prefixedCode,
        error, // not needed because same error showing in lastVersionError
        isCopyBtnDisabled,
        lastVersionError,
    } = state;

    useEffect(() => {
        handlePrefix(browserList, withComments, cssCode);
    }, [browserList, withComments, cssCode]);

    useEffect(() => {
        const defaultBrowsers = [`last ${lastVersion} versions`];
        dispatch({ type: actionTypes.SET_BROWSER_LIST, payload: defaultBrowsers });
    }, [lastVersion]);

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
            dispatch({ type: actionTypes.SET_PREFIXED_CODE, payload: html });
            dispatch({ type: actionTypes.SET_ERROR, payload: null });
        } catch (error) {
            dispatch({ type: actionTypes.SET_ERROR, payload: error.message });
        }
    };

    const generateOutputComment = () => {
        return `/*
 * Processed by: https://github.com/sabeerbikba/dev.tools
 * PostCSS: v${postcssVersion},
 * Autoprefixer: v${autoprefixerVersion}
 * Browsers: ${browserList}
 */

`;
    };


    const textPrepare = (text = '') => {
        return text.replace(/</g, '&lt;').replace(/>/g, '&gt;');
    };

    function updateLastVersionError(payload) {
        dispatch({ type: actionTypes.SET_LAST_VERSION_ERROR, payload })
    }

    function handleRevisitDays(value) {
        if (value === '') {
            setLastVersion('');
            updateLastVersionError('Unknown browser query `last versions`');
            return;
        }
        if (!/^\d{0,3}$/.test(value)) {
            updateLastVersionError('Only up to three-digit numbers are allowed');
            return;
        }
        let numericValue = value.replace(/[^0-9]/g, '');
        if (numericValue.startsWith('0')) {
            updateLastVersionError('Minimum value is 1');
            return;
        }
        setLastVersion(numericValue.toString());
        updateLastVersionError('');
    }


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
                                onClick={() => dispatch({ type: actionTypes.SET_CSS_CODE, payload: '' })}
                            >
                                Clear
                            </button>
                        </div>
                    </div>
                    <MonacoEditor
                        language="css"
                        theme="vs-dark"
                        value={cssCode}
                        onChange={(e) => setCssCode(e)}
                        options={options}
                    />
                </div>
                <div className='monaco-style monaco-result'>
                    <div className='flex justify-between px-4 text-white'>
                        <p className="font-bold text-xl text-white h-12"> Output: </p>
                        <div>
                            {lastVersionError && (
                                <div style={{
                                    marginLeft: '25px',
                                    display: 'inline',
                                    border: '2px solid orange',
                                    color: 'white',
                                    borderRadius: '8px',
                                    padding: '7px',
                                    fontSize: '0.85rem',
                                    backgroundColor: 'rgba(255, 87, 34, 0.1)',
                                    marginRight: '20px'
                                }}>
                                    <span style={{
                                        position: 'relative',
                                        left: `${lastVersionError === 'Only up to three-digit numbers are allowed' ? '280px' : lastVersionError === 'Minimum value is 1' ? '140px' : '260px'}`,
                                        bottom: '-1.3',
                                        display: 'inline-block',
                                        width: 0,
                                        height: 0,
                                        borderTop: '7px solid transparent',
                                        borderBottom: '7px solid transparent',
                                        borderRight: '10px solid orange',
                                    }}></span>
                                    {lastVersionError}
                                </div>
                            )}
                            <label style={{ color: 'cfd8dc' }}>
                                <span style={{ fontSize: '1.2rem', color: 'white' }}>
                                    Browserslist:{' '}
                                </span>
                                Last{' '}
                                <input
                                    style={{ width: '50px', backgroundColor: '#2a2a2a', outline: 'none', borderBottom: `2px solid ${lastVersionError ? 'red' : 'grey'}` }}
                                    value={lastVersion}
                                    type="text"
                                    onChange={e => handleRevisitDays(e.target.value)}
                                />
                                version
                            </label>
                        </div>
                    </div>
                    <MonacoEditor
                        language="css"
                        theme="vs-dark"
                        value={prefixedCode}
                        options={{ ...options, readOnly: true }}
                    />
                    <div style={{ display: 'flex' }}>
                        <CopyBtn
                            copyText={prefixedCode}
                            svg
                            setCopyBtnDisabled={(isDisable) => dispatch({ type: actionTypes.SET_COPY_BTN_DISABLED, payload: isDisable })}
                            copyBtnDisabled={isCopyBtnDisabled || prefixedCode === ''}
                            styles={{ backgroundColor: `${isCopyBtnDisabled || prefixedCode === '' ? '#4446a6' : '#6366f1'}`, margin: '10px 10px 0 0' }}
                        />
                        <label className='text-white' style={{ marginTop: '4px' }}>
                            <input
                                type="checkbox"
                                checked={withComments}
                                onChange={() => dispatch({ type: actionTypes.SET_WITH_COMMENTS, payload: !withComments })}
                            />
                            {' '}
                            include comment with configuration to the result
                            <br />
                            You can also see which browsers you choose by filter string on {' '}
                            <a href="https://browsersl.ist/?q=last%206%20version" style={{ color: 'lightblue', textDecoration: 'underline' }}>
                                browsersl.ist
                            </a>
                        </label>
                        {/* {error} */}
                    </div>
                </div>
            </div >
        </>
    );
}