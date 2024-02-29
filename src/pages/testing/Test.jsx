import React, { useReducer } from 'react';

// Define the initial state with at least one input
const initialState = {
    inputs: {
        link1: '', // Default input
    },
    errors: {},
};

// Define the reducer function
const reducer = (state, action) => {
    let newInputs = {};
    let newErrors = {};

    switch (action.type) {
        case 'UPDATE_INPUT':
            return {
                ...state,
                inputs: {
                    ...state.inputs,
                    [action.payload.name]: action.payload.value,
                },
            };
        case 'SET_ERRORS':
            return {
                ...state,
                errors: action.payload,
            };
        case 'SET_INPUT_COUNT':
            for (let i = 1; i <= action.payload; i++) {
                if (state.inputs[`link${i}`]) {
                    newInputs[`link${i}`] = state.inputs[`link${i}`];
                } else {
                    newInputs[`link${i}`] = '';
                }
                if (state.errors[`link${i}`]) {
                    newErrors[`link${i}`] = state.errors[`link${i}`];
                }
            }
            return {
                ...state,
                inputs: newInputs,
                errors: newErrors,
            };
        default:
            return state;
    }
};

const Test = () => {
    const [state, dispatch] = useReducer(reducer, initialState);
    const { inputs, errors } = state; // Destructuring inputs and errors from state

    console.log(inputs.link1);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        dispatch({ type: 'UPDATE_INPUT', payload: { name, value } });
    };

    const validateInput = (input) => {
        const pattern = new RegExp('^(https?:\\/\\/)?' + // protocol
            '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // domain name
            '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
            '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
            '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
            '(\\#[-a-z\\d_]*)?$', 'i'); // fragment locator
        return !!pattern.test(input);
    };

    // const handleBlur = (e) => {
    //     const { name, value } = e.target;
    //     const newErrors = { ...errors };
    //     if (!validateInput(value)) {
    //         newErrors[name] = 'Invalid URL';
    //     } else {
    //         delete newErrors[name];
    //     }
    //     dispatch({ type: 'SET_ERRORS', payload: newErrors });
    // };

    function handleBlur(e) {
        const { name, value } = e.target;
        let newErrors = { ...errors }; // Start with the current errors

        // If the input is cleared, remove the error for this input
        if (value === '') {
            delete newErrors[name];
        } else if (!validateInput(value)) { // If the input is not valid, set the error
            newErrors[name] = 'Invalid URL';
        } else { // If the input is valid, ensure there's no error for this input
            delete newErrors[name];
        }

        dispatch({ type: 'SET_ERRORS', payload: newErrors });
    }


    function handleOgNumberOfImages(count) {
        dispatch({ type: 'SET_INPUT_COUNT', payload: count });
    }

    return (
        <form>
            <div style={{ height: '100px', marginLeft: '5px', marginRight: '5px', width: '46%', }}>
                <label style={{ marginBottom: '5px' }} htmlFor="ogNumberOfImages">Number of Images</label>
                <select
                    id="ogNumberOfImages"
                    onChange={(e) => handleOgNumberOfImages(parseInt(e.target.value))}
                    style={{ width: '100%', borderRadius: '2px', textAlign: 'center', }}
                >
                    {[...Array(10)].map((_, index) => (
                        <option key={index + 1} value={index + 1}>{index + 1}</option>
                    ))}
                </select>
            </div>
            {Object.keys(inputs).map((name, index) => (
                <input
                    key={index}
                    type="text"
                    name={name}
                    value={inputs[name]}
                    onChange={handleInputChange}
                    onBlur={handleBlur}
                />
            ))}
            {Object.keys(errors).length > 0 && (
                <span>
                    Error in {Object.keys(errors).map((key) => key.replace('link', '')).join(', ')}: Invalid URL
                </span>
            )}
        </form>
    );
};

export default Test;
