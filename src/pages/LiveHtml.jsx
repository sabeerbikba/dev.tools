import MonacoEditor from '@monaco-editor/react';
import useLocalStorage from "../hooks/useLocalStorage";
import { useState } from 'react';
import { toast } from 'react-toastify';

export default function LiveHtml() {
    const [copyBtnDisabled, setCopyBtnDisabled] = useState(false);
    const [code, setCode] = useLocalStorage('liveHtmlCode', '');

    function handleClear() {
        setCode('');
    }

    async function handleCopyBtn() {
        try {
            setCopyBtnDisabled(true);
            await navigator.clipboard.writeText(code);
            toast.success('text-copied', {
                position: 'bottom-right',
                theme: 'dark',
                autoClose: 1700,
                onClose: () => setCopyBtnDisabled(false)
            });
        } catch {
            setCopyBtnDisabled(true);
            toast.warn('text-not-copied', {
                position: 'bottom-right',
                theme: 'dark',
                autoClose: 2400,
                onClose: () => setCopyBtnDisabled(false)
            })
        }
    }
    
    const tailwindcss = {
        btn: "rounded-md bg-indigo-500 px-3.5 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500 h-12"
    }

    return (
        <div style={{ width: '100%', height: '100%', display: 'flex' }}>
            <div style={{ width: '50%', height: '100%', display: 'flex', flexDirection: 'column', background: '#808080cc' }}>
                <div style={{ display: 'flex', justifyContent: 'space-around', height: '5%' }}>
                    <button style={{width: '35%', height: '92%'}} className={tailwindcss.btn} onClick={handleClear}>Clear</button>
                    <button style={{width: '35%', height: '92%'}} className={tailwindcss.btn} onClick={handleCopyBtn} disabled={copyBtnDisabled || code.trim() === ''}>Copy</button> {/* need to verify */}
                </div>
                <div style={{ height: '95%' }}>
                    <MonacoEditor
                        language="html"
                        theme="vs-dark"
                        options={{ minimap: { enabled: false }, lineNumber: true }}
                        onChange={setCode}
                        value={code}
                    />
                </div>
            </div>
            <div style={{ width: '50%', height: '100%' }}>
                <iframe
                    srcDoc={code}
                    title="Live Preview"
                    width={'100%'}
                    height={'100%'}
                />
            </div>
        </div>
    );
}