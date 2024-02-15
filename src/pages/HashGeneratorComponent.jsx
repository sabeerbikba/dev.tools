import { useState } from "react";
import PropTypes from 'prop-types';
import TextArea from "../common/TextArea";
import * as CryptoJS from "crypto-js";

export default function HashGeneratorComponent({ isProUser }) {
    const [input, setInput] = useState("");
    const [md5Hash, setMd5Hash] = useState("");
    const [sha1Hash, setSha1Hash] = useState("");
    const [sha224Hash, setSha224Hash] = useState("");
    const [sha256Hash, setSha256Hash] = useState("");
    const [sha384Hash, setSha384Hash] = useState("");
    const [sha512Hash, setSha512Hash] = useState("");
    const [keccak256Hash, setKeccak256Hash] = useState("");

    const generateMd5Hash = (input) =>
        setMd5Hash(CryptoJS.MD5(input).toString());
    const generateSha1Hash = (input) =>
        setSha1Hash(CryptoJS.SHA1(input).toString());
    const generateSha224Hash = (input) =>
        setSha224Hash(CryptoJS.SHA224(input).toString());
    const generateSha256Hash = (input) =>
        setSha256Hash(CryptoJS.SHA256(input).toString());
    const generateSha384Hash = (input) =>
        setSha384Hash(CryptoJS.SHA384(input).toString());
    const generateSha512Hash = (input) =>
        setSha512Hash(CryptoJS.SHA512(input).toString());
    const generateKeccak256Hash = (input) =>
        setKeccak256Hash(CryptoJS.SHA3(input, { outputLength: 256 }).toString());

    const generateHashes = (input) => {
        try {
            if (input) {
                generateMd5Hash(input);
                generateSha1Hash(input);
                generateSha224Hash(input);
                generateSha256Hash(input);
                generateSha384Hash(input);
                generateSha512Hash(input);
                generateKeccak256Hash(input);
            }
        } catch (_) {
            setMd5Hash("");
            setSha1Hash("");
            setSha224Hash("");
            setSha256Hash("");
            setSha384Hash("");
            setSha512Hash("");
            setKeccak256Hash("");
        }
    };

    return (
        <div className="flex gap-4 m-4">
            <TextArea
                initialInput="hello world"
                onInputChange={(input) => {
                    setInput(input);
                    generateHashes(input);
                }}
            />
            <div className="w-full h-full flex flex-col gap-4">
                <Output4Hash title="Md5" hash={md5Hash} />
                <Output4Hash title="Sha1" hash={sha1Hash} />
                <Output4Hash title="Sha224" hash={sha224Hash} />
                <Output4Hash title="Sha256" hash={sha256Hash} />
                <Output4Hash title="Sha384" hash={sha384Hash} />
                <Output4Hash title="Sha512" hash={sha512Hash} />
                <Output4Hash title="Keccak256" hash={keccak256Hash} />
            </div>
        </div>
    );
}


function Output4Hash({ title = '', hash }) {
    return (
        <div>
            <p className="font-bold text-sm mb-2 text-white">{title} Hash:</p>
            <div className="flex gap-2">
                <input
                    readOnly
                    className="px-4 py-2 w-full block rounded-lg border-0 bg-gray-700 text-white shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    value={hash}
                />
                <button
                    type="button"
                    className="rounded-md bg-indigo-500 px-3.5 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
                    onClick={async () => {
                        await navigator.clipboard.writeText(hash);
                    }}
                >
                    Copy
                </button>
            </div>
        </div>
    );
}
Output4Hash.propTypes = {
    title: PropTypes.string,
    hash: PropTypes.string.isRequired,
}