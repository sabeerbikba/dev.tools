
import { useState, useEffect, useRef } from "react";
export default function Test() {
    const [checkbox, setCheckbox] = useState(false);
    const checkboxRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = () => {
            if (!checkboxRef.current) {
                setCheckbox(prevVal => !prevVal)
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);


    return (
        <>
            <label>checkbox
                <input
                    type="checkbox"
                    checked={checkbox}
                // onChange={() => setCheckbox(!checkbox)}
                />
            </label>
        </>
    );
}

