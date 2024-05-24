import React, { useState } from 'react';
import { LiveProvider, LiveError, LivePreview } from 'react-live';
import * as Babel from '@babel/standalone';
import MonacoEditor from '@monaco-editor/react';
// TODO: need to add code formatter 

import CopyBtn from '../common/CopyBtn';
import useLocalStorageState from "../hooks/useLocalStorageState";

const initCode = `const App = () => (
   <div>
      <h1>Hello, world!</h1>
   </div>
);

render(<App />);
`;

const clearCode = `const App = () => (
   <>

   </>
);

render(<App />);
`;

export default function LiveReactEditor() {
   const [code, setCode] = useLocalStorageState('liveReactCode', initCode);
   const [copyBtnDisabled, setCopyBtnDisabled] = useState(false);

   const styles = {
      main: { width: '100%', height: '100%', display: 'flex', minWidth: '1620px' },
      div50: { width: '50%', height: '100%', display: 'flex', flexDirection: 'column', background: '#808080cc' },
      btnDiv: { display: 'flex', justifyContent: 'space-around', height: '5%' },
      btn: { width: '30%', height: '92%', color: 'white', borderRadius: '5px' }, 'h95%': { height: '95%' }, livepreviewDiv: { width: '50%', height: '100%', color: 'white' },
      btnBtn: { border: '1px solid #d3d3d3', borderTop: '0', position: 'absolute', right: '0', bottom: '0', height: '100%', padding: '0 7px', borderRadius: '5px', boxShadow: '-5px 0 5px #d3d3d3' },
   }

   return (
      <>
         <div style={styles.main}>
            <div style={styles.div50}>
               <div style={styles.btnDiv}>
                  <button
                     style={{ ...styles.btn, backgroundColor: `${code.trim() ? '#4446a6' : 'rgb(99, 102, 241)'}` }}
                     onClick={() => setCode(initCode)}
                  >
                     BoilerPlate
                  </button>
                  <button
                     style={{ ...styles.btn, backgroundColor: `${!code.trim() ? '#4446a6' : 'rgb(99, 102, 241)'}`, position: 'relative', paddingRight: '50px' }}
                     className={styles.btn}
                     onClick={() => setCode(clearCode)}
                  >
                     Clear
                     <button
                        onClick={(e) => {
                           e.stopPropagation()
                           setCode('')
                        }
                        }
                        style={styles.btnBtn}
                     >AllClear</button>
                  </button>
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
               <LiveProvider
                  code={code}
                  transformCode={(code) =>
                     Babel.transform(code, {
                        presets: ['env', 'react']
                     }).code
                  }
                  noInline
                  scope={{ React }}
               >
                  <LiveError />
                  <LivePreview />
               </LiveProvider>
            </div>
         </div>
      </>
   );
}