import PropTypes from 'prop-types';

export default function BrowserExtensions() {
    return (
        <>
            <div className='Browser-extensionsDiv' >
                <div><img src={'./src/assets/website/old/image5.webp'} className='Browser-extensionsImg' /></div>
                <div className='Browser-extensionsHead'>Images Compression</div>
                <p className='Browser-extensionsP' >Compress WebP, PNG and JPEG images to optimize web page loding times</p>
                <div style={{ display: 'flex' }}>
                    <button className='Browser-extensionsBtn' style={{ width: '6rem', borderRadius: '20px 20px 0 0' }}>
                        <a href={null} target='_blank' rel="noreferrer" className='accordion-panel4WebBtnLink'>Visit</a>
                    </button>
                    <button className='Browser-extensionsBtn'>
                        <a href={null} target='_blank' rel="noreferrer" className='accordion-panel4WebBtnLink'>Visit</a>
                    </button>
                </div>
            </div>
        </>
    );
}

function Container({ img, head, pera, docsLink = '', downloadLink, openLink }) {
    // TODO: implement the logic that if user downloaded the extension need to give open link else install link by detecting browser
    const link = downloadLink ? openLink : ''; 
    // if looking good add docs image or svg simmilar to book diery
    return (
        <div className='Browser-extensionsDiv' >
            <div><img src={img} className='Browser-extensionsImg' /></div>
            <div className='Browser-extensionsHead'>{head}</div>
            <p className='Browser-extensionsP' >{pera}</p>
            <div style={{ display: 'flex' }}>
                {docsLink && (
                    <button className='Browser-extensionsBtn' style={{ width: '6rem', borderRadius: '20px 20px 0 0' }}>
                        <a href={docsLink} target='_blank' rel="noreferrer" className='accordion-panel4WebBtnLink'>Docs</a>
                    </button>
                )}

                <button className='Browser-extensionsBtn'>
                    <a href={link} target='_blank' rel="noreferrer" className='accordion-panel4WebBtnLink'>Visit</a>
                </button>
            </div>
        </div>
    )
}
Container.porpTypes = {
    img: PropTypes.string.isRequired,
    head: PropTypes.string.isRequired,
    pera: PropTypes.string,
    downloadLink: PropTypes.string.isRequired,
    openLink: PropTypes.string.isRequired
}