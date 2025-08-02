import { useEffect, useReducer } from "react";
import { MD5, SHA1, SHA224, SHA256, SHA384, SHA512, SHA3 } from "crypto-js";
import PropTypes from "prop-types";

import TextArea from "@/common/TextArea";
import CopyBtn from "@/common/CopyBtn";

const initialState = {
  input: "",
  md5Hash: "",
  sha1Hash: "",
  sha224Hash: "",
  sha256Hash: "",
  sha384Hash: "",
  sha512Hash: "",
  keccak256Hash: "",
};

const actionTypes = {
  UPDATE_VALUE: "UPDATE_VALUE",
};

const hashGenratorReducer = (state, action) => {
  switch (action.type) {
    case actionTypes.UPDATE_VALUE: {
      return { ...state, [action.field]: action.value };
    }
    default: {
      console.error("Unknown action: " + action.type);
      console.warn(
        "you not added action.type: " + action.type + " add and try"
      );
      return state;
    }
  }
};

const HashGenerator = () => {
  const [
    {
      input,
      md5Hash,
      sha1Hash,
      sha224Hash,
      sha256Hash,
      sha384Hash,
      sha512Hash,
      keccak256Hash,
    },
    dispatch,
  ] = useReducer(hashGenratorReducer, initialState);

  const UPDATE_VALUE = (field, value) => {
    dispatch({ type: actionTypes.UPDATE_VALUE, field: field, value: value });
  };

  const generateMd5Hash = (input) =>
    UPDATE_VALUE("md5Hash", MD5(input).toString());
  const generateSha1Hash = (input) =>
    UPDATE_VALUE("sha1Hash", SHA1(input).toString());
  const generateSha224Hash = (input) =>
    UPDATE_VALUE("sha224Hash", SHA224(input).toString());
  const generateSha256Hash = (input) =>
    UPDATE_VALUE("sha256Hash", SHA256(input).toString());
  const generateSha384Hash = (input) =>
    UPDATE_VALUE("sha384Hash", SHA384(input).toString());
  const generateSha512Hash = (input) =>
    UPDATE_VALUE("sha512Hash", SHA512(input).toString());
  const generateKeccak256Hash = (input) =>
    UPDATE_VALUE(
      "keccak256Hash",
      SHA3(input, { outputLength: 256 }).toString()
    );

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

  useEffect(() => {
    if (input === "") {
      // Clear all inputs
      Object.entries(initialState).map(([s]) => {
        UPDATE_VALUE(s, "");
      });
    }
  }, [input]);

  const tailwindcss = {
    main: "flex gap-4 p-4",
    hashOutputsDiv: "w-full h-full flex flex-col gap-4",
  };

  return (
    <div className={tailwindcss.main} style={{ minWidth: "1620px" }}>
      <TextArea
        onInputChange={(input) => {
          UPDATE_VALUE("input", input);
          generateHashes(input);
        }}
      />
      <div className={tailwindcss.hashOutputsDiv}>
        {[
          { title: "Md5", hash: md5Hash },
          { title: "sha1", hash: sha1Hash },
          { title: "sha224", hash: sha224Hash },
          { title: "sha256", hash: sha256Hash },
          { title: "sha384", hash: sha384Hash },
          { title: "sha512", hash: sha512Hash },
          { title: "keccak256", hash: keccak256Hash },
        ].map(({ title, hash }, key) => (
          <Output4Hash key={key} title={title} hash={hash} />
        ))}
      </div>
    </div>
  );
};

const Output4Hash = ({ title = "", hash }) => {
  const tailwindcss = {
    p: "font-bold text-sm mb-2 text-white",
    div: "flex gap-2",
    input:
      "px-4 py-2 w-full block rounded-lg border-0 !bg-gray-700 !text-white shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6",
    button:
      "rounded-md bg-indigo-500 px-3.5 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500",
  };

  return (
    <div>
      <p className={tailwindcss.p}>{title} Hash:</p>
      <div className={tailwindcss.div}>
        <input readOnly className={tailwindcss.input} value={hash} />
        <CopyBtn
          copyText={hash}
          disabled={!hash}
          styles={{ height: "40px", width: "70px" }}
        />
      </div>
    </div>
  );
};
Output4Hash.propTypes = {
  title: PropTypes.string,
  hash: PropTypes.string.isRequired,
  setIsCopyBtnDisabled: PropTypes.func,
  isCopyBtnDisabled: PropTypes.bool,
};

export default HashGenerator;
