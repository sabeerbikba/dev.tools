import { useState, useEffect, useCallback } from 'react';

/**
 * A custom hook to manage state with local storage persistence using reducers.
 * @param {string} key The key under which to store the state in local storage.
 * @param {function} reducer A function that takes the current state and an action, and returns the new state.
 * @param {*} initialState The initial state value.
 * @returns {[*, function]} A tuple containing the current state and a dispatch function to update the state.
 */

export default function useLocalStorageReducer(key, reducer, initialState) {
    // Retrieve the initial state from local storage or use the provided initial state.
    const [state, setState] = useState(() => {
        try {
            const localStorageState = localStorage.getItem(key);
            return localStorageState ? JSON.parse(localStorageState) : initialState;
        } catch (error) {
            console.error('Error retrieving state from localStorage:', error);
            return initialState;
        }
    });

    // Update local storage whenever the state changes.
    useEffect(() => {
        try {
            localStorage.setItem(key, JSON.stringify(state));
        } catch (error) {
            console.error('Error setting state in localStorage:', error);
        }
    }, [key, state]);

    // Memoize the dispatch function to prevent unnecessary re-renders.
    const dispatch = useCallback((action) => {
        setState((currentState) => reducer(currentState, action));
    }, [reducer]);

    // Listen for changes in other tabs and update state accordingly.
    useEffect(() => {
        const handleStorageChange = (event) => {
            if (event.key === key) {
                try {
                    const newValue = JSON.parse(event.newValue);
                    setState(newValue);
                } catch (error) {
                    console.error('Error parsing state from localStorage:', error);
                }
            }
        };

        window.addEventListener('storage', handleStorageChange);

        // Cleanup function to remove the event listener when the component unmounts.
        return () => {
            window.removeEventListener('storage', handleStorageChange);
        };
    }, [key]);

    return [state, dispatch];
}