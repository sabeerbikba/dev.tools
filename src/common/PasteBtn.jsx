import PropTypes from 'prop-types';

const PasteBtn = ({
   onPaste,
   btnText = 'Paste',
   styles = {},
   btnDisabled,
   // svg,
}) => {
   const handlePasteBtn = async () => {
      try {
         const text = await navigator.clipboard.readText();
         onPaste(text);
      } catch (error) {
         console.error('Failed to read clipboard: ', error);
      }
   };

   const btnStyle = {
      color: 'white', height: '40px', width: '120px', borderRadius: '10px',
      backgroundColor: btnDisabled ? '#4446a6' : '#6366f1', ...styles,
   };

   return (
      <button
         onClick={handlePasteBtn}
         style={btnStyle}
         disabled={btnDisabled}
      >
         {btnText}
         {/* TODO: add svg */}
         {/* {svg && (
            <svg
               style={{ display: 'inline', position: 'relative', left: '10px' }}
               xmlns="http://www.w3.org/2000/svg"
               fill="none" viewBox="0 0 24 24"
               strokeWidth={1.5} stroke="currentColor"
               className="w-6 h-6"
            >
               <svg
                  style={{ display: 'inline', position: 'relative', left: '10px' }}
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none" viewBox="0 0 24 24"
                  strokeWidth={1.5} stroke="currentColor"
                  className="w-6 h-6"
               >
                  <path
                     strokeLinecap="round"
                     strokeLinejoin="round"
                     d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 0 1-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 0 1 1.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 0 0-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 10.375H9.375a1.125 1.125 0 0 1-1.125-1.125v-9.25m12 6.625v-1.875a3.375 3.375 0 0 0-3.375-3.375h-1.5a1.125 1.125 0 0 1-1.125-1.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H9.75"
                  /></svg>
            </svg>
         )} */}
      </button>
   )
};

PasteBtn.propTypes = {
   onPaste: PropTypes.func.isRequired,
   btnText: PropTypes.string,
   styles: PropTypes.object,
   btnDisabled: PropTypes.bool,
   // svg: PropTypes.bool,
}

export default PasteBtn;
