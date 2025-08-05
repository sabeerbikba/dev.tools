import { useReducer } from "react";
import { LoremIpsum } from "lorem-ipsum";
import PropTypes from "prop-types";

import Input from "@/common/Input";
import CopyBtn from "@/common/CopyBtn";
import ToolBoxLayout from "@/common/ToolBoxLayout";
import ToolBox from "@/common/ToolBox";

const actionTypes = {
  UPDATE_INPUT: "UPDATE_INPUT",
};

const initialState = {
  text: "",
  length: 10,
  checked: 1,
  copyBtnDisabled: false,
};

function reducer(state, action) {
  switch (action.type) {
    case actionTypes.UPDATE_INPUT: {
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
}

export default function LoremIpsumGenerator() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const { text, length, checked, copyBtnDisabled } = state;

  function UPDATE_INPUT(field, value) {
    dispatch({ type: actionTypes.UPDATE_INPUT, field: field, value: value });
  }

  const lorem = new LoremIpsum({
    sentencesPerParagraph: {
      max: 8,
      min: 4,
    },
    wordsPerSentence: {
      max: 16,
      min: 4,
    },
  });

  function genrate() {
    switch (checked) {
      case 1: {
        return UPDATE_INPUT("text", lorem.generateWords(length));
      }
      case 2: {
        return UPDATE_INPUT("text", lorem.generateSentences(length));
      }
      case 3: {
        return UPDATE_INPUT("text", lorem.generateParagraphs(length));
      }
      default: {
        console.error("Unknown checked: " + checked);
      }
    }
  }

  const styles = {
    btn: {
      height: "50%",
      width: "50%",
      color: "white",
      borderRadius: "5px",
      marginBottom: "5px",
    },
  };

  return (
    <ToolBoxLayout classNames="p-2 max-xl:block !min-w-auto max-xl:!h-[98%]">
      <ToolBox title="Input" mainClass="max-xl:!w-full max-xl:h-[48%]">
        <Input
          name="length"
          label="length:"
          type="number"
          onChange={UPDATE_INPUT}
          value={length}
          styles={{ height: "28px", paddingLeft: "10px" }}
          divStyles={{ height: "70px", flexGrow: "0" }}
        />
        <div style={{ display: "flex", height: "90px" }}>
          <div style={{ width: "49%", paddingLeft: "30px" }}>
            {["words", "sentences", "paragraphs"].map((label, index) => (
              <Checkbox
                key={index}
                value={index + 1}
                checkedValue={checked}
                labelText={label}
                onChange={() => UPDATE_INPUT("checked", index + 1)}
              />
            ))}
          </div>
          <div style={{ width: "49%", paddingLeft: "30px" }}>
            <button
              style={{ ...styles.btn, backgroundColor: "#6366f1" }}
              onClick={genrate}
            >
              Genrate
            </button>
            <br />
            <CopyBtn
              copyText={text}
              styles={styles.btn}
              setCopyBtnDisabled={(isDisabled) =>
                UPDATE_INPUT("copyBtnDisabled", isDisabled)
              }
              disabled={copyBtnDisabled || text === ""}
            />
          </div>
        </div>
      </ToolBox>
      <ToolBox title="Ourput" mainClass="max-xl:!w-full max-xl:h-1/2">
        <Input
          elementType="textarea"
          value={text}
         classNames="bg-[#374151] p-3 border-[1px] border-white !text-[#9ca3a6]"
          elementHeight="88%"
        />
      </ToolBox>
    </ToolBoxLayout>
  );
}

function Checkbox({ value, checkedValue, labelText, onChange }) {
  const styles = {
    label: { color: "#A6A6A6", cursor: "pointer" },
  };

  return (
    <div style={{ marginBottom: "11px" }}>
      <label style={styles.label} onClick={() => onChange(value)}>
        <input
          type="checkbox"
          checked={checkedValue === value}
          onChange={() => onChange(value)}
        />{" "}
        {labelText}
      </label>
    </div>
  );
}

Checkbox.propTypes = {
  value: PropTypes.any.isRequired,
  checkedValue: PropTypes.any.isRequired,
  labelText: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
};
