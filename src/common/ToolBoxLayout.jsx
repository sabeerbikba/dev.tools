import PropTypes from "prop-types";

const ToolBoxLayout = ({
   children,
   height = '100vh',
}) => {
   return (
      <div
         className="flex gap-4 p-4 w-full h-full text-white"
         style={{ minWidth: '1620px', height: height, overflow: 'hidden' }}
      >
         {children}
      </div>
   );
}

ToolBoxLayout.propTypes = {
   children: PropTypes.node.isRequired,
   height: PropTypes.string,
}

export default ToolBoxLayout;
