import { useReducer } from 'react';
import PropTypes from 'prop-types';
const labelStyles = { color: '#A6A6A6' };

const initialState = {
    ogNumberOfImages: 1,
    ogImagesLinks: [''],
    finalOutput: ''
};

const actionTypes = { TOGGLE_OG_NUMBER_OF_IMAGES: 'TOGGLE_OG_NUMBER_OF_IMAGES', SET_OG_IMAGES_LINKS: 'SET_OG_IMAGES_LINKS' }

function reducer(state, action) {
    switch (action.type) {
        case 'UPDATE_INPUT':
            return { ...state, [action.field]: action.value }
        case actionTypes.TOGGLE_OG_NUMBER_OF_IMAGES:
            return {
                ...state,
                ogNumberOfImages: action.payload,
                ogImagesLinks: Array.from({ length: action.payload }, (_, index) => state.ogImagesLinks[index] || '')
            };
        case actionTypes.SET_OG_IMAGES_LINKS:
            return {
                ...state,
                ogImagesLinks: state.ogImagesLinks.map((value, index) => index === action.index ? action.payload : value)
            };
        default:
            return state;
    }
}

function Test() {
    const [state, dispatch] = useReducer(reducer, initialState);
    const { ogNumberOfImages, ogImagesLinks, finalOutput } = state;

    const handleInputChange = (index, value) => {
        dispatch({ type: actionTypes.SET_OG_IMAGES_LINKS, index, payload: value });
    };

    const handleOutput = () => {
        let finalOutput = '';

        ogImagesLinks.filter(link => link) // Filter out empty or falsy values
            .forEach((link) => (
                finalOutput += '<meta property="og:image" content="' + link + '">\n'
            ));

        // dispatch({ type: 'SET_OUTPUT', payload: output });
        UPDATE_INPUT('finalOutput', finalOutput)
    };

    const handleInputCountChange = (count) => {
        dispatch({ type: actionTypes.TOGGLE_OG_NUMBER_OF_IMAGES, payload: count });
    };

    function UPDATE_INPUT(field, value) {
        dispatch({ type: 'UPDATE_INPUT', field: field, value: value })
    }

    const renderInputs = () => {
        const inputs = [];
        for (let i = 0; i < ogNumberOfImages; i++) {
            const label = i === 0 ? 'Image URL' : '';
            inputs.push(
                <Input
                    key={i}
                    label={label}
                    elementType="input"
                    value={ogImagesLinks[i]}
                    placeholder={`Image URL ${i + 1}`}
                    handleInput={(e) => handleInputChange(i, e.target.value)}
                />
            );
        }
        return inputs;
    };

    return (
        <div>
            <label>Number of Inputs:</label>
            <select value={ogNumberOfImages}
                onChange={(e) => handleInputCountChange(parseInt(e.target.value))}
            >
                <option value={1}>1</option>
                <option value={2}>2</option>
                <option value={3}>3</option>
            </select>
            {renderInputs()}
            <textarea type="text"
                value={finalOutput}
                style={{ width: '50%' }}
            />
            <button onClick={handleOutput}>generate</button>
        </div>
    );
}

export default Test;

function Input({ label = '', elementType, type = 'text', value, placeholder = '', handleInput, styles = {} }) {
    const InputComponent = elementType === 'textarea' ? 'textarea' : 'input';
    const style = {
        div: { paddingLeft: '5px', paddingRight: '5px', flexGrow: '1', height: '60%' },
        input: { marginTop: '5px', marginBottom: '12px', width: '100%', height: '100%', borderRadius: '5px' },
    };

    return (
        <>
            <div style={style.div}>
                {label && (
                    <div>
                        <label style={labelStyles} htmlFor={label}>{label + ' '}</label>
                    </div>
                )}
                <InputComponent
                    style={{ ...style.input, ...styles, }}
                    id={label}
                    value={value}
                    type={type}
                    onChange={handleInput}
                    placeholder={'   ' + placeholder}
                    rows={elementType === 'textarea' ? 3 : null}
                />
            </div>

        </>
    );
}
Input.propTypes = {
    label: PropTypes.string,
    elementType: PropTypes.oneOf(['input', 'textarea']).isRequired,
    type: PropTypes.string,
    value: PropTypes.string.isRequired,
    placeholder: PropTypes.string,
    handleInput: PropTypes.func.isRequired,
    styles: PropTypes.object
};
