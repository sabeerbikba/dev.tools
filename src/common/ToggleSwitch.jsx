import PropTypes from "prop-types";
import cn from "@/utils/cn";

const ToggleSwitch = ({
  enabled,
  onClick,
  falseText,
  trueText,
  className,
  smallVersion,
}) => (
  <div
    className={cn((trueText || falseText) && "flex items-center", className)}
    onClick={onClick}
  >
    {falseText && <span>Editor</span>}
    <div
      className={cn(
        "flex items-center bg-gray-300 rounded-full p-1 cursor-pointer transition-colors duration-300 mx-2",
        smallVersion
          ? "w-7 h-4 relative -z-20"
          : "w-14 h-8 ",
        enabled ? "bg-indigo-500" : "bg-gray-400"
      )}
    >
      <div
        className={cn(
          "bg-white rounded-full shadow-md transform transition-transform duration-300",
          smallVersion ? "size-3 -z-10" : "size-6",
          enabled
            ? smallVersion
              ? "translate-x-3"
              : "translate-x-6"
            : "translate-x-0"
        )}
      />
    </div>
    {trueText && <span>Preview</span>}
  </div>
);

ToggleSwitch.propTypes = {
  enabled: PropTypes.bool.isRequired,
  onClick: PropTypes.func.isRequired,
  falseText: PropTypes.string,
  trueText: PropTypes.string,
  className: PropTypes.string,
  smallVersion: PropTypes.bool,
};

export default ToggleSwitch;
