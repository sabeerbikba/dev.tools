import { useState } from 'react';
import MonacoEditor from '@monaco-editor/react';
import beautify from 'js-beautify';

import useLocalStorageState from "../hooks/useLocalStorageState";
import CopyBtn from '../common/CopyBtn';

const initCode = `<h2>Hello world!</h2>`

export default function LiveHtml() {
   const [code, setCode] = useLocalStorageState('liveHtmlCode2', initCode);
   const [copyBtnDisabled, setCopyBtnDisabled] = useState(false);


   const formatCode = () => {
      const beautifiedCode = beautify.html(code);
      setCode(beautifiedCode);
   }

   const styles = {
      main: { width: '100%', height: '100%', display: 'flex', minWidth: '1620px' },
      div50: { width: '50%', height: '100%', display: 'flex', flexDirection: 'column', background: '#808080cc' },
      btnDiv: { display: 'flex', justifyContent: 'space-around', height: '5%' },
      btn: { width: '30%', height: '92%', color: 'white', borderRadius: '5px', backgroundColor: `${!code.trim() ? '#4446a6' : 'rgb(99, 102, 241)'}` }, 'h95%': { height: '95%' }, livepreviewDiv: { width: '50%', height: '100%' },
   }

   return (
      <div style={styles.main}>
         <div style={styles.div50}>
            <div style={styles.btnDiv}>
               <button
                  style={styles.btn}
                  onClick={() => setCode('')}
                  disabled={code.trim() === ''}
               >Clear</button>
               <button
                  style={styles.btn}
                  onClick={formatCode}
                  disabled={code.trim() === ''}
               >Format</button>
               <CopyBtn
                  copyText={code}
                  styles={styles.btn}
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