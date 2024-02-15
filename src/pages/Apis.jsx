import { useState } from 'react';
import {
    Accordion,
    AccordionItem,
    AccordionItemHeading,
    AccordionItemButton,
    AccordionItemPanel
} from 'react-accessible-accordion';
import { baseUrl, websites } from '../data/websites2';

export default function Websites() {
    const [expandedSections, setExpandedSections] = useState(new Array(Object.keys(websites).length).fill(false));

    function handleAccordionChange(index) {
        const newExpandedSections = [...expandedSections];
        newExpandedSections[index] = !expandedSections[index];
        setExpandedSections(newExpandedSections);
    }

    return (
        <Accordion allowZeroExpanded={true} preExpanded={expandedSections.filter((expanded) => expanded)} onChange={handleAccordionChange}>
            {Object.keys(websites).map((website, index) => (
                <AccordionItem key={index}>
                    <AccordionGenrator heading={website} index={index} />
                </AccordionItem>
            ))}
        </Accordion>
    );
}

function AccordionGenrator({ heading, index }) {
    const accrdionBody = websites[heading];

    return (
        <>
            <AccordionItemHeading key={index}>
                <AccordionItemButton className='accordion-btn4Web'>
                    <div className='accordion-btn4Web-div'>
                        <div className='accordion-btn4Web-div2'>{heading}</div>
                    </div>
                </AccordionItemButton>
            </AccordionItemHeading>
            {accrdionBody.map((body, bodyIndex) => (
                <AccordionItemPanel key={bodyIndex} className='accrdion-panel4Web' style={{ backgroundColor: '#8c8ecc' }}>
                    <div className='accordion-panel4WebDiv'>
                        <div><img src={baseUrl + body.img} className='accordion-panel4WebImg' /></div>
                        <div>{body.heading}</div>
                        <div>
                            <button className='accordion-panel4WebBtn'>
                                <a href={body.link} target='_blank' rel="noreferrer">Visit</a>
                            </button>
                        </div>
                    </div>
                </AccordionItemPanel>
            ))}
        </>
    );
}