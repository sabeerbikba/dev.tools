

import MonacoEditor from '@monaco-editor/react';
import { useState } from 'react';
import beautify from 'js-beautify'; // Import js-beautify

import useLocalStorageState from "../../hooks/useLocalStorageState";
import CopyBtn from '../../common/CopyBtn';

export default function Test() {
   const [code, setCode] = useState('');
   const [copyBtnDisabled, setCopyBtnDisabled] = useState(false);

   const styles = {
      main: { width: '100%', height: '100%', display: 'flex', minWidth: '1620px' },
      div50: { width: '50%', height: '100%', display: 'flex', flexDirection: 'column', background: '#808080cc' },
      btnDiv: { display: 'flex', justifyContent: 'space-around', height: '5%' },
      btn: { width: '35%', height: '92%', color: 'white', borderRadius: '5px' }, 'h95%': { height: '95%' }, livepreviewDiv: { width: '50%', height: '100%' },
   }

   const formatCode = () => {
      const beautifiedCode = beautify.html(code);
      setCode(beautifiedCode);
   }

   return (
      <div style={styles.main}>
         <div style={styles.div50}>
            <div style={styles.btnDiv}>
               <button
                  style={{ ...styles.btn, backgroundColor: `${typeof code === 'string' && !code.trim() ? '#4446a6' : 'rgb(99, 102, 241)'}` }}
                  className={styles.btn}
                  onClick={() => setCode('')}
               >Clear</button>
               <button
                  style={{ ...styles.btn, backgroundColor: 'rgb(99, 102, 241)' }}
                  className={styles.btn}
                  onClick={formatCode}
               >Format</button>
               <CopyBtn
                  copyText={code}
                  styles={styles.btn}
                  setCopyBtnDisabled={isDisabled => setCopyBtnDisabled(isDisabled)}
                  copyBtnDisabled={copyBtnDisabled || (typeof code === 'string' && code.trim() === '')}
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
         <div style={styles.livepreviewDiv}>
            <iframe
               srcDoc={`<html><head></head><body style="color: white;">${code}</body></html>`}
               title="Live Preview"
               width={'100%'}
               height={'100%'}
            />
         </div>
      </div>
   );
}
