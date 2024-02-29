import { useReducer } from "react";
import PropTypes from 'prop-types';
import { toast } from 'react-toastify';
import MonacoEditor from '@monaco-editor/react';

/** TASK.TODO
//  * create single function UPDATE_INPUTS 
//  * fix handleFinalOutput
* when url type use need to show url correct or not 
 * fix the error in log
//  * need to update contennt type and primarly language UPDATE_INPUT function 
//  * need to add trim in if logic in handleFinalOutput fucntion
//  * in revistDays input if userType text need to show error only number allowed 
 * need to make responsive when screen is smaller 
 * implement regEx in inputs where possible 
 * in inputs after enter specified charcter notfiy or warn them 
 * oglocale ogAlternateLocale bug click genrate to see
//  * create reusable selection and use where possible 
//  * need to impletmet boilderplate code 
//  * check descreption spelling 
// * after implemet all reusable componet need to check onFocus workig or not in og and tc
// * make styles supprate in reusable components 
* adjust monaco editor font size 
 */


const initialState = {
    title: '',
    description: '',
    keywords: '',
    canonicalUrl: { value: '', isValid: true },
    revisitDays: 1,
    revisitDaysError: '',
    author: '',
    finalOutput: '',
    robotsAllowed: 'yes',
    robotsFollowLink: 'yes',
    contentType: 'UTF-8',
    primaryLanguage: 'EngLish',
    primaryLanguageManual: '',
    boilerPlate: false,
    headTitle: '',
    copyBtnDisabled: false,
    livePreview: 1,
    // Open Graph section
    ogTitle: '',
    ogSiteName: '',
    ogDescription: '',
    ogLocale: 'en_US',
    ogLocaleManual: '',
    ogLocaleAlternate: 'none',
    ogLocaleAlternateManual: '',
    ogUrl: { value: '', isValid: true },
    ogType: 'website', //need to verify after done 
    ogImagesInputs: {
        link1: '', 
    },
    ogImagesInputsErrors: {},
    // Twitter card section
    tcType: 'summary',
    tcTitle: '',
    tcUserName: '@',
    tcImgUrl: { value: '', isValid: true },
    tcUrl: { value: '', isValid: true },
    tcDescription: '',
};
const actionTypes = {
    UPDATE_INPUT: 'UPDATE_INPUT',
    UPDATE_OBJECT: 'UPDATE_OBJECT',
    VALIDATE_OBJECT: 'VALIDATE_OBJECT',
    CLEAR_INPUTS: 'CLEAR_INPUTS',
    UPDATE_OG_IMAGES_INPUTS: 'UPDATE_OG_IMAGES_INPUTS',
    UPDATE_OG_IMAGES_INPUTS_ERRORS: 'UPDATE_OG_IMAGES_INPUTS_ERRORS',


};

function inputsReducer(state, action) {
    let newInputs = {};
    let newErrors = {};

    switch (action.type) {
        case actionTypes.UPDATE_INPUT:
            return { ...state, [action.field]: action.value }
        case actionTypes.CLEAR_INPUTS:
            return initialState;
        case actionTypes.UPDATE_OG_IMAGES_INPUTS:
            console.log(`Updating input: ${action.payload.name} - ${action.payload.value}`); // Debugging statement
            return {
                ...state,
                ogImagesInputs: {
                    ...state.ogImagesInputs,
                    [action.payload.name]: action.payload.value,
                },
            };
        case actionTypes.UPDATE_OG_IMAGES_INPUTS_ERRORS:
            return {
                ...state,
                ogImagesInputsErrors: action.payload,
            };
        case 'SET_INPUT_COUNT':
            for (let i = 1; i <= action.payload; i++) {
                if (state.ogImagesInputs[`link${i}`]) {
                    newInputs[`link${i}`] = state.ogImagesInputs[`link${i}`];
                } else {
                    newInputs[`link${i}`] = '';
                }
                if (state.ogImagesInputsErrors[`link${i}`]) {
                    newErrors[`link${i}`] = state.ogImagesInputsErrors[`link${i}`];
                }
            }
            return {
                ...state,
                ogImagesInputs: newInputs,
                ogImagesInputsErrors: newErrors,
            };
        case actionTypes.UPDATE_OBJECT:
            return {
                ...state,
                [action.field]: {
                    ...state[action.field],
                    value: action.value,
                },
            };
        case actionTypes.VALIDATE_OBJECT:
            return {
                ...state,
                [action.field]: {
                    ...state[action.field],
                    isValid: action.isValid,
                },
            };
        default:
            console.error('Unknown action: ' + action.type);
            console.warn('you not added action.type: ' + action.type + ' add and try');
            return state;
    }
}

export default function MetaTagsGenrator() {
    const [state, dispatch] = useReducer(inputsReducer, initialState)
    const {
        title,
        description,
        keywords,
        canonicalUrl,
        revisitDays,
        revisitDaysError,
        author,
        robotsAllowed,
        robotsFollowLink,
        contentType,
        primaryLanguage,
        primaryLanguageManual,
        finalOutput,
        boilerPlate,
        headTitle,
        copyBtnDisabled,
        livePreview,
        // Open Graph section
        ogTitle,
        ogSiteName,
        ogDescription,
        ogLocale,
        ogLocaleManual,
        ogLocaleAlternate,
        ogLocaleAlternateManual,
        ogUrl,
        ogType,
        ogImagesInputs,
        ogImagesInputsErrors,
        // Twitter card section
        tcType,
        tcTitle,
        tcUserName,
        tcImgUrl,
        tcUrl,
        tcDescription,
    } = state;

    // console.log(ogImagesLinks);

    const ogInputsFocused = { border: `${ogImagesInputs.link1 || ogUrl.value || ogTitle || ogDescription ? '3px solid green' : ''}` }
    const tcInputFocused = { border: `${tcUrl.value.trim() || tcImgUrl.value.trim() ? '3px solid green' : ''}` }

    const contentTypeOptions = ['UTF-8', 'UTF-16', 'ISO-8859-1', 'WINDOWS-1252', "Don't Use This Tag"];
    const primaryLanguageOptions = [
        'English', 'French', 'Spanish', 'Russian', 'Arabic', 'Japanese', 'Korean',
        'Hindi', 'Portuguese', 'No Language Tag', 'Manually Type'
    ];
    const ogTypeOptions = [
        { text: 'Article', value: 'article' },
        { text: 'Book', value: 'book' },
        { text: 'Book Author', value: 'books.author' },
        { text: 'Book Genre', value: 'books.genre' },
        { text: 'Business', value: 'business.business' },
        { text: 'Fitness Course', value: 'fitness.course' },
        { text: 'Music Album', value: 'music.album' },
        { text: 'Music Musician', value: 'music.musician' },
        { text: 'Music Playlist', value: 'music.playlist' },
        { text: 'Music Radio Station', value: 'music.radio_station' },
        { text: 'Music Song', value: 'music.song' },
        { text: 'Object (Generic Object)', value: 'object' },
        { text: 'Place', value: 'place' },
        { text: 'Product', value: 'product' },
        { text: 'Product Group', value: 'product.group' },
        { text: 'Product Item', value: 'product.item' },
        { text: 'Profile', value: 'profile' },
        { text: 'Election', value: 'quick_election.election' },
        { text: 'Restaurant', value: 'restaurant' },
        { text: 'Restaurant Menu', value: 'restaurant.menu' },
        { text: 'Restaurant Menu Item', value: 'restaurant.menu_item' },
        { text: 'Restaurant Menu Section', value: 'restaurant.menu_section' },
        { text: 'Video Episode', value: 'video.episode' },
        { text: 'Video Movie', value: 'video.movie' },
        { text: 'Video TV Show', value: 'video.tv_show' },
        { text: 'Video Other', value: 'video.other' },
        { text: 'Website (default)', value: 'website' },
    ];
    const ogLocaleOptions = [
        { text: 'English (United States)', value: 'en_US' },
        { text: 'English (United Kingdom)', value: 'en_UK' },
        { text: 'Spanish (Spain)', value: 'es_ES' },
        { text: 'Spanish (Mexico)', value: 'es_MX' },
        { text: 'French (France)', value: 'fr_FR' },
        { text: 'French (Canada)', value: 'fr_CA' },
        { text: 'German (Germany)', value: 'de_DE' },
        { text: 'Italian (Italy)', value: 'it_IT' },
        { text: 'Chinese (Simplified, China)', value: 'zh_CN' },
        { text: 'Chinese (Traditional, Taiwan)', value: 'zh_TW' },
        { text: 'Japanese (Japan)', value: 'ja_JP' },
        { text: 'Korean (South Korea)', value: 'ko_KR' },
        { text: 'Russian (Russia)', value: 'ru_RU' },
        { text: 'Arabic (Saudi Arabia)', value: 'ar_SA' },
        { text: 'Portuguese (Brazil)', value: 'pt_BR' },
        { text: 'Manually Type', value: 'manual' },
    ];
    const tcTypeOptions = [
        { text: 'App', value: 'app' },
        { text: 'Player', value: 'player' },
        { text: 'Summary', value: 'summary' },
        { text: 'Summary With Large Image', value: 'summary_large_image' }
    ];

    function renderPreview() {
        const isOgPreview = livePreview === 1 && (ogTitle.trim() || ogDescription.trim() || ogImagesInputs.link1.trim() || ogUrl.value.trim());
        const isTcPreview = livePreview === 2 && (tcImgUrl.value.trim() || tcUrl.value.trim());

        if (isOgPreview || isTcPreview) {
            return (
                <iframe
                    srcDoc={livePreview === 1 ? ogLivePreview : tcLivePreview}
                    title="Live Preview"
                    width={'100%'}
                    height={'100%'}
                    style={{}}
                />
            );
        }
        return null;
    }

    const ogLivePreview = `
    <html style="height: 100%; width: 100%; display: flex; justify-content: center;   align-items: center;">
    <head>
    <head>
    <body style="width: 85%">
        <div style="max-width: 100%; cursor: pointer; ">
            <div
                style="border: 1px solid #dadde1; border-bottom: 0; background-size: cover; background-position: center; background-repeat: no-repeat;">
                <div style="width: 100%; position: relative; padding-top: 52.5%;">
                    <img style="height: 100%; width: 100%; position: absolute; top: 0; object-fit: cover; display: block;" src="${ogImagesInputs.link1}">
                </div>
            </div>
            <div
                style="overflow-wrap: break-word; border: 1px solid #dadde1; background-color: #f2f3f5; padding: 10px 12px; font-family: 'Helvetica';">
                <div style="overflow: hidden; white-space: nowrap; font-size: 12px; color: #606770;">${formatUrl(ogUrl.value)}</div><div
                    style="display: block; height: 46px; max-height: 46px; border-separate: 0; overflow: hidden; break-word; text-align: left; border-spacing: 0px;">
                    <div
                        style="margin-top: 3px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; font-size: 16px; font-weight: 600; line-height: 20px; color: #1d2129;">
                        ${ogTitle}</div>
                    <div
                        style="margin-top: 3px; display: block; height: 18px; max-height: 80px; border-separate: 0; overflow: hidden; white-space: nowrap; break-word; font-size: 14px; line-height: 20px; color: #606770; -webkit-line-clamp: 1; border-spacing: 0px; -moz-box-orient: vertical;">
                        ${ogDescription}</div>
                </div>
            </div>
        </div>
    </body>
    </html>`;

    const tcLivePreview = `
    <html style="height: 100%; width: 100%; display: flex; justify-content: center;   align-items: center;">
    <head>
    <head>
    <body style="width: 100%">
        <div
            style="position: relative; max-width: 100%; cursor: pointer; overflow: hidden; border-radius: 14px; border: 1px solid #e1e8ed; line-height: 1.3em; color: #000; font-family: 'Helvetica', sans-serif;">
            <div style="background-size: cover; background-position: center; background-repeat: no-repeat;">
                <div style="width: 100%; position: relative; padding-top: 52.33%;">
                    <img style="height: 100%; width: 100%; position: absolute; top: 0; object-fit: cover; display: block;" src="${tcImgUrl.value.trim()}">
                </div>
            </div>
            <div
                style="position: absolute; bottom: 2px; left: 2px; font-size: 0.75rem; color: #fff; background-color: rgba(0, 0, 0, 0.4); padding: 2px 4px; border-radius: 4px;">
                ${formatUrl(tcUrl.value)}</div>
        </div>
    </body>
    </html>`;

    function handleFinalOutput() {
        let output = '';
        const urlRegex = /^https?:\/\/(?:www\.)?[a-zA-Z0-9-]+\.[a-zA-Z]{2,}(?:\/[^\s]*)?$/;
        const ogSelectors = () => {
            return ogTitle.trim() !== '' || ogDescription.trim() !== '';
        };

        if (boilerPlate) {
            output += `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${headTitle.trim() ? headTitle : 'Document'}</title>
`;
        }

        if (title.trim()) {
            output += '    <meta name="title" content="' + title.trim() + '">\n';
        }

        if (description.trim()) {
            output += '    <meta name="desciption" content="' + description.trim() + '">\n';
        }

        if (keywords.trim()) {
            output += '    <meta name="keywords" content="' + keywords.trim() + '">\n';
        }

        if (canonicalUrl.value.trim()) {
            output += '    <link rel="canonical" href="' + canonicalUrl.value.trim() + '">\n';
        }

        if (robotsAllowed === 'yes' && robotsFollowLink === 'yes') {
            output += '<meta name="robots" content="index, follow">\n';
        } else if (robotsAllowed === 'no' && robotsFollowLink === 'no') {
            output += '<meta name="robots" content="noindex, nofollow">\n';
        } else if (robotsAllowed === 'yes' && robotsFollowLink === 'no') {
            output += '<meta name="robots" content="index, nofollow">\n';
        } else if (robotsAllowed === 'no' && robotsFollowLink === 'yes') {
            output += '<meta name="robots" content="noindex, follow">\n';
        }

        if (contentType) {
            output += '<meta http-equiv="Content-Type" content="text/html; charset=' + contentType + '">\n';
        }

        if (primaryLanguage !== 'No Language Tag' && primaryLanguage !== 'Manually Type') {
            output += '<meta name="language" content="' + primaryLanguage + '">\n';
        } else if (primaryLanguage === 'Manually Type' && primaryLanguageManual.trim()) {
            output += '<meta name="language" content="' + primaryLanguageManual.trim().charAt(0).toUpperCase() +
                primaryLanguageManual.slice(1) + '">\n';
        }

        if (revisitDays) {
            output += '<meta name="revisit-after" content="' + revisitDays + ' days">\n'; //check description spelling 
        }

        if (author.trim()) {
            output += '<meta name="author" content="' + author.trim() + '">\n';
        }

        if (ogTitle.trim()) {
            output += '<meta property="og:title" content="' + ogTitle.trim() + '">\n';
        }

        if (ogSiteName.trim()) {
            output += '<meta property="og:site_name" content="' + ogSiteName.trim() + '"></meta>\n';
        }

        if (urlRegex.test(ogUrl.value.trim())) {
            output += '<meta property="og:url" content="' + ogUrl.value.trim() + '">\n';
        } else if (!urlRegex.test(ogUrl.value.trim()) && ogUrl.value.trim()) {
            console.log('true');
            toast.warn('URL is not valid', {
                position: 'bottom-right',
                theme: 'dark',
                autoClose: 2400,
            })
        }

        if (ogDescription.trim()) {
            output += '<meta property="og:description" content="' + ogDescription.trim() + '">\n';
        }

        if (ogSelectors() || ogSiteName.trim() !== '') {
            output += '<meta property="og:type" content="' + ogType + '">\n';
        }

        // ogImagesLinks.filter(link => link).forEach((link) => (
        //     output += '<meta property="og:image" content="' + link + '">\n'
        // ));

        // not working as expected
        if (ogLocale !== ogLocaleAlternate || (ogLocale !== 'manual' || ogLocaleAlternate !== 'manual')) {
            if (ogLocale !== 'manual') {
                output += '<meta property="og:locale" content="' + ogLocale + '">\n';
            } else if (ogLocale === 'manual' && ogLocaleManual.trim()) {
                output += '<meta property="og:locale" content="' + ogLocaleManual.trim() + '">\n';
            }
            if (ogLocaleAlternate !== 'manual' && ogLocaleAlternate !== 'none') {
                output += '<meta property="og:locale:alternate" content="' + ogLocaleAlternate + '">\n';
            } else if (ogLocaleAlternate === 'manual' && ogLocaleAlternateManual.trim()) {
                output += '<meta property="og:locale:alternate" content="' + ogLocaleAlternateManual.trim() + '">\n';
            }
        } else {
            toast.warn('Open Graph Primary Locale and Alternate Locale not be same ', {
                position: 'bottom-right',
                theme: 'dark',
                autoClose: 3400,
            })
        }
        // not working as expected

        if (ogLocale !== 'manual') {
            output += '<meta property="og:locale" content="' + ogLocale + '">\n';
        } else if (ogLocale === 'manual' && ogLocaleManual.trim() && ogLocale !== ogLocaleManual.trim()) {
            output += '<meta property="og:locale" content="' + ogLocaleManual.trim() + '">\n';
        } else {
            toast.warn('Open Graph Primary Locale and Alternate Locale not be same ', {
                position: 'bottom-right',
                theme: 'dark',
                autoClose: 3400,
            })
        }

        if (ogLocaleAlternate !== 'manual' && ogLocaleAlternate !== 'none') {
            output += '<meta property="og:locale:alternate" content="' + ogLocaleAlternate + '">\n';
        } else if (
            ogLocaleAlternate === 'manual' && ogLocaleAlternateManual.trim() &&
            ogLocaleAlternate !== ogLocaleAlternateManual.trim() && ogLocale !== ogLocaleAlternateManual.trim()
        ) {
            output += '<meta property="og:locale:alternate" content="' + ogLocaleAlternateManual.trim() + '">\n';
        } else {
            toast.warn('Open Graph Primary Locale and Alternate Locale not be same ', {
                position: 'bottom-right',
                theme: 'dark',
                autoClose: 3400,
            })
        }

        if (tcType) {
            output += '<meta name="twitter:card" content="' + tcType + '">\n';
        }

        if (tcTitle.trim()) {
            output += '<meta name="twitter:title" content="' + tcTitle.trim() + '">\n';
        }

        if (tcUserName.trim() && tcUserName !== '@') {
            output += '<meta name="twitter:site" content="' + tcUserName.trim() + '">\n';
        }

        if (tcImgUrl.value.trim()) {
            output += '<meta name="twitter:image" content="' + tcImgUrl.value.trim() + '">\n';
        }

        if (tcDescription.trim()) {
            output += '<meta name="twitter:description" content="' + tcDescription.trim() + '">\n';
        }

        if (boilerPlate) {
            output += `</head>
    <body>



    </body>
</html>`
        }

        UPDATE_INPUT('finalOutput', output);
    }


    function formatUrl(url) {
        url = url.replace(/^(https?:\/\/)?/, '');
        url = url.replace(/^www./, '');
        const domain = url.split('/')[0];
        const formattedUrl = domain.charAt(0).toUpperCase() + domain.slice(1);
        return formattedUrl;
    }

    async function handleCopyBtn() {
        try {
            UPDATE_INPUT('copyBtnDisabled', true);
            await navigator.clipboard.writeText(finalOutput);
            toast.success('text-copied', {
                position: 'bottom-right',
                theme: 'dark',
                autoClose: 1700,
                onClose: () => UPDATE_INPUT('copyBtnDisabled', false)
            });
        } catch {
            UPDATE_INPUT('copyBtnDisabled', true);
            toast.warn('text-not-copied', {
                position: 'bottom-right',
                theme: 'dark',
                autoClose: 2400,
                onClose: () => UPDATE_INPUT('copyBtnDisabled', false)
            })
        }
    }

    function UPDATE_INPUT(field, value) {
        dispatch({ type: actionTypes.UPDATE_INPUT, field: field, value: value })
    }

    const handleUrlChange = (field, event) => {
        const value = event.target.value;
        dispatch({ type: actionTypes.UPDATE_OBJECT, field, value });
    };

    const validateUrl = (field) => {
        const url = state[field].value.trim();
        if (url === '') {
            dispatch({ type: actionTypes.VALIDATE_OBJECT, field, isValid: true });
            return;
        }
        const urlRegex = /^(ftp|http|https):\/\/[^ "]+$/;
        const isValid = urlRegex.test(url);
        console.log(isValid);
        dispatch({ type: actionTypes.VALIDATE_OBJECT, field, isValid });
    };


    // function handleOgNumberOfImages(count) {
    //     dispatch({ type: actionTypes.TOGGLE_OG_NUMBER_OF_IMAGES, payload: count });
    // }

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        dispatch({ type: actionTypes.UPDATE_OG_IMAGES_INPUTS, payload: { name, value } });
    };

    const validateInput = (input) => {
        const pattern = new RegExp('^(https?:\\/\\/)?' + // protocol
            '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // domain name
            '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
            '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
            '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
            '(\\#[-a-z\\d_]*)?$', 'i'); // fragment locator
        return !!pattern.test(input);
    };

    function handleBlur(e) {
        const { name, value } = e.target;
        let newErrors = { ...ogImagesInputsErrors };

        if (value === '') {
            delete newErrors[name];
        } else if (!validateInput(value)) {
            newErrors[name] = 'Invalid URL';
        } else { 
            delete newErrors[name];
        }

        dispatch({ type: actionTypes.UPDATE_OG_IMAGES_INPUTS_ERRORS, payload: newErrors });
    }


    function handleOgNumberOfImages(count) {
        dispatch({ type: 'SET_INPUT_COUNT', payload: count });
    }

    function hanldeSetLivePreview(previewTab) {
        UPDATE_INPUT('livePreview', previewTab);
    }

    function handleRevisitDays(value) {
        if (value === '') {
            UPDATE_INPUT('revisitDays', '');
            return;
        }
        if (!/^\d+$/.test(value)) {
            UPDATE_INPUT('revisitDaysError', 'Only numbers are allowed');
            return;
        }
        let numericValue = value.replace(/[^0-9]/g, '');
        if (numericValue.startsWith('0')) {
            UPDATE_INPUT('revisitDays', numericValue);
            UPDATE_INPUT('revisitDaysError', 'Minimum value is 1');
        } else if (parseInt(numericValue) > 120) { // Check if the value is greater than 120
            UPDATE_INPUT('revisitDays', numericValue);
            UPDATE_INPUT('revisitDaysError', 'Keep robots revisit below 120 for SEO');
        } else {
            UPDATE_INPUT('revisitDays', numericValue);
            UPDATE_INPUT('revisitDaysError', '');
        }
    }

    const styles = {
        main: { height: '100%', width: '100%', display: 'flex', },
        mainDiv2: { width: '50%', height: 'auto', display: 'flex', flexDirection: 'column', padding: '14px' },
        flexStrech: { display: 'flex', alignItems: 'stretch' },
        label: { color: '#A6A6A6' },
        button: {
            flexGrow: '1', backgroundColor: '#204e84', height: '50px', marginLeft: '5px',
            marginRight: '5px', borderRadius: '5px', color: 'white'
        },
        h60px: { height: '60px', marginBottom: '10px' },
    }

    return (
        <main style={styles.main}>
            <div style={{ ...styles.mainDiv2, overflow: 'scroll' }}>
                <Heading text="Basic SEO" styles={{ marginTop: '0', marginBottom: '8px' }} />
                {boilerPlate && (
                    <div style={styles.flexStrech}>
                        <Input
                            name="headTitle"
                            label="Head Title:"
                            value={headTitle}
                            placeholder="Head title must be within 50 characters"
                            onChange={UPDATE_INPUT}
                            elementHeight="48px"
                            styles={{ height: '24px' }}
                        />
                    </div>
                )}
                <div style={styles.flexStrech}>
                    <Input
                        name="title"
                        label="Site Title:"
                        value={title}
                        placeholder="Title must be within 70 characters"
                        onChange={UPDATE_INPUT}
                        elementHeight="48px"
                        styles={{ height: '24px' }}
                    />
                </div>
                <div style={{ ...styles.flexStrech, height: '90px' }}>
                    <Input
                        name="description"
                        label="Site Description"
                        elementType="textarea"
                        value={description}
                        placeholder="Description must be within 150 characters"
                        onChange={UPDATE_INPUT}
                    />
                    <Input
                        name="keywords"
                        label="Site KeyWords (Separate with commas):"
                        elementType="textarea"
                        value={keywords}
                        placeholder="keyword1, keyword2, keyword3"
                        onChange={UPDATE_INPUT}
                    />
                </div>
                <div style={styles.flexStrech}>
                    <Input
                        name="canonicalUrl"
                        type="url"
                        label="Canonical URL:"
                        value={canonicalUrl.value}
                        showError={canonicalUrl.isValid}
                        onChange={handleUrlChange}
                        onBlur={validateUrl}
                        placeholder="Enter canonical URL..."
                        elementHeight="35%"
                    />
                </div>
                <div style={{ display: 'flex' }}>
                    <YesNoSelect
                        label="Allow Robots to index your Website?"
                        value={`robotsAllowed=${robotsAllowed}`}
                        onChange={UPDATE_INPUT}
                        width="46%"
                    />
                    <YesNoSelect
                        label="Allow robots to follow all links?"
                        value={`robotsFollowLink=${robotsFollowLink}`}
                        onChange={UPDATE_INPUT}
                        width="53%"
                    />
                </div>
                <div style={{ display: 'flex', height: '87px' }}>
                    <SelectInput
                        name="contentType"
                        value={contentType}
                        onChange={UPDATE_INPUT}
                        options={contentTypeOptions.map(type => ({ text: type, value: type }))}
                        label="What type of content will your site display?"
                        width="46%"
                    />
                    <LanguageSelector
                        label="What is your site primary language?"
                        name="primaryLanguage"
                        value={primaryLanguage}
                        onChange={UPDATE_INPUT}
                        options={primaryLanguageOptions.map(language => ({ text: language, value: language }))}
                        inputName="primaryLanguageManual"
                        inputPlaceholder="Enter Primary Language"
                        manualInputValue={primaryLanguageManual}
                        handleManualInput={UPDATE_INPUT}
                        divStyles={{ width: '53%', height: '87px' }}
                        inputStyles={{ marginLeft: '0' }}
                        showManualInput={primaryLanguage === 'Manually Type'}
                    />
                </div>
                <div style={styles.h60px}>
                    <label style={styles.label} htmlFor="revisitDays">Search engines should revisit this page after</label>
                    <input
                        id="revisitDays"
                        min={1}
                        value={revisitDays}
                        style={{ width: '20%', marginLeft: '10px', marginRight: '10px', borderRadius: '4px' }}
                        type="text"
                        onChange={e => handleRevisitDays(e.target.value)}
                    />
                    <span style={styles.label}>days</span>
                    {revisitDaysError && (
                        <div style={{
                            marginLeft: '25px',
                            display: 'inline',
                            border: '2px solid orange',
                            color: 'white',
                            borderRadius: '8px',
                            padding: '7px',
                            fontSize: '0.85rem',
                            backgroundColor: 'rgba(255, 87, 34, 0.1)'
                        }}>
                            <span style={{
                                position: 'relative',
                                left: '-25px',
                                bottom: '-3px',
                                display: 'inline-block',
                                width: 0,
                                height: 0,
                                borderTop: '7px solid transparent',
                                borderBottom: '7px solid transparent',
                                borderRight: '10px solid orange',
                            }}></span>
                            {revisitDaysError}
                        </div>
                    )}
                </div>
                <div style={styles.h60px}>
                    <label style={styles.label} htmlFor="author">Author</label>
                    <input
                        id="author"
                        type="text"
                        value={author}
                        style={{ width: '54%', marginLeft: '10px', marginRight: '10px', borderRadius: '4px' }}
                        onChange={e => UPDATE_INPUT('author', e.target.value)}
                    />
                </div>
                <Heading text="Open Graph" />
                <div style={styles.flexStrech}>
                    <div style={{ flexGrow: '1', }}>
                        <div style={{ height: '60px' }}>
                            <Input
                                name="ogTitle"
                                label="Title:"
                                elementType="input"
                                value={ogTitle}
                                placeholder="Title of your content"
                                onChange={UPDATE_INPUT}
                                styles={{ height: '26px', ...ogInputsFocused }}
                                onFocus={() => hanldeSetLivePreview(1)}
                            />
                        </div>
                        <div style={{ height: '60px' }}>
                            <Input
                                name="ogSiteName"
                                label="Site Name:"
                                elementType="input"
                                value={ogSiteName}
                                placeholder="Name of your website or brand"
                                onChange={UPDATE_INPUT}
                                styles={{ height: '26px' }}
                                onFocus={() => hanldeSetLivePreview(1)}
                            />
                        </div>
                    </div>
                    <div style={{ flexGrow: '1' }}>
                        <Input
                            name="ogDescription"
                            label="Description:"
                            elementType="textarea"
                            value={ogDescription}
                            placeholder="Description must be within 200 characters"
                            onChange={UPDATE_INPUT}
                            styles={ogInputsFocused}
                            onFocus={() => hanldeSetLivePreview(1)}
                        />
                    </div>
                </div>
                <div style={{ ...styles.flexStrech, height: '75px' }}>
                    <LanguageSelector
                        name="ogLocale"
                        label="Primary Locale:"
                        value={ogLocale}
                        onChange={UPDATE_INPUT}
                        onFocus={() => hanldeSetLivePreview(1)}
                        options={ogLocaleOptions}
                        inputName="ogLocaleManual"
                        inputPlaceholder="Enter Pramary Locale"
                        manualInputValue={ogLocaleManual}
                        handleManualInput={UPDATE_INPUT}
                        showManualInput={ogLocale === 'manual'}
                        inputStyles={{ marginLeft: '0' }}
                    />
                    <LanguageSelector
                        name='ogLocaleAlternate'
                        label="Alternate Locale:"
                        value={ogLocaleAlternate}
                        onChange={UPDATE_INPUT}
                        onFocus={() => hanldeSetLivePreview(1)}
                        options={[
                            { text: "Don't Use This Tag", value: 'none' },
                            ...ogLocaleOptions
                        ]}
                        inputName="ogLocaleAlternateManual"
                        inputPlaceholder="Enter Pramary Locale"
                        manualInputValue={ogLocaleAlternateManual}
                        handleManualInput={UPDATE_INPUT}
                        showManualInput={ogLocaleAlternate === 'manual'}
                        inputStyles={{ marginLeft: '0' }}
                    />
                </div>
                <div style={styles.flexStrech}>
                    <div style={{ height: '60px', width: '45.5%' }}>
                        <Input
                            name="ogUrl"
                            type="url"
                            label="Site URL:"
                            value={ogUrl.value}
                            showError={ogUrl.isValid}
                            placeholder="URL of your website"
                            onChange={handleUrlChange}
                            onFocus={() => hanldeSetLivePreview(1)}
                            onBlur={validateUrl}
                            styles={{ height: '26px', ...ogInputsFocused }}
                        />
                    </div>
                    <div style={{ flexGrow: '1', height: '60px', display: 'flex', width: '54%', paddingTop: '9px' }}>
                        <SelectInput
                            label="Type:"
                            name="ogType"
                            value={ogType}
                            onChange={UPDATE_INPUT}
                            options={ogTypeOptions}
                            onFocus={() => hanldeSetLivePreview(1)}
                        />
                        <div style={{ height: '100px', marginLeft: '5px', marginRight: '5px', width: '46%', }}>
                            <label style={styles.label} htmlFor="ogNumberOfImages">Number of Images</label>
                            <select
                                id="ogNumberOfImages"
                                onChange={(e) => handleOgNumberOfImages(parseInt(e.target.value))}
                                style={{ width: '100%', borderRadius: '2px', textAlign: 'center', }}
                            >
                                {[...Array(10)].map((_, index) => (
                                    <option key={index + 1} value={index + 1}>{index + 1}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>
                <div>
                    {Object.keys(ogImagesInputs).map((name, index) => (
                        <>
                            <label style={styles.label} htmlFor={name}>{index === 0 ? 'Images URL:' : ''}</label>
                            {Object.keys(ogImagesInputsErrors).length > 0 && index === 0 && (
                                <div style={{
                                    position: 'relative', bottom: '1px', marginLeft: '25px', display: 'inline',
                                    border: '2px solid orange', color: 'white', borderRadius: '8px',
                                    paddingTop: '2.4px', paddingBottom: '3px', paddingRight: '8px',
                                    fontSize: '0.78rem', backgroundColor: 'rgba(255, 87, 34, 0.1)'
                                }}>
                                    <span style={{
                                        position: 'relative',
                                        left: '-18px',
                                        bottom: '-3px',
                                        display: 'inline-block',
                                        width: 0,
                                        height: 0,
                                        borderTop: '7px solid transparent',
                                        borderBottom: '7px solid transparent',
                                        borderRight: '10px solid orange',
                                    }}></span>
                                    Please enter Valid Url Image at {Object.keys(ogImagesInputsErrors).map((key) => key.replace('link', '')).join(', ')}
                                </div>
                            )}
                            <input
                                key={index}
                                type="url"
                                name={name}
                                value={ogImagesInputs[name]}
                                placeholder={`Image URL ${index + 1}`}
                                onChange={handleInputChange}
                                onBlur={handleBlur}
                                style={{
                                    marginTop: '5px', marginBottom: `2px`, width: '100%', height: '20px',
                                    borderRadius: '5px', resize: 'none'
                                }}
                            />
                        </>
                    ))}

                    {/* testing */}
                </div>
                <Heading text="Twitter Card" />
                <div style={styles.flexStrech}>
                    <div style={{ flexGrow: '1', }}>
                        <Input
                            name="tcTitle"
                            label="Site Title (Characters left: 70):"
                            elementType="input"
                            value={tcTitle}
                            placeholder="Title must be within 70 Characters"
                            onChange={UPDATE_INPUT}
                            onFocus={() => hanldeSetLivePreview(2)}
                            styles={{ height: '26px' }}
                            elementHeight="40%"
                        />
                        <div style={{ height: '60px' }}>
                            <Input
                                name="tcUrl"
                                type="url"
                                label="Site Url: "
                                elementType="input"
                                value={tcUrl.value}
                                showError={tcUrl.isValid}
                                onBlur={validateUrl}
                                placeholder="URL of your website"
                                onChange={handleUrlChange}
                                onFocus={() => hanldeSetLivePreview(2)}
                                styles={{ height: '26px', ...tcInputFocused }}
                            />
                        </div>
                    </div>
                    <div style={{ flexGrow: '1' }}>
                        <div style={{ height: '60px' }}>
                            <Input
                                name="tcUserName"
                                label="Site Username:"
                                elementType="input"
                                value={tcUserName}
                                placeholder=" UserName must be within 60 Characters"
                                onChange={UPDATE_INPUT}
                                onFocus={() => hanldeSetLivePreview(2)}
                                styles={{ height: '26px' }}
                            />
                        </div>
                        <div style={{ height: '60px' }}>
                            <SelectInput
                                name="tcType"
                                label="Type:"
                                value={tcType}
                                onChange={UPDATE_INPUT}
                                onFocus={() => hanldeSetLivePreview(2)}
                                options={tcTypeOptions}
                                styles={{ marginTop: '10px', height: '20px' }}
                            />
                        </div>
                    </div>
                </div>
                <div style={styles.flexStrech}>
                    <Input
                        name="tcImgUrl"
                        type="url"
                        label="Image URL:"
                        value={tcImgUrl.value}
                        showError={tcImgUrl.isValid}
                        onBlur={validateUrl}

                        placeholder="with http:// or https://"
                        onChange={handleUrlChange}
                        onFocus={() => hanldeSetLivePreview(2)}
                        styles={{ height: '26px', ...tcInputFocused }}
                    />
                </div>
                <div style={styles.flexStrech}>
                    <Input
                        name="tcDescription"
                        label="Description (Characters left: 200):"
                        elementType="textarea"
                        value={tcDescription}
                        placeholder="Up to 200 characters"
                        onChange={UPDATE_INPUT}
                        onFocus={() => hanldeSetLivePreview(2)}
                    />
                </div>
            </div>
            <div style={styles.mainDiv2}>
                <div style={{ height: '46%', border: '2px solid transparent', zIndex: '10' }}>
                    <div style={{ ...styles.flexStrech, ...styles.h60px }}>
                        <div style={{ width: '40px' }}>
                            <label
                                htmlFor="boilerPlate"
                                style={{ fontSize: '0.74rem', color: 'white', position: 'relative', right: '26px', textAlign: 'center' }}
                            >BoilerPlate:
                            </label>
                            <input
                                id="boilerPlate"
                                type="checkbox"
                                checked={boilerPlate}
                                onChange={e => UPDATE_INPUT('boilerPlate', e.target.checked)}
                            />
                        </div>
                        <button style={styles.button} onClick={handleFinalOutput}>Genrate Meta Tags</button>
                        <button style={styles.button} onClick={handleCopyBtn} disabled={copyBtnDisabled}>copy to clipboard</button>
                        <button style={styles.button} onClick={() => dispatch({ type: actionTypes.CLEAR_INPUTS })}>clear Inputs</button>
                    </div>
                    <MonacoEditor
                        language="html"
                        theme="vs-dark"
                        height={'87%'}
                        value={finalOutput}
                        options={{
                            minimap: { enabled: false },
                            lineNumber: true,
                            readOnly: true,
                            fontSize: 12.5,
                        }}
                    />
                </div>
                <div style={{ height: '54%' }}>
                    {renderPreview()}
                </div>
            </div>
        </main >
    );
}

function Heading({ text, styles }) {
    const stylesObject = {
        height: '40px', marginBottom: '20px', marginTop: '20px', fontSize: '1.8rem', color: '#cecece', textAlign: 'center', borderRadius: '10px',
        background: 'linear-gradient(277deg, rgba(42, 42, 42, 1) 3%, rgba(92, 92, 92, 1) 32%, rgba(177, 176, 176, 1) 51%, rgba(92, 92, 92, 1) 68%, rgba(42, 42, 42, 1) 100%)',
        ...styles
    };

    return <h2 style={stylesObject}>{text}</h2>
}
Heading.propTypes = {
    text: PropTypes.string.isRequired,
    styles: PropTypes.object,
};

function Input({
    name,
    label = '',
    elementType = 'input',
    type = 'text',
    value,
    placeholder = '',
    onChange,
    onBlur,
    showError,
    styles = {},
    elementHeight = '60%',
    noDivMargin,
    onFocus,
}) {
    const InputComponent = elementType === 'textarea' ? 'textarea' : 'input';
    const style = {
        div: {
            paddingLeft: noDivMargin ? '0' : '5px', paddingRight: noDivMargin ? '0' : '5px', flexGrow: '1',
            marginBottom: '10px', height: elementHeight
        },
        input: {
            marginTop: '5px', marginBottom: '12px', width: '100%', height: '100%',
            borderRadius: '5px', resize: 'none', ...styles
        },
        tooltip: {
            position: 'relative', bottom: '3.2px', marginLeft: '25px', display: 'inline',
            border: '2px solid orange', color: 'white', borderRadius: '8px',
            paddingTop: '2.4px', paddingBottom: '3px', paddingRight: '8px',
            fontSize: '0.75rem', backgroundColor: 'rgba(255, 87, 34, 0.1)'
        },
        tooltipTringle: {
            position: 'relative', left: '-16px', bottom: '-12px', display: 'inline-block',
            width: 0, height: 0, borderTop: '7px solid transparent', borderBottom: '7px solid transparent',
            borderRight: '14px solid orange', transform: 'rotate(90deg)'
        },
    }

    return (
        <div style={style.div}>
            {label && (
                <div>
                    <label style={{ color: '#A6A6A6' }} htmlFor={name}>{label + ' '}</label>
                    {!showError && value !== '' && type === 'url' && (
                        <div style={style.tooltip}>
                            <span style={style.tooltipTringle}></span>
                            Please enter valid url
                        </div>
                    )}
                </div>
            )}
            <InputComponent
                style={style.input}
                id={name}
                value={value}
                type={type}
                onChange={name ? e => onChange(name, type === 'url' ? e : e.target.value) : onChange}
                onBlur={name ? () => onBlur(name) : onBlur}
                placeholder={'   ' + placeholder}
                rows={elementType === 'textarea' ? 3 : null}
                onFocus={onFocus}
            />
        </div>
    );
}
Input.propTypes = {
    name: PropTypes.string,
    label: PropTypes.string,
    elementType: PropTypes.oneOf(['input', 'textarea']),
    type: PropTypes.string,
    value: PropTypes.string.isRequired,
    placeholder: PropTypes.string,
    onChange: PropTypes.func.isRequired,
    onBlur: PropTypes.func,
    showError: PropTypes.bool,
    styles: PropTypes.object,
    elementHeight: PropTypes.string,
    noDivMargin: PropTypes.bool,
    onFocus: PropTypes.func,
};

function YesNoSelect({
    label,
    value,
    onChange,
    width = '50%',
    height = '60px'
}) {
    const [name, valueState] = value.split('=');
    const stylesObject = {
        selectorDiv: { marginLeft: '5px', marginRight: '5px', width: width, height: height },
        selector: { width: '100%', borderRadius: '2px', textAlign: 'center', }
    }

    return (
        <div style={stylesObject.selectorDiv}>
            <label style={{ color: '#A6A6A6' }} htmlFor={name}>{label}</label>
            <select
                id={name}
                value={valueState}
                onChange={e => onChange(name, e.target.value)}
                style={stylesObject.selector}
            >
                <option value="yes">Yes</option>
                <option value="no">No</option>
            </select>
        </div>
    )
}
YesNoSelect.propTypes = {
    label: PropTypes.string.isRequired,
    value: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
    width: PropTypes.string,
    height: PropTypes.string
};

function SelectInput({
    name,
    label,
    value,
    onChange,
    onFocus,
    options,
    width = '100%',
    height = '60px',
    styles = {}
}) {
    const stylesObject = {
        selectorDiv: { marginLeft: '5px', marginRight: '5px', width: width, height: height },
        selector: { width: '100%', borderRadius: '2px', textAlign: 'center', ...styles },
    }

    return (
        <div style={stylesObject.selectorDiv}>
            <label style={{ color: '#A6A6A6' }} htmlFor={name}>{label}</label>
            <select
                id={name}
                value={value}
                onChange={e => onChange(name, e.target.value)}
                onFocus={onFocus}
                style={stylesObject.selector}
            >
                {options.map((option, index) => (
                    <option key={index} value={option.value}>{option.text}</option>
                ))}
            </select>
        </div>
    )
}
SelectInput.propTypes = {
    name: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    onChange: PropTypes.func.isRequired,
    onFocus: PropTypes.func,
    options: PropTypes.arrayOf(PropTypes.shape({
        text: PropTypes.string.isRequired,
        value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired
    })).isRequired,
    width: PropTypes.string,
    height: PropTypes.string,
    styles: PropTypes.object,
};

function LanguageSelector({
    name,
    label,
    value,
    onChange,
    onFocus,
    options,
    inputName,
    inputPlaceholder,
    manualInputValue,
    handleManualInput,
    showManualInput,
    divStyles = {},
    inputStyles = {},
}) {
    const stylesObject = {
        selectorDiv: { marginLeft: '5px', marginRight: '5px', width: '50%', height: '100px', ...divStyles },
        selector: { width: '100%', borderRadius: '2px', textAlign: 'center', },
        input: {
            marginLeft: '10px', marginRight: '10px', borderRadius: '4px', width: '100%',
            height: '22px', ...inputStyles
        },
    }

    return (
        <div style={stylesObject.selectorDiv}>
            <label style={{ color: '#A6A6A6' }} htmlFor={name}>{label}</label>
            <select
                style={stylesObject.selector}
                value={value}
                onChange={e => onChange(name, e.target.value)}
                onFocus={onFocus}
                id={name}
            >
                {options.map((option, index) => {
                    if (name === 'primaryLanguage') {
                        return (
                            <option key={index} value={option.value}>{option.value}</option>
                        )
                    } else {
                        return (
                            <option key={index} value={option.value}>
                                {option.value !== 'manual' && option.value !== 'none' ? '[' + option.value + '] ' + ' ' : ' '} {/** problem here */}
                                {option.text}
                            </option>
                        )
                    }
                })}
            </select>
            {showManualInput && (
                <Input
                    name={inputName}
                    styles={stylesObject.input}
                    value={manualInputValue}
                    onChange={handleManualInput}
                    onFocus={onFocus}
                    placeholder={inputPlaceholder}
                    elementHeight="30%"
                    noDivMargin
                />
            )}
        </div>
    );
}
LanguageSelector.propTypes = {
    name: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    value: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
    onFocus: PropTypes.func,
    options: PropTypes.arrayOf(PropTypes.shape({
        text: PropTypes.string.isRequired,
        value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired
    })).isRequired,
    inputName: PropTypes.string.isRequired,
    inputPlaceholder: PropTypes.string,
    manualInputValue: PropTypes.string.isRequired,
    handleManualInput: PropTypes.func.isRequired,
    showManualInput: PropTypes.bool.isRequired,
    divStyles: PropTypes.object,
    inputStyles: PropTypes.object,
};