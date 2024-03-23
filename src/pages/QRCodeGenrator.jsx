import { useState } from "react";
import QRCode from "react-qr-code";

import CopyBtn from '../common/CopyBtn';

export default function QrCodeGenerator() {
    const [qrText, setQrText] = useState("https://www.google.com/"); console.log(qrText.length);
    const [copyBtnDisabled, setCopyBtnDisabled] = useState(false);

    const handleTextChange = (input) => {
        const trimmedInput = input.trim();
        if (trimmedInput.length > 1500) {
            return;
        }
        setQrText(trimmedInput);
    };

    const onImageDownload = () => {
        const svg = document.getElementById("QRCode");
        const svgData = new XMLSerializer().serializeToString(svg);
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        const img = new Image();

        img.onload = () => {
            const borderSize = 10;
            const borderColor = "#ffffff";

            canvas.width = img.width + 2 * borderSize;
            canvas.height = img.height + 2 * borderSize;

            ctx.fillStyle = borderColor;
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            const xPosition = (canvas.width - img.width) / 2;
            const yPosition = (canvas.height - img.height) / 2;
            ctx.drawImage(img, xPosition, yPosition);

            const pngFile = canvas.toDataURL("image/png");
            const downloadLink = document.createElement("a");
            downloadLink.download = "QRCode";
            downloadLink.href = `${pngFile}`;
            downloadLink.click();
        };

        img.src = `data:image/svg+xml;base64,${btoa(svgData)}`;
    };

    const tailwindcss = {
        main: "flex flex-col gap-4 p-4",
        p: "font-bold text-sm mb-2 text-white",
        inputDiv: "flex gap-2",
        input: "px-4 py-2 w-full block rounded-lg border-0 bg-gray-700 text-white shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6",
        btn: "rounded-md bg-indigo-500 px-3.5 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500",
        qrDiv: "mt-5 flex gap-5 items-end",
        qrCode: "flex border-white border-8",
        qrDownloadBtn: "h-11 rounded-md mt-4 bg-indigo-500 px-3.5 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500",
        button: { width: '110px', height: '42px', borderRadius: '11px', position: 'relative', left: '-2px', backgroundColor: `${qrText === '' ? '#4446a6' : '#6366f1'}` },
        tooltip: {
            position: 'relative', bottom: '3.2px', marginLeft: '25px', display: 'inline',
            border: '2px solid orange', color: 'white', borderRadius: '8px',
            paddingTop: '2.4px', paddingBottom: '3px', paddingRight: '8px',
            fontSize: '0.75rem', backgroundColor: 'rgba(255, 87, 34, 0.1)'
        },
        tooltipTringle: {
            position: 'relative', left: '-16px', bottom: '-12px', display: 'inline-block',
            width: 0, height: 0, borderTop: '7px solid transparent', borderBottom: '7px solid transparent',
            borderRight: '14px solid orange', transform: 'rotate(90deg)'
        },
    }

    return (
        <div className={tailwindcss.main} style={{ minWidth: '1620px' }}>
            <div>
                <p className={tailwindcss.p}>Text: </p>
                {qrText.length == 1500 && (
                    <div style={{ position: 'absolute', top: "10px", left: "250px" }}>
                        <div style={tailwindcss.tooltip}>
                            <span style={tailwindcss.tooltipTringle}></span>
                            Character limit reached: 1500 characters max.
                        </div>
                    </div>
                )}
                <div className={tailwindcss.inputDiv}>
                    <input
                        className={tailwindcss.input}
                        value={qrText}
                        onChange={(e) => handleTextChange(e.currentTarget.value)}
                    />
                    <CopyBtn
                        copyText={qrText}
                        setCopyBtnDisabled={isDisabled => setCopyBtnDisabled(isDisabled)}
                        copyBtnDisabled={copyBtnDisabled || qrText.trim() == ''}
                    />
                    <button
                        className={tailwindcss.btn}
                        onClick={() => setQrText('')}
                        style={tailwindcss.button}
                        disabled={qrText === ''}
                    >
                        Clear
                    </button>
                </div>
                {qrText.trim() && (
                    <div className={tailwindcss.qrDiv}>
                        <div className={tailwindcss.qrCode}>
                            <QRCode
                                size={256}
                                bgColor="white"
                                fgColor="black"
                                viewBox={`0 0 256 256`}
                                value={qrText.trim()}
                                id="QRCode"
                            />
                        </div>
                        <button
                            type="button"
                            className={tailwindcss.qrDownloadBtn}
                            onClick={onImageDownload}
                        >
                            Download
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}