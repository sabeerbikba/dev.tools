import PropTypes from 'prop-types';

const BasicBtn = ({
  onClick,
  btnText,
  classNames = '',
  styles = {},
  btnDisabled,
}) => {
  // Nothing fancy just added styles

  return (
    <button
      onClick={onClick}
        className={classNames + ' btn'} // Some Tailwind class names require the !important modifier due to the btn class
      style={styles}
      disabled={btnDisabled}
    >{btnText}</button>
  );
};

BasicBtn.propTypes = {
  onClick: PropTypes.func.isRequired,
  btnText: PropTypes.string.isRequired,
  className: PropTypes.string,
  styles: PropTypes.object,
  btnDisabled: PropTypes.bool,
}

export default BasicBtn;