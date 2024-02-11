

// import { useState, useEffect, useRef } from 'react';
// import PropTypes from 'prop-types';
// import { Accordion, AccordionItem, AccordionItemHeading, AccordionItemButton, AccordionItemPanel, } from 'react-accessible-accordion';
// import 'react-accessible-accordion/dist/fancy-example.css';
// // import searchEngines from '../../data/searchEngine';


// // console.log(searchEngines.length);

// export default function Example() {
//     const accordionBackground = { backgroundColor: '#7e7dff', textTransform: 'capitalize' };
//     const accordionContainerRef = useRef(null);
//     const [expandedSections, setExpandedSections] = useState([]);

//     useEffect(() => {
//         const handleClickOutside = (event) => {
//             if (accordionContainerRef.current && !accordionContainerRef.current.contains(event.target)) {
//                 setExpandedSections([]); // This will close all accordion items
//             }
//         };

//         document.addEventListener('mousedown', handleClickOutside);
//         return () => {
//             document.removeEventListener('mousedown', handleClickOutside);
//         };
//     }, []);


//     return (
//         <div ref={accordionContainerRef}>
//             <Accordion preExpanded={expandedSections} onChange={setExpandedSections}>
//                 <AccordionItem className="accordion__item">
//                     <AccordionItemPanel style={{ backgroundColor: 'rgba(23, 23, 23, 0.14)', color: '#aaaaaa' }}>
//                         <ShortcutComponent />
//                     </AccordionItemPanel>
//                     <AccordionItemHeading>
//                         <AccordionItemButton style={accordionBackground} className="accordion__button">
//                             Input Shortcuts
//                         </AccordionItemButton>
//                     </AccordionItemHeading>
//                 </AccordionItem>
//             </Accordion>
//         </div>
//     );
// }



// function ShortcutComponent() {
//     return (
//         <div className="p-4 sm:p-6">
//             <div className="grid grid-flow-row grid-cols-[repeat(auto-fit,minmax(250px,1fr))] gap-x-9">
//                 <div className="flex flex-col overflow-hidden">
//                     <ShortcutItem title="Select Google search engine " keys={['!!g']} />
//                     <ShortcutItem title="Focus chat input" keys={['Shift', 'Esc']} />
//                     <ShortcutItem title="Copy last code block" keys={['Ctrl', 'Shift', ';']} />
//                     <ShortcutItem title="Copy last response" keys={['Ctrl', 'Shift', 'c']} />
//                 </div>
//                 <div className="flex flex-col overflow-hidden">
//                     <ShortcutItem title="Set custom instructions" keys={['Ctrl', 'Shift', 'i']} />
//                     <ShortcutItem title="Toggle sidebar" keys={['Ctrl', 'Shift', 's']} />
//                     <ShortcutItem title="Delete chat" keys={['Ctrl', 'Shift', '⌫']} />
//                     <ShortcutItem title="Show shortcuts" keys={['Ctrl', '/']} />
//                 </div>
//             </div>
//         </div>
//     );
// }

// function ShortcutItem({ title, keys }) {
//     return (
//         <div className="flex items-center justify-between overflow-hidden text-token-text-secondary">
//             <div className="flex flex-shrink items-center overflow-hidden text-sm">
//                 <div className="truncate">{title}</div>
//             </div>
//             <div className="ml-3 flex flex-row gap-2">
//                 {keys.map((key, index) => (
//                     <div key={index} className="my-2 flex h-8 items-center justify-center rounded-[4px] border border-black/10 text-token-text-secondary dark:border-white/10 min-w-[50px]">
//                         <span className="text-xs">{key}</span>
//                     </div>
//                 ))}
//             </div>
//         </div>
//     );
// }

// ShortcutItem.propTypes = {
//     title: PropTypes.string.isRequired,
//     keys: PropTypes.arrayOf(PropTypes.string).isRequired,
// };


import { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { Accordion, AccordionItem, AccordionItemHeading, AccordionItemButton, AccordionItemPanel } from 'react-accessible-accordion';
import 'react-accessible-accordion/dist/fancy-example.css';

export default function Example() {
    const accordionBackground = { backgroundColor: '#7e7dff', textTransform: 'capitalize' };
    const accordionContainerRef = useRef(null);
    const [expandedSection, setExpandedSection] = useState(-1); // Single state for all accordions
    console.log('expandedSection: ', expandedSection);
    // console.log(accordionContainerRef);

    function handleAccordionChange(index) {
        console.log('index: ' + index);
        setExpandedSection(expandedSection === index ? -1 : index);
    }

    useEffect(() => {
        console.log('1');
        const handleClickOutside = () => {
            console.log('2');
            // if (accordionContainerRef.current && !accordionContainerRef.current.contains(event.target)) {
            if (accordionContainerRef.current) {
                console.log('3');
                setExpandedSection(expandedSection === ':r:' ? -1 : ':r1:'); // Collapse all accordion items
                
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (<>
        <div ref={accordionContainerRef}>
            <Accordion allowZeroExpanded={true} preExpanded={expandedSection === -1 ? [] : [expandedSection]} onChange={handleAccordionChange}>
                <AccordionItem className="accordion__item">
                    <AccordionItemHeading>
                        <AccordionItemButton style={accordionBackground} className="accordion__button">
                            Input Shortcuts
                        </AccordionItemButton>
                    </AccordionItemHeading>
                    <AccordionItemPanel style={{ backgroundColor: 'rgba(23,   23,   23,   0.14)', color: '#aaaaaa' }}>
                        <ShortcutComponent />
                    </AccordionItemPanel>
                </AccordionItem>
                {/* Additional AccordionItems */}
            </Accordion>
        </div>
    </>
    );
}





function ShortcutComponent() {
    return (
        <div className="p-4 sm:p-6">
            <div className="grid grid-flow-row grid-cols-[repeat(auto-fit,minmax(250px,1fr))] gap-x-9">
                <div className="flex flex-col overflow-hidden">
                    <ShortcutItem title="Select Google search engine " keys={['!!g']} />
                    <ShortcutItem title="Focus chat input" keys={['Shift', 'Esc']} />
                    <ShortcutItem title="Copy last code block" keys={['Ctrl', 'Shift', ';']} />
                    <ShortcutItem title="Copy last response" keys={['Ctrl', 'Shift', 'c']} />
                </div>
                <div className="flex flex-col overflow-hidden">
                    <ShortcutItem title="Set custom instructions" keys={['Ctrl', 'Shift', 'i']} />
                    <ShortcutItem title="Toggle sidebar" keys={['Ctrl', 'Shift', 's']} />
                    <ShortcutItem title="Delete chat" keys={['Ctrl', 'Shift', '⌫']} />
                    <ShortcutItem title="Show shortcuts" keys={['Ctrl', '/']} />
                </div>
            </div>
        </div>
    );
}

function ShortcutItem({ title, keys }) {
    return (
        <div className="flex items-center justify-between overflow-hidden text-token-text-secondary">
            <div className="flex flex-shrink items-center overflow-hidden text-sm">
                <div className="truncate">{title}</div>
            </div>
            <div className="ml-3 flex flex-row gap-2">
                {keys.map((key, index) => (
                    <div key={index} className="my-2 flex h-8 items-center justify-center rounded-[4px] border border-black/10 text-token-text-secondary dark:border-white/10 min-w-[50px]">
                        <span className="text-xs">{key}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}

ShortcutItem.propTypes = {
    title: PropTypes.string.isRequired,
    keys: PropTypes.arrayOf(PropTypes.string).isRequired,
};




/**
 * need to attach that accordin to bottom 
// need to test using check box then click outside check its working 
 * need to fix accordin button arrow pointer 
 * when i click outside of according close the all accordin 
 */