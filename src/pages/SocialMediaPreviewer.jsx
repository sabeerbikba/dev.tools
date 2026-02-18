import { useState, useEffect } from 'react';
import ToolBoxLayout from '@/common/ToolBoxLayout';
import ToolBox from '@/common/ToolBox';
import Input from '@/common/Input';
import { Upload, X, Download, TriangleAlert, } from 'lucide-react';
import { toast } from 'react-toastify';

const SocialMediaPreviewer = () => {
   const [title, setTitle] = useState('');
   const [description, setDescription] = useState('');
   const [url, setUrl] = useState('');
   const [imageSource, setImageSource] = useState('upload'); // 'url' or 'upload'
   const [imageUrl, setImageUrl] = useState('');
   const [uploadedImage, setUploadedImage] = useState(null);
   const [twitterCardType, setTwitterCardType] = useState('summary_large_image'); // 'summary' or 'summary_large_image'
   const [imageDimensions, setImageDimensions] = useState({ width: 0, height: 0 });
   const [isFetching, setIsFetching] = useState(false);
   const [activeTab, setActiveTab] = useState(() => {
      if (typeof window !== 'undefined') {
         const hostname = window.location.hostname;
         if (hostname === 'localhost' || hostname === '127.0.0.1') {
            return 'automatic';
         }
      }
      return 'manual';
   });

   useEffect(() => {
      if (imageSource === 'upload' && uploadedImage) {
         const reader = new FileReader();
         reader.onload = (e) => {
            setImageUrl(e.target.result);
         };
         reader.readAsDataURL(uploadedImage);
      }
   }, [imageSource, uploadedImage]);

   const handleImageUpload = (e) => {
      const file = e.target.files[0];
      if (file) {
         setUploadedImage(file);
         setImageSource('upload');
      }
   };

   const handleImageUrlChange = (name, value) => {
      setImageUrl(value);
   };

   const clearImage = () => {
      setImageUrl('');
      setUploadedImage(null);
   };

   const getDomainName = (urlString) => {
      try {
         return new URL(urlString).hostname;
      } catch (e) {
         return 'example.com';
      }
   };

   const fetchMetaTags = async () => {
      // TODO: create own api that only support this website request
      if (!url) {
         toast.error("Please enter a URL first.");
         return;
      }

      setIsFetching(true);
      try {
         const proxyUrl = `https://corsproxy.io/?${encodeURIComponent(url)}`;
         const response = await fetch(proxyUrl);

         if (!response.ok) {
            throw new Error("Failed to fetch via primary proxy");
         }

         const html = await response.text();
         const parser = new DOMParser();
         const doc = parser.parseFromString(html, "text/html");

         const getMeta = (property) => {
            return doc.querySelector(`meta[property='${property}']`)?.getAttribute('content') ||
               doc.querySelector(`meta[name='${property}']`)?.getAttribute('content') ||
               '';
         };

         const fetchedTitle = getMeta('og:title') || doc.title || '';
         const fetchedDescription = getMeta('og:description') || getMeta('description') || '';
         const fetchedImage = getMeta('og:image');

         if (fetchedTitle) setTitle(fetchedTitle);
         if (fetchedDescription) setDescription(fetchedDescription);

         if (fetchedImage) {
            let absoluteImageUrl = fetchedImage;
            if (fetchedImage.startsWith('/')) {
               try {
                  const urlObj = new URL(url);
                  absoluteImageUrl = `${urlObj.origin}${fetchedImage}`;
               } catch (e) {
                  console.error("Error constructing absolute URL", e);
               }
            } else if (!fetchedImage.startsWith('http')) {
               try {
                  const urlObj = new URL(url);
                  absoluteImageUrl = new URL(fetchedImage, urlObj.href).href;
               } catch (e) {
                  console.error("Error resolving relative URL", e);
               }
            }

            setImageUrl(absoluteImageUrl);
            setImageSource('url');
            setUploadedImage(null);
         }

         toast.success("Meta tags fetched successfully!");
         if (activeTab !== '') setActiveTab('manual');

      } catch (error) {
         console.error("Error fetching meta tags:", error);
         try {
            const backupProxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(url)}`;
            const response = await fetch(backupProxyUrl);
            const data = await response.json();
            if (data.contents) {
               const parser = new DOMParser();
               const doc = parser.parseFromString(data.contents, "text/html");
               const getMeta = (property) => {
                  return doc.querySelector(`meta[property='${property}']`)?.getAttribute('content') ||
                     doc.querySelector(`meta[name='${property}']`)?.getAttribute('content') ||
                     '';
               };

               const fetchedTitle = getMeta('og:title') || doc.title || '';
               const fetchedDescription = getMeta('og:description') || getMeta('description') || '';
               const fetchedImage = getMeta('og:image');

               if (fetchedTitle) setTitle(fetchedTitle);
               if (fetchedDescription) setDescription(fetchedDescription);
               if (fetchedImage) {
                  let absoluteImageUrl = fetchedImage;
                  if (fetchedImage.startsWith('/')) {
                     try {
                        const urlObj = new URL(url);
                        absoluteImageUrl = `${urlObj.origin}${fetchedImage}`;
                     } catch (e) { }
                  }
                  setImageUrl(absoluteImageUrl);
                  setImageSource('url');
                  setUploadedImage(null);
               }
               toast.success("Meta tags fetched successfully (via backup proxy)!");
               if (activeTab !== '') setActiveTab('manual');
            } else {
               toast.error("Failed to fetch meta tags. Please enter manually.");
            }
         } catch (backupError) {
            console.error("Backup fetch failed", backupError);
            toast.error("Could not fetch meta tags from this URL.");
         }
      } finally {
         setIsFetching(false);
      }
   };

   const TwitterCard = () => {
      const isLarge = twitterCardType === 'summary_large_image';
      return (
         <div className="border border-gray-300 rounded-lg overflow-hidden bg-white max-w-sm mx-auto font-sans text-black">
            {isLarge ? (
               <>
                  {imageUrl && (
                     <div className="h-48 overflow-hidden bg-gray-100 relative">
                        <img src={imageUrl} alt="Preview" className="w-full h-full object-cover" />
                     </div>
                  )}
                  <div className="p-3 border-t border-gray-200">
                     <div className="text-gray-500 text-sm uppercase truncate mb-1">{getDomainName(url)}</div>
                     <div className="font-bold text-gray-900 leading-tight mb-1 truncate">{title || 'Page Title'}</div>
                     <div className="text-gray-500 text-sm line-clamp-2">{description || 'Page description goes here...'}</div>
                  </div>
               </>
            ) : (
               <div className="flex">
                  {imageUrl && (
                     <div className="w-32 h-32 flex-shrink-0 bg-gray-100 relative border-r border-gray-200">
                        <img src={imageUrl} alt="Preview" className="w-full h-full object-cover" />
                     </div>
                  )}
                  <div className="p-3 flex flex-col justify-center overflow-hidden">
                     <div className="text-gray-500 text-sm uppercase truncate mb-1">{getDomainName(url)}</div>
                     <div className="font-bold text-gray-900 leading-tight mb-1 truncate">{title || 'Page Title'}</div>
                     <div className="text-gray-500 text-sm line-clamp-2">{description || 'Page description goes here...'}</div>
                  </div>
               </div>
            )}
         </div>
      );
   };

   const FacebookCard = () => (
      <div className="border border-gray-300 bg-gray-100 max-w-sm mx-auto font-sans text-black">
         {imageUrl && (
            <div className="h-48 overflow-hidden bg-gray-200 relative">
               <img src={imageUrl} alt="Preview" className="w-full h-full object-cover" />
            </div>
         )}
         <div className="p-3 bg-gray-100 border-t border-gray-300">
            <div className="text-gray-600 text-xs uppercase truncate mb-1">{getDomainName(url).toUpperCase()}</div>
            <div className="font-bold text-gray-900 leading-tight mb-1 line-clamp-2">{title || 'Page Title'}</div>
            <div className="text-gray-600 text-sm line-clamp-1">{description || 'Page description goes here...'}</div>
         </div>
      </div>
   );

   const LinkedInCard = () => (
      <div className="border border-gray-300 rounded-sm overflow-hidden bg-white max-w-sm mx-auto font-sans text-black shadow-sm">
         {imageUrl && (
            <div className="h-48 overflow-hidden bg-gray-100 relative">
               <img src={imageUrl} alt="Preview" className="w-full h-full object-cover" />
            </div>
         )}
         <div className="p-3 bg-white border-t border-gray-200">
            <div className="font-semibold text-gray-900 leading-tight mb-1 truncate">{title || 'Page Title'}</div>
            <div className="text-gray-500 text-xs truncate">{getDomainName(url)}</div>
         </div>
      </div>
   );

   const DiscordCard = () => (
      <div className="border-l-4 border-gray-500 pl-3 max-w-sm mx-auto font-sans text-gray-300 bg-[#313338] p-2 rounded">
         <div className="text-xs text-gray-400 mb-1">{getDomainName(url)}</div>
         <div className="font-bold text-[#00b0f4] mb-1 hover:underline cursor-pointer">{title || 'Page Title'}</div>
         <div className="text-sm text-gray-300 mb-2 line-clamp-3">{description || 'Page description goes here...'}</div>
         {imageUrl && (
            <div className="rounded-lg overflow-hidden max-w-full max-h-60 bg-gray-900 inline-block">
               <img src={imageUrl} alt="Preview" className="max-w-full h-auto object-contain max-h-60" />
            </div>
         )}
      </div>
   );

   const WhatsAppCard = () => (
      <div className="bg-[#dcf8c6] p-2 rounded-lg max-w-sm mx-auto font-sans text-black shadow relative inline-block">
         <div className="bg-gray-100 rounded overflow-hidden mb-1">
            {imageUrl && (
               <div className="h-32 overflow-hidden bg-gray-200 relative">
                  <img src={imageUrl} alt="Preview" className="w-full h-full object-cover" />
               </div>
            )}
            <div className="p-2 bg-[#f0f0f0]">
               <div className="font-bold text-black leading-tight mb-1 truncate">{title || 'Page Title'}</div>
               <div className="text-gray-600 text-sm line-clamp-2">{description || 'Page description goes here...'}</div>
               <div className="text-gray-500 text-xs truncate mt-1">{getDomainName(url)}</div>
            </div>
         </div>
         <div className="text-blue-500 hover:underline text-sm break-all">{url || 'https://example.com'}</div>
      </div>
   );

   const TelegramCard = () => (
      <div className="bg-white p-2 rounded-lg max-w-sm mx-auto font-sans text-black shadow-sm border border-gray-100 inline-block">
         <div className="font-bold text-[#2481cc] leading-tight mb-1 cursor-pointer truncate">{title || 'Page Title'}</div>
         <div className="text-black text-sm mb-2 line-clamp-3 leading-snug">{description || 'Page description goes here...'}</div>
         {imageUrl && (
            <div className="rounded overflow-hidden mb-1 relative">
               <img src={imageUrl} alt="Preview" className="w-full h-auto object-cover rounded" />
            </div>
         )}
         <div className="text-blue-500 text-sm truncate opacity-70 mt-1">{getDomainName(url)}</div>
      </div>
   );


   return (
      <ToolBoxLayout>
         <ToolBox title="Input" boxWidth="40%">

            <div className="flex border-b border-gray-700 mb-6">
               <button
                  className={`flex-1 pb-2 text-center transition-colors ${activeTab === 'manual' ? 'border-b-2 border-blue-500 text-white font-medium' : 'text-gray-400 hover:text-gray-200'}`}
                  onClick={() => setActiveTab('manual')}
               >
                  Manual
               </button>
               <button
                  className={`flex-1 pb-2 text-center transition-colors ${activeTab === 'automatic' ? 'border-b-2 border-blue-500 text-white font-medium' : 'text-gray-400 hover:text-gray-200'}`}
                  onClick={() => setActiveTab('automatic')}
               >
                  Automatic
               </button>
            </div>

            {activeTab === 'manual' ? (
               <>
                  {/* Image Section First */}
                  <div className="mb-6">
                     <label className="text-[#A6A6A6] block mb-2">Image</label>
                     <div className="flex gap-4 mb-2">
                        <label className="flex items-center cursor-pointer">
                           <input
                              type="radio"
                              name="imageSource"
                              value="upload"
                              checked={imageSource === 'upload'}
                              onChange={() => {
                                 setImageSource('upload');
                              }}
                              className="mr-2"
                           />
                           Upload
                        </label>
                        <label className="flex items-center cursor-pointer">
                           <input
                              type="radio"
                              name="imageSource"
                              value="url"
                              checked={imageSource === 'url'}
                              onChange={() => {
                                 setImageSource('url');
                                 setUploadedImage(null);
                              }}
                              className="mr-2"
                           />
                           Link
                        </label>
                     </div>

                     {imageSource === 'url' ? (
                        <Input
                           name="imageUrl"
                           value={imageUrl}
                           onChange={handleImageUrlChange}
                           placeholder="https://example.com/image.jpg"
                           noDivMargin
                           elementHeight="60px"
                        />
                     ) : (
                        <div className="border-2 border-dashed border-gray-500 rounded-lg p-6 text-center cursor-pointer hover:border-blue-500 transition-colors relative h-32 flex items-center justify-center">
                           <input
                              type="file"
                              accept="image/*"
                              onChange={handleImageUpload}
                              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                           />
                           {uploadedImage ? (
                              <div className="flex items-center justify-center gap-2">
                                 <span className="truncate max-w-[200px] text-white">{uploadedImage.name}</span>
                                 <button onClick={(e) => {
                                    e.preventDefault();
                                    clearImage();
                                 }} className="z-10 p-1 hover:bg-gray-700 rounded-full text-white">
                                    <X size={16} />
                                 </button>
                              </div>
                           ) : (
                              <div className="flex flex-col items-center text-gray-400">
                                 <Upload className="mb-2" />
                                 <span>Click to upload image</span>
                              </div>
                           )}
                        </div>
                     )}
                  </div>

                  <Input
                     name="title"
                     label="Title"
                     value={title}
                     onChange={(_, value) => setTitle(value)}
                     placeholder="Enter page title"
                     elementHeight="85px"
                     divStyles={{ paddingTop: '40px', }}
                  />
                  <Input
                     name="description"
                     label="Description"
                     value={description}
                     onChange={(_, value) => setDescription(value)}
                     placeholder="Enter page description"
                     elementHeight="85px"
                     divStyles={{ paddingTop: '40px', }}
                  />
                  <Input
                     name="url"
                     label="Website URL"
                     value={url}
                     onChange={(_, value) => setUrl(value)}
                     placeholder="https://example.com"
                     elementHeight="85px"
                     divStyles={{ paddingTop: '40px', }}
                  />

                  <div className="pt-8">
                     <label className="text-[#A6A6A6] block mb-2">Twitter Card Type</label>
                     <div className="flex gap-4">
                        <label className="flex items-center cursor-pointer">
                           <input
                              type="radio"
                              name="twitterCardType"
                              value="summary"
                              checked={twitterCardType === 'summary'}
                              onChange={() => setTwitterCardType('summary')}
                              className="mr-2"
                           />
                           Summary
                        </label>
                        <label className="flex items-center cursor-pointer">
                           <input
                              type="radio"
                              name="twitterCardType"
                              value="summary_large_image"
                              checked={twitterCardType === 'summary_large_image'}
                              onChange={() => setTwitterCardType('summary_large_image')}
                              className="mr-2"
                           />
                           Summary Large Image
                        </label>
                     </div>
                  </div>
               </>
            ) : (
               <div className="mb-4">
                  <div className="relative">
                     <Input
                        name="url"
                        label="Website URL"
                        value={url}
                        onChange={(name, value) => setUrl(value)}
                        placeholder="https://example.com"
                        elementHeight="85px"
                        divStyles={{ paddingTop: '50px', }}
                     />
                     <button
                        onClick={fetchMetaTags}
                        disabled={isFetching || !url}
                        className="absolute right-2 top-8 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white p-2 rounded text-xs flex items-center gap-1 transition-colors"
                        title="Fetch Meta Tags"
                     >
                        {isFetching ? 'Fetching...' : <><Download size={14} /> Fetch Meta</>}
                     </button>
                  </div>
                  <p className="text-gray-400 text-sm mt-12">
                     Enter a URL and click "Fetch Meta" to automatically retrieve title, description, and image. You can then edit them in the Manual tab.
                  </p>
                  <p className="flex items-start gap-2 p-3 mt-4 text-xs text-yellow-500 bg-yellow-500/10 border border-yellow-500/20 rounded-md">
                     <TriangleAlert size={16} className="mt-0.5 flex-shrink-0" />
                     <span>
                        <strong>Dev Mode Only:</strong> Automatic fetching currently works only in the development environment. We will add full production support soon!
                     </span>
                  </p>
               </div>
            )}

         </ToolBox>

         {/* here can be used loop */}
         <ToolBox title="Previews" boxWidth="60%">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-8">
               <div className="flex flex-col gap-2">
                  <h3 className="text-lg font-semibold text-gray-300 mb-1">Twitter / X</h3>
                  <TwitterCard />
               </div>

               <div className="flex flex-col gap-2">
                  <h3 className="text-lg font-semibold text-gray-300 mb-1">Facebook</h3>
                  <FacebookCard />
               </div>

               <div className="flex flex-col gap-2">
                  <h3 className="text-lg font-semibold text-gray-300 mb-1">LinkedIn</h3>
                  <LinkedInCard />
               </div>

               <div className="flex flex-col gap-2">
                  <h3 className="text-lg font-semibold text-gray-300 mb-1">Discord</h3>
                  <DiscordCard />
               </div>

               <div className="flex flex-col gap-2">
                  <h3 className="text-lg font-semibold text-gray-300 mb-1">WhatsApp</h3>
                  <WhatsAppCard />
               </div>

               <div className="flex flex-col gap-2">
                  <h3 className="text-lg font-semibold text-gray-300 mb-1">Telegram</h3>
                  <TelegramCard />
               </div>
            </div>
         </ToolBox>
      </ToolBoxLayout>
   );
};

export default SocialMediaPreviewer;
