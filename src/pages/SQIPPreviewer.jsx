import { useEffect, useReducer, useRef } from 'react';
import clsx from 'clsx';

import ToolBoxLayout from '@/common/ToolBoxLayout';
import ToolBox from '@/common/ToolBox';
import Input from '@/common/Input';
import Btn from '@/common/BasicBtn';
import CopyBtn from '@/common/CopyBtn';

const actionTypes = {
   UPDATE_VALUE: 'UPDATE_VALUE',
   UPDATE_OBJECT_VALUE: 'UPDATE_OBJECT_VALUE',
};

const initialState = {
   mainInput: '',
   base64String: '',
   inputDimension: { width: '', height: '' },
   activeDimensions: { width: 0, height: 0 },

   isValidBase64String: false,
   cancelledState: { base64String: '', width: 0, height: 0 },
   isBase64String: { editing: false, edited: false },
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

const SQIPPreviewer = () => {
   const previewContainerRef = useRef(null);
   const [state, dispatch] = useReducer(reducer, initialState);

   const {
      mainInput,
      base64String,
      inputDimension,
      activeDimensions,

      // Part of editing 
      isValidBase64String,
      cancelledState,
      isBase64String,
   } = state;

   const previewAspectRatio = inputDimension.width / inputDimension.height;


   // //   Utility Functions   // //

   const extractCSSAttributes = (cssString) => {
      const widthMatch = cssString.match(/width="(\d+)"/);
      const heightMatch = cssString.match(/height="(\d+)"/);
      const backgroundImageMatch = cssString.match(/background-image:\s*url\((.*?)\)/);

      updateValues({
         base64String: backgroundImageMatch ? backgroundImageMatch[1] : '',
         initialBase64String: backgroundImageMatch ? backgroundImageMatch[1] : '',
      });
      updateObjectValue('inputDimension', {
         width: widthMatch ? parseInt(widthMatch[1], 10) : '',
         height: heightMatch ? parseInt(heightMatch[1], 10) : '',
      })
   };

   const isValidBase64 = (base64String) => {
      const validMimeTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/svg+xml', 'image/webp'];
      const base64PrefixMatch = base64String.match(/^data:(image\/[a-zA-Z]+);base64,/);
      if (!base64PrefixMatch) return false;

      const mimeType = base64PrefixMatch[1];
      if (!validMimeTypes.includes(mimeType)) return false;

      const base64Content = base64String.slice(base64PrefixMatch[0].length);
      const base64Regex = /^[A-Za-z0-9+/]+={0,2}$/;
      return base64Regex.test(base64Content) && base64Content.length % 4 === 0;
   };


   // //   Functions for Updating Reducer   // //

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

   const clearInputDimesions = () => {
      updateObjectValue('inputDimension', {
         width: '',
         height: '',
      });
   };

   const handleSaveEdit = () => {
      if (isValidBase64String === false) {

         if (isBase64String.edited) {
            updateValues({ base64String: cancelledState.base64String, });
            updateObjectValue('inputDimension', {
               width: cancelledState.width,
               height: cancelledState.height,
            })
         }
      } else {
         if (cancelledState.base64String !== base64String) {
            updateObjectValue('isBase64String', { edited: true });
            updateObjectValue('cancelledState', {
               base64String: base64String,
               width: inputDimension.width,
               height: inputDimension.height,
            });
         } else {
            updateValues({
               base64String: cancelledState.base64String,
            });
            updateObjectValue('inputDimension', {
               width: cancelledState.width,
               height: cancelledState.height,
            })
         }
      }
      updateObjectValue('isBase64String', { editing: !isBase64String.editing });
   };


   // //   Event Handlers   // //

   const handlePaste = async () => {
      try {
         const text = await navigator.clipboard.readText();

         updateValues({ mainInput: text, base64String: '' });
         clearInputDimesions();
         extractCSSAttributes(text);
      } catch (error) {
         console.error('Failed to read clipboard: ', error);
      }
   };

   const handleInputChange = (event) => {
      const cliOutput = event.target.value;

      updateValues({ mainInput: cliOutput });
      extractCSSAttributes(cliOutput);
   };


   useEffect(() => {
      const valid = isValidBase64(base64String);
      updateValues({ isValidBase64String: valid });
   }, [base64String]);

   useEffect(() => {
      const updateChildDimensions = (() => {
         if (previewContainerRef.current) {
            const parentWidth = previewContainerRef.current.clientWidth;
            const parentHeight = previewContainerRef.current.clientHeight;

            let childWidth, childHeight;

            if (parentWidth / parentHeight > previewAspectRatio) {
               childHeight = parentHeight;
               childWidth = childHeight * previewAspectRatio;
            } else {
               childWidth = parentWidth;
               childHeight = childWidth / previewAspectRatio;
            }

            updateObjectValue('activeDimensions', {
               width: Math.round(childWidth),
               height: Math.round(childHeight)
            });
         }
      })();

      window.addEventListener('resize', updateChildDimensions);
      return () => window.removeEventListener('resize', updateChildDimensions);
   }, [previewAspectRatio]);

   const tailwind = {
      btnsDiv: "flex justify-between px-2",
      previewPlaceholder: 'text-white text-center text-2xl border-2 border-gray-500 rounded-[10px] h-[745px] min-w-[1600px] !w-[99%] flex flex-wrap content-center justify-center flex-col m-2.5 my-0 p-[5px]',
      input: "!h-[88%] resize-none px-4 py-2 rounded-lg border-0 bg-gray-700 !text-white shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6 disabled:bg-gray-500 disabled:text-gray-400 disabled:opacity-50 disabled:cursor-not-allowed disabled:pt-2 placeholder-gray-500",
   };

   return (
      <div>
         <ToolBoxLayout height='32%'>
            <ToolBox title='Input'>
               <Input
                  label={`${Object.keys(initialState)[0]}:`}
                  value={mainInput}
                  placeholder='<img width="..." height="..." src="..." alt="..." style="background-image: url(data:image/svg+xml;base64,....);">'
                  onChange={handleInputChange}
                  elementType='textarea'
                  classNames={tailwind.input}
                  divStyles={{ height: '200px', width: 'auto' }}
               />
               <div className={tailwind.btnsDiv}>
                  {[
                     {
                        btnText: 'Clear & Paste',
                        onClick: () => {
                           updateValues({ mainInput: '' });
                           handlePaste();
                        },
                        isLargeButton: true,
                     }, {
                        btnText: 'Clear',
                        onClick: () => {
                           updateValues({
                              mainInput: '',
                              base64String: '',
                           });
                           clearInputDimesions();
                        },
                        btnDisabled: mainInput === '',
                     }, {
                        btnText: 'Paste',
                        onClick: handlePaste,
                        btnDisabled: mainInput !== '',
                     }
                  ].map((btn, key) => {
                     const { btnText, onClick, btnDisabled, isLargeButton } = btn;

                     return (
                        <Btn
                           key={key}
                           btnText={btnText}
                           onClick={onClick}
                           btnDisabled={btnDisabled}
                           classNames={clsx(
                              '!h-[45px]',
                              isLargeButton ? '!w-[340px]' : '!w-[290px]',
                              key === 0 ? '!mr-1' : key === 1 ? '!mx-1' : '!ml-1',
                           )}
                        />
                     )
                  })}
               </div>
            </ToolBox>
            <ToolBox title='Output'>
               <div className="flex">
                  <Input
                     label={`${Object.keys(initialState)[1]}:`}
                     value={base64String}
                     onChange={e => updateValues({ base64String: e.target.value })}
                     placeholder={isBase64String.editing ? 'data:image/svg+xml;base64,....' : ''}
                     inputDisalbed={!isBase64String.editing}
                     classNames={tailwind.input}
                     divStyles={{ height: '73px', width: 'auto' }}
                  />
                  <CopyBtn
                     copyText={base64String}
                     copyBtnDisabled={!isValidBase64String}
                     className='mt-7 !h-16'
                  />
               </div>
               <div className='flex pt-5'>
                  <Input
                     label='Width:'
                     value={inputDimension.width}
                     onChange={e => updateObjectValue('inputDimension', { width: e.target.value })}
                     placeholder={isBase64String.editing ? '100' : ''}
                     inputDisalbed={!isBase64String.editing}
                     classNames={tailwind.input}
                     divStyles={{ height: '73px', width: 'auto' }}
                  />
                  <Input
                     label='Height:'
                     value={inputDimension.height}
                     onChange={e => updateObjectValue('inputDimension', { height: e.target.value })}
                     placeholder={isBase64String.editing ? '100' : ''}
                     inputDisalbed={!isBase64String.editing}
                     classNames={tailwind.input}
                     divStyles={{ height: '73px', width: 'auto' }}
                  />
               </div>
               <div className={clsx(tailwind.btnsDiv, 'pt-6')}>
                  {[
                     {
                        btnText: 'Clear',
                        onClick: () => {
                           updateValues({
                              base64String: '',
                           });
                           clearInputDimesions();
                        },
                        btnDisabled: !isBase64String.editing,
                     },
                     {
                        btnText: !isBase64String.editing ? 'Edit' :
                           isValidBase64String === false ? 'Cancel' : 'Save',
                        onClick: handleSaveEdit,
                     }
                  ].map((btn, key) => {
                     const { btnText, onClick, btnDisabled } = btn;

                     return (
                        <Btn
                           key={key}
                           btnText={btnText}
                           onClick={onClick}
                           btnDisabled={btnDisabled}
                           classNames={clsx(
                              'min-w-[370px] !w-[446px] !h-[45px]',
                              key === 0 ? 'mr-2' : 'ml-2'
                           )}
                        />
                     );
                  })}
               </div>
            </ToolBox>
         </ToolBoxLayout >
         <div ref={previewContainerRef} className={tailwind.previewPlaceholder}>
            {base64String && isValidBase64String ? (
               <div
                  style={{
                     width: activeDimensions.width,
                     height: activeDimensions.height,
                     backgroundImage: `url(${base64String})`,
                     backgroundSize: 'cover',
                  }}
               >
               </div>
            ) : (
               <>
                  Image Preview
               </>
            )}
         </div>
      </div>
   );
};

export default SQIPPreviewer;
