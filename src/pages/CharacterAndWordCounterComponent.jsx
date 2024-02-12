import { useEffect, useState } from "react";
import Selector from "../common/Selector";
import MonacoEditor from '@monaco-editor/react'

const FilterOption = {
    Character: "Character",
    Word: "Word",
    Line: "Line",
    CustomDelimiter: "     Custom Delimiter",
};

const filterOptions = [
    {
        label: "Character",
        value: FilterOption.Character,
    },
    { label: "Word", value: FilterOption.Word },
    { label: "Line", value: FilterOption.Line },
    { label: "Custom Delimiter", value: FilterOption.CustomDelimiter },
];

export default function CharacterAndWordCounterComponent() {
    const [input, setInput] = useState("");
    const [output, setOutput] = useState("");
    const [count, setCount] = useState(0);
    const [currentFilterOption, setCurrentFilterOption] = useState(
        filterOptions[0].value
    );
    const [filter, setFilter] = useState("");

    useEffect(() => {
        switch (currentFilterOption) {
            case FilterOption.Character:
                setCount(input.length);
                setOutput(input.split("").join("\n"));
                break;
            case FilterOption.CustomDelimiter:
                setCount(input.split(filter).length -1);
                setOutput(input.split(filter).join("\n"));
                break;
            case FilterOption.Word:
                setCount(input.split(" ").length);
                setOutput(input.split(" ").join("\n"));
                break;
            case FilterOption.Line:
                setCount(input.trim().split("\n").length);
                setOutput(input);
            default:
                break;
        }
    }, [input, currentFilterOption, filter]);

    const handleChange = (event) => {
        const { value } = event.target;
        setFilter(value);
    };

    const options = {
        minimap: {
            enabled: false,
        },
        lineNumber: true,
    };

    return (
        <div className="flex gap-4 m-4 h-full">
            <div className="w-full h-full">
                <div className="flex justify-between items-center mb-4 gap-4">
                    <div className="flex gap-4 items-center">
                        <p className="font-bold text-xl text-white"> Input: </p>
                        <button
                            type="button"
                            className="rounded-md bg-indigo-500 px-3.5 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
                            onClick={() => setInput("")}
                        >
                            Clear
                        </button>
                    </div>
                </div>
                <MonacoEditor
                    language="plaintext"
                    theme="vs-dark"
                    value={input}
                    onChange={e => setInput(e)}
                    options={options}
                    height={'95vh'}
                />
            </div>

            <div className="w-full h-full">
                <div className="flex items-center mb-4 gap-4 justify-between">
                    <p className="font-bold text-xl text-white"> Output: </p>
                    <div className="flex gap-4 items-center justify-end w-full">

                        {currentFilterOption === FilterOption.CustomDelimiter && (
                            <input
                                className={`block w-1/4 rounded-md border-0 py-1.5 text-white shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 bg-gray-600`}
                                placeholder={currentFilterOption}
                                value={filter}
                                onChange={handleChange}
                            />
                        )}
                        <Selector
                            values={filterOptions}
                            handleClick={(filterOption) => {
                                setCurrentFilterOption(filterOption.value);
                            }}
                        />
                        <p className="font-bold text-md text-white"> count: {count}</p>
                    </div>
                    <button
                        type="button"
                        className="rounded-md bg-indigo-500 px-3.5 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
                        onClick={async () => {
                            await navigator.clipboard.writeText(output);
                        }}
                    >
                        Copy
                    </button>
                </div>
                <MonacoEditor
                    language="plaintext"
                    theme="vs-dark"
                    options={{ ...options, readOnly: true }}
                    onChange={e => setOutput(e)}
                    value={output}
                    height={'95vh'}
                />
            </div>
        </div>
    );
}
