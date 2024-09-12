import PropTypes from "prop-types";
import clsx from "clsx";

const ToolBox = ({
   title,
   children,
   tailwindStyles = '',
   boxWidth = '50%',
   controls,
   controlsPositionEnd = false,
   border, // for development purpose
}) => {

   const tailwind = {
      main: clsx(
         'w-1/2 h-full ',
         border && 'border-2 border-red-500',
      ),
      controlsDiv: "flex mb-4 gap-4 justify-between block",
      title: "font-bold text-xl",
      controls: clsx(
         'flex gap-4 items-center w-full',
         controlsPositionEnd && 'justify-end',
      ),
      content: clsx(
         "w-full h-full p-2 overflow-y-auto ",
         tailwindStyles,
      )
   }

   return (
      <div className={tailwind.main} style={{ width: boxWidth, }}
      >
         <div className={tailwind.controlsDiv}>
            <p className={tailwind.title}>{title}: </p>
            {controls && (<div className={tailwind.controls}>
               {controls}
            </div>)}
         </div>
         <div className={tailwind.content}>
            {children}
         </div>
      </div>
   )
}

ToolBox.propTypes = {
   title: PropTypes.string.isRequired,
   children: PropTypes.node.isRequired,
   tailwind: PropTypes.string,
   controls: PropTypes.node,
   boxWidth: PropTypes.string,
   controlsPositionEnd: PropTypes.bool,
   border: PropTypes.bool,
};

export default ToolBox;