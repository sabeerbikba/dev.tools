export default function Test2() {
   return (
      <div>
         <label>
            <span>Target:</span>
            <select>
               <option value="ES3">ES3</option>
               <option value="ES5">ES5</option>
               <option value="ES2015">ES2015</option>
               <option value="ES2016">ES2016</option>
               <option value="ES2017">ES2017</option>
               <option value="ES2018">ES2018</option>
               <option value="ES2019">ES2019</option>
               <option value="ES2020">ES2020</option>
               <option value="ES2021">ES2021</option>
               <option value="ES2022">ES2022</option>
               <option value="ESNext">ESNext</option>
               <option value="JSON">JSON</option>
            </select>
            <span>
               <p>
                  Set the JavaScript language version for emitted JavaScript and include
                  compatible library declarations.
               </p>
            </span>
         </label>
         <label>
            <span>JSX:</span>
            <select>
               <option value="None">None</option>
               <option value="Preserve">Preserve</option>
               <option value="React">React</option>
               <option value="ReactNative">ReactNative</option>
               <option value="ReactJSX">ReactJSX</option>
               <option value="ReactJSXDev">ReactJSXDev</option>
            </select>
            <span>
               <p>Specify what JSX code is generated.</p>
            </span>
         </label>
         <label>
            <span>Module:</span>
            <select>
               <option value="None">None</option>
               <option value="CommonJS">CommonJS</option>
               <option value="AMD">AMD</option>
               <option value="UMD">UMD</option>
               <option value="System">System</option>
               <option value="ES2015">ES2015</option>
               <option value="ES2020">ES2020</option>
               <option value="ES2022">ES2022</option>
               <option value="ESNext">ESNext</option>
               <option value="Node16">Node16</option>
               <option value="NodeNext">NodeNext</option>
               <option value="Preserve">Preserve</option>
            </select>
            <span>
               <p>Specify what module code is generated.</p>
            </span>
         </label>
      </div>
   )
};