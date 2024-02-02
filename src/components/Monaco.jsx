// import React from "react";
import Editor from "@monaco-editor/react";
import { Pane, Spinner } from "evergreen-ui";

export function processSize(size) {
    return !/^\d+$/.test(size) ? size : `${size}px`;
}

const Monaco = ({
    language,
    value,
    defaultValue,
    height,
    width,
    options,
    onChange
}) => {
    return (
        <Editor
            defaultLanguage={language}
            defaultValue={defaultValue}
            value={value}
            height={height}
            width={width}
            options={options}
            onChange={onChange}
            loading={
                <Pane
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    height={400}
                    flex={1}
                >
                    <Spinner />
                </Pane>
            }
        />
    );
};

export default Monaco;
