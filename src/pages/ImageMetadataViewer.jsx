import { useRef, useReducer } from 'react';
import PropTypes from 'prop-types';
import exifr from 'exifr';
import { Prism as JsonSyntaxHighlighter } from 'react-syntax-highlighter';
import { a11yDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

import cn from "@/utils/cn";
import ToolBoxLayout from '@/common/ToolBoxLayout';
import ToolBox from '@/common/ToolBox';
import Btn from '@/common/BasicBtn';

const actionTypes = {
   UPDATE_VALUE: 'UPDATE_VALUE',
};

const initialState = {
   imageUrl: '',
   metadata: '',
   error: '',
};

const reducer = (state, action) => {
   switch (action.type) {
      case actionTypes.UPDATE_VALUE: {
         return { ...state, [action.field]: action.value };
      }
      default: {
         console.error('Unknown action: ' + action.type);
         console.warn('you not added action.type: ' + action.type + ' add and try');
         return state;
      }
   }
};

const ImageMetadataViewer = () => {
   const imgInputRef = useRef('');
   const [state, dispatch] = useReducer(reducer, initialState);
   const {
      imageUrl,
      metadata,
      error,
   } = state;


   // //   Functions for Updating Reducer   // //

   const updateValues = (values) => {
      Object.keys(values).forEach((field) => {
         dispatch({ type: actionTypes.UPDATE_VALUE, field, value: values[field] });
      });
   };


   // //   Event Handlers   // //

   const imgInputClick = () => {
      if (imgInputRef.current) {
         imgInputRef.current.click();
      }
   };

   const handleImageChange = async (event) => {
      const file = event.target.files[0];
      if (file) {
         try {
            const imageUrl = URL.createObjectURL(file);
            const supportedFormats = ['image/jpeg', 'image/tiff', 'image/webp', 'image/heic', 'image/heif'];
            if (!supportedFormats.includes(file.type)) {
               throw new Error('Unsupported file format');
            }

            const exifData = await exifr.parse(file);

            if (exifData) {
               updateValues({
                  metadata: exifData,
                  error: '',
                  imageUrl
               });
            } else {
               throw new Error('No EXIF data found in the image');
            }
         } catch (error) {
            console.error('Error extracting metadata:', error.message);
            updateValues({
               metadata: '',
               error: error.message || 'Failed to extract metadata',
               imageUrl: '',
            });
         }
      } else {
         console.error('No file selected');
         updateValues({
            metadata: '',
            error: 'No file selected',
            imageUrl: '',
         });
      }
   };

   const tailwind = {
      input: {
         selectImgBtn: 'mx-auto block !w-44',
         imgPreview: 'border-2 border-gray-500 rounded-[10px] h-[91%] flex content-center justify-center flex-col mx-0 my-2.5 p-[5px]',
         imgPreviewImg: 'object-contain max-h-full max-w-full',
      },
      output: "border border-gray-400 rounded-lg h-[96%] overflow-y-auto",
   };

   return (
      <ToolBoxLayout height=''>
         <ToolBox title='Input'>
            <input
               type="file"
               ref={imgInputRef}
               // accept=".jpeg, .jpg, .tiff, .webp, .heic, .heif"
               accept="image/*"
               onChange={handleImageChange}
               hidden
            />
            <Btn
               btnText='Select Image'
               onClick={imgInputClick}
               classNames={tailwind.input.selectImgBtn}
            />
            <div className={tailwind.input.imgPreview}>
               {imageUrl === '' ? (
                  <Info text="Image Preview" />
               ) : (
                  <img
                     src={imageUrl}
                     className={tailwind.input.imgPreviewImg}
                  />
               )}
            </div>
         </ToolBox>

         <ToolBox title='Output'>
            <div className={tailwind.output}>
               {error ? (
                  <Info text={error} colorRed />
               ) : metadata === "" ? (
                  <Info text="Select Image" />
               ) : (
                  <JsonSyntaxHighlighter
                     style={a11yDark}
                     language='json'
                  >
                     {JSON.stringify(metadata, '', 2)}
                  </JsonSyntaxHighlighter>
               )}
            </div>
         </ToolBox>
      </ToolBoxLayout>
   );
};

const Info = ({ text, colorRed }) => (
   <div className={
      cn(
         "flex items-center justify-center h-full text-center text-xl",
         colorRed && "text-red-500",
      )}
   >
      <p>{text}</p>
   </div>
);

Info.propType = {
   text: PropTypes.string.isRequired,
   colorRed: PropTypes.bool,
};

export default ImageMetadataViewer;
