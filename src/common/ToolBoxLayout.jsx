import PropTypes from "prop-types";
import cn from "@/utils/cn"

const ToolBoxLayout = ({
   children,
   height = '100vh',
   classNames
}) => {
   return (
      <div
         className={cn("flex gap-4 p-4 size-full text-white", classNames)}
         style={{ minWidth: '1620px', height, overflow: 'hidden' }}
      >
         {children}
      </div>
   );
}

ToolBoxLayout.propTypes = {
   children: PropTypes.node.isRequired,
   height: PropTypes.string,
   classNames: PropTypes.string,
}

export default ToolBoxLayout;
