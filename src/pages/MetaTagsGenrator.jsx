import { useReducer } from "react";
import PropTypes from 'prop-types'
import { toast } from 'react-toastify';
import MonacoEditor from '@monaco-editor/react';

/** TASK.TODO
//  * create single function UPDATE_INPUTS 
 * fix handleFinalOutput
 * fix the error in log
//  * need to update contennt type and primarly language UPDATE_INPUT function 
 * need to add trim in if logic in handleFinalOutput fucntion
 * in revistDays input if userType text need to show error only number allowed 
 * need to make responsive when screen is smaller 
 */

const labelStyles = { color: '#A6A6A6' };

const initialState = {
    title: '',
    descreption: '',
    keywords: '',
    revisitDays: '',
    author: '',
    finalOutput: '',
    robotsAllowed: 'no',
    robotsFollowLink: 'no',
    contentType: 'UTF-8',
    primaryLanguage: 'EngLish',
    copyBtnDisabled: false,
};
const actionTypes = { UPDATE_INPUT: 'UPDATE_INPUT', CLEAR_INPUTS: 'CLEAR_INPUTS' };

function inputsReducer(state, action) {
    switch (action.type) {
        case actionTypes.UPDATE_INPUT:
            return { ...state, [action.field]: action.value }
        case actionTypes.CLEAR_INPUTS:
            return initialState;
        default:
            console.error('Unknown action: ' + action.type);
            console.warn('you not added action.type: ' + action.type + ' add and try');
            return state;
    }
}

export default function MetaTagsGenrator() {
    const [inputs, dispatch] = useReducer(inputsReducer, initialState)
    const {
        title,
        descreption,
        keywords,
        revisitDays,
        author,
        robotsAllowed,
        robotsFollowLink,
        contentType,
        primaryLanguage,
        finalOutput,
        copyBtnDisabled,
    } = inputs

    // const noTag = 'noTag';

    const contentTypeOptions = ['UTF-8', 'UTF-16', 'ISO-8859-1', 'WINDOWS-1252', "Don't Use This Tag"];
    const primaryLanguageOptions = ['English', 'French', 'Spanist', 'Russian', 'Arabic', 'Japanese', 'Korean', 'Hindi', 'Portuguese', 'No Language Tag', 'Manually Type'];
    const yesNoOptions = () => {
        return (
            <>
                <option value="yes">Yes</option>
                <option value="no">No</option>
                <option value="noTag">Don&apos;t use this Tag</option>
            </>
        )
    }


    function handleFinalOutput() {
        let output = '';

        if (title) {
            output += '<meta name="title" content="' + title + '">\n';
        }

        if (descreption) {
            output += '<meta name="desciption" content="' + descreption + '">\n'; //check descreption spelling 
        }

        if (keywords) {
            output += '<meta name="keywords" content="' + keywords + '">\n';
        }

        // if (.trim() || )

        if (revisitDays) {
            output += '<meta name="revisit-after" content="' + revisitDays + ' days">\n'; //check descreption spelling 
        }

        if (author) {
            output += '<meta name="author" content="' + author + '">\n';
        }


        // problem --------------------------------------------------------------------------------------------------------------------------
        // if (!robotsAllowed === 'noTag' && !robotsFollowLink === 'noTag') {
        //     console.log('1');
        //     output += '<meta name="robots" content="' + robotsAllowed + ', ' + robotsFollowLink + '">\n'; // need to check name attribute
        // }
        // //  else
        // if (!robotsAllowed == 'noTag') {
        //     console.log('2');
        //     output += '<meta name="robots" content="' + robotsAllowed + '">\n'; // need to check name attribute
        // }
        // //  else 
        // if (!robotsFollowLink == 'noTag') {
        //     console.log('3');
        //     output += '<meta name="robots" content="' + robotsFollowLink + '">\n'; // need to check name attribute
        // }
        // problem --------------------------------------------------------------------------------------------------------------------------

        dispatch({ type: actionTypes.UPDATE_INPUT, field: 'finalOutput', value: output })
    }

    async function handleCopyBtn() {
        try {
            UPDATE_INPUT('copyBtnDisabled', true);
            await navigator.clipboard.writeText(finalOutput);
            toast.success('text-copied', {
                position: 'bottom-right',
                theme: 'dark',
                autoClose: 1700,
                onClose: () => UPDATE_INPUT('copyBtnDisabled', false)
            });
        } catch {
            UPDATE_INPUT('copyBtnDisabled', true);
            toast.warn('text-not-copied', {
                position: 'bottom-right',
                theme: 'dark',
                autoClose: 2400,
                onClose: () => UPDATE_INPUT('copyBtnDisabled', false)
            })
        }
    }

    function UPDATE_INPUT(field, value) {
        dispatch({ type: actionTypes.UPDATE_INPUT, field: field, value: value })
    }

    const styles = {
        mainDiv: { height: '100%' },
        mainDiv2: { width: '75%', height: '100%', marginLeft: 'auto', marginRight: 'auto', padding: '20px', },
        flex: { display: 'flex' },
        flexStrech: { display: 'flex', alignItems: 'stretch' },
        selectorDiv: { height: '100px', marginLeft: '5px', marginRight: '5px' },
        selector: { width: '100%', borderRadius: '2px', textAlign: 'center' },
        input: { marginLeft: '10px', marginRight: '10px', borderRadius: '4px' },
        button: { flexGrow: '1', backgroundColor: '#204e84', height: '50px', marginLeft: '5px', marginRight: '5px', borderRadius: '5px', color: 'white' },
        h60px: { height: '60px' },
        'h54%': { height: '54%' },
    }

    return (
        <div style={styles.mainDiv}>
            <div style={styles.mainDiv2}>
                <div style={styles.flexStrech}>
                    <Input
                        label="Site Title:"
                        elementType="input"
                        type='text'
                        value={title}
                        placeholder="Title must be within 70 characters"
                        handleInput={e => UPDATE_INPUT('title', e.target.value)}
                    />
                </div>
                <div style={styles.flexStrech}>
                    <Input
                        label="Site Descreption"
                        elementType="textarea"
                        value={descreption}
                        placeholder="Descreption must be within 150 characters"
                        handleInput={e => UPDATE_INPUT('descreption', e.target.value)}
                    />
                    <Input
                        label="Site KeyWords (Separate with commas)"
                        elementType="textarea"
                        value={keywords}
                        placeholder="keyword1, keyword2, keyword3"
                        handleInput={e => UPDATE_INPUT('keywords', e.target.value)}
                    />
                </div>
                <div style={styles.flex}>
                    <div style={{ ...styles.selectorDiv, width: '46%' }}>
                        <label style={labelStyles} htmlFor="robotsAllowed">Allow Robots to index your Website?</label>
                        <select
                            id="robotsAllowed"
                            value={robotsAllowed}
                            onClick={e => UPDATE_INPUT('robotsAllowed', e.target.value)}
                            style={styles.selector}
                        >{yesNoOptions()}
                        </select>
                    </div>
                    <div style={{ ...styles.selectorDiv, width: '53%' }}>
                        <label style={labelStyles} htmlFor="robotsFollowLink">Allow robots to follow all links?</label>
                        <select
                            id="robotsFollowLink"
                            value={robotsFollowLink}
                            onClick={e => UPDATE_INPUT('robotsFollowLink', e.target.value)}
                            style={styles.selector}
                        >{yesNoOptions()}
                        </select>
                    </div>
                </div>
                <div style={styles.flex}>
                    <div style={{ ...styles.selectorDiv, width: '46%', }}>
                        <label style={labelStyles} htmlFor="robotsAllowed">What type of content will your site display?</label>
                        <select
                            id="robotsAllowed"
                            value={contentType}
                            onClick={e => UPDATE_INPUT('contentType', e.target.value)}
                            style={styles.selector}
                        >{contentTypeOptions.map(type => (
                            <option key={type} value={type}>{type}</option>
                        ))}
                        </select>
                    </div>
                    <div style={{ ...styles.selectorDiv, width: '53%' }}>
                        <label style={labelStyles} htmlFor="robotsFollowLink">What is your site primary language?</label>
                        <select
                            id="robotsFollowLink"
                            value={primaryLanguage}
                            onClick={e => UPDATE_INPUT('primaryLanguage', e.target.value)}
                            style={styles.selector}
                        >{primaryLanguageOptions.map(language => (
                            <option key={language} value={language}>{language}</option>
                        ))}
                        </select>
                    </div>
                </div>
                <div style={styles.h60px}>
                    <label style={labelStyles} htmlFor="revisitDays">Search engines should revisit this page after</label>
                    <input
                        id="revisitDays"
                        min={1}
                        // max={730} // 2years
                        value={revisitDays}
                        style={{ width: '20%', ...styles.input }}
                        type="number"
                        onChange={e => UPDATE_INPUT('revisitDays', e.target.value)}
                    />
                    <span style={labelStyles}>days</span>
                </div>
                <div style={styles.h60px}>
                    <label style={labelStyles} htmlFor="author">Author</label>
                    <input
                        id="author"
                        type="text" value={author}
                        style={{ width: '54%', ...styles.input }}
                        onChange={e => UPDATE_INPUT('author', e.target.value)}
                    />
                </div>
                <div style={{ ...styles.flexStrech, ...styles.h60px }}>
                    <button style={styles.button} onClick={handleFinalOutput}>Genrate Meta Tags</button>
                    <button style={styles.button} onClick={handleCopyBtn} disabled={copyBtnDisabled}>copy to clipboard</button>
                    <button style={styles.button} onClick={() => dispatch({ type: actionTypes.CLEAR_INPUTS })}>clear Inputs</button>
                </div>
                <div style={styles["h54%"]}>
                    <div style={styles["h54%"]}>
                        <MonacoEditor
                            language="html"
                            theme="vs-dark"
                            value={finalOutput}
                            options={{ minimap: { enabled: false }, lineNumber: true, readOnly: true }}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}

function Input({ label, elementType, type = 'text', value, placeholder = '', handleInput }) {
    const InputComponent = elementType === 'textarea' ? 'textarea' : 'input';
    const styles = {
        div: { paddingLeft: '5px', paddingRight: '5px', flexGrow: '1', height: '60%' },
        input: { marginTop: '5px', marginBottom: '12px', width: '100%', height: '100%', borderRadius: '5px' },
    }

    return (
        <div style={styles.div}>
            <div>
                <label style={labelStyles} htmlFor={label}>{label + ' '}</label>
            </div>
            <InputComponent
                style={styles.input}
                id={label}
                value={value}
                type={type}
                onChange={handleInput}
                placeholder={'   ' + placeholder}
                rows={elementType === 'textarea' ? 3 : null}
            />
        </div>
    );
}

Input.propTypes = {
    label: PropTypes.string.isRequired,
    elementType: PropTypes.oneOf(['input', 'textarea']).isRequired,
    type: PropTypes.string,
    value: PropTypes.string.isRequired,
    placeholder: PropTypes.string,
    handleInput: PropTypes.func.isRequired,
};
