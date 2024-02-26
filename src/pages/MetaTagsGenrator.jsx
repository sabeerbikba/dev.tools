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
 * need to add trim in if logic in handleFinalOutput fucntion
 * in revistDays input if userType text need to show error only number allowed 
 * need to make responsive when screen is smaller 
 * implement regEx in inputs where possible 
 * in inputs after enter specified charcter notfiy or warn them 
 */

const labelStyles = { color: '#A6A6A6' };

const initialState = {
    title: '',
    descreption: '',
    keywords: '',
    revisitDays: '',
    author: '',
    finalOutput: '',
    robotsAllowed: 'yes',
    robotsFollowLink: 'yes',
    contentType: 'UTF-8',
    primaryLanguage: 'EngLish',
    primaryLanguageManual: '',
    copyBtnDisabled: false,
    // Open Graph section
    ogTitle: '',
    ogSiteName: '',
    ogDescription: '',
    ogLocale: 'en_US',
    ogLocaleManual: '',
    ogLocaleAlternate: 'none',
    ogLocaleAlternateManual: '',
    ogUrl: '',
    ogType: 'website', //need to verify after done 
    ogNumberOfImages: 1,
    // Twitter card section

    ogImagesLinks: [''],
};
const actionTypes = {
    UPDATE_INPUT: 'UPDATE_INPUT',
    CLEAR_INPUTS: 'CLEAR_INPUTS',
    TOGGLE_OG_NUMBER_OF_IMAGES: 'TOGGLE_OG_NUMBER_OF_IMAGES',
    SET_OG_IMAGES_LINKS: 'SET_OG_IMAGES_LINKS'
};

function inputsReducer(state, action) {
    switch (action.type) {
        case actionTypes.UPDATE_INPUT:
            return { ...state, [action.field]: action.value }
        case actionTypes.CLEAR_INPUTS:
            return initialState;
        case actionTypes.TOGGLE_OG_NUMBER_OF_IMAGES:
            return {
                ...state,
                ogNumberOfImages: action.payload,
                ogImagesLinks: Array.from({ length: action.payload }, (_, index) => state.ogImagesLinks[index] || '')
            };
        case actionTypes.SET_OG_IMAGES_LINKS:
            return {
                ...state,
                ogImagesLinks: state.ogImagesLinks.map((value, index) => index === action.index ? action.payload : value)
            };
        default:
            console.error('Unknown action: ' + action.type);
            console.warn('you not added action.type: ' + action.type + ' add and try');
            return state;
    }
}

export default function MetaTagsGenrator() {
    const [inputs, dispatch] = useReducer(inputsReducer, initialState)
    const {
        title,
        descreption,
        keywords,
        revisitDays,
        author,
        robotsAllowed,
        robotsFollowLink,
        contentType,
        primaryLanguage,
        primaryLanguageManual,
        finalOutput,
        copyBtnDisabled,
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
        ogNumberOfImages,
        ogImagesLinks,
        // Twitter card section

    } = inputs

    const ogInputsFocused = { border: `${ogImagesLinks[0] || ogUrl || ogTitle || ogDescription ? '2px solid teal' : ''}` }

    const contentTypeOptions = ['UTF-8', 'UTF-16', 'ISO-8859-1', 'WINDOWS-1252', "Don't Use This Tag"];
    const primaryLanguageOptions = ['English', 'French', 'Spanish', 'Russian', 'Arabic', 'Japanese', 'Korean', 'Hindi', 'Portuguese', 'No Language Tag', 'Manually Type'];
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
    const yesNoOptions = () => {
        return (
            <>
                <option value="yes">Yes</option>
                <option value="no">No</option>
            </>
        )
    }
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

    const renderImagesInputs = () => {
        const inputs = [];
        for (let i = 0; i < ogNumberOfImages; i++) {
            const label = i === 0 ? 'Image URL' : '';
            inputs.push(
                <Input
                    key={i}
                    label={label}
                    styles={{ height: '24px', ...ogInputsFocused }}
                    elementType="input"
                    value={ogImagesLinks[i]}
                    placeholder={`Image URL ${i + 1}`}
                    elementHeight={i === 0 ? '45px' : '22px'}
                    handleInput={(e) => handleOgImagesLinks(i, e.target.value)}
                />
            );
        }
        return inputs;
    };

    const ogLivePreview = `
    <html style="height: 100%; width: 100%; display: flex; justify-content: center;   align-items: center;">
    <head>
    <head>
    <body style="width: 90%">
        <div style="max-width: 100%; cursor: pointer; ">
            <div
                style="border: 1px solid #dadde1; border-bottom: 0; background-size: cover; background-position: center; background-repeat: no-repeat;">
                <div style="width: 100%; position: relative; padding-top: 52.5%;">
                    <img style="height: 100%; width: 100%; position: absolute; top: 0; object-fit: cover; display: block;" src="${ogImagesLinks[0]}">
                </div>
            </div>
            <div
                style="overflow-wrap: break-word; border: 1px solid #dadde1; background-color: #f2f3f5; padding: 10px 12px; font-family: 'Helvetica';">
                <div style="overflow: hidden; white-space: nowrap; font-size: 12px; color: #606770;">${formatUrl(ogUrl)}</div><div
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
    </html>`

    function handleFinalOutput() {
        let output = '';
        const urlRegex = /^https?:\/\/(?:www\.)?[a-zA-Z0-9-]+\.[a-zA-Z]{2,}(?:\/[^\s]*)?$/;
        const ogSelectors = () => {
            return ogTitle.trim() !== '' || ogDescription.trim() !== '';
        };

        if (title.trim()) {
            output += '<meta name="title" content="' + title.trim() + '">\n';
        }

        if (descreption.trim()) {
            output += '<meta name="desciption" content="' + descreption.trim() + '">\n'; //check descreption spelling 
        }

        if (keywords.trim()) {
            output += '<meta name="keywords" content="' + keywords.trim() + '">\n';
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
            output += '<meta name="language" content="' + primaryLanguageManual.trim().charAt(0).toUpperCase() + primaryLanguageManual.slice(1) + '">\n';
        }

        if (revisitDays.trim()) {
            output += '<meta name="revisit-after" content="' + revisitDays.trim() + ' days">\n'; //check descreption spelling 
        }

        if (author.trim()) {
            output += '<meta name="author" content="' + author.trim() + '">\n';
        }

        if (ogTitle.trim()) {
            output += '<meta property="og:title" content="' + ogTitle.trim() + '">\n';
        }

        if (ogSiteName.trim()) {
            output += '<meta property="og:site_name" content="' + ogSiteName.trim() + '"></meta>\n'
        }

        if (urlRegex.test(ogUrl.trim())) {
            output += '<meta property="og:url" content="' + ogUrl.trim() + '">\n'
        } else if (!urlRegex.test(ogUrl.trim()) && ogUrl.trim()) {
            console.log('true');
            toast.warn('URL is not valid', {
                position: 'bottom-right',
                theme: 'dark',
                autoClose: 2400,
            })
        }

        if (ogDescription.trim()) {
            output += '<meta property="og:description" content="' + ogDescription.trim() + '">\n'
        }

        if (ogSelectors() || ogSiteName.trim() !== '') {
            output += '<meta property="og:type" content="' + ogType + '">\n'
        }

        // if (ogSelectors()) {
        ogImagesLinks.filter(link => link).forEach((link) => (
            output += '<meta property="og:image" content="' + link + '">\n'
        ));
        // }

        if (ogLocale !== ogLocaleAlternate && (ogLocale !== 'manual' && ogLocaleAlternate == 'manual')) {
            if (ogLocale !== 'manual') {
                output += '<meta property="og:locale" content="' + ogLocale + '">\n'
            } else if (ogLocale === 'manual' && ogLocaleManual.trim()) {
                output += '<meta property="og:locale" content="' + ogLocaleManual.trim() + '">\n'
            }
            if (ogLocaleAlternate !== 'manual' && ogLocaleAlternate !== 'none') {
                output += '<meta property="og:locale:alternate" content="' + ogLocaleAlternate + '">'
            } else if (ogLocaleAlternate === 'manual' && ogLocaleAlternateManual.trim()) {
                output += '<meta property="og:locale:alternate" content="' + ogLocaleAlternateManual.trim() + '">'
            }
        } else {
            toast.warn('Open Graph Primary Locale and Alternate Localte not be same ', {
                position: 'bottom-right',
                theme: 'dark',
                autoClose: 3400,
            })
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

    function handleOgNumberOfImages(count) {
        dispatch({ type: actionTypes.TOGGLE_OG_NUMBER_OF_IMAGES, payload: count });
    }

    function handleOgImagesLinks(index, value) {
        dispatch({ type: actionTypes.SET_OG_IMAGES_LINKS, index, payload: value });
    }

    const styles = {
        main: { height: '100%', width: '100%', display: 'flex', },
        mainDiv2: { width: '50%', height: 'auto', display: 'flex', flexDirection: 'column', padding: '14px' },
        flex: { display: 'flex' },
        flexStrech: { display: 'flex', alignItems: 'stretch' },
        selectorDiv: { height: '100px', marginLeft: '5px', marginRight: '5px' },
        selector: { width: '100%', borderRadius: '2px', textAlign: 'center' },
        input: { marginLeft: '10px', marginRight: '10px', borderRadius: '4px' },
        button: { flexGrow: '1', backgroundColor: '#204e84', height: '50px', marginLeft: '5px', marginRight: '5px', borderRadius: '5px', color: 'white' },
        h2: { height: '40px', marginBottom: '20px', marginTop: '20px', fontSize: '1.8rem', color: '#cecece', textAlign: 'center', borderRadius: '10px', background: 'linear-gradient(277deg, rgba(42, 42, 42, 1) 3%, rgba(92, 92, 92, 1) 32%, rgba(177, 176, 176, 1) 51%, rgba(92, 92, 92, 1) 68%, rgba(42, 42, 42, 1) 100%)', },
        h60px: { height: '60px', marginBottom: '10px' },
        'h54%': { height: '30%' },
    }

    return (
        <main style={styles.main}>
            <div style={{ ...styles.mainDiv2, overflow: 'scroll' }}>
                <div style={styles.flexStrech}>
                    <Input
                        label="Site Title:"
                        elementType="input"
                        type='text'
                        value={title}
                        placeholder="Title must be within 70 characters"
                        handleInput={e => UPDATE_INPUT('title', e.target.value)}
                        elementHeight="48px"
                        styles={{ height: '24px' }}
                    />
                </div>
                <div style={styles.flexStrech}>
                    <Input
                        label="Site Descreption"
                        elementType="textarea"
                        value={descreption}
                        placeholder="Descreption must be within 150 characters"
                        handleInput={e => UPDATE_INPUT('descreption', e.target.value)}
                    />
                    <Input
                        label="Site KeyWords (Separate with commas)"
                        elementType="textarea"
                        value={keywords}
                        placeholder="keyword1, keyword2, keyword3"
                        handleInput={e => UPDATE_INPUT('keywords', e.target.value)}
                    />
                </div>
                <div style={styles.flex}>
                    <div style={{ ...styles.selectorDiv, width: '46%', height: '60px' }}>
                        <label style={labelStyles} htmlFor="robotsAllowed">Allow Robots to index your Website?</label>
                        <select
                            id="robotsAllowed"
                            value={robotsAllowed}
                            onChange={e => UPDATE_INPUT('robotsAllowed', e.target.value)}
                            style={styles.selector}
                        >{yesNoOptions()}
                        </select>
                    </div>
                    <div style={{ ...styles.selectorDiv, width: '53%', height: '60px' }}>
                        <label style={labelStyles} htmlFor="robotsFollowLink">Allow robots to follow all links?</label>
                        <select
                            id="robotsFollowLink"
                            value={robotsFollowLink}
                            onChange={e => UPDATE_INPUT('robotsFollowLink', e.target.value)}
                            style={styles.selector}
                        >{yesNoOptions()}
                        </select>
                    </div>
                </div>
                <div style={{ ...styles.flex, height: '87px' }}>
                    <div style={{ ...styles.selectorDiv, width: '46%', }}>
                        <label style={labelStyles} htmlFor="contentType">What type of content will your site display?</label>
                        <select
                            id="contentType"
                            value={contentType}
                            onChange={e => UPDATE_INPUT('contentType', e.target.value)}
                            style={styles.selector}
                        >{contentTypeOptions.map(type => (
                            <option key={type} value={type}>{type}</option>
                        ))}
                        </select>
                    </div>
                    <div style={{ ...styles.selectorDiv, width: '53%' }}>
                        <label style={labelStyles} htmlFor="primaryLanguage">What is your site primary language?</label>
                        <select
                            id="primaryLanguage"
                            value={primaryLanguage}
                            onChange={e => UPDATE_INPUT('primaryLanguage', e.target.value)}
                            style={styles.selector}
                        >{primaryLanguageOptions.map(language => (
                            <option key={language} value={language}>{language}</option>
                        ))}
                        </select>
                        {primaryLanguage === 'Manually Type' && (
                            <Input
                                styles={{ ...styles.input, marginLeft: '0', width: '100%', height: '22px' }}
                                value={primaryLanguageManual}
                                handleInput={e => UPDATE_INPUT('primaryLanguageManual', e.target.value)}
                                placeholder="Enter Primary Language"
                                elementHeight="30%"
                                noDivMargin
                            />
                        )}
                    </div>
                </div>
                <div style={styles.h60px}>
                    <label style={labelStyles} htmlFor="revisitDays">Search engines should revisit this page after</label>
                    <input
                        id="revisitDays"
                        min={1}
                        // max={730} // 2years
                        value={revisitDays}
                        style={{ width: '20%', ...styles.input }}
                        type="number"
                        onChange={e => UPDATE_INPUT('revisitDays', e.target.value)}
                    />
                    <span style={labelStyles}>days</span>
                </div>
                <div style={styles.h60px}>
                    <label style={labelStyles} htmlFor="author">Author</label>
                    <input
                        id="author"
                        type="text" value={author}
                        style={{ width: '54%', ...styles.input }}
                        onChange={e => UPDATE_INPUT('author', e.target.value)}
                    />
                </div>
                <h2 style={styles.h2}>Open Graph </h2>
                <div style={styles.flexStrech}>
                    <div style={{ flexGrow: '1', }}>
                        <div style={{ height: '60px' }}>
                            <Input
                                label="Title:"
                                elementType="input"
                                value={ogTitle}
                                placeholder="Title of your content"
                                handleInput={e => UPDATE_INPUT('ogTitle', e.target.value)}
                                styles={{ height: '26px', ...ogInputsFocused }}
                            />
                        </div>
                        <div style={{ height: '60px' }}>
                            <Input
                                label="Site Name:"
                                elementType="input"
                                value={ogSiteName}
                                placeholder="Name of your website or brand"
                                handleInput={e => UPDATE_INPUT('ogSiteName', e.target.value)}
                                styles={{ height: '26px' }}
                            />
                        </div>
                    </div>
                    <div style={{ flexGrow: '1' }}>
                        <Input
                            label="Description:"
                            elementType="textarea"
                            value={ogDescription}
                            placeholder="Descreption must be within 200 characters"
                            handleInput={e => UPDATE_INPUT('ogDescription', e.target.value)}
                            styles={ogInputsFocused}
                        />
                    </div>
                </div>
                <div style={{ ...styles.flexStrech, height: '75px' }}>

                    <div style={{ ...styles.selectorDiv, width: '50%' }}>
                        <label style={labelStyles} htmlFor="ogLocale">Primary Locale:</label>
                        <select
                            style={styles.selector}
                            value={ogLocale}
                            onChange={e => UPDATE_INPUT('ogLocale', e.target.value)}
                            id="ogLocale">
                            {/* <option value=""></option> */}
                            {ogLocaleOptions.map((option, index) => (
                                <option key={index} value={option.value}>
                                    {option.value !== 'manual' ? '[' + option.value + '] ' + ' ' : ' '}
                                    {option.text}
                                </option>
                            ))}
                        </select>
                        {ogLocale === 'manual' && (
                            <Input
                                styles={{ ...styles.input, marginLeft: '0', width: '100%', height: '22px' }}
                                value={ogLocaleManual}
                                handleInput={e => UPDATE_INPUT('ogLocaleManual', e.target.value)}
                                placeholder="Enter Pramary Locale"
                                elementHeight="30%"
                                noDivMargin
                            />
                        )}
                    </div>
                    <div style={{ ...styles.selectorDiv, width: '50%', height: '60px' }}>
                        <label style={labelStyles} htmlFor="ogLocaleAlternate">Alternate Locale:</label>
                        <select
                            style={styles.selector}
                            value={ogLocaleAlternate}
                            onChange={e => UPDATE_INPUT('ogLocaleAlternate', e.target.value)}
                            id="ogLocaleAlternate">
                            <option value="none">Don&apos;t Use This Tag</option>
                            {ogLocaleOptions.map((option, index) => (
                                <option key={index} value={option.value}>
                                    {option.value !== 'manual' ? '[' + option.value + '] ' + ' ' : ' '}
                                    {option.text}
                                </option>
                            ))}
                        </select>
                        {ogLocaleAlternate === 'manual' && (
                            <Input
                                styles={{ ...styles.input, marginLeft: '0', width: '100%', height: '22px' }}
                                value={ogLocaleAlternateManual}
                                handleInput={e => UPDATE_INPUT('ogLocaleAlternateManual', e.target.value)}
                                placeholder="Enter Pramary Locale"
                                elementHeight="30%"
                                noDivMargin
                            />
                        )}
                    </div>
                </div>
                <div style={styles.flexStrech}>
                    <div style={{ height: '60px', width: '45.5%' }}>
                        <Input
                            label="Site URL:"
                            elementType="input"
                            value={ogUrl}
                            placeholder="URL of your website"
                            handleInput={e => UPDATE_INPUT('ogUrl', e.target.value)}
                            styles={{ height: '26px', ...ogInputsFocused }}
                        />
                    </div>
                    <div style={{ flexGrow: '1', height: '60px', display: 'flex', width: '54%', paddingTop: '9px' }}>
                        <div style={{ ...styles.selectorDiv, width: '46%', height: '60px' }}>
                            <label style={labelStyles} htmlFor="ogType">Type</label>
                            <select
                                id="ogType"
                                value={ogType}
                                onClick={e => UPDATE_INPUT('ogType', e.target.value)}
                                style={{ ...styles.selector }}
                            >{ogTypeOptions.map((type, index) => (
                                <option key={index} value={type.value}>{type.text}</option>
                            ))}
                            </select>
                        </div>
                        <div style={{ ...styles.selectorDiv, width: '46%', }}>
                            <label style={labelStyles} htmlFor="ogNumberOfImages">Number of Images</label>
                            <select
                                id="ogNumberOfImages"
                                value={ogNumberOfImages}
                                // onClick={e => UPDATE_INPUT('ogNumberOfImages', e.target.value)}
                                onChange={(e) => handleOgNumberOfImages(parseInt(e.target.value))}
                                style={styles.selector}
                            >{[...Array(10)].map((_, index) => (
                                <option key={index + 1} value={index + 1}>{index + 1}</option>
                            ))}
                            </select>
                        </div>
                    </div>
                </div>
                <div>
                    {renderImagesInputs()}
                </div>


                <h2 style={styles.h2}>Twitter Card</h2>
                <div style={styles.flexStrech}>
                    <div style={{ flexGrow: '1', }}>
                        <div style={{ height: '60px' }}>
                            <Input
                                label="Title:"
                                elementType="input"
                                value={ogTitle}
                                placeholder="Title of your content"
                                handleInput={e => UPDATE_INPUT('ogTitle', e.target.value)}
                                styles={{ height: '26px', ...ogInputsFocused }}
                            />
                        </div>
                        <div style={{ height: '60px' }}>
                            <Input
                                label="Site Name:"
                                elementType="input"
                                value={ogSiteName}
                                placeholder="Name of your website or brand"
                                handleInput={e => UPDATE_INPUT('ogSiteName', e.target.value)}
                                styles={{ height: '26px' }}
                            />
                        </div>
                    </div>
                    <div style={{ flexGrow: '1' }}>
                        <div style={{ height: '60px' }}>
                            <Input
                                label="Title:"
                                elementType="input"
                                value={ogTitle}
                                placeholder="Title of your content"
                                handleInput={e => UPDATE_INPUT('ogTitle', e.target.value)}
                                styles={{ height: '26px', ...ogInputsFocused }}
                            />
                        </div>
                        <div style={{ height: '60px' }}>
                            <Input
                                label="Site Name:"
                                elementType="input"
                                value={ogSiteName}
                                placeholder="Name of your website or brand"
                                handleInput={e => UPDATE_INPUT('ogSiteName', e.target.value)}
                                styles={{ height: '26px' }}
                            />
                        </div>
                    </div>
                </div>

                <div style={styles.flexStrech}>
                    <Input
                        label="Site Descreption"
                        elementType="textarea"
                        value={descreption}
                        placeholder="Descreption must be within 150 characters"
                        handleInput={e => UPDATE_INPUT('descreption', e.target.value)}
                    />
                </div>
            </div>
            <div style={styles.mainDiv2}>
                <div style={{ height: '46%', border: '2px solid transparent' }}>

                    <div style={{ ...styles.flexStrech, ...styles.h60px }}>
                        <button style={styles.button} onClick={handleFinalOutput}>Genrate Meta Tags</button>
                        <button style={styles.button} onClick={handleCopyBtn} disabled={copyBtnDisabled}>copy to clipboard</button>
                        <button style={styles.button} onClick={() => dispatch({ type: actionTypes.CLEAR_INPUTS })}>clear Inputs</button>
                    </div>
                    <MonacoEditor
                        language="html"
                        theme="vs-dark"
                        height={'87%'}
                        value={finalOutput}
                        options={{ minimap: { enabled: false }, lineNumber: true, readOnly: true }}
                    />
                </div>
                <div style={{ height: '54%' }}>
                    {ogTitle.trim() || ogDescription.trim() || ogImagesLinks[0] || ogUrl ? (
                        <iframe
                            srcDoc={ogLivePreview}
                            title="Live Preview"
                            width={'100%'}
                            height={'100%'}
                            style={{}}
                        />
                    ) : null}
                </div>
            </div>

        </main >
    );
}

function Input({
    label = '',
    elementType,
    type = 'text',
    value,
    placeholder = '',
    handleInput,
    styles = {},
    elementHeight = '60%',
    noDivMargin
}) {
    const InputComponent = elementType === 'textarea' ? 'textarea' : 'input';
    const style = {
        div: { paddingLeft: noDivMargin ? '0' : '5px', paddingRight: noDivMargin ? '0' : '5px', flexGrow: '1', marginBottom: '10px', height: elementHeight },
        input: { marginTop: '5px', marginBottom: '12px', width: '100%', height: '100%', borderRadius: '5px' },
    }

    return (
        <div style={style.div}>
            {label && (
                <label style={labelStyles} htmlFor={label}>{label + ' '}</label>
            )}
            <InputComponent
                style={{ ...style.input, ...styles, }}
                id={label}
                value={value}
                type={type}
                onChange={handleInput}
                placeholder={'   ' + placeholder}
                rows={elementType === 'textarea' ? 3 : null}
            />
        </div>
    );
}
Input.propTypes = {
    label: PropTypes.string,
    elementType: PropTypes.oneOf(['input', 'textarea']).isRequired,
    type: PropTypes.string,
    value: PropTypes.string.isRequired,
    placeholder: PropTypes.string,
    handleInput: PropTypes.func.isRequired,
    styles: PropTypes.object,
    elementHeight: PropTypes.string,
    noDivMargin: PropTypes.bool,
};