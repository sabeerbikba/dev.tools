import { useState } from 'react';

const Apis = () => {
    const [isChecked, setIsChecked] = useState(false);

    const toggleSwitch = () => {
        setIsChecked(!isChecked);
    };

    return (
        <div style={{display: 'flex', width: '50%'}}>
            <div className={`switch ${isChecked ? 'on' : 'off'}`} onClick={toggleSwitch}>
                <div className="slider">
                </div>
            </div>
            <input type="text" />
        </div>
    );
};

export default Apis;
