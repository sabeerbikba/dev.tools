// import PropTypes from 'prop-types';

// export default function BrowserExtensions() {

//     return (
//         <>
//             <Container
//                 img="https://addons.mozilla.org/user-media/addon_icons/2624/2624604-64.png?modified=534eb777"
//                 head='Light House'
//                 pera='Lighthouse is an open-source, automated tool for improving the performance, quality, and correctness of your web apps.'
//                 docsLink='https://developer.chrome.com/docs/lighthouse/overview/'
//                 downloadLink='https://addons.mozilla.org/en-US/firefox/addon/google-lighthouse/'
//                 openLink='moz-extension://4a6ed332-712d-49da-8054-16db75588727/pages/options.htmm'
//             />
//         </>
//     );
// }

// function Container({ img, head, pera, docsLink = '', downloadLink, openLink }) {
//     // Check if the extension is downloaded
//     const isExtensionDownloaded = !!downloadLink;

//     // Determine the link based on whether the extension is downloaded or not
//     const link = isExtensionDownloaded ? openLink : downloadLink;

//     // Determine the button text based on whether the extension is downloaded or not
//     const buttonText = isExtensionDownloaded ? 'Open' : 'Install';

//     // Define the action based on whether the extension is downloaded or not
//     const handleClick = () => {
//         if (isExtensionDownloaded) {
//             // Handle logic for opening the extension
//             // For example:
//             window.open(openLink, '_blank');
//         } else {
//             // Handle logic for installing the extension
//             // You can detect the browser and provide the appropriate installation link
//             // For example:
//             window.location.href = downloadLink;
//         }
//     };

//     return (
//         <div className='Browser-extensionsDiv'>
//             <div><img src={img} className='Browser-extensionsImg' /></div>
//             <div className='Browser-extensionsHead'>{head}</div>
//             <p className='Browser-extensionsP'>{pera}</p>
//             <div style={{ display: 'flex' }}>
//                 {docsLink && (
//                     <button className='Browser-extensionsBtn' style={{ width: '6rem', borderRadius: '20px 20px 0 0' }}>
//                         <a href={docsLink} target='_blank' rel="noreferrer" className='Browser-extensionsBtnLink'>Docs</a>
//                     </button>
//                 )}

//                 <button className='Browser-extensionsBtn' onClick={handleClick}>
//                     <a href={link} target='_blank' rel="noreferrer" className='Browser-extensionsBtnLink'>{buttonText}</a>
//                 </button>
//             </div>
//         </div>
//     );
// }

// // function Container({ img, head, pera, docsLink = '', downloadLink, openLink }) {
// //     // TODO: implement the logic that if user downloaded the extension need to give open link else install link by detecting browser
// //     const link = downloadLink ? openLink : ''; 
// //     // if looking good add docs image or svg simmilar to book diery
// //     return (
// //         <div className='Browser-extensionsDiv' >
// //             <div><img src={img} className='Browser-extensionsImg' /></div>
// //             <div className='Browser-extensionsHead'>{head}</div>
// //             <p className='Browser-extensionsP' >{pera}</p>
// //             <div style={{ display: 'flex' }}>
// //                 {docsLink && (
// //                     <button className='Browser-extensionsBtn' style={{ width: '6rem', borderRadius: '20px 20px 0 0' }}>
// //                         <a href={docsLink} target='_blank' rel="noreferrer" className='accordion-panel4WebBtnLink'>Docs</a>
// //                     </button>
// //                 )}

// //                 <button className='Browser-extensionsBtn'>
// //                     <a href={link} target='_blank' rel="noreferrer" className='accordion-panel4WebBtnLink'>Visit</a>
// //                 </button>
// //             </div>
// //         </div>
// //     )
// // }
// Container.propTypes = {
//     img: PropTypes.string.isRequired,
//     head: PropTypes.string.isRequired,
//     pera: PropTypes.string.isRequired,
//     docsLink: PropTypes.string,
//     downloadLink: PropTypes.string.isRequired,
//     openLink: PropTypes.string.isRequired
// }