import { useReducer } from "react";
import PropTypes from 'prop-types'
import MonacoEditor from '@monaco-editor/react';

const initialState = { title: '', descreption: '', revisitDays: '', author: '', finalOutput: '' };
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
        finalOutput
    } = inputs

    console.log(title);

    function handleFinalOutput() {
        let output = '';

        if (title) {
            output += '<meta name="title" content="' + { title } + '">';
        }

        if (descreption) {
            output += '<meta name="desciption" content="' + { descreption } + '">'; //check descreption spelling 
        }

        if (keywords) {
            output += '<meta name="keywords" content="' + { keywords } + '">';
        }

        // if (.trim() || )
        
        if (revisitDays) {
            output += '<meta name="revisit-after" content="' + { revisitDays } + ' days">'; //check descreption spelling 
        }

        if (author) {
            output += '<meta name="author" content="' + { author } + '">';
        }

        dispatch({ type: actionTypes.UPDATE_INPUT, field: 'finalOutput', value: output})
    }

    console.log(finalOutput);
    return (
        <div style={{ border: '2px solid blue', height: '100%' }}>
            <div style={{ width: '75%', border: '2px solid red', height: '100%', marginLeft: 'auto', marginRight: 'auto', padding: '20px' }}>
                <div style={{ display: 'flex', alignItems: 'stretch', }}>

                    {/* <div style={{ border: "2px solid green", display: 'flex', alignItems: 'stretch', width: '100%' }}> */}
                    <Input
                        label="Site Title:"
                        elementType="input"
                        type='text'
                        value={title}
                        placeholder="Title must be within 70 characters"
                        handleInput={(e) => dispatch(
                            { type: actionTypes.UPDATE_INPUT, field: 'title', value: e.target.value }
                        )}
                    />
                </div>
                <div style={{ display: 'flex', alignItems: 'stretch', }}>
                    <Input
                        label="Site Descreption"
                        elementType="textarea"
                        value={descreption}
                        placeholder="Descreption must be within 150 characters"
                        handleInput={(e) => dispatch({ type: actionTypes.UPDATE_INPUT, field: 'descreption', value: e.target.value })}
                    />
                    <Input
                        label="Site KeyWords (Separate with commas)"
                        elementType="textarea"
                        value={keywords}
                        placeholder="keyword1, keyword2, keyword3"
                        handleInput={(e) => dispatch({ type: actionTypes.UPDATE_INPUT, field: 'descreption', value: e.target.value })}
                    />
                </div>
                <div style={{ display: 'flex', alignItems: 'stretch', }}>
                    {/* need to add selection bars or also can make switch for it */}
                    <div>
                        <label htmlFor="robotsAllowed">Allow Robots to index your Website</label>
                        <select id="robotsAllowed">
                            {/* options */}
                        </select>
                    </div>
                    <div>
                        <label htmlFor="robotsFollowLink"></label>
                        <select id="robotsFollowLink">
                            {/* options */}
                        </select>
                    </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'stretch', }}>
                    {/* need to create seprate Component for checkbox */}
                    <input type="number" value={revisitDays} onChange={(e) => dispatch({ type: actionTypes.UPDATE_INPUT, field: 'revisitDays', value: e.target.value })} />
                    {/* need to create seprate Component for checkbox */}
                    <input type="text" value={author} onChange={(e) => dispatch({ type: actionTypes.UPDATE_INPUT, field: 'days', value: e.target.value })} />
                </div>
                <div>
                    <button onClick={handleFinalOutput}>Genrate Meta Tags</button>
                </div>
                <div>
                    <button>copy to clipboard</button>
                    <MonacoEditor
                        language="html"
                        theme="vs-dark"
                        value={finalOutput}
                        options={{ minimap: { enabled: false }, lineNumber: true, readOnly: true }}
                    />
                </div>
            </div>
        </div>

    );
}

function Input({ label, elementType, type = 'text', value, placeholder = '', handleInput }) {
    const InputComponent = elementType === 'textarea' ? 'textarea' : 'input';
    return (
        <div style={{ paddingLeft: '5px', paddingRight: '5px', flexGrow: '1', height: '100px' }}>
            {/* <div> */}
            <div>
                <label style={{ color: 'white' }} htmlFor={label}>{label + ' '}</label>
            </div>
            <br />
            <InputComponent
                style={{ marginTop: '5px', marginBottom: '12px', width: '100%' }}
                id={label}
                value={value}
                type={type}
                onChange={handleInput}
                placeholder={placeholder}
                rows={elementType === 'textarea' ? 3 : null}
            />
            {/* </div> */}
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
