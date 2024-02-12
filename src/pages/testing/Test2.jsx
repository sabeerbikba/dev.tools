import { useState } from 'react';
import PropTypes from 'prop-types';
import { Accordion, AccordionItem, AccordionItemHeading, AccordionItemButton, AccordionItemPanel } from 'react-accessible-accordion';
import searchEngines from '../../data/searchEngine';

export default function Test() {
    const [expandedSection, setExpandedSection] = useState(-1); // Single state for all accordions

    function handleAccordionChange(index) {
        setExpandedSection(expandedSection === index ? -1 : index);
    }

    return (
        <>
            <div className='accordion_div'>
                <Accordion className='accordion_main' allowZeroExpanded={true} preExpanded={expandedSection === -1 ? [] : [expandedSection]} onChange={handleAccordionChange}>
                    <AccordionItem>
                        <AccordionItemPanel>
                            <ShortcutComponent />
                        </AccordionItemPanel>
                        <AccordionItemHeading>
                            <AccordionItemButton>
                                Input Shortcuts
                            </AccordionItemButton>
                        </AccordionItemHeading>
                    </AccordionItem>
                    {/* Additional AccordionItems */}
                </Accordion>
            </div>
        </>
    );
}

function ShortcutComponent() {
    const flattenedEngines = searchEngines.flatMap(group => group.engines);
    const midpoint = Math.ceil(flattenedEngines.length / 2);
    const firstHalf = flattenedEngines.slice(0, midpoint);
    const secondHalf = flattenedEngines.slice(midpoint);

    const tailwindcss = {
        shortcutComponent: "p-4 sm:p-6",
        shortcutComponentDiv: "grid grid-flow-row grid-cols-[repeat(auto-fit,minmax(250px,1fr))] gap-x-9",
        parts: "flex flex-col overflow-hidden",


    }

    return (
        <div className={tailwindcss.shortcutComponent}>
            <div className={tailwindcss.shortcutComponentDiv} >
                <div className={tailwindcss.parts} >
                    {firstHalf.map(engine => (
                        <div key={engine.key}>
                            <ShortcutItem
                                title={`Select search ${engine.name} engine`}
                                keys={[engine.key]}
                            />
                        </div>
                    ))}
                </div>
                <div className={tailwindcss.parts} >
                    {secondHalf.map(engine => (
                        <div key={engine.key}>
                            <ShortcutItem
                                title={`Select search ${engine.name} engine`}
                                keys={[engine.key]}
                            />
                        </div>
                    ))}

                </div>
            </div>
        </div>
    );
}

function ShortcutItem({ title, keys }) {
    const tailwindcss = {
        shortcutItem: "flex items-center justify-between overflow-hidden text-token-text-secondary",
        title: "flex flex-shrink items-center overflow-hidden text-sm",
        keys: "ml-3 flex flex-row gap-2",
        key: "my-2 flex h-8 items-center justify-center rounded-[4px] border border-black/10 text-token-text-secondary dark:border-white/10 min-w-[50px]",
    }
    return (
        <div className={tailwindcss.shortcutItem}>
            <div className={tailwindcss.title}>
                <div className="truncate">{title}</div>
            </div>
            <div className={tailwindcss.keys}>
                {keys.map((key, index) => (
                    <div key={index} className={tailwindcss.key}>
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
