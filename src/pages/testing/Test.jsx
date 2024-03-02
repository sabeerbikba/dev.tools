import React, { useState } from 'react';

export default function Test() {
    const [data, setData] = useState(null);

    console.log(data);

    // const receiveData = (childData) => {
    //     setData(childData);
    // };

    return (
        <div>
            <p>Data received from child component: {data === null ? 'No data yet' : data.toString()}</p>
            {/* <ChildComponent sendData={childData => receiveData(setData(childData))} /> */}
            <ChildComponent
                sendData={(childData) => setData(childData)} // Define receiveData inline
            />
        </div>
    );
}

function ChildComponent({ sendData }) {
    const handleClick = () => {
        sendData(true); // or false
    };

    return (
        <button onClick={handleClick}>Send Data</button>
    );
}

