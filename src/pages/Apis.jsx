import { useState } from 'react';
import {
    Accordion, AccordionItem, AccordionItemHeading,
    AccordionItemButton, AccordionItemPanel
} from 'react-accessible-accordion';
import { websites } from '../data/websites2';


export default function Websites() {
    const [expandedSection, setExpandedSection] = useState(-1); // Single state for all accordions

    function handleAccordionChange(index) {
        setExpandedSection(expandedSection === index ? -1 : index);
    }


    return (
        <>
            <Accordion allowZeroExpanded={true} preExpanded={expandedSection === -1 ? [] : [expandedSection]} onChange={handleAccordionChange}>
                <AccordionItem>
                    <AccordionItemHeading>
                        <AccordionItemButton>
                            <div className='inline mr-auto border' >sabeer</div>
                            <div className='inline border'>bikba</div>
                        </AccordionItemButton>
                    </AccordionItemHeading>

                    <AccordionItemPanel style={{ border: '2px solid red' }}>
                        sabeer bikba
                    </AccordionItemPanel>
                    <AccordionItemPanel
                        // style={{ position: 'absolute' }}
                    >
                        {/* <div className='block'> */}
                            <button style={{ backgroundColor: 'yellow', marginRight: 'auto' }}>click</button>

                        {/* </div> */}
                    </AccordionItemPanel>
                </AccordionItem>

            </Accordion>
        </>
    );
}
