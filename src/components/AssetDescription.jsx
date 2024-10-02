import React, { useState } from 'react';

const translations = {
  en: {
    about: "About",
    seeMore: "See more",
    seeLess: "See less",
  },
  so: {
    about: "Ku saabsan",
    seeMore: "Arag wax badan",
    seeLess: "Arag wax yar",
  }
};

const AssetDescription = ({ description, language }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const maxLength = 300;

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  const truncatedDescription = isExpanded ? description : description.slice(0, maxLength);
  const t = translations[language];

  return (
    <div className="mb-6">
      <h2 className="text-xl md:text-2xl font-bold mb-4">{t.about}</h2>
      <div className="text-sm md:text-base">
        <p dangerouslySetInnerHTML={{ __html: truncatedDescription }}></p>
        {description.length > maxLength && (
          <a
            onClick={toggleExpand}
            className="cursor-pointer mt-2 inline-block font-semibold text-blue-400 hover:text-blue-300"
          >
            {isExpanded ? t.seeLess : t.seeMore}
          </a>
        )}
      </div>
    </div>
  );
};

export default AssetDescription;