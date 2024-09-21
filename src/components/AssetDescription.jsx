import React, { useState } from 'react';

const AssetDescription = ({ description }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const maxLength = 300; // Adjust this value to change when the "See more" link appears

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  const truncatedDescription = isExpanded ? description : description.slice(0, maxLength);

  return (
    <div className="mb-6">
      <h2 className="text-xl md:text-2xl font-bold mb-4">About</h2>
      <div className="text-sm md:text-base">
        <p dangerouslySetInnerHTML={{ __html: truncatedDescription }}></p>
        {description.length > maxLength && (
          <a
            onClick={toggleExpand}
            className="cursor-pointer mt-2 inline-block font-semibold text-blue-400 hover:text-blue-300"
          >
            {isExpanded ? 'See less' : 'See more'}
          </a>
        )}
      </div>
    </div>
  );
};

export default AssetDescription;
