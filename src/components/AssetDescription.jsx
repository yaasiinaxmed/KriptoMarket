import React from 'react';

const AssetDescription = ({ description }) => (
  <div className="mb-6">
    <h2 className="text-xl md:text-2xl font-bold mb-4">About</h2>
    <p className="text-sm md:text-base" dangerouslySetInnerHTML={{ __html: description }}></p>
  </div>
);

export default AssetDescription;