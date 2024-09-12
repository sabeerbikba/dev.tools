import PropTypes from "prop-types";

const ToolBoxLayout = ({ children }) => {
   return (<div className="flex gap-4 p-4 w-full h-full text-white"
      style={{ minWidth: '1620px', height: '100vh', overflow: 'hidden' }}
   >{children}</div>);
}

ToolBoxLayout.propTypes = {
   children: PropTypes.node.isRequired,
}

export default ToolBoxLayout;