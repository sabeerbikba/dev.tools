import { useState } from "react";

export default function Test() {
    const [focusedInput, setFocusedInput] = useState(1);
    console.log(focusedInput);

    const handleInputFocus = (ref) => {
        setFocusedInput(ref);
    };

    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignContent: 'center', height: '100%', width: '100%' }}>
            <div>
                <input
                    type="text"
                    style={{
                        border: '1px solid red', // Border color
                        borderRadius: '4px', // Border radius for rounded corners
                        padding: '8px', // Padding inside the input field
                        width: '100%' // Width of the input field
                    }}
                    onFocus={() => handleInputFocus(1)}
                />
                <input
                    type="text"
                    style={{
                        border: '1px solid red', // Border color
                        borderRadius: '4px', // Border radius for rounded corners
                        padding: '8px', // Padding inside the input field
                        width: '100%' // Width of the input field
                    }}
                    onFocus={() => handleInputFocus(2)}
                />
            </div>
        </div>
    );
}