import React from "react";
import { mappings } from "../constants";

const IconsDisplay = ({ techStack }) => {
  if (!Array.isArray(techStack) || techStack.length === 0) return null;

  const iconsToDisplay = techStack
    .filter((tech) => typeof tech === "string")
    .slice(0, 3)
    .map((tech) => {
      const key = tech.toLowerCase();
      const icon = mappings[key];
      return icon ? { icon, label: tech } : null;
    })
    .filter(Boolean);

  if (iconsToDisplay.length === 0) return null;

  return (
    <span className="flex items-center min-h-[40px] min-w-[100px] gap-1">
      {iconsToDisplay.map(({ icon, label }, index) => (
        <div
          key={index}
          title={label}
          className={`w-[30px] h-[30px] flex items-center justify-center text-white text-xl rounded-full bg-[#262626]
            ${index !== 0 ? "-ml-2" : ""}
            z-[${30 - index}]`}
        >
          <i className={`devicon-${icon}-plain colored`} />
        </div>
      ))}
    </span>
  );
};

export default IconsDisplay;
