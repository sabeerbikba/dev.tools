import PropTypes from "prop-types";
import cn from "@/utils/cn";

const BasicBtn = ({
  btnText,
  onClick,
  classNames = "",
  styles = {},
  btnDisabled,
}) => (
  <button
    onClick={onClick}
    className={cn(classNames, "btn cursor-pointer capitalize")} // Some Tailwind class names require the !important modifier due to the btn class
    style={styles}
    disabled={btnDisabled}
  >
    {btnText}
  </button>
);

BasicBtn.propTypes = {
  btnText: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
  className: PropTypes.string,
  styles: PropTypes.object,
  btnDisabled: PropTypes.bool,
};

export default BasicBtn;
