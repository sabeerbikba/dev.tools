import MonacoEditor from '@monaco-editor/react';
import { useState } from 'react';

import useLocalStorage from "../hooks/useLocalStorage";
import CopyBtn from '../common/CopyBtn';

export default function LiveHtml() {
    const [copyBtnDisabled, setCopyBtnDisabled] = useState(false);
    const [code, setCode] = useLocalStorage('liveHtmlCode', '');

    function handleClear() {
        setCode('');
    }

    const tailwindcss = {
        btn: "rounded-md bg-indigo-500 px-3.5 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500 h-12"
    }

    const styles = {
        main: { width: '100%', height: '100%', display: 'flex' },
        div50: { width: '50%', height: '100%', display: 'flex', flexDirection: 'column', background: '#808080cc' },
        btnDiv: { display: 'flex', justifyContent: 'space-around', height: '5%' },
        btn: { width: '35%', height: '92%' },
        'h95%': { height: '95%' },
        iframeDiv: { width: '50%', height: '100%' },
    }

    return (
        <main style={styles.main}>
            <div style={styles.div50}>
                <div style={styles.btnDiv}>
                    <button
                        style={{ ...styles.btn, backgroundColor: `${!code.trim() ? '#4446a6' : ''}` }}
                        className={tailwindcss.btn}
                        onClick={handleClear}
                    >Clear</button>
                    <CopyBtn
                        copyText={code}
                        styles={{ ...styles.btn }}
                        setCopyBtnDisabled={isDisabled => setCopyBtnDisabled(isDisabled)}
                        copyBtnDisabled={copyBtnDisabled || code.trim() === ''}
                    />
                </div>
                <div style={styles['h95%']}>
                    <MonacoEditor
                        language="html"
                        theme="vs-dark"
                        options={{ minimap: { enabled: false }, lineNumber: true }}
                        onChange={setCode}
                        value={code}
                    />
                </div>
            </div>
            <div style={styles.iframeDiv}>
                <iframe
                    srcDoc={`<html><head></head><body style="color: white;">${code}</body></html>`}
                    title="Live Preview"
                    width={'100%'}
                    height={'100%'}
                />
            </div>
        </main>
    );
}