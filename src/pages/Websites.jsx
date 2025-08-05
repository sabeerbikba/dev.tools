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
            <div className="accordion-btn4Web-div2">{heading}</div>
          </div>
        </AccordionItemButton>
      </AccordionItemHeading>
      {accrdionBody.map((body, bodyIndex) => (
        <AccordionItemPanel
          key={bodyIndex}
          className="accrdion-panel4Web"
          style={{ backgroundColor: "#8c8ecc", padding: "0 0 0 20px" }}
        >
          <div className="accordion-panel4WebDiv">
            <div>
              <img
                src={baseUrl + body.img}
                className="accordion-panel4WebImg"
              />
            </div>
            <div className="accordion-panel4WebHead">{body.heading}</div>
            <p className="accordion-panel4WebP">{body.text}</p>
            <div>
              <button
                className="accordion-panel4WebBtn"
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
