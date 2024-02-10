import { useState } from 'react';

/**
 * A custom hook for storing and retrieving data in local storage.
 * @param {string} key - The key under which to store the data in local storage.
 * @param {any} initialValue - The initial value to use if no value is found in local storage.
 * @param {number} [maxLength=Infinity] - Optional. The maximum length of the array to be stored in local storage.
 * If not provided, the array length is not limited.
 * @returns {[any, function]} - A tuple containing the current value and a function to update the value.
 */

function useLocalStorage(key, initialValue, maxLength = Infinity) {
    const storedValue = localStorage.getItem(key);
    const initial = storedValue ? JSON.parse(storedValue) : initialValue;
    const [value, setValue] = useState(initial);

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

export default useLocalStorage;
