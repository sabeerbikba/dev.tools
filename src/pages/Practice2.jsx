import { useState } from "react";

export default function Practice2() {
    const [name, setName] = useState('sabeer');

    let value = 1 == 0;

    return (
        <>
            sabeer bibka
            <progress value={null} /> <br />
            <input pattern="email" type="text" readOnly={value} value={name} onChange={(e) => setName(e.target.value)} style={{ opacity: value ? '0.5' : '1.0' }} />

        </>
    );
}