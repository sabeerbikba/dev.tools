import {
    Button,
    FilePicker,
    Heading,
    IconButton,
    Pane,
    Popover,
    TextInput,
    toaster,
    Tooltip
} from "evergreen-ui";
import React, { useCallback, useEffect, useState } from "react";
import copy from "clipboard-copy";
import { useDropzone } from "react-dropzone";

const Monaco = React.lazy(() => import("../components/Monaco"));

export default function EditorPanel({
    editable = true,
    title,
    settingElement,
    hasLoad,
    acceptFiles,
    hasClear,
    hasCopy = true,
    topNotifications,
    language,
    defaultValue,
    onChange,
    id,
    packageDetails
}) {
    const [showSettingsDialogue, setSettingsDialog] = useState(false);
    const [value, setValue] = useState(defaultValue);
    const [fetchingUrl, setFetchingUrl] = useState("");

    const options = {
        fontSize: 14,
        readOnly: !editable,
        codeLens: false,
        fontFamily: "Menlo, Consolas, monospace, sans-serif",
        minimap: {
            enabled: false
        },
        quickSuggestions: false,
        lineNumbers: "on",
        renderValidationDecorations: "off"
    };

    const _toggleSettingsDialog = useCallback(
        () => setSettingsDialog(!showSettingsDialogue),
        [showSettingsDialogue]
    );

    useEffect(() => {
        // @ts-ignore
        window.__webpack_public_path__ = "/_next/static/";
    }, []);

    const getSettings = useCallback(
        () => (
            <>
                <Button
                    marginRight={10}
                    iconBefore="cog"
                    onClick={_toggleSettingsDialog}
                    height={28}
                >
                    Settings
                </Button>

                {settingElement({
                    toggle: _toggleSettingsDialog,
                    open: showSettingsDialogue
                })}
            </>
        ),
        [showSettingsDialogue]
    );

    const onFilePicked = useCallback((files, close = () => { }) => {
        if (!(files && files.length)) return;
        const file = files[0];
        const reader = new FileReader();
        reader.readAsText(file, "utf-8");
        reader.onload = () => {
            setValue(reader.result);
            onChange(reader.result);
            close();
        };
    }, []);

    const { getRootProps } = useDropzone({
        onDrop: files => onFilePicked(files),
        disabled: !editable,
        accept: acceptFiles,
        onDropRejected: () =>
            toaster.danger("This file type is not supported.", {
                id
            })
    });

    const copyValue = useCallback(() => {
        copy(value);
        toaster.success("Copied to clipboard.", {
            id
        });
    }, [value]);

    const fetchFile = useCallback(
        close => {
            (async () => {
                if (!fetchingUrl) return;
                const res = await fetch(fetchingUrl);
                const value = await res.text();
                setValue(value);
                setFetchingUrl("");
                close();
                onChange(value);
            })();
        },
        [fetchingUrl, onChange]
    );

    // whenever defaultValue changes, change the value of the editor.
    useEffect(() => {
        setValue(defaultValue);
    }, [defaultValue]);

    return (
        <Pane display="flex" flex={1} flexDirection="column" overflow="hidden">
            <Pane
                display="flex"
                height={40}
                paddingX={10}
                alignItems={"center"}
                borderBottom
                zIndex={2}
                backgroundColor="#FFFFFF"
                flexShrink={0}
            >
                <Pane flex={1}>
                    <Heading size={500} marginTop={0}>
                        {title}
                    </Heading>
                </Pane>

                {settingElement && getSettings()}

                {hasLoad && (
                    <Popover
                        content={({ close }) => (
                            <Pane
                                paddingY={20}
                                paddingX={20}
                                display="flex"
                                flex={1}
                                alignItems="center"
                                justifyContent="center"
                                flexDirection="column"
                                backgroundColor="#FFFFFF"
                            >
                                <FilePicker
                                    width={"100%"}
                                    name="filepicker"
                                    onChange={files => onFilePicked(files, close)}
                                    accept={acceptFiles}
                                />

                                <Heading paddingY={10} size={200}>
                                    OR
                                </Heading>

                                <Pane display="flex" flexDirection="row">
                                    <TextInput
                                        borderBottomRightRadius={0}
                                        borderTopRightRadius={0}
                                        placeholder="Enter URL"
                                        onChange={(e) =>
                                            setFetchingUrl(e.target.value)
                                        }
                                    />
                                    <Button
                                        borderLeftWidth={0}
                                        borderBottomLeftRadius={0}
                                        borderTopLeftRadius={0}
                                        onClick={() => fetchFile(close)}
                                    >
                                        Fetch URL
                                    </Button>
                                </Pane>
                            </Pane>
                        )}
                        shouldCloseOnExternalClick
                    >
                        <Tooltip content="Load File">
                            <IconButton height={28} marginRight={10} icon="upload" />
                        </Tooltip>
                    </Popover>
                )}

                {hasClear && (
                    <Tooltip content="Clear">
                        <IconButton
                            height={28}
                            icon="trash"
                            intent="danger"
                            marginRight={10}
                            onClick={() => setValue("")}
                        />
                    </Tooltip>
                )}

                {packageDetails && (
                    <a
                        href={packageDetails.url}
                        style={{
                            display: "inline-flex"
                        }}
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        <Tooltip content={packageDetails.name}>
                            <Npm />
                        </Tooltip>
                    </a>
                )}

                {hasCopy && (
                    <Button
                        appearance="primary"
                        marginRight={10}
                        iconBefore="duplicate"
                        onClick={copyValue}
                        height={28}
                    >
                        Copy
                    </Button>
                )}
            </Pane>

            <div
                style={{
                    display: "flex",
                    flexDirection: "column",
                    flex: 1,
                    overflow: "hidden"
                }}
                {...getRootProps()}
            >
                {topNotifications &&
                    topNotifications({
                        isSettingsOpen: showSettingsDialogue,
                        toggleSettings: _toggleSettingsDialog
                    })}

                <React.Suspense fallback={<div>Loading...</div>}>
                    <Monaco
                        language={language}
                        value={value}
                        options={options}
                        onChange={value => {
                            setValue(value);
                            onChange(value);
                        }}
                    />
                </React.Suspense>
            </div>
        </Pane>
    );
}
