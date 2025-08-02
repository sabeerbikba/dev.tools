import {
   useState,
   useReducer,
   useEffect,
   useRef,
   useMemo,
   useCallback,
   useTransition,
   memo,
} from 'react';
import PropTypes from 'prop-types';
import { toast } from 'react-toastify';
import { decode, isBlurhashValid } from 'blurhash';
import { Prism as JsonSyntaxHighlighter } from 'react-syntax-highlighter';
import { a11yDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

import cn from "@/utils/cn";
import ToolBoxLayout from '@/common/ToolBoxLayout';
import ToolBox from '@/common/ToolBox';
import Input from '@/common/Input';
import CopyBtn from '@/common/CopyBtn';
import PasteBtn from '@/common/PasteBtn';
import Btn from '@/common/BasicBtn';
import EndLink from '@/common/Endink';

import { Fallback } from '@/components/SuspenseWithFallback';
import useLocalStorageState from '@/hooks/useLocalStorageState'

const constantTailwind = {
   heading: 'text-center text-xl underline decoration-blue-800	decoration-2 underline-offset-[3.2px]',
   imgInfo: {
      main: 'flex mb-6 text-start',
      title: 'w-1/5',
      value: 'border-b-[1px] w-[65%] text-center px-[30px] py-[1.5px] overflow-hidden text-ellipsis',
   },
   blurhashCanvas: {
      error: 'text-red-600',
      canvasDiv: 'object-contain max-h-full max-w-full m-auto',
      canvas: 'w-full h-full',
   }
};

const rgbDataURL = (r, g, b) => {
   // Github: https://github.com/vercel/next.js/blob/canary/examples/image-component/app/color/page.tsx
   // Pixel GIF code adapted from https://stackoverflow.com/a/33919020/266535

   const keyStr =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";

   const triplet = (e1, e2, e3) =>
      keyStr.charAt(e1 >> 2) +
      keyStr.charAt(((e1 & 3) << 4) | (e2 >> 4)) +
      keyStr.charAt(((e2 & 15) << 2) | (e3 >> 6)) +
      keyStr.charAt(e3 & 63);

   return `data:image/gif;base64,R0lGODlhAQABAPAA${triplet(0, r, g) + triplet(b, 255, 255)
      }/yH5BAAAAAAALAAAAAABAAEAAAICRAEAOw==`;
};

const actionTypes = {
   UPDATE_VALUE: 'UPDATE_VALUE',
   UPDATE_OBJECT_VALUE: 'UPDATE_OBJECT_VALUE',
};

const initialState = {
   imgSrc: '',
   imgName: '',
   imgSize: 0,
   imgDimensions: { width: 0, height: 0 },

   dominatedColor: 'not_set',
   averageColor: 'not_set',
   imgSelectedColor: 'not_set',
   colorPalette: {},
   colorPaletteSelected: 0,

   blurhash: '',
   isBlurhashImgProcessing: false,
   isSuggestionBoxScrolling: false,
   tmpCanvasDimensions: { width: 0, height: 0 },
   isBlurhash: { editing: false, edited: false },
   blurhashValidation: { isValid: false, errorReason: '' },
   blurhashProcessedStats: { counts: 0, inSize: 0 }, // inSize not using anywhere
   blurhashComponent: { componentX: 4, componentY: 3 },
};

const reducer = (state, action) => {
   switch (action.type) {
      case actionTypes.UPDATE_VALUE: {
         return { ...state, [action.field]: action.value };
      }
      case actionTypes.UPDATE_OBJECT_VALUE: {
         return {
            ...state,
            [action.payload.field]: {
               ...state[action.payload.field],
               ...action.payload.value,
            },
         };
      }
      default: {
         console.error('Unknown action: ' + action.type);
         console.warn('you not added action.type: ' + action.type + ' add and try');
         return state;
      }
   }
};

const ImgPlaceholderGen = () => {
   const imgInputRef = useRef(null);
   const [isChangingTab, startTabChangingTransition] = useTransition();
   const [state, dispatch] = useReducer(reducer, initialState);

   const {
      // Used in both side
      imgSrc,
      imgName,
      imgSize, // in bytes
      imgDimensions,

      // Used in Color side
      dominatedColor,
      averageColor,
      imgSelectedColor,
      colorPalette,
      colorPaletteSelected,

      // Used in Blurhash side
      blurhash,
      isBlurhashImgProcessing,
      isSuggestionBoxScrolling,
      tmpCanvasDimensions, // State to store the temporary width and height of the Blurhash canvas when click Edit Blurhash button
      isBlurhash,
      blurhashValidation, // Store isBlurhashValid() function values using useEffet:
      blurhashProcessedStats,
      blurhashComponent,
   } = state;

   const [outputOptionsRadio, setOutputOptionsRadio] = useLocalStorageState(
      'ImgPlaceholderGen.:outputOptionsRadio', 'color');
   const [localBlurhash, setLocalBlurhash] = useLocalStorageState(
      'ImgPlaceholderGen.:localBlurhash', { blurhash: '', width: 0, height: 0 });

   // Created a temporary object to batch updates to the localBlurhash state.
   // This ensures that all updates are applied together, avoiding potential issues
   // where intermediate updates could result in storing 'undefined' in local storage. 
   let updatedBlurhashState = { ...localBlurhash };

   const selectedColor = colorPalette[colorPaletteSelected];
   const isExtractedColorsBtnsDisabled = selectedColor == undefined || colorPalette.length === 0;

   const isTooltipVisibleForDimensionChange =
      isBlurhash.editing && localBlurhash.blurhash != blurhash && blurhashValidation.isValid;
   const isTooltipHiddenForMatchingDimensions =
      tmpCanvasDimensions.width === localBlurhash.width && tmpCanvasDimensions.height === localBlurhash.height;
   const shouldShowDimensionTooltip = isTooltipVisibleForDimensionChange && isTooltipHiddenForMatchingDimensions;
   const canvasDimensions = {
      width: imgDimensions.width ? imgDimensions.width : isBlurhash.edited ?
         localBlurhash.width : tmpCanvasDimensions.width,
      height: imgDimensions.height ? imgDimensions.height : isBlurhash.edited ?
         localBlurhash.height : tmpCanvasDimensions.height,
   };

   const blurhashOutputJson = `{
   imgName: "${imgName}",
   blurhash: "${blurhash}",
   width: ${imgDimensions.width || tmpCanvasDimensions.width},
   height: ${imgDimensions.height || tmpCanvasDimensions.height},
}`;


   // //   Utility Functions   // //

   function rgbToHex(r, g, b) {
      return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1).toUpperCase()}`;
   }

   function generateColorJson(rgbArray) {
      if (!Array.isArray(rgbArray) || rgbArray.length === 0) {
         return {};
      }

      const result = {};
      rgbArray.forEach((rgb, index) => {
         const [r, g, b] = rgb;
         result[index + 1] = {
            hex: rgbToHex(r, g, b),
            rgb: [r, g, b],
         };
      });

      return result;
   }

   const customStringify = (obj) => {
      return JSON.stringify(obj, (_, value) => {
         if (Array.isArray(value)) {
            return `[ ${value.join(', ')} ]`;
         }
         return value;
      }, 1);
   }

   const formatFileSize = (byte) => {
      return byte < 1024
         ? `${byte} bytes`
         : byte < 1024 * 1024
            ? `${(byte / 1024).toFixed(2)} KB`
            : `${(byte / (1024 * 1024)).toFixed(2)} MB`;
   };

   const showErrorToast = () => {
      toast.warn('Something going wrong, Try again!', {
         position: 'bottom-right',
         theme: 'dark',
         autoClose: 2400,
      });
   };

   const getBlurhashImgString = (blurhash, width, height) => {
      const pixels = decode(blurhash, width, height);

      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');

      const imageData = ctx.createImageData(width, height);
      imageData.data.set(pixels);
      ctx.putImageData(imageData, 0, 0);

      return canvas.toDataURL();
   };

   const openBase64InNewTab = (base64String) => {
      // `data` URLs are not allowed to be opened with `window.open(url, '_blank');` or `window.location.href = url;` due to security restrictions.
      // This approach avoids these restrictions and allows the image to be opened directly in a new tab.

      const byteCharacters = atob(base64String.split(',')[1]);
      const byteNumbers = new Array(byteCharacters.length)
         .fill(0).map((_, i) => byteCharacters.charCodeAt(i));
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: 'image/png' });

      const blobUrl = URL.createObjectURL(blob);
      window.open(blobUrl, '_blank');
   };


   // //   Functions for Updating State or Reducer   // //

   const updateValues = (values) => {
      Object.keys(values).forEach((field) => {
         dispatch({ type: actionTypes.UPDATE_VALUE, field, value: values[field] });
      });
   };

   const updateObjectValue = (field, valueUpdater) => {
      const currentValue = state[field];
      const updatedValue = typeof valueUpdater === 'function' ? valueUpdater(currentValue) : valueUpdater;

      dispatch({
         type: actionTypes.UPDATE_OBJECT_VALUE,
         payload: { field, value: updatedValue },
      });
   };

   const updateBlurhashProcessedStats = (imgSize) => {
      updateObjectValue('blurhashProcessedStats', (prevState) => ({
         counts: prevState.counts + 1,
         inSize: prevState.inSize + imgSize,
      }));
   };

   const handleEditSaveBlurhash = () => {
      if (blurhashValidation.isValid === false) {

         // when user cancel editing
         if (blurhashProcessedStats.counts >= 1 || isBlurhash.edited) {
            updateValues({ blurhash: localBlurhash.blurhash });
            updateObjectValue('tmpCanvasDimensions', { width: imgDimensions.width, height: imgDimensions.height });
         }
      } else {
         if (localBlurhash.blurhash !== blurhash) {
            updateObjectValue('isBlurhash', { edited: true });
            setLocalBlurhash({ blurhash, width: tmpCanvasDimensions.width, height: tmpCanvasDimensions.height });

            updateValues({
               imgName: '',
               imgSize: 0,
               imgSrc: '',
               imgDimensions: { width: 0, height: 0 },
            });
         } else {
            updateValues({ blurhash: localBlurhash.blurhash });
         }
      }
      updateObjectValue('isBlurhash', { editing: !isBlurhash.editing });
   };


   // //   Event Handlers   // //

   const handlePaste = (value) => {
      updateValues({ blurhash: value });
   };

   const imgInputClick = () => {
      if (imgInputRef.current) {
         imgInputRef.current.click();
      }
   };

   const handleImageChange = (event) => {
      const file = event.target.files[0];

      if (file) {
         updateValues({
            imgName: event.target.value.split(/[/\\]/).pop(),
            imgSize: file.size,
         });
         if (outputOptionsRadio === 'blurhash') {
            updateValues({
               isBlurhashImgProcessing: true,
               blurhash: '',
            });
         } else {
            updateValues({ // clear the color cards and pallete
               dominatedColor: 'not_set',
               averageColor: 'not_set',
               imgSelectedColor: 'not_set',
               colorPalette: {},
            });
         }
         updateValues({ imgSrc: '' });

         const reader = new FileReader();
         reader.onloadend = () => {
            const img = new Image();
            img.src = reader.result;
            img.crossOrigin = "Anonymous";
            img.onload = () => {
               const { width, height } = img;
               updateValues({
                  imgSrc: reader.result,
                  imgDimensions: { width, height },
               });
               updateObjectValue('tmpCanvasDimensions', { width, height });

               updatedBlurhashState.width = width;
               updatedBlurhashState.height = height;

               getBlurHash(img)
               extractDominantColor(img);
               getAverageColor(img);
               extractColors(img.src);
            };
         };
         reader.readAsDataURL(file);
      }
   };

   const handleImageClick = (event) => {
      const img = event.currentTarget;
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      // Because of 'objectFit: contain', the image scales while maintaining its aspect ratio.
      // This can create empty space (padding) around the image inside its container.
      // Need to calculate the actual visible area of the image (excluding empty spaces).

      const imgAspectRatio = img.naturalWidth / img.naturalHeight;
      const containerAspectRatio = img.width / img.height;
      let drawWidth, drawHeight, offsetX = 0, offsetY = 0;

      if (imgAspectRatio > containerAspectRatio) {
         drawWidth = img.width;
         drawHeight = img.width / imgAspectRatio;
         offsetY = (img.height - drawHeight) / 2;
      } else {
         drawWidth = img.height * imgAspectRatio;
         drawHeight = img.height;
         offsetX = (img.width - drawWidth) / 2;
      }

      const rect = img.getBoundingClientRect();
      const x = event.clientX - rect.left - offsetX;
      const y = event.clientY - rect.top - offsetY;

      if (x < 0 || y < 0 || x > drawWidth || y > drawHeight) {
         return;
      }

      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

      const naturalX = (x / drawWidth) * img.naturalWidth;
      const naturalY = (y / drawHeight) * img.naturalHeight;
      const pixelData = ctx.getImageData(naturalX, naturalY, 1, 1).data;

      const RGB = { r: pixelData[0], g: pixelData[1], b: pixelData[2] };
      updateValues({ imgSelectedColor: RGB });
   };


   // //   Main Functions   // //

   const getBlurHash = (img) => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const context = canvas.getContext('2d');
      context.drawImage(img, 0, 0);

      const imageData = context.getImageData(0, 0, img.width, img.height);

      // TODO: can be used worker here 
      import('blurhash').then((blurhashModule) => {
         const blurHashValue = blurhashModule.encode(
            imageData.data,
            imageData.width,
            imageData.height,
            blurhashComponent.componentX,
            blurhashComponent.componentY,
         );

         updateObjectValue('isBlurhash', { edited: false });
         updatedBlurhashState.blurhash = blurHashValue;
         setLocalBlurhash(updatedBlurhashState);
         updateBlurhashProcessedStats(imgSize);
         updateValues({
            blurhash: blurHashValue,
            isBlurhashImgProcessing: false,
         });

      }).catch(() => {
         showErrorToast();
         updateValues({ isBlurhashImgProcessing: false });
      });
   }

   const getAverageColor = (img) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;
      let r = 0, g = 0, b = 0;

      for (let i = 0; i < data.length; i += 4) {
         r += data[i];
         g += data[i + 1];
         b += data[i + 2];
      }

      const pixelCount = data.length / 4;
      r = Math.floor(r / pixelCount);
      g = Math.floor(g / pixelCount);
      b = Math.floor(b / pixelCount);

      const RGB = { r, g, b };
      updateValues({ averageColor: RGB });
   };

   const extractDominantColor = (img) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');

      if (!ctx) return;

      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);

      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const { data } = imageData;
      const colorCounts = {};
      let maxCount = 0;
      let dominantColor = '';

      for (let i = 0; i < data.length; i += 4) {
         const rgb = `${data[i]},${data[i + 1]},${data[i + 2]}`;
         colorCounts[rgb] = (colorCounts[rgb] || 0) + 1;

         if (colorCounts[rgb] > maxCount) {
            maxCount = colorCounts[rgb];
            dominantColor = rgb;
         }
      }

      if (dominantColor !== undefined) {
         const [r, g, b] = dominantColor.split(',').map(Number);
         const RGB = { r, g, b };
         updateValues({ dominatedColor: RGB });
      } else {
         showErrorToast();
      }
   };


   // // // extractColors // // //

   const extractColors = (src) => {
      const img = new Image();
      img.src = src;
      img.crossOrigin = 'Anonymous';
      img.onload = () => {
         const canvas = document.createElement('canvas');
         const ctx = canvas.getContext('2d');
         if (!ctx) return;

         canvas.width = img.width;
         canvas.height = img.height;
         ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

         const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
         const data = imageData.data;

         const pixels = [];
         for (let i = 0; i < data.length; i += 4) {
            const r = data[i];
            const g = data[i + 1];
            const b = data[i + 2];
            pixels.push([r, g, b]);
         }

         // Apply K-Means clustering to find the dominant colors
         const k = 6; // Number of clusters (colors to extract)
         const clusters = kMeansClustering(pixels, k);

         const distinctColors = clusters.map(cluster => ([
            cluster[0],
            cluster[1],
            cluster[2],
         ]));

         updateValues({ colorPalette: distinctColors });
      };
   };

   const kMeansClustering = (pixels, k) => {
      const centroids = initializeCentroids(pixels, k);
      let clusters = Array.from({ length: k }, () => []);

      for (let iteration = 0; iteration < 10; iteration++) {
         // Assign pixels to the closest centroid
         clusters = pixels.reduce((acc, pixel) => {
            const nearestCentroidIndex = findNearestCentroid(pixel, centroids);
            acc[nearestCentroidIndex].push(pixel);
            return acc;
         }, Array.from({ length: k }, () => []));

         // Recalculate centroids
         for (let i = 0; i < k; i++) {
            centroids[i] = calculateMean(clusters[i]);
         }
      }

      return centroids;
   };

   const initializeCentroids = (pixels, k) => {
      const centroids = [];
      for (let i = 0; i < k; i++) {
         const randomPixel = pixels[Math.floor(Math.random() * pixels.length)];
         centroids.push(randomPixel);
      }
      return centroids;
   };

   const findNearestCentroid = (pixel, centroids) => {
      let minDistance = Infinity;
      let nearestIndex = 0;

      centroids.forEach((centroid, index) => {
         const distance = euclideanDistance(pixel, centroid);
         if (distance < minDistance) {
            minDistance = distance;
            nearestIndex = index;
         }
      });

      return nearestIndex;
   };

   const euclideanDistance = (point1, point2) => {
      return Math.sqrt(
         Math.pow(point1[0] - point2[0], 2) +
         Math.pow(point1[1] - point2[1], 2) +
         Math.pow(point1[2] - point2[2], 2)
      );
   };

   const calculateMean = (cluster) => {
      const sum = cluster.reduce(
         (acc, pixel) => {
            acc[0] += pixel[0];
            acc[1] += pixel[1];
            acc[2] += pixel[2];
            return acc;
         },
         [0, 0, 0]
      );

      return cluster.length > 0
         ? [Math.round(sum[0] / cluster.length),
         Math.round(sum[1] / cluster.length), Math.round(sum[2] / cluster.length)]
         : [0, 0, 0];
   };
   // // // Top all function is part of `extractColors` function // // //

   useEffect(() => {
      const { result, errorReason } = isBlurhashValid(blurhash || '');
      updateObjectValue('blurhashValidation', { isValid: result, errorReason: errorReason || '' });
   }, [blurhash]);

   const tailwind = {
      common: {
         imgPreviewPlaceholder: 'text-center text-2xl',
      },
      input: {
         selectImgBtn: 'mx-auto block !w-44',
         imgPreview: 'border-2 border-gray-500 rounded-[10px] h-[62%] flex content-center justify-center flex-col mx-0 my-2.5 p-[5px]',
         imgPreviewImg: 'object-contain max-h-full max-w-full',

         panel: 'flex h-[27%]',
         imgInfoMain: 'grow border-r-[1px] border-gray-500 text-center w-1/2',
         imgInfo: 'my-10 mx-0',
         outoputOptions: {
            main: 'grow pt-0 px-5 pb-5 w-1/2',
            options: 'my-10 mx-0',
            optionDiv: 'flex m-[5px] p-[15px] text-lg rounded',
            optionLableAndInput: 'self-start flex-[1]',
            optionBlurhashInputs: 'flex mt-3.5',
         },
      },
      output: {
         color: {
            colorPalette: {
               main: "mt-4 shadow-2xl border-t-[1px] border-zinc-700 rounded-lg shadow-md",
               topBox: {
                  main: "flex flex-col md:flex-row",

                  left: "md:w-3/5 px-6 py-4",
                  title: "text-2xl font-bold mb-2",
                  about: "text-gray-300 mb-4",
                  paletteDiv: "grid grid-cols-2 gap-4 my-4 flex",
                  paletteRadio: 'grow w-1/6',
                  paletteNumber: 'grow mix-blend-difference w-5/6 text-end', //
                  colorBox: "rounded-md h-14 flex items-center px-3",

                  right: "md:w-2/5 h-[328px]",
                  jsonPreview: "border-l border-neutral-700 rounded-none w-full h-full",
                  noImageDiv: "w-full h-full flex items-center justify-center",
                  noImage: "text-center text-xl",
               },
               bottomBox: "flex justify-between px-4 pr-8 py-2 bg-[rgb(48,48,49)] rounded-b-lg",
            }
         },
         blurhash: {
            tmpDimensionsTooltip: cn(
               'relative top-[3.2px] right-[25px] border-2 border-orange-400 rounded-lg text-xs bg-[rgba(255, 87, 34, 0.1)] w-44 pt-[5px] h-[30px]',
               shouldShowDimensionTooltip ? 'visible' : 'invisible',
            ),
            tmpDimensionsTooltipTriangle: 'relative left-[-9px] top-6 inline-block w-0 h-0 border-y-[7px] border-y-transparent border-r-[14px] border-r-orange-500 rotate-[50deg]',

            tmpDimensionsWidthHeigt: cn(
               'flex w-[30%] rounded-lg border-b-0',
               shouldShowDimensionTooltip ? 'border border-orange-400' : 'border border-transparent'
            ),
            blurhashEditButtonsDiv: 'flex justify-around	mb-3.5 mt-[5px]',
            blurhashCanvasDiv: 'border-2 border-gray-500 rounded-[10px] h-[54%] flex content-center justify-center flex-col my-2.5 mx-0 p-[5px]',
            suggestions: cn(
               'w-[81%] border border-gray-500 mr-3.5 rounded-[10px] p-[18px] pb-1 overflow-y-auto h-[117px]',
               isSuggestionBoxScrolling ? 'scrollbar-show' : 'scrollbar-hide',
            ),
            suggestion: cn('pb-3',
               imgSize > 768000 ? 'block' : 'hidden'
            ),
            testImgAndCopyJsonBtnsDiv: 'flex flex-col w-[150px] gap-[34px]',
         }
      }
   };

   return (
      <ToolBoxLayout>
         <ToolBox title='Input'>
            <input
               type="file"
               accept="image/*"
               onChange={handleImageChange}
               ref={imgInputRef}
               hidden
            />
            <Btn
               btnText='Select Image'
               onClick={imgInputClick}
               btnDisabled={isBlurhash.editing}
               classNames={tailwind.input.selectImgBtn}
            />
            <div className={tailwind.input.imgPreview}>
               {imgSrc !== '' && isBlurhashImgProcessing ? (
                  <Fallback height='100%' />
               ) : (
                  <>
                     {imgSrc === '' ? (
                        <div className={tailwind.common.imgPreviewPlaceholder}>
                           Image Preview
                        </div>
                     ) : (
                        <img
                           src={imgSrc}
                           onClick={handleImageClick}
                           className={tailwind.input.imgPreviewImg}
                        />
                     )}
                  </>
               )}
            </div>
            <div className={tailwind.input.panel}>
               <div className={tailwind.input.imgInfoMain}>
                  <Heading title='Image Info' />
                  <div className={tailwind.input.imgInfo}>
                     {[
                        {
                           title: 'Name',
                           condition: imgName !== '',
                           value: imgName,
                        }, {
                           title: 'Size',
                           condition: imgSize !== 0,
                           value: formatFileSize(imgSize),
                        }, {
                           title: 'Width',
                           condition: imgDimensions.width !== 0,
                           value: imgDimensions.width,
                        }, {
                           title: 'Height',
                           condition: imgDimensions.height !== 0,
                           value: imgDimensions.height,
                        }
                     ].map((imgInfo, key) => {
                        const { title, condition, value } = imgInfo;
                        return (
                           <ImgInfo title={title} condition={condition} value={value} key={key} />
                        )
                     })}
                  </div>
               </div>
               <div className={tailwind.input.outoputOptions.main}>
                  <Heading title='Output Option' />
                  <div className={tailwind.input.outoputOptions.options}>
                     {['color', 'blurhash'].map((option, key) => (
                        <div
                           key={key}
                           role='button'
                           aria-label={`${option} output`}
                           tabIndex={key + 1}
                           onClick={e => {
                              startTabChangingTransition(() => {
                                 setOutputOptionsRadio(option);
                                 if (option === 'color') {
                                    updateObjectValue('isBlurhash', { editing: false });
                                 } 
                              })
                           }}
                           className={cn(
                              tailwind.input.outoputOptions.optionDiv,
                              option === outputOptionsRadio ? 'bg-[#808080]' : 'bg-[#80808021]'
                           )}
                        >
                           <label
                              className={tailwind.input.outoputOptions.optionLableAndInput}
                              htmlFor={option}
                           >
                              {option}
                           </label>
                           <span
                              className={cn('grow',
                                 isChangingTab && option !== outputOptionsRadio ? 'visible' : 'invisible'
                              )}
                           >⏳</span>
                           <input
                              type="radio"
                              id={option}
                              checked={outputOptionsRadio === option}
                              className={tailwind.input.outoputOptions.optionLableAndInput}
                              readOnly
                           />
                        </div>
                     ))}
                  </div>
                  <div className={tailwind.input.outoputOptions.optionBlurhashInputs}>
                     {Object.entries(blurhashComponent).map(([input, value], key) => (
                        <Input
                           key={key}
                           label={input}
                           type='number'
                           styles={{ flexGrow: '1', height: '25px', padding: '0 5px' }}
                           value={value}
                           onChange={e => updateObjectValue('blurhashComponent', { [input]: e.target.value })}
                           inputDisalbed={outputOptionsRadio === 'color'}
                           placeholder={`Recommended: ${initialState.blurhashComponent[input]}`}
                        />
                     ))}
                  </div>
               </div>
            </div>
         </ToolBox>
         <ToolBox
            title='Output'
            // This part is using as error not as controls //
            controlsPositionEnd={true}
            controls={
               <div className={tailwind.output.blurhash.tmpDimensionsTooltip}>
                  <span
                     className={tailwind.output.blurhash.tmpDimensionsTooltipTriangle}
                  ></span>
                  Height and Width Required!!
               </div>
            }
         >
            {outputOptionsRadio === 'color' ? (

               // Color side
               <>
                  {[
                     {
                        title: 'Dominant Color',
                        about: "Extracts the dominant color from an image by analyzing it's pixel data.",
                        colorRGB: dominatedColor
                     }, {
                        title: 'Average Color',
                        about: 'Calculates the average color of an image by averaging the red, green, and blue values of all pixels in the image.',
                        colorRGB: averageColor,
                     }, {
                        title: 'Selected Color',
                        about: 'Extracts the color of the pixel that on in an image.',
                        colorRGB: imgSelectedColor,
                        conditionallyAppendText: [[
                           averageColor !== 'not_set' ?
                              !(imgSelectedColor !== 'not_set') : averageColor !== 'not_set',
                           'Click on Image to see.'
                        ]],
                     }
                  ].map((value, key) => {
                     const { title, about, colorRGB, conditionallyAppendText } = value;

                     return (
                        <ColorCard
                           key={key}
                           title={title}
                           about={about}
                           colorRGB={colorRGB}
                           conditionallyAppendText={conditionallyAppendText}
                        />
                     )
                  })}
                  <div className={tailwind.output.color.colorPalette.main}>
                     <div className={tailwind.output.color.colorPalette.topBox.main}>
                        <div className={tailwind.output.color.colorPalette.topBox.left}>
                           <h2 className={tailwind.output.color.colorPalette.topBox.title}>
                              Extracted Color Palette
                           </h2>
                           <p className={tailwind.output.color.colorPalette.topBox.about}>
                              Find the most prominent colors. Output is a list of dominant colors.
                           </p>
                           <div className={tailwind.output.color.colorPalette.topBox.paletteDiv}>
                              {/* When input image not set. It will set empty select color boxes */}
                              {[...Array(6)].map((_, index) => {
                                 const colorObj = colorPalette[index];
                                 const color = colorObj
                                    ? `rgb(${colorObj[0]}, ${colorObj[1]}, ${colorObj[2]})`
                                    : '#464646';

                                 return (
                                    <div
                                       key={index}
                                       className={tailwind.output.color.colorPalette.topBox.colorBox}
                                       style={{ backgroundColor: color }}
                                       onClick={() => updateValues({ colorPaletteSelected: index })}
                                    >
                                       <input
                                          type="radio"
                                          checked={colorPaletteSelected === index}
                                          className={tailwind.output.color.colorPalette.topBox.paletteRadio}
                                          readOnly
                                       />
                                       <span className={tailwind.output.color.colorPalette.topBox.paletteNumber}>
                                          {index + 1}
                                       </span>
                                    </div>
                                 );
                              })}
                           </div>
                        </div>
                        <div className={tailwind.output.color.colorPalette.topBox.right}>
                           <div className={tailwind.output.color.colorPalette.topBox.jsonPreview}>
                              {Object.keys(colorPalette).length !== 0 ? (
                                 <JsonSyntaxHighlighter
                                    style={a11yDark}
                                    language='json'
                                    customStyle={{ height: '100%', width: '100%', margin: '0' }}
                                 >
                                    {customStringify(generateColorJson(colorPalette))}
                                 </JsonSyntaxHighlighter>
                              ) : (
                                 <div className={tailwind.output.color.colorPalette.topBox.noImageDiv}>
                                    <div className={tailwind.output.color.colorPalette.topBox.noImage}>
                                       No image selected
                                    </div>
                                 </div>
                              )}
                           </div>
                        </div>
                     </div>
                     <div className={tailwind.output.color.colorPalette.bottomBox}>
                        {[
                           {
                              btnText: 'Copy Code',
                              copyText: !isExtractedColorsBtnsDisabled ?
                                 `rgb(${selectedColor[0]}, ${selectedColor[1]}, ${selectedColor[2]})` : '',
                           }, {
                              btnText: 'Copy String',
                              copyText: !isExtractedColorsBtnsDisabled ?
                                 rgbDataURL(
                                    selectedColor[0],
                                    selectedColor[1],
                                    selectedColor[2],
                                 ) : '',
                           }, {
                              btnText: 'Copy Json',
                              copyText: !isExtractedColorsBtnsDisabled ? blurhashOutputJson : '{}',
                              isLargeButton: true,
                           }
                        ].map((value, key) => {
                           const { btnText, copyText, isLargeButton } = value;

                           return (
                              <CopyBtn
                                 key={key}
                                 btnText={btnText}
                                 copyText={copyText}
                                 styles={{ width: isLargeButton ? '240px' : '180px', height: '42px' }}
                                 disabled={isExtractedColorsBtnsDisabled}
                              />
                           )
                        })}
                     </div>
                  </div>
                  <EndLink
                     text='how to use RGB code and string in code.'
                     link='https://github.com/vercel/next.js/blob/canary/examples/image-component/app/color/page.tsx'
                     linkText='Checkout'
                     linkStart
                     tailwindStyles='my-3'
                  />
               </>
            ) : (

               // Blurhash side
               <>
                  <div>
                     <div className='flex'>
                        <Input
                           label={`Blurhash${isBlurhash.editing ? '*' : ''}`}
                           value={blurhash}
                           onChange={e => updateValues({ blurhash: e.target.value })}
                           styles={{
                              height: '40px', margin: '0', padding: '0 12px',
                              borderRight: `8px solid ${!blurhashValidation.isValid ?
                                 blurhash ? 'red' : '' : 'green'}`
                           }}
                           divStyles={{ width: isBlurhash.editing ? '70%' : '100%' }}
                           inputDisalbed={!isBlurhash.editing}
                           showError={!blurhashValidation.isValid && isBlurhash.editing}
                           tooltipError={blurhashValidation.errorReason}
                           tooltipPosition={{ left: '70px', bottom: '46px' }}
                        />
                        {isBlurhash.editing && (
                           <div className={tailwind.output.blurhash.tmpDimensionsWidthHeigt}>
                              {Object.entries(tmpCanvasDimensions).map(([input, value], key) => (
                                 <Input
                                    key={key}
                                    value={value}
                                    onChange={
                                       e => updateObjectValue('tmpCanvasDimensions', { [input]: e.target.value })
                                    }
                                    label={`${((str) => str.charAt(0).toUpperCase() + str.slice(1))(input)}*`}
                                    styles={{ height: '40px', margin: '0', padding: '0 12px' }}
                                 />
                              ))}
                           </div>
                        )}
                     </div>
                     <div className={tailwind.output.blurhash.blurhashEditButtonsDiv}>
                        <CopyBtn
                           copyText={blurhash}
                           disabled={Boolean(!blurhash)}
                        />
                        <PasteBtn onPaste={handlePaste} btnDisabled={!isBlurhash.editing} />
                        {[
                           {
                              btnText: 'Clear',
                              btnDisabled: !isBlurhash.editing || Boolean(!blurhash),
                              onClick: () => {
                                 updateValues({ blurhash: '' });
                                 updateObjectValue('tmpCanvasDimensions', { width: 0, height: 0 });
                              }
                           }, {
                              btnText: !isBlurhash.editing ? 'Edit' :
                                 blurhashValidation.isValid === false ? 'Cancel' : 'Save',
                              onClick: handleEditSaveBlurhash,
                              classNames: 'w-44',
                           }
                        ].map((value, key) => {
                           const { btnText, btnDisabled, onClick, classNames } = value;

                           return (
                              <Btn
                                 key={key}
                                 btnText={btnText}
                                 btnDisabled={btnDisabled}
                                 onClick={onClick}
                                 classNames={classNames !== undefined ? classNames : ''}
                              />
                           )
                        })}
                     </div>
                  </div>
                  <div className={tailwind.output.blurhash.blurhashCanvasDiv}>
                     {blurhash === '' && isBlurhashImgProcessing && !isBlurhash.editing ? (
                        <Fallback height='100%' />
                     ) : (
                        (
                           blurhash === '' || isBlurhash.editing ||
                           !canvasDimensions.width || !canvasDimensions.height
                        ) ? (
                           <div className={tailwind.common.imgPreviewPlaceholder}>
                              Image Preview
                           </div>
                        ) : (
                           <BlurhashCanvas
                              hash={blurhash}
                              width={canvasDimensions.width}
                              height={canvasDimensions.height}
                              punch={1}
                           />
                        )
                     )}
                  </div>
                  <div className='flex'>
                     <div className={tailwind.output.blurhash.suggestions}
                        onScroll={() => updateValues({ isSuggestionBoxScrolling: true })}
                        onMouseLeave={() => updateValues({ isSuggestionBoxScrolling: false })}
                     >
                        <p className={tailwind.output.blurhash.suggestion}>
                           {/* <p className='pb-3'> */}
                           💡 The image size is {formatFileSize(imgSize)}.
                           It's recommended to compress the image before using it on the website and generating a Blurhash.
                        </p>
                        {blurhashProcessedStats.counts !== 0 && blurhash && (
                           <p className='pb-3'>
                              📜{' '}
                              <a
                                 href={'https://github.com/woltapp/react-blurhash'}
                                 target='__blank'
                                 className='text-[lightblue] underline'
                              >Checkout
                              </a>
                              {' '}
                              how to use Blurhash in code.
                           </p>
                        )}
                     </div>
                     <div className={tailwind.output.blurhash.testImgAndCopyJsonBtnsDiv}>
                        <Btn
                           classNames='!w-[155px]'
                           btnText={'Test Img'}
                           btnDisabled={!blurhash}
                           onClick={() => {
                              openBase64InNewTab(
                                 getBlurhashImgString(
                                    blurhash,
                                    canvasDimensions.width,
                                    canvasDimensions.height
                                 )
                              )
                           }}
                        />
                        <CopyBtn copyText={blurhashOutputJson} btnText='Copy Json' styles={{ width: '155px' }} />
                     </div>
                  </div>
                  <JsonSyntaxHighlighter
                     style={a11yDark}
                     language='json'
                     customStyle={{ border: '1px solid grey', borderRadius: '10px' }}
                  >
                     {blurhashOutputJson}
                  </JsonSyntaxHighlighter>
               </>
            )}
         </ToolBox>
      </ToolBoxLayout >
   );
};


const Heading = ({
   title
}) => {
   return <div className={constantTailwind.heading}>{title}</div>
};

const ImgInfo = ({
   title,
   condition,
   value,
}) => {
   return (
      <div className={constantTailwind.imgInfo.main}>
         <div className={constantTailwind.imgInfo.title}>{title}: </div>
         <div className={constantTailwind.imgInfo.value}>{condition && value}</div>
      </div>
   )
};

const ColorCard = ({
   title,
   about,
   colorRGB,
   conditionallyAppendText = []
}) => {
   const { r, g, b } = colorRGB;
   const isRgbNotSet = colorRGB === 'not_set' || colorRGB == undefined;
   const rgbString = `rgb(${r}, ${g}, ${b})`;
   const appendText = conditionallyAppendText
      .filter(([condition]) => condition)
      .map(([, text]) => text)
      .join(' ');

   const tailwind = {
      main: "flex flex-col md:flex-row rounded-lg shadow-xl overflow-hidden border-t-[1px] border-zinc-700 mb-2",
      colorPreview: cn(
         "w-4/12 bg-gray-200 m-2 border-2 border-gray-700 rounded-lg rounded-r-none",
         isRgbNotSet && 'flex content-center justify-center flex-wrap'
      ),
      infoAndBtns: "w-8/12 px-5 py-3",
      title: "text-2xl font-bold mb-2",
      about: "text-gray-300 my-2 h-[60px]",
      btns: "flex justify-around",
   };

   return (
      <div className={tailwind.main}>
         <div
            style={{ backgroundColor: !isRgbNotSet ? rgbString : '#464646' }}
            className={tailwind.colorPreview}
         >
            {isRgbNotSet && <div>Not Set</div>}
         </div>
         <div className={tailwind.infoAndBtns}>
            <div className={tailwind.title}>{title}</div>
            <p className={tailwind.about}>
               {about}
               {conditionallyAppendText.length !== 0 && (

                  <span className='text-white'>
                     {' ' + appendText}
                  </span>
               )}
            </p>
            <div className={tailwind.btns}>
               {[
                  {
                     btnText: 'Copy Code',
                     copyText: rgbString,
                  }, {
                     btnText: 'Copy String',
                     copyText: rgbDataURL(r, g, b),

                  }
               ].map((button, key) => {
                  const { btnText, copyText } = button;

                  return (
                     <CopyBtn
                        key={key}
                        btnText={btnText}
                        copyText={copyText}
                        styles={{ width: '180px', height: '42px' }}
                        disabled={isRgbNotSet}
                     />
                  );
               })}
            </div>
         </div>
      </div>
   );
};

const BlurhashCanvas = memo(({
   hash,
   width,
   height,
   punch = 1, // Contrast
}) => {

   /** 
      * Custom implementation of the `BlurhashCanvas` component, based on the `react-blurhash` library.
      * 
      * Improvements:
      * 1. Converted to a functional component using hooks (`useRef`, `useState`, `useEffect`) for better management of canvas and error handling.
      * 2. Added custom error handling to track and display errors during Blurhash decoding.
      * 3. Designed for responsive rendering with Tailwind CSS classes (`w-full`, `h-full`).
      * 4. Optimized canvas updates using `useMemo` and `useCallback` to prevent unnecessary re-renders.
      * 
      * Original component reference:
      * https://github.com/woltapp/react-blurhash/blob/master/src/BlurhashCanvas.tsx
      * 
      * Original library: `react-blurhash`
   */

   const canvasRef = useRef(null);
   const [error, setError] = useState(null);


   const pixels = useMemo(() => {
      try {
         return decode(hash, width, height, punch);
      } catch (err) {
         setError(err);
         console.error("Error rendering BlurhashCanvas:", err);
         return null;
      }
   }, [hash, width, height, punch]);

   const draw = useCallback(() => {
      if (pixels && canvasRef.current) {
         const ctx = canvasRef.current.getContext('2d');
         if (ctx) {
            const imageData = ctx.createImageData(width, height);
            imageData.data.set(pixels);
            ctx.putImageData(imageData, 0, 0);
         }
      }
   }, [pixels, width, height]);

   useEffect(() => {

      if (hash) {
         if (pixels) {
            requestAnimationFrame(draw);
         }
      } else {
         setError(new Error("Invalid hash provided to BlurhashCanvas."));
      }
   }, [pixels, draw]);

   if (error) {
      return (
         <div className={constantTailwind.blurhashCanvas.error}>
            <div>Error: {
               error.message || "Something went wrong while rendering the Blurhash."
            }</div>
            <div className={'mt-4'}>Error: {JSON.stringify(error, null, 2)}</div>
         </div>
      );
   }

   return (
      <div className={constantTailwind.blurhashCanvas.canvasDiv}>
         <canvas
            ref={canvasRef}
            height={height}
            width={width}
            className={constantTailwind.blurhashCanvas.canvas}
         />
      </div>
   );
});


Heading.propTypes = {
   title: PropTypes.string.isRequired,
};

ImgInfo.propTypes = {
   title: PropTypes.string.isRequired,
   condition: PropTypes.bool.isRequired,
   value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
};

ColorCard.propTypes = {
   title: PropTypes.string.isRequired,
   about: PropTypes.string.isRequired,
   colorRGB: PropTypes.oneOfType([
      PropTypes.shape({
         r: PropTypes.number.isRequired,
         g: PropTypes.number.isRequired,
         b: PropTypes.number.isRequired,
      }),
      PropTypes.oneOf(['not_set']),
   ]).isRequired,
   conditionallyAppendText: PropTypes.arrayOf(
      PropTypes.arrayOf(
         PropTypes.oneOfType([PropTypes.bool, PropTypes.string])
      )
   ),
};

BlurhashCanvas.propTypes = {
   hash: PropTypes.string.isRequired,
   width: PropTypes.number.isRequired, // Error if width is undefined due to React's behavior
   height: PropTypes.number.isRequired, // Error if height is undefined due to React's behavior
   punch: PropTypes.number,
};

// Note: Prop-types warnings occur if width or height is undefined, which can happen
// during initial renders or when dimensions are not set yet. This is due to React's behavior
// and is expected. These errors can be safely ignored as dimensions will be provided eventually.

export default ImgPlaceholderGen;