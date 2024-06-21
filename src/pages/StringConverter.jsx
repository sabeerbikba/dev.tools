import { useReducer, useEffect, useRef, forwardRef } from "react";
import PropTypes from 'prop-types';
import CopyBtn from "../common/CopyBtn";

function detectInputFormat(input) {
   const camelCasePattern = /^[a-z]+([A-Z][a-z]*)*$/;
   const snakeCasePattern = /^[a-z]+(_[a-z]+)*$/;
   const kebabCasePattern = /^[a-z]+(-[a-z]+)*$/;
   const pascalCasePattern = /^[A-Z][a-z]*([A-Z][a-z]*)*$/;
   const screamKebabCasePattern = /^[A-Z]+(-[A-Z]+)*$/;
   const constantCasePattern = /^[A-Z]+(_[A-Z]+)*$/;

   if (camelCasePattern.test(input)) return "camelCase";
   if (snakeCasePattern.test(input)) return "snake_case";
   if (kebabCasePattern.test(input)) return "kebab-case";
   if (pascalCasePattern.test(input)) return "PascalCase";
   if (screamKebabCasePattern.test(input)) return "SCREAM-KEBAB-CASE";
   if (constantCasePattern.test(input)) return "CONSTANT_CASE";

   return "";
}

const transformations = {
   camelCase: {
      toSnakeCase: text => text.replace(/([A-Z])/g, '_$1').toLowerCase(),
      toKebabCase: text => text.replace(/([A-Z])/g, '-$1').toLowerCase(),
      toPascalCase: text => text.charAt(0).toUpperCase() + text.slice(1),
      toScreamKebabCase: text => text.replace(/([A-Z])/g, '-$1').toUpperCase(),
      toConstantCase: text => text.replace(/([a-z])([A-Z])/g, '$1_$2').toUpperCase(),
   },
   snakeCase: {
      toCamelCase: text => text.replace(/_([a-z])/g, (_, char) => char.toUpperCase()),
      toKebabCase: text => text.replace(/_/g, '-'),
      toPascalCase: text => text.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(''),
      toScreamKebabCase: text => text.replace(/_/g, '-').toUpperCase(),
      toConstantCase: text => text.toUpperCase(),
   },
   kebabCase: {
      toCamelCase: text => text.split('-').map((word, index) => index === 0 ? word.toLowerCase() : word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(''),
      toSnakeCase: text => text.replace(/-/g, '_'),
      toPascalCase: text => text.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(''),
      toScreamKebabCase: text => text.toUpperCase(),
      toConstantCase: text => text.replace(/-/g, '_').toUpperCase(),
   },
   pascalCase: {
      toCamelCase: text => text.charAt(0).toLowerCase() + text.slice(1),
      toSnakeCase: text => text.replace(/([A-Z])/g, '_$1').toLowerCase().substring(1),
      toKebabCase: text => text.replace(/([A-Z])/g, '-$1').toLowerCase().substring(1),
      toScreamKebabCase: text => text.replace(/([A-Z])/g, '-$1').toUpperCase().substring(1),
      toConstantCase: text => text.replace(/([a-z])([A-Z])/g, '$1_$2').toUpperCase(),
   },
   screamKebabCase: {
      toCamelCase: text => text.toLowerCase().split('-').map((word, index) => index === 0 ? word : word.charAt(0).toUpperCase() + word.slice(1)).join(''),
      toSnakeCase: text => text.toLowerCase().replace(/-/g, '_'),
      toKebabCase: text => text.toLowerCase(),
      toPascalCase: text => text.toLowerCase().split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(''),
      toConstantCase: text => text.replace(/-/g, '_'),
   },
   constantCase: {
      toCamelCase: text => text.toLowerCase().split('_').map((word, index) => index === 0 ? word : word.charAt(0).toUpperCase() + word.slice(1)).join(''),
      toSnakeCase: text => text.toLowerCase(),
      toKebabCase: text => text.toLowerCase().replace(/_/g, '-'),
      toPascalCase: text => text.toLowerCase().split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(''),
      toScreamKebabCase: text => text.replace(/_/g, '-'),
   },
};

const options = [
   { label: "camelCase", value: "camelCase" },
   { label: "snake_case", value: "snakeCase" },
   { label: "kebab-case", value: "kebabCase" },
   { label: "PascalCase", value: "pascalCase" },
   { label: "lower case", value: "lowerCase" },
   { label: "UPPER CASE", value: "upperCase" },
   { label: "SCREAM-KEBAB-CASE", value: "screamKebabCase" },
   { label: "CONSTANT_CASE", value: "constantCase" },
];

const initialState = {
   input: "camelCase",
   output: "",
   inputTransformationOption: options[0].label,
   outputTransformationOption: options[1].label,
   detectedInputTransformationOption: "",
   copyBtnDisabled: false,
   showConfirmButton: false,
};

const actionTypes = {
   UPDATE_INPUT: 'UPDATE_INPUT',
   SET_DETECTED_OPTION: 'SET_DETECTED_OPTION',
   CONFIRM_OPTION: 'CONFIRM_OPTION',
   CLEAR_DETECT_OPTION: "CLEAR_DETECT_OPTION",
};

function inputsReducer(state, action) {
   switch (action.type) {
      case actionTypes.UPDATE_INPUT: {
         return { ...state, [action.field]: action.value }
      }
      case actionTypes.SET_DETECTED_OPTION: {
         return { ...state, detectedInputTransformationOption: action.value, showConfirmButton: true }
      }
      case actionTypes.CONFIRM_OPTION: {
         return {
            ...state,
            inputTransformationOption: state.detectedInputTransformationOption,
            detectedInputTransformationOption: "",
            showConfirmButton: false,
         }
      }
      case actionTypes.CLEAR_DETECT_OPTION: {
         return {
            ...state,
            detectedInputTransformationOption: "",
            showConfirmButton: false,
         }
      }
      default: {
         console.error('Unknown action: ' + action.type);
         console.warn('You did not add action.type: ' + action.type + '. Please add it and try again.');
         return state;
      }
   }
}

export default function StringConverter() {
   const [state, dispatch] = useReducer(inputsReducer, initialState);
   const inputRef = useRef(null);
   const {
      input,
      output,
      inputTransformationOption,
      outputTransformationOption,
      detectedInputTransformationOption,
      copyBtnDisabled,
      showConfirmButton,
   } = state;

   const UPDATE_INPUT = (field, value) => {
      dispatch({ type: actionTypes.UPDATE_INPUT, field, value });
   };

   useEffect(() => {
      if (input === "") {
         return dispatch({ type: actionTypes.CLEAR_DETECT_OPTION });
      }

      const detectedFormat = detectInputFormat(input);
      if (detectedFormat && detectedFormat !== inputTransformationOption) {
         dispatch({ type: actionTypes.SET_DETECTED_OPTION, value: detectedFormat });
      }

      if (inputTransformationOption === options[4].label || inputTransformationOption === options[5].label) {
         UPDATE_INPUT('outputTransformationOption',
            inputTransformationOption === options[4].label ? options[5].label : options[4].label);
      }

      handleTransformText();
   }, [input, inputTransformationOption, outputTransformationOption]);

   useEffect(() => {
      const handleKeyDown = (event) => {
         if (showConfirmButton) {
            if (event.ctrlKey && event.key === 'Enter') {
               dispatch({ type: actionTypes.CONFIRM_OPTION });
            }
         }
         if (document.activeElement === inputRef.current) {
            if (event.key === 'Escape') {
               inputRef.current.blur();
            }
            if (event.ctrlKey && event.shiftKey && event.key === 'Backspace') {
               clearAndResetInput();
            }
         }
         if (event.key === '/') {
            inputRef.current.focus();
            event.preventDefault();

            const { value } = inputRef.current;
            inputRef.current.setSelectionRange(value.length, value.length);
         }
      };

      window.addEventListener('keydown', handleKeyDown);

      return () => {
         window.removeEventListener('keydown', handleKeyDown);
      };
   }, [showConfirmButton]);

   const findValueByLabel = (label) => {
      const option = options.find(opt => opt.label === label);
      return option ? option.value : null;
   };

   const transformText = (text, fromCase, toCase) => {
      if (toCase === options[4].label) return text.toLowerCase();
      if (toCase === options[5].label) return text.toUpperCase();

      const fromOption = findValueByLabel(fromCase);
      let toOption = findValueByLabel(toCase);

      if (!fromOption || !toOption) {
         console.error("Can't find transformation option!");
         return text;
      }

      toOption = "to" + toOption.charAt(0).toUpperCase() + toOption.slice(1);
      const transformationFunction = transformations[fromOption] ? transformations[fromOption][toOption] : null;

      if (!transformationFunction) {
         console.warn("Transformation function not found!");
         return text;
      }

      return transformationFunction(text);
   };

   const handleTransformText = () => {
      const transformedOutput = transformText(input, inputTransformationOption, outputTransformationOption);
      UPDATE_INPUT("output", transformedOutput);
   };

   const clearAndResetInput = () => {
      UPDATE_INPUT("input", "");
      dispatch({ type: actionTypes.CLEAR_DETECT_OPTION });
   };

   const styles = {
      main: "flex flex-col gap-8 p-4",
      btn: { color: 'white', backgroundColor: `${input === "" ? '#4446a6' : '#6366f1'}`, height: '40px', width: '120px', borderRadius: '10px', },
      selectorProps: {
         selectorStyle: { width: '230px' }, div2Class: "flex gap-4 items-center",
         selectorClass: `block w-fit rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6`
      },
      optionDetectText: {
         mainP: { display: "inline", width: "250px", color: "white", margin: "auto 0", lineHeight: "20px" },
         insideSpan: { color: "lightblue", display: "block", textAlign: "right", fontSize: "18px", paddingRight: "12px" },
      }
   };

   return (
      <div className={styles.main} style={{ minWidth: '1620px' }}>
         <InputOutputSection
            title=" Input: "
            setRef={inputRef}
            inputOnChange={(e) => UPDATE_INPUT("input", e.target.value)}
            inputValue={input}
            selectorDivWidth={showConfirmButton ? "822px" : "400px"}
         >
            {showConfirmButton && (
               <div className="flex">
                  <p style={styles.optionDetectText.mainP}>Looks like you using:
                     <br /><span style={styles.optionDetectText.insideSpan}>
                        {detectedInputTransformationOption}
                     </span>
                  </p>
                  <button
                     style={styles.btn} disabled={input === ""}
                     onClick={() => dispatch({ type: actionTypes.CONFIRM_OPTION })}
                  >
                     Confirm
                  </button>
               </div>
            )}
            <div className={styles.selectorProps.div2Class}>
               <select
                  style={styles.selectorProps.selectorStyle}
                  value={inputTransformationOption}
                  className={styles.selectorProps.selectorClass}
                  onChange={(e) => UPDATE_INPUT("inputTransformationOption", e.target.value)}
               >
                  {options.map((value, index) => (
                     <option className="text-black" key={index}>{value.label}</option>
                  ))}
               </select>
            </div>
            <button
               style={styles.btn}
               onClick={clearAndResetInput}
            >Clear</button>
         </InputOutputSection>
         <InputOutputSection
            title=" Output: "
            inputValue={output}
         >
            <div className={styles.selectorProps.div2Class}>
               <select
                  style={styles.selectorProps.selectorStyle}
                  value={outputTransformationOption}
                  className={styles.selectorProps.selectorClass}
                  onChange={(e) => UPDATE_INPUT("outputTransformationOption", e.target.value)}
               >
                  {inputTransformationOption === options[4].label || inputTransformationOption === options[5].label ? (
                     options.filter(option =>
                        option.value === options[4].value || option.value === options[5].value
                     ).map((value, index) => (
                        <option className="text-black" key={index}>{value.label}</option>
                     ))
                  ) : (
                     options.map((value, index) => (
                        <option className="text-black" key={index}>{value.label}</option>
                     ))
                  )}
               </select>
            </div>
            <CopyBtn
               copyText={output}
               setCopyBtnDisabled={isDisabled => UPDATE_INPUT("copyBtnDisabled", isDisabled)}
               copyBtnDisabled={copyBtnDisabled || output === ''}
            />
         </InputOutputSection>
      </div>
   );
}

const InputOutputSection = forwardRef(({
   title,
   children,
   inputOnChange,
   inputValue,
   selectorDivWidth = "400px",
   setRef = null
}, ref) => {
   const styles = {
      wHFull: "w-full h-full",
      selectorDiv: "flex items-center mb-4 gap-4 justify-between",
      outputText: "font-bold text-xl text-white",
      textArea: "px-8 py-2 block w-full rounded-lg border-0 bg-gray-700 text-white shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6",
      selectorProps: {
         div: "flex justify-between", style: { width: selectorDivWidth }
      }
   };

   return (
      <div className={styles.wHFull}>
         <div className={styles.selectorDiv}>
            <p className={styles.outputText}>{title}</p>
            <div className={styles.selectorProps.div} style={styles.selectorProps.style}>
               {children}
            </div>
         </div>
         <textarea
            readOnly={!inputOnChange}
            onChange={inputOnChange}
            className={styles.textArea}
            value={inputValue}
            ref={ref || setRef}
         />
      </div>
   );
});
InputOutputSection.propTypes = {
   title: PropTypes.string.isRequired,
   children: PropTypes.node.isRequired,
   inputOnChange: PropTypes.func,
   inputValue: PropTypes.string.isRequired,
   selectorDivWidth: PropTypes.string,
   setRef: PropTypes.oneOfType([
      PropTypes.func,
      PropTypes.shape({ current: PropTypes.any })
   ])
};
