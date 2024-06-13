import PropTypes from 'prop-types';

export default function Selector({
   title = "",
   value,
   values,
   handleClick,
   styles = {}
}) {
   return (
      <div className="flex gap-4 items-center">
         {title && (
            <p className="block text-lg w-full font-medium leading-6 text-black">
               {title}
            </p>
         )}
         <select
            style={styles}
            value={value}
            className={`block w-fit rounded-md border-0 py-1.5 pl-3 pr-10
                    text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2
                    focus:ring-indigo-600 sm:text-sm sm:leading-6`}
            onChange={handleClick}
         >
            {values.map((value, index) => (
               <option className="text-black" key={index} value={value.value}>{value.label}</option>
            ))}
         </select>
      </div>
   );
}
Selector.propTypes = {
   title: PropTypes.string,
   value: PropTypes.string.isRequired,
   values: PropTypes.arrayOf(PropTypes.shape({
      label: PropTypes.string.isRequired,
      value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
   })).isRequired,
   handleClick: PropTypes.func.isRequired,
   styles: PropTypes.object,
};