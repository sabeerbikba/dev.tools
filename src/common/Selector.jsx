export default function Selector({ title, values, handleClick }) {
    return (
        <div className="flex gap-4 items-center">
            {title && (
                <p className="block text-lg w-full font-medium leading-6 text-black">
                    {title}
                </p>
            )}
            <select
                className={`block w-fit rounded-md border-0 py-1.5 pl-3 pr-10
                    text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2
            
                    focus:ring-indigo-600 sm:text-sm sm:leading-6`}
                onChange={(e) => {
                    const selectedValue = values.find(
                        (value) => value.label === e.target.value
                    );
                    if (selectedValue) {
                        handleClick(selectedValue);
                    }
                }}
            >
                {values.map((value) => (
                    <option className="text-black" key={value.value}>{value.label}</option>
                ))}
            </select>
        </div>
    );
}
