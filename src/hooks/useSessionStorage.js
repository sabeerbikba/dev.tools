import { useState } from "react";
import pkg from "../../package.json";

const prefix = `transform:${pkg.version}:`;

export function useSessionStorage(key, initialValue) {
    const [storedValue, setStoredValue] = useState(() => {
        try {
            const item =
                typeof window !== "undefined"
                    ? window.sessionStorage.getItem(prefix + key) || initialValue
                    : initialValue;
            return key.startsWith("data:") ? item : JSON.parse(item);
        } catch (error) {
            return initialValue;
        }
    });

    const setValue = (value) => {
        try {
            const valueToStore =
                value instanceof Function ? value(storedValue) : value;
            setStoredValue(valueToStore);
            if (typeof window !== "undefined")
                window.sessionStorage.setItem(
                    prefix + key,
                    key.startsWith("data:") ? valueToStore : JSON.stringify(valueToStore)
                );
        } catch (error) {
            console.log(error);
        }
    };

    return [storedValue, setValue];
}
