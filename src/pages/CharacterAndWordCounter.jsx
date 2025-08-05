import { useEffect, useReducer } from "react";

import Selector from "@/common/Selector";
import CopyBtn from "@/common/CopyBtn";
import Input from "@/common/Input";

const FilterOption = {
  Character: "Character",
  Word: "Word",
  Line: "Line",
  CustomDelimiter: "     Custom Delimiter",
};

const filterOptions = [
  { label: "Character", value: FilterOption.Character },
  { label: "Word", value: FilterOption.Word },
  { label: "Line", value: FilterOption.Line },
  { label: "Custom Delimiter", value: FilterOption.CustomDelimiter },
];

const actionTypes = {
  UPDATE_VALUE: "UPDATE_VALUE",
};

const initilaState = {
  input: "",
  output: "",
  count: "",
  currentFilterOption: filterOptions[0].value,
  filter: "",
  copyBtnDisabled: false,
};

function charctedCounterReducer(state, action) {
  switch (action.type) {
    case actionTypes.UPDATE_VALUE: {
      return { ...state, [action.field]: action.value };
    }
    default:
      console.error("Unknown action: " + action.type);
      console.warn(
        "you not added action.type: " + action.type + " add and try"
      );
      return state;
  }
}

export default function CharacterAndWordCounter() {
  const [state, dispatch] = useReducer(charctedCounterReducer, initilaState);
  const { input, output, count, currentFilterOption, filter, copyBtnDisabled } =
    state;

  function UPDATE_VALUE(field, value) {
    dispatch({ type: actionTypes.UPDATE_VALUE, field: field, value: value });
  }

  useEffect(() => {
    switch (currentFilterOption) {
      case FilterOption.Character:
        UPDATE_VALUE("count", input.length);
        UPDATE_VALUE("output", input.split("").join("\n"));
        break;
      case FilterOption.CustomDelimiter:
        UPDATE_VALUE("count", input.split(filter).length - 1);
        break;
      case FilterOption.Word:
        UPDATE_VALUE("count", input.split(" ").length);
        UPDATE_VALUE("output", input.split(" ").join("\n"));
        break;
      case FilterOption.Line:
        UPDATE_VALUE("count", input.trim().split("\n").length);
        UPDATE_VALUE("output", input);
        break;
      default:
        break;
    }
  }, [input, currentFilterOption, filter]);

  const handleChange = (event) => {
    const { value } = event.target;
    UPDATE_VALUE("filter", value);
  };

  return (
    <div className="xl:flex gap-4 p-4 h-full">
      <div className="size-full max-xl:max-h-[47%]">
        <div className="flex justify-between items-center mb-4 gap-4">
          <div className="flex gap-4 items-center">
            <p className="font-bold text-xl text-white"> Input: </p>
            <button
              type="button"
              className="rounded-md bg-indigo-500 px-3.5 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
              onClick={() => UPDATE_VALUE("input", "")}
            >
              Clear
            </button>
          </div>
        </div>
        <Input
          elementType="textarea"
          value={input}
          onChange={(e) => UPDATE_VALUE("input", e.target.value)}
          classNames="bg-[#374151] p-3 border-[1px] border-white !text-white/95 h-[91.3vh] !w-full"
          elementHeight="65%"
        />
      </div>
      <div className="size-full max-xl:max-h-[47%]">
        <div className="flex items-center mb-4 gap-4 justify-between">
          <p className="font-bold text-xl text-white"> Output: </p>
          <div className="flex gap-4 items-center justify-end w-full">
            {currentFilterOption === filterOptions[3].value && (
              <input
                className={`block w-1/3 rounded-md pl-2 h-7 border-0 py-1.5 text-white shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 bg-gray-600`}
                placeholder={currentFilterOption}
                value={filter}
                onChange={handleChange}
              />
            )}
            <Selector
              values={filterOptions}
              value={currentFilterOption}
              handleClick={(filterOption) => {
                UPDATE_VALUE("currentFilterOption", filterOption.target.value);
              }}
            />
            <p className="font-bold text-md text-white"> count: {count}</p>
            <CopyBtn
              copyText={output}
              setCopyBtnDisabled={(isDisabled) =>
                UPDATE_VALUE("copyBtnDisabled", isDisabled)
              }
              disabled={copyBtnDisabled || output === ""}
            />
          </div>
        </div>
        <Input
          elementType="textarea"
          value={output}
          classNames="bg-[#374151] p-3 border-[1px] border-white !text-white/95
        h-[91.3vh] !w-full"
          elementHeight="65%"
          inputDisabled
        />
      </div>
    </div>
  );
}
