import { useReducer } from "react";
import PropTypes from 'prop-types';
import * as CryptoJS from "crypto-js";

import TextArea from "../common/TextArea";
import CopyBtn from '../common/CopyBtn';

const initialState = {
    input: '',
    md5Hash: '',
    sha1Hash: '',
    sha224Hash: '',
    sha256Hash: '',
    sha384Hash: '',
    sha512Hash: '',
    keccak256Hash: '',
    copyBtnDisabled: {
        md5Hash: false,
        sha1Hash: false,
        sha224Hash: false,
        sha256Hash: false,
        sha384Hash: false,
        sha512Hash: false,
        keccak256Hash: false,
    },
};

const actionTypes = {
    UPDATE_INPUT: 'UPDATE_INPUT',
    CLEAR_INPUTS: 'CLEAR_INPUTS',
    CONTROL_COPY_BUTTON: 'CONTROL_COPY_BUTTON',
};

function hashGenratorReducer(state, action) {
    switch (action.type) {
        case actionTypes.UPDATE_VALUE: {
            return { ...state, [action.field]: action.value };
        }
        case actionTypes.CLEAR_INPUTS: {
            return initialState;
        }
        case actionTypes.CONTROL_COPY_BUTTON: {
            return {
                ...state,
                copyBtnDisabled: {
                    ...state.copyBtnDisabled,
                    [action.field]: action.value,
                },
            };
        }
        default: {
            console.error('Unknown action: ' + action.type);
            console.warn('you not added action.type: ' + action.type + ' add and try');
            return state;
        }
    }
}

export default function HashGenerator() {
    const [state, dispatch] = useReducer(hashGenratorReducer, initialState);
    const {
        input,
        md5Hash,
        sha1Hash,
        sha224Hash,
        sha256Hash,
        sha384Hash,
        sha512Hash,
        keccak256Hash,
        copyBtnDisabled
    } = state

    function UPDATE_VALUE(field, value) {
        dispatch({ type: actionTypes.UPDATE_VALUE, field: field, value: value })
    }

    const generateMd5Hash = (input) => UPDATE_VALUE('md5Hash', CryptoJS.MD5(input).toString());
    const generateSha1Hash = (input) => UPDATE_VALUE('sha1Hash', CryptoJS.SHA1(input).toString());
    const generateSha224Hash = (input) => UPDATE_VALUE('sha224Hash', CryptoJS.SHA224(input).toString());
    const generateSha256Hash = (input) => UPDATE_VALUE('sha256Hash', CryptoJS.SHA256(input).toString());
    const generateSha384Hash = (input) => UPDATE_VALUE('sha384Hash', CryptoJS.SHA384(input).toString());
    const generateSha512Hash = (input) => UPDATE_VALUE('sha512Hash', CryptoJS.SHA512(input).toString());
    const generateKeccak256Hash = (input) => UPDATE_VALUE('keccak256Hash', CryptoJS.SHA3(input, { outputLength: 256 }).toString());

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
            dispatch({ type: actionTypes.CLEAR_INPUTS });
        }
    };

    const tailwindcss = {
        main: "flex gap-4 p-4",
        hashOutputsDiv: "w-full h-full flex flex-col gap-4",
    }

    function UPDATE_BUTTON_STATE(field, value) {
        dispatch({ type: actionTypes.CONTROL_COPY_BUTTON, field, value })
    }

    return (
        <div className={tailwindcss.main} style={{ minWidth: '1620px' }}>
            <TextArea
                onInputChange={(input) => {
                    UPDATE_VALUE('input', input);
                    generateHashes(input);
                }}
            />
            <div className={tailwindcss.hashOutputsDiv}>
                <Output4Hash
                    title="Md5"
                    hash={md5Hash}
                    setIsCopyBtnDisabled={isDisabled => UPDATE_BUTTON_STATE('md5Hash', isDisabled)}
                    isCopyBtnDisabled={copyBtnDisabled.md5Hash}
                />
                <Output4Hash
                    title="Sha1"
                    hash={sha1Hash}
                    setIsCopyBtnDisabled={isDisabled => UPDATE_BUTTON_STATE('sha1Hash', isDisabled)}
                    isCopyBtnDisabled={copyBtnDisabled.sha1Hash}
                />
                <Output4Hash
                    title="Sha224"
                    hash={sha224Hash}
                    setIsCopyBtnDisabled={isDisabled => UPDATE_BUTTON_STATE('sha224Hash', isDisabled)}
                    isCopyBtnDisabled={copyBtnDisabled.sha224Hash}
                />
                <Output4Hash
                    title="Sha256"
                    hash={sha256Hash}
                    setIsCopyBtnDisabled={isDisabled => UPDATE_BUTTON_STATE('sha256Hash', isDisabled)}
                    isCopyBtnDisabled={copyBtnDisabled.sha256Hash}
                />
                <Output4Hash
                    title="Sha384"
                    hash={sha384Hash}
                    setIsCopyBtnDisabled={isDisabled => UPDATE_BUTTON_STATE('sha384Hash', isDisabled)}
                    isCopyBtnDisabled={copyBtnDisabled.sha384Hash}
                />
                <Output4Hash
                    title="Sha512"
                    hash={sha512Hash}
                    setIsCopyBtnDisabled={isDisabled => UPDATE_BUTTON_STATE('sha512Hash', isDisabled)}
                    isCopyBtnDisabled={copyBtnDisabled.sha512Hash}
                />
                <Output4Hash
                    title="Keccak256"
                    hash={keccak256Hash}
                    setIsCopyBtnDisabled={isDisabled => UPDATE_BUTTON_STATE('keccak256Hash', isDisabled)}
                    isCopyBtnDisabled={copyBtnDisabled.keccak256Hash}
                />
            </div>
        </div>
    );
}


function Output4Hash({
    title = '',
    hash,
    setIsCopyBtnDisabled,
    isCopyBtnDisabled,
}) {
    const tailwindcss = {
        p: "font-bold text-sm mb-2 text-white",
        div: "flex gap-2",
        input: "px-4 py-2 w-full block rounded-lg border-0 bg-gray-700 text-white shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6",
        button: "rounded-md bg-indigo-500 px-3.5 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500",
    }

    return (
        <div>
            <p className={tailwindcss.p}>{title} Hash:</p>
            <div className={tailwindcss.div}>
                <input
                    readOnly
                    className={tailwindcss.input}
                    value={hash}
                />
                <CopyBtn
                    copyText={hash}
                    setCopyBtnDisabled={setIsCopyBtnDisabled}
                    copyBtnDisabled={isCopyBtnDisabled}
                    styles={{ height: '40px', width: '70px' }}
                />

            </div>
        </div>
    );
}
Output4Hash.propTypes = {
    title: PropTypes.string,
    hash: PropTypes.string.isRequired,
    setIsCopyBtnDisabled: PropTypes.func,
    isCopyBtnDisabled: PropTypes.bool,
}