import { useState } from "react";
import PropTypes from "prop-types";
import {
  Accordion,
  AccordionItem,
  AccordionItemHeading,
  AccordionItemButton,
  AccordionItemPanel,
} from "react-accessible-accordion";

import useOpenLink from "@/hooks/useOpenLink";
import { baseUrl, websites } from "@/data/websites";

export default function Websites() {
  const [expandedSections, setExpandedSections] = useState(
    new Array(Object.keys(websites).length).fill(false)
  );

  function handleAccordionChange(index) {
    const newExpandedSections = [...expandedSections];
    newExpandedSections[index] = !expandedSections[index];
    setExpandedSections(newExpandedSections);
  }

  return (
    <div>
      <Accordion
        className="accordion4Web"
        allowZeroExpanded={true}
        preExpanded={expandedSections.filter((expanded) => expanded)}
        onChange={handleAccordionChange}
      >
        {Object.keys(websites).map((website, index) => (
          <AccordionItem className="accordion-item4Web" key={index}>
            <AccordionGenrator heading={website} index={index} />
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}

function AccordionGenrator({ heading, index }) {
  const accrdionBody = websites[heading];

  return (
    <>
      <AccordionItemHeading key={index}>
        <AccordionItemButton className="accordion-btn4Web">
          <div className="accordion-btn4Web-div">
            <div className="accordion-btn4Web-div2  max-lg:!text-lg max-sm:!text-base">
              {heading}
            </div>
          </div>
        </AccordionItemButton>
      </AccordionItemHeading>
      {accrdionBody.map((body, bodyIndex) => (
        <AccordionItemPanel
          key={bodyIndex}
          className="accrdion-panel4Web bg-[#8c8ecc] pl-5 max-lg:pl-2 max-sm:pl-1"
        >
          <div className="accordion-panel4WebDiv">
            <div className="flex justify-center content-center flex-wrap">
              <img
                src={body.customImg ? body.img : baseUrl + body.img}
                className="rounded-[8px] h-[60px] max-lg:h-[45px] max-sm:h-[35px]"
              />
            </div>
            <div className="accordion-panel4WebHead">{body.heading}</div>
            <p className="accordion-panel4WebP">{body.text}</p>
            <div>
              <button
                className="accordion-panel4WebBtn max-lg:!w-[7rem] max-sm:!w-[4.8rem]"
                onClick={useOpenLink(body.link)}
              >
                Visit
              </button>
            </div>
          </div>
        </AccordionItemPanel>
      ))}
    </>
  );
}
AccordionGenrator.propTypes = {
  heading: PropTypes.string.isRequired,
  index: PropTypes.number.isRequired,
};
