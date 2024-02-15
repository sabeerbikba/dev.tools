import { useState } from "react";
import PropTypes from 'prop-types';
import { PhotoshopPicker, SwatchesPicker, SliderPicker, CirclePicker } from 'react-color';

const isHSLColor = /^hsl\(\s*(\d+)\s*,\s*(\d*(?:\.\d+)?%)\s*,\s*(\d*(?:\.\d+)?%)\)$/i;

export default function ColorConverterComponent() {
    const [rgb, setRgb] = useState("255, 255, 255");
    const [rgba, setRgba] = useState("255, 255, 255, 1");
    const [hex, setHex] = useState("#ffffff");
    const [hsl, setHsl] = useState("hsl(0, 0%, 100%)");

    const rgbToHex = (input) => {
        const cleanedRgb = input.replace(/\s/g, "").toLowerCase();
        const match = cleanedRgb.match(/\(?(\d+),(\d+),(\d+)\)?$/);

        if (!match) {
            throw Error();
        }

        const r = parseInt(match[1], 10);
        const g = parseInt(match[2], 10);
        const b = parseInt(match[3], 10);

        if (r < 0 || r > 255 || g < 0 || g > 255 || b < 0 || b > 255) {
            throw Error();
        }

        const toHex = (value) => {
            const hex = value.toString(16);
            return hex.length === 1 ? `0${hex}` : hex;
        };

        const hexR = toHex(r);
        const hexG = toHex(g);
        const hexB = toHex(b);

        return `#${hexR}${hexG}${hexB}`;
    };

    const rgbToRgba = (input) => {
        const cleanedRgb = input.replace(/\s/g, "").toLowerCase();
        const match = cleanedRgb.match(/\(?(\d+),(\d+),(\d+)\)?$/);

        if (!match) {
            throw Error();
        }

        const r = parseInt(match[1], 10);
        const g = parseInt(match[2], 10);
        const b = parseInt(match[3], 10);

        if (r < 0 || r > 255 || g < 0 || g > 255 || b < 0 || b > 255) {
            throw Error();
        }

        return `${r}, ${g}, ${b}, 1`;
    };

    const hexToRgb = (input) => {
        const cleanedHex = input.replace(/\s/g, "").toLowerCase();
        const match = cleanedHex.match(/^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})?$/);

        if (!match) {
            throw Error();
        }

        const r = parseInt(match[1], 16);
        const g = parseInt(match[2], 16);
        const b = parseInt(match[3], 16);

        if (r < 0 || r > 255 || g < 0 || g > 255 || b < 0 || b > 255) {
            throw Error();
        }

        return `${r}, ${g}, ${b}`;
    };

    const hexToRgba = (input) => {
        const cleanedHex = input.replace(/\s/g, "").toLowerCase();
        const match = cleanedHex.match(/^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})?$/);

        if (!match) {
            throw Error();
        }

        const r = parseInt(match[1], 16);
        const g = parseInt(match[2], 16);
        const b = parseInt(match[3], 16);
        const a = match[4] === undefined ? 1 : parseInt(match[4], 16) / 255;

        if (
            r < 0 ||
            r > 255 ||
            g < 0 ||
            g > 255 ||
            b < 0 ||
            b > 255 ||
            a < 0 ||
            a > 1
        ) {
            throw Error();
        }

        return `${r}, ${g}, ${b}, ${a % 1 === 0 ? a : a.toFixed(3)}`;
    };

    const rgbaToRgb = (input) => {
        const cleanedRgb = input.replace(/\s/g, "").toLowerCase();
        const match = cleanedRgb.match(/\(?(\d+),(\d+),(\d+),(\d+(\.\d+)?)\)?$/);

        if (!match) {
            throw Error();
        }

        const r = parseInt(match[1], 10);
        const g = parseInt(match[2], 10);
        const b = parseInt(match[3], 10);

        if (r < 0 || r > 255 || g < 0 || g > 255 || b < 0 || b > 255) {
            throw Error();
        }

        return `${r}, ${g}, ${b}`;
    };

    const rgbaToHex = (input) => {
        const cleanedRgb = input.replace(/\s/g, "").toLowerCase();
        const match = cleanedRgb.match(/\(?(\d+),(\d+),(\d+),(\d+(\.\d+)?)\)?$/);

        if (!match) {
            throw Error();
        }

        const r = parseInt(match[1], 10);
        const g = parseInt(match[2], 10);
        const b = parseInt(match[3], 10);
        const a = parseFloat(match[4]);

        if (
            r < 0 ||
            r > 255 ||
            g < 0 ||
            g > 255 ||
            b < 0 ||
            b > 255 ||
            a < 0 ||
            a > 1
        ) {
            throw Error();
        }

        const toHex = (value) => {
            const hex = value.toString(16);
            return hex.length === 1 ? `0${hex}` : hex;
        };

        const hexR = toHex(r);
        const hexG = toHex(g);
        const hexB = toHex(b);
        const hexA = toHex(parseInt((a * 255).toFixed(0)));

        return `#${hexR}${hexG}${hexB}${hexA}`;
    };

    const hexToHsl = (input) => {
        let r = 0,
            g = 0,
            b = 0;

        if (input.length == 4) {
            r = "0x" + input[1] + input[1];
            g = "0x" + input[2] + input[2];
            b = "0x" + input[3] + input[3];
        } else if (input.length == 7) {
            r = "0x" + input[1] + input[2];
            g = "0x" + input[3] + input[4];
            b = "0x" + input[5] + input[6];
        }

        r /= 255;
        g /= 255;
        b /= 255;
        let cmin = Math.min(r, g, b),
            cmax = Math.max(r, g, b),
            delta = cmax - cmin,
            h = 0,
            s = 0,
            l = 0;

        if (delta == 0) h = 0;
        else if (cmax == r) h = ((g - b) / delta) % 6;
        else if (cmax == g) h = (b - r) / delta + 2;
        else h = (r - g) / delta + 4;

        h = Math.round(h * 60);

        if (h < 0) h += 360;

        l = (cmax + cmin) / 2;
        s = delta == 0 ? 0 : delta / (1 - Math.abs(2 * l - 1));
        s = +(s * 100).toFixed(1);
        l = +(l * 100).toFixed(1);
        return "hsl(" + h + ", " + s + "%, " + l + "%)";
    };

    const hslToRgb = (input) => {
        let sep = input.indexOf(",") > -1 ? "," : " ";
        const hsl = input.substring(4).split(")")[0].split(sep);

        let h = hsl[0],
            s = hsl[1].substring(0, hsl[1].length - 1),
            l = hsl[2].substring(0, hsl[2].length - 1);

        if (h >= 360) h %= 360;
        s /= 100;
        l /= 100;

        let c = (1 - Math.abs(2 * l - 1)) * s,
            x = c * (1 - Math.abs(((h / 60) % 2) - 1)),
            m = l - c / 2,
            r = 0,
            g = 0,
            b = 0;

        if (0 <= h && h < 60) {
            r = c;
            g = x;
            b = 0;
        } else if (60 <= h && h < 120) {
            r = x;
            g = c;
            b = 0;
        } else if (120 <= h && h < 180) {
            r = 0;
            g = c;
            b = x;
        } else if (180 <= h && h < 240) {
            r = 0;
            g = x;
            b = c;
        } else if (240 <= h && h < 300) {
            r = x;
            g = 0;
            b = c;
        } else if (300 <= h && h < 360) {
            r = c;
            g = 0;
            b = x;
        }

        r = Math.round((r + m) * 255);
        g = Math.round((g + m) * 255);
        b = Math.round((b + m) * 255);

        return r + ", " + g + ", " + b;
    };

    const handleRgbChange = (input) => {
        try {
            setRgb(input);
            setRgba(rgbToRgba(input));
            setHex(rgbToHex(input));
            setHsl(hexToHsl(rgbToHex(input)));
        } catch (_) {
            setHex("");
            setRgba("");
            setHsl("");
        }
    };

    const handleHexChange = (color) => {
        try {
            setHex(color.hex);
            setRgb(hexToRgb(color.hex));
            setRgba(hexToRgba(color.hex));
            setHsl(hexToHsl(color.hex));
        } catch (_) {
            setRgb("");
            setRgba("");
            setHsl("");
        }
    };

    const handleRgbaChange = (input) => {
        try {
            setRgba(input);
            setRgb(rgbaToRgb(input));
            setHex(rgbaToHex(input));
            setHsl(hexToHsl(rgbaToHex(input)));
        } catch (_) {
            setRgb("");
            setHex("");
            setHsl("");
        }
    };

    const handleHslChange = (input) => {
        setHsl(input);
        if (!isHSLColor.test(input)) {
            setRgb("");
            setHex("");
            setRgba("");
        } else {
            try {
                setRgb(hslToRgb(input));
                setRgba(rgbToRgba(hslToRgb(input)));
                setHex(rgbToHex(hslToRgb(input)));
            } catch (_) {
                setRgb("");
                setHex("");
                setRgba("");
            }
        }
    };

    return (
        <div className='flex flex-col gap-4 m-4'>
            <Output4CC title="RGB" colorCode={rgb} handleChange={e => handleRgbChange(e.currentTarget.value)} />
            <Output4CC title="RGBA" colorCode={rgba} handleChange={e => handleRgbaChange(e.currentTarget.value)} />
            <Output4CC title="HEX" colorCode={hex} handleChange={e => handleHexChange(e.currentTarget.value)} />
            <Output4CC title="HSL" colorCode={hsl} handleChange={e => handleHslChange(e.currentTarget.value)} />

            <div>
                <p className="font-bold text-sm mb-2 text-white">Preview:</p>
                <SliderPicker
                    color={hex}
                    onChange={handleHexChange}
                    header="Pick a Color"
                />
                <div style={{ display: 'flex', justifyContent: 'space-around', marginTop: '20px' }}>
                    <PhotoshopPicker
                        color={hex}
                        onChange={handleHexChange}
                        header="Pick a Color"
                    />
                    <div style={{ height: '300px' }}>
                        <SwatchesPicker
                            color={hex}
                            onChange={handleHexChange}
                        />
                    </div>
                    <CirclePicker
                        color={hex}
                        onChange={handleHexChange}
                    />
                </div>
            </div>
        </div>
    );
}

function Output4CC({ title = '', colorCode, handleChange }) {
    return (
        <div>
            <p className='font-bold text-sm mb-2 text-white'> {title}: </p>
            <div className='flex gap-2'>
                <input
                    className='px-4 py-2 w-full block rounded-lg border-0 bg-gray-700 text-white shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6'
                    value={colorCode}
                    onChange={handleChange}
                />
                <button
                    type="button"
                    className='rounded-md bg-indigo-500 px-3.5 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500'
                    onClick={async () => {
                        await navigator.clipboard.writeText(colorCode);
                    }}
                >
                    Copy
                </button>
            </div>
        </div>
    );
}
Output4CC.propTypes = {
    title: PropTypes.string,
    colorCode: PropTypes.string.isRequired,
    handleChange: PropTypes.func.isRequired,
};