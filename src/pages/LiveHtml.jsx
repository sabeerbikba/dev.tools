import { useState } from "react";
import MonacoEditor from '@monaco-editor/react'

export default function LiveHtmlEditor() {
    const [code, setCode] = useState('');

    function handleClear() {
        setCode('');
    }

    return (
        <div style={{ width: '100%', height: '100%', display: 'flex' }}>
            <div style={{width: '50%', height: '100%'}}>

                <div style={{ display: 'flex', height: '5%' }}>
                    <button onClick={handleClear}>clear</button>
                </div>
                <div style={{ height: '95%' }}>
                    <MonacoEditor
                        language="html"
                        theme="vs-dark"
                        options={{ minimap: { enabled: false, }, lineNumber: true, }}
                        onChange={e => setCode(e)}
                        value={code}
                    />
                </div>
            </div>
            <div style={{ width: '50%', height: '100%' }}>
                {/* need to implement live previe of code  */}
            </div>
        </div>
    );
}