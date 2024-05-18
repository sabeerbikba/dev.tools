export default function Test() {
   const [showOptions, setShowOptions] = useState(false);
   return (
      <>
         <button style={{ ...styles.btns, backgroundColor: 'rgb(99, 102, 241)', color: 'white', borderRadius: '7px', }}>
            Options
         </button>
         {!showOptions ? (
            <MonacoEditor
               language="javascript"
               theme="vs-dark"
               value={outputCode}
               options={{ readOnly: true, ...options }}
            />
         ) : (
            <div className="outsideToEscape" style={{ height: "100%", overflow: 'scroll', width: '100%', color: '#d5d5d5' }}>
               <div className="info" id="config-container"></div>
            </div>
         )};
      </>
   )
}