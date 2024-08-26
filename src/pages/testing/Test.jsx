import { useState, useEffect, useRef } from 'react';
import { decode, isBlurhashValid } from 'blurhash';

import CopyBtn from '../../common/CopyBtn';
import { Fallback } from '../../components/SuspenseWithFallback';

export default function Test() {
   const imgInputRef = useRef(null);
   const [imgSrc, setImgSrc] = useState('');
   const [imgName, setImgName] = useState('');
   const [blurHash, setBlurHash] = useState('');
   const [imgWidth, setImgWidth] = useState(0);
   const [imgHeight, setImgHeight] = useState(0);
   const [isValidBlurhash, setIsValidBlurhash] = useState(false);
   const [componentX, setComponentX] = useState(32);
   const [componentY, setComponentY] = useState(32);
   const [isBlurhashIsLoading, setIsBlurhashIsLoading] = useState(false);
   const [isAlreadyImgHashProcessing, setIsAlreadyImgHashProcessing] = useState(false);
   const [jsonOutput, setJsonOutput] = useState('');

   console.log(
      'isAlreadyImgHashProcessing',
      isAlreadyImgHashProcessing
   );

   const imgInputClicked = () => {
      if (imgInputRef.current) {
         imgInputRef.current.click();
      }
   };

   const getFileNameFromPath = (path) => {
      return path.split(/[/\\]/).pop();
   };

   const handleImageChange = (event) => {
      if (!isAlreadyImgHashProcessing) {
         setIsBlurhashIsLoading(true);
         setIsAlreadyImgHashProcessing(true);
         const file = event.target.files[0];
         setImgName(getFileNameFromPath(event.target.value));

         if (file) {
            const reader = new FileReader();

            reader.onload = () => {
               const img = new Image();
               img.src = reader.result;

               img.onload = () => {
                  setImgWidth(img.width);
                  setImgHeight(img.height);
                  setImgSrc(img.src);

                  const canvas = document.createElement('canvas');
                  canvas.width = img.width;
                  canvas.height = img.height;
                  const context = canvas.getContext('2d');
                  context.drawImage(img, 0, 0);

                  const imageData = context.getImageData(componentX, componentY, img.width, img.height);

                  import('blurhash').then((blurhashModule) => {
                     const blurHashValue = blurhashModule.encode(
                        imageData.data,
                        imageData.width,
                        imageData.height,
                        4, 4 // Adjust this for blur intensity
                     );

                     setBlurHash(blurHashValue);
                     setIsBlurhashIsLoading(false);
                     setIsAlreadyImgHashProcessing(false);
                  }).catch(() => {
                     setIsBlurhashIsLoading(false); // Handle errors by resetting the loading state
                     setIsAlreadyImgHashProcessing(false);
                  });
               };
            };

            reader.readAsDataURL(file);
         } else {
            setIsAlreadyImgHashProcessing(false);
            setIsBlurhashIsLoading(false);
         }
      } else {
         // TODO: not working this block code
         // alert('image already processing please wait');
         toast.warn(warningText, {
            // onOpen: () => UPDATE_INPUT('finalOutputBtnDisalbed', true),
            position: 'bottom-right',
            theme: 'dark',
            autoClose: time,
            // onClose: () => UPDATE_INPUT('finalOutputBtnDisalbed', false),
         });
      }
   };

   const handleJson = () => {
      setJsonOutput(`{
   imgName: "${imgName}",
   blurhash: "${blurHash}",
   width: ${imgWidth},
   height: ${imgHeight},
}`);
   }

   useEffect(() => {
      if (isBlurhashValid(blurHash)) {
         setIsValidBlurhash(true);
         handleJson();
      }
   }, [blurHash])


   const styles = {
      main: 'monaco-container', inputHeadFlex: "flex gap-4 items-center mb-3", inputHeadText: "font-bold text-xl text-white",
      outputDiv: 'monaco-style monaco-result', btns: { height: '37px', width: '120px' },
      configMain: { height: "100%", overflow: 'scroll', width: '100%', color: '#d5d5d5' }, dropdownsDiv: { display: 'flex', margin: '10px 0' },
      dropdownsLabel: { flex: '1', margin: '5px', }, dropdownsSelect: { marginLeft: '12px', marginTop: '10px', height: '20px', borderRadius: '4px', textAlign: 'center', color: 'black', minWidth: '100px' },
      checkboxDiv: { borderBottom: '2px solid white' }, checkboxH4: { fontSize: '17.5px', fontWeight: 'bold' }, checkboxOl: { display: 'flex', flexWrap: 'wrap', marginBottom: '20px' },
      checkboxLi: { display: 'flex', width: '49%' }, checkboxLabel: { position: "relative", width: "100%", margin: 'auto 0' }, checkboxLabelSpan: { width: '100%', display: 'inline-block', fontWeight: 'bold', fontStyle: 'oblique' },
      btnsDiv: { display: 'flex', justifyContent: 'space-around', margin: '15px 0' },
      btnsClass: "rounded-md bg-indigo-500 px-3.5 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500",
      consoleDiv: { border: '2px solid grey', borderRadius: '5px', overflowY: 'scroll', height: '37%', color: 'white', backgroundColor: '#232327' },
      consoleH2: { fontSize: '20px', margin: '0 8px', paddingLeft: '4px', borderBottom: '1px solid white' },




   }


   return (
      <div className={styles.main} style={{ minWidth: '1620px', }}>

         <div className={styles.outputDiv} style={{ height: '92%', width: '40%' }}>
            <div className={styles.inputHeadFlex}>
               <p className={styles.inputHeadText}>Input: </p>
            </div>
            <div style={{ border: '2px solid red' }} className="h-full w-full">
               <br />
               <br />
               <div style={{ fontSize: '18px', color: 'white', textAlign: 'center' }}>Incomplete: Need to add styles added soon.. ⚠️</div>
               <br />
               <br />
               <br />
               <br />
               <button onClick={imgInputClicked}
                  style={{ backgroundColor: 'blue', color: 'white' }}
                  disabled={isAlreadyImgHashProcessing}
               >Select Image</button>
               <br />
               <label className='text-white' htmlFor="imgName">image name:{' '}</label>
               <input type="text" name='imgName' value={imgName} readOnly />
               <input type="file" accept="image/*" onChange={handleImageChange} ref={imgInputRef}
                  disabled={isAlreadyImgHashProcessing}
                  hidden />
               {/* <button onClick={e => setIsAlreadyImgHashProcessing(!isAlreadyImgHashProcessing)}>disable input</button> */}
               <br />
               <label className='text-white' htmlFor="hash">image hash:{' '}</label>
               <input type="text" name='hash' value={blurHash} onChange={e => setBlurHash(e.target.value)} />
               <CopyBtn copyText={blurHash} />
               <br />
               <span className='text-white'>width * height</span>
               <br />
               <input type="number" name="imgWidth" value={imgWidth} readOnly />
               <br />
               <input type="number" name="imgHeight" value={imgHeight} readOnly />
               <br />
               <br />
               <span className='text-white'>componentX * componentY</span>
               <br />
               <input type="text" name='componentX' value={componentX} onChange={e => setComponentX(e.target.value)} />
               <br />
               <input type="text" name='componentY' value={componentY} onChange={e => setComponentY(e.target.value)} />
               <img src={imgSrc} width={imgWidth} height={imgHeight} />

            </div>
         </div>


         <div className={styles.outputDiv} style={{ height: '92%', width: '59%' }}>
            <div className={styles.inputHeadFlex}>
               <p className={styles.inputHeadText}>Preview: </p>
            </div>
            <div style={{ border: '2px solid red' }} className="h-full w-full">
               {isValidBlurhash && (
                  <div style={{ width: '100%', height: '60%', border: '1px solid green' }}>
                     {isBlurhashIsLoading ? (
                        // <div className='text-white'>image loading</div>
                        <Fallback text='Loading Image' height='100%' />
                     ) : (
                        <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center' }}>
                           <BlurhashToImage blurhash={blurHash} width={imgWidth} height={imgHeight} />
                        </div>
                     )}
                  </div>
               )}


               {jsonOutput && (<pre style={{ fontSize: '22px', fontFamily: 'monospace' }}>{jsonOutput}</pre>)}
               <CopyBtn copyText={jsonOutput} />
            </div>
         </div>

      </div>
   );
}


const BlurhashToImage = ({ blurhash, width, height }) => {
   const [imageSrc, setImageSrc] = useState('');

   useEffect(() => {
      if (blurhash) {
         const canvas = document.createElement('canvas');
         canvas.width = width;
         canvas.height = height;
         const ctx = canvas.getContext('2d');

         if (ctx) {
            const pixels = decode(blurhash, width, height);
            const imageData = ctx.createImageData(width, height);
            imageData.data.set(Uint8ClampedArray.from(pixels));
            ctx.putImageData(imageData, 0, 0);

            const dataURL = canvas.toDataURL('image/png');
            setImageSrc(dataURL);
         } else {
            console.error('Failed to get 2D context from canvas');
         }
      }
   }, [blurhash, width, height]);

   return (
      <>
         {imageSrc && <img src={imageSrc} alt="Blurhash" />}
      </>
   );
};
