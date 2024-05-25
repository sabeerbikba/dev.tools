import { useReducer } from 'react';
import { LoremIpsum } from 'lorem-ipsum';
import PropTypes from 'prop-types';

import Input from '../common/Input';
import CopyBtn from '../common/CopyBtn';

const actionTypes = {
   UPDATE_INPUT: 'UPDATE_INPUT',
};

const initialState = {
   text: '',
   length: 10,
   checked: 1,
   copyBtnDisabled: false,
};

function reducer(state, action) {
   switch (action.type) {
      case actionTypes.UPDATE_INPUT: {
         return { ...state, [action.field]: action.value }
      }
      default: {
         console.error('Unknown action: ' + action.type);
         console.warn('you not added action.type: ' + action.type + ' add and try');
         return state;
      }
   }
}

export default function LoremIpsumGenerator() {
   const [state, dispatch] = useReducer(reducer, initialState)

   const {
      text,
      length,
      checked,
      copyBtnDisabled,
   } = state;

   function UPDATE_INPUT(field, value) {
      dispatch({ type: actionTypes.UPDATE_INPUT, field: field, value: value })
   }

   const lorem = new LoremIpsum({
      sentencesPerParagraph: {
         max: 8,
         min: 4
      },
      wordsPerSentence: {
         max: 16,
         min: 4
      }
   });

   function genrate() {
      switch (checked) {
         case 1: {
            return UPDATE_INPUT('text', lorem.generateWords(length));
         }
         case 2: {
            return UPDATE_INPUT('text', lorem.generateSentences(length));
         }
         case 3: {
            return UPDATE_INPUT('text', lorem.generateParagraphs(length));
         }
         default: {
            console.error('Unknown checked: ' + checked);
         }
      }
   }


   const styles = {
      main: { width: '100%', height: '100%', display: 'flex', minWidth: '1620px' },
      div50: { width: '50%', height: '100%', padding: '10px', display: 'flex', flexDirection: 'column' },
      btn: { height: '50%', width: '50%', color: 'white', borderRadius: '5px', marginBottom: '5px' },
      outputArea: { width: '50%', height: '100%', padding: '10px', color: 'white' },

   };

   return (
      <div style={styles.main}>
         <div style={styles.div50}>
            <Input
               name='length'
               label='length:'
               type='number'
               onChange={UPDATE_INPUT}
               value={length}
               styles={{ height: '28px', paddingLeft: '10px' }}
               divStyles={{ height: '70px', flexGrow: '0' }}
            />
            <div style={{ display: 'flex', height: '90px' }}>
               <div style={{ width: '49%', paddingLeft: '30px', }}>
                  {['words', 'sentences', 'paragraphs'].map((label, index) => (
                     <Checkbox
                        value={index + 1}
                        checkedValue={checked}
                        labelText={label}
                        onChange={() => UPDATE_INPUT('checked', index + 1)}
                     />
                  ))}
               </div>
               <div style={{ width: '49%', paddingLeft: '30px' }}>
                  <button
                     style={{ ...styles.btn, backgroundColor: '#6366f1' }}
                     onClick={genrate}
                  >Genrate
                  </button>
                  <br />
                  <CopyBtn
                     copyText={text}
                     styles={styles.btn}
                     setCopyBtnDisabled={isDisabled => UPDATE_INPUT('copyBtnDisabled', isDisabled)}
                     copyBtnDisabled={copyBtnDisabled || text === ''}
                  />
               </div>
            </div>
         </div>
         <div style={styles.outputArea}>
            <Input
               elementType='textarea'
               value={text}
               styles={{ backgroundColor: 'grey', padding: '8px', border: '1px solid white' }}
               elementHeight='99%'
            />
         </div>
      </div>
   );
}

function Checkbox({ value, checkedValue, labelText, onChange }) {
   const styles = {
      label: { color: '#A6A6A6', cursor: 'pointer', }
   }

   return (
      <div style={{ marginBottom: '11px' }}>
         <label style={styles.label} onClick={() => onChange(value)}>
            <input
               type="checkbox"
               checked={checkedValue === value}
               onChange={() => onChange(value)}
            />
            {' '}{labelText}
         </label>
      </div>
   );
}

Checkbox.propTypes = {
   value: PropTypes.any.isRequired, // You can specify the type you expect for value
   checkedValue: PropTypes.any.isRequired, // Same for checkedValue
   labelText: PropTypes.string.isRequired,
   onChange: PropTypes.func.isRequired
};
