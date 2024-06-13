import { useState } from "react";
import PropTypes from 'prop-types';

export default function TextArea({ initialInput = "", onInputChange, title = "Input:" }) {
   const [input, setInput] = useState(initialInput);

   const handleInputChange = (e) => {
      const inputValue = e.target.value;
      setInput(inputValue);
      onInputChange(inputValue);
   };

   const handleClearInput = () => {
      setInput("");
      onInputChange("");
   };

   return (
      <div className="w-full h-full">
         <div className="flex items-center mb-4 gap-4">
            <p className="font-bold text-xl text-white"> {title} </p>
            <button
               type="button"
               className="rounded-md bg-indigo-500 px-3.5 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
               onClick={handleClearInput}
            >
               Clear
            </button>
         </div>
         <textarea
            className="px-8 py-2 block w-full rounded-lg border-0 bg-gray-700 text-white shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
            style={{ height: "calc(100% - 44px)" }}
            value={input}
            onChange={handleInputChange}
         />
      </div>
   );
}
TextArea.propTypes = {
   initialInput: PropTypes.string,
   onInputChange: PropTypes.func.isRequired,
   title: PropTypes.string,
};