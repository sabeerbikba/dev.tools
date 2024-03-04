import { useState } from "react";
import PropTypes from 'prop-types'

const websites = [
    {
        pageIndex: 1,
        name: 'Devtoolbox.co',
        link: "https://www.devtoolbox.co/tools/json-validator"
    },
    {
        pageIndex: 2,
        name: 'Transform.tools',
        link: "https://transform.tools/"
    },
    {
        pageIndex: 3,
        name: 'code Beautify',
        link: 'https://codebeautify.org/'
    }
];

export default function SimilarWebsites() {
    const [pageIndex, setPageIndex] = useState(1);

    function handleClick(index) {
        setPageIndex(index);
    }

    return (
        <>
            <Buttons websites={websites} handleClick={handleClick} pageIndex={pageIndex} />
            <Content link={websites[pageIndex - 1].link} />
        </>
    );
}

function Buttons({ websites, handleClick, pageIndex }) {
    return (
        <div className="pagination">
            {websites.map(website => (
                <div
                    className={`sw-btn-div ${website.pageIndex === pageIndex ? 'sw-btn-active' : ''}`}
                    key={website.pageIndex}
                    onClick={() => handleClick(website.pageIndex)}
                >
                    {website.name}
                    <button className="sw-link-btn">
                        <a className="sw-btn-link" href={website.link} target="_blank" rel="noreferrer">visit site</a>
                    </button>
                </div>
            ))}
        </div>
    );
}
Buttons.propTypes = {
    websites: PropTypes.arrayOf(
        PropTypes.shape({
            name: PropTypes.string.isRequired,
            link: PropTypes.string.isRequired,
            pageIndex: PropTypes.number.isRequired,
        })
    ).isRequired,
    handleClick: PropTypes.func.isRequired,
    pageIndex: PropTypes.number.isRequired,
};

function Content({ link }) {
    return (
        <>
            <iframe style={{ borderLeft: '1px solid white' }} src={link} width="100%" height="95%"></iframe>
        </>
    );
}
Content.propTypes = {
    link: PropTypes.string.isRequired
}