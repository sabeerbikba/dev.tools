import { useState, useEffect } from 'react';
import PropTypes from 'prop-types'

import { findNearestNumber } from '../utils/findNearestNumber';
import CopyBtn from '../common/CopyBtn';

const tailwindUnits = [
    0, 1, 1.5, 2, 2.5, 3, 3.5, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 16, 20, 24,
    28, 32, 36, 40, 44, 48, 52, 56, 60, 64, 72, 80, 96,
];

const emToPx = (em) => em * 16;
const twToPx = (tw) => tw * 4;

const pxToEm = (px) => px / 16;
const pxToTw = (px) => findNearestNumber(tailwindUnits, px / 4) ?? 0;

export default function UnitConverter() {
    const [em, setEm] = useState(0);
    const [px, setPx] = useState(0);
    const [tw, setTw] = useState(0);

    const [style, setStyle] = useState({ '--w': `${px}px` });

    useEffect(() => {
        setEm(pxToEm(px));
        setTw(pxToTw(px));

        setStyle({ '--w': `${px}px` });
    }, [px]);

    return (
        <main className="flex flex-col gap-8 p-4">
            <div className="flex flex-col gap-2">
                <UnitInput
                    name="em"
                    value={em}
                    onChange={(n, d) => {
                        if (!d && n !== null) {
                            setPx(emToPx(n));
                        }
                    }}
                />
                <UnitInput
                    name="px"
                    value={px}
                    onChange={(n, d) => {
                        if (!d && n !== null) {
                            setPx(n);
                        }
                    }}
                />
                <UnitInput
                    name="Tailwind"
                    value={tw}
                    onChange={(n, d) => {
                        if (!d && n !== null) {
                            setPx(twToPx(n));
                        }
                    }}
                />
            </div>

            {px > 0 && (
                <div className="px-1 py-4" >
                    <div
                        style={style}
                        className="w-full h-[var(--w)] bg-indigo-500 flex items-center justify-center rounded-md text-s">
                        This is {px} Pixel high
                    </div>
                </div>
            )}
        </main>
    );
}

function UnitInput(props) {
    const [value, setValue] = useState(0);
    const [copyBtnDisabled, setCopyBtnDisabled] = useState(false);

    const handleInput = (e) => {
        const num = parseInt(e.target.value);
        const realNum = isNaN(num) ? null : num;
        setValue(realNum);
        setCopyBtnDisabled(isNaN(num));
        props.onChange(realNum, isNaN(num));
    };

    useEffect(() => {
        setValue(props.value);
        setCopyBtnDisabled(isNaN(props.value));
    }, [props.value]);

    return (
        <div>
            <p className="font-bold text-sm mb-2 capitalize text-white">{props.name}</p>
            <div className="flex gap-2">
                <input
                    type="number"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    value={`${value ?? ''}`}
                    onChange={handleInput}
                    className="px-4 py-2 w-full block rounded-lg border-0 bg-gray-700 text-white shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                />
                <CopyBtn
                    copyText={value}
                    setCopyBtnDisabled={isDisabled => setCopyBtnDisabled(isDisabled)}
                    copyBtnDisabled={copyBtnDisabled || value === 0}
                    styles={{width: '90px', height: '40px'}}
                />
            </div>
        </div>
    );
}
UnitInput.propTypes = {
    name: PropTypes.string.isRequired,
    value: PropTypes.number.isRequired,
    onChange: PropTypes.func.isRequired,
};