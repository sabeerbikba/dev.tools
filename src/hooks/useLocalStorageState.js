import { useState, useEffect } from 'react';

/**
 * A custom hook for storing and retrieving data in local storage.
 * @param {string} key - The key under which to store the data in local storage.
 * @param {any} initialValue - The initial value to use if no value is found in local storage.
 * @param {number} [maxLength=Infinity] - Optional. The maximum length of the array to be stored in local storage.
 * If not provided, the array length is not limited.
 * @returns {[any, function]} - A tuple containing the current value and a function to update the value.
 */

export default function useLocalStorageState(key, initialValue, maxLength = Infinity) {
   const storedValue = localStorage.getItem(key);
   let initial;

   if (storedValue !== null) {
      try {
         initial = JSON.parse(storedValue);
      } catch {
         initial = initialValue;
      }
   } else {
      initial = initialValue;
      localStorage.setItem(key, JSON.stringify(initialValue));  // Force the initial value into localStorage
   }

   const [value, setValue] = useState(initial);

   useEffect(() => {
      if (storedValue === null) {
         localStorage.setItem(key, JSON.stringify(initialValue));
      }
   }, [key, initialValue]);

   /**
    * Update localStorage whenever the value changes.
    * @param {any} newValue - The new value to set and store in local storage.
    */

   const setStoredValue = (newValue) => {
      const updatedValue = maxLength < Infinity ? newValue.slice(0, maxLength) : newValue;
      setValue(updatedValue);
      localStorage.setItem(key, JSON.stringify(updatedValue));
   };

   return [value, setStoredValue];
}