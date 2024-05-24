import PropTypes from 'prop-types';

export default function Input({
   name,
   label = '',
   elementType = 'input',
   type = 'text',
   value,
   placeholder = '',
   onChange,
   onBlur,
   showError = false,
   tooltipError = '',
   styles = {},
   divStyles = {},
   tooltipPosition = {},
   elementHeight = '60%',
   noDivMargin,
   onFocus,
   inputDisalbed,
}) {
   const InputComponent = elementType === 'textarea' ? 'textarea' : 'input';
   const style = {
      div: {
         paddingLeft: noDivMargin ? '0' : '5px', paddingRight: noDivMargin ? '0' : '5px', flexGrow: '1',
         marginBottom: '10px', height: elementHeight, position: 'relative', ...divStyles,
      },
      input: {
         marginTop: '5px', marginBottom: '12px', width: '100%', height: '100%', color: 'black',
         borderRadius: '5px', resize: 'none', ...styles
      },
      tooltip: {
         position: 'relative', bottom: '3.2px', marginLeft: '25px', display: 'inline',
         border: '2px solid orange', color: 'white', borderRadius: '8px',
         paddingTop: '2.4px', paddingBottom: '3px', paddingRight: '8px',
         fontSize: '0.75rem', backgroundColor: 'rgba(255, 87, 34, 0.1)'
      },
      tooltipTringle: {
         position: 'relative', left: '-16px', bottom: '-12px', display: 'inline-block',
         width: 0, height: 0, borderTop: '7px solid transparent', borderBottom: '7px solid transparent',
         borderRight: '14px solid orange', transform: 'rotate(90deg)'
      },
   }

   return (
      <div style={style.div}>
         {label && (
            <div>
               <label style={{ color: '#A6A6A6' }} htmlFor={name}>{label + ' '}</label>
               {showError && value !== '' && (
                  <div style={{ position: 'absolute', bottom: '30px', left: '110px', ...tooltipPosition }}>
                     <div style={style.tooltip}>
                        <span style={style.tooltipTringle}></span>
                        {tooltipError.trim() ? tooltipError.trim() : 'Please enter valid url'}
                     </div>
                  </div>
               )}
            </div>
         )}
         <InputComponent
            style={style.input}
            id={name}
            value={value}
            type={type}
            onChange={name ? e => onChange(name, type === 'url' ? e : e.target.value) : onChange}
            onBlur={onBlur}
            placeholder={'   ' + placeholder}
            rows={elementType === 'textarea' ? 3 : null}
            onFocus={onFocus}
            disabled={inputDisalbed}
         />
      </div>
   );
}
Input.propTypes = {
   name: PropTypes.string,
   label: PropTypes.string,
   elementType: PropTypes.oneOf(['input', 'textarea']),
   type: PropTypes.string,
   value: PropTypes.any.isRequired,
   placeholder: PropTypes.string,
   onChange: PropTypes.func.isRequired,
   onBlur: PropTypes.func,
   showError: PropTypes.bool,
   tooltipError: PropTypes.string,
   styles: PropTypes.object,
   divStyles: PropTypes.object,
   tooltipPosition: PropTypes.object,
   elementHeight: PropTypes.string,
   noDivMargin: PropTypes.bool,
   onFocus: PropTypes.func,
   inputDisalbed: PropTypes.bool,
};

// function UPDATE_INPUT(field, value) {
//    dispatch({ type: actionTypes.UPDATE_INPUT, field: field, value: value })
// }