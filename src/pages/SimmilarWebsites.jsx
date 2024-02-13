import { useState } from "react";

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
                <button
                    className={`sw-btn ${website.pageIndex === pageIndex ? 'sw-btn-active' : ''}`}
                    key={website.pageIndex}
                    onClick={() => handleClick(website.pageIndex)}
                >
                    {website.name}
                    <a className="sw-btn-link" href={website.link} target="_blank" rel="noreferrer">visit site</a>
                </button>
            ))}
        </div>
    );
}


function Content({ link }) {
    return (
        <>
            <iframe style={{ borderLeft: '1px solid white' }} src={link} width="100%" height="95%"></iframe>
        </>
    );
}
