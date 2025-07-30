import { memo } from 'react';
import ReactDiffViewer from 'react-diff-viewer-continued';

import useLocalStorageState from '@/hooks/useLocalStorageState';
import TextArea from '@/common/TextArea';

const initialOldCode = `
const a = 10
const b = 10
const c = () => console.log('foo')

if(a > 10) {
  console.log('bar')
}

console.log('done')
`;
const initialNewCode = `
const a = 10
const boo = 10

if(a === 10) {
  console.log('bar')
}
`;

const DiffViewer = memo(() => {
   const [oldCode, setOldCode] = useLocalStorageState('DiffViewer:oldCode', initialOldCode);
   const [newCode, setNewCode] = useLocalStorageState('DiffViewer:newCode', initialNewCode);

   const styles = {
      main: { minWidth: '1620px', padding: '14px', overflow: 'hidden' },
      inputs: { height: '200px' },
      diffOutput: { overflow: "scroll", height: '100%', width: '100%' },
   }

   return (
      <div className="w-full h-full flex flex-col gap-4" style={styles.main}>
         <div className="flex gap-4 h-1/2">
            <TextArea
               initialInput={oldCode}
               onInputChange={(input) => setOldCode(input)}
               title="OldCode:"
               inputStyles={styles.inputs}
            />
            <TextArea
               initialInput={newCode}
               onInputChange={(input) => setNewCode(input)}
               title="NewCode:"
               inputStyles={styles.inputs}
            />
         </div>
         <div style={styles.diffOutput}>
            <ReactDiffViewer
               oldValue={oldCode}
               newValue={newCode}
               splitView
               useDarkTheme
            />
         </div>
      </div>
   );
});

export default DiffViewer;