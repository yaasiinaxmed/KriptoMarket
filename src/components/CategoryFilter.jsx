import React from 'react';
import { Button } from "@/components/ui/button";

const categories = [
  { name: 'All', key: 'all' },
  { name: 'Memecoins', key: 'meme' },
  { name: 'AI', key: 'ai' },
  { name: 'Layer 1', key: 'layer1' },
  { name: 'Layer 2', key: 'layer2' },
  { name: 'Other', key: 'other' },
];

const CategoryFilter = ({ activeCategory, setActiveCategory }) => {
  return (
    <div className="flex flex-wrap justify-center gap-2 mb-6">
      {categories.map((category) => (
        <Button
          key={category.key}
          onClick={() => setActiveCategory(category.key)}
          className={`${
            activeCategory === category.key
              ? 'bg-white text-black'
              : 'bg-gray-800 text-white hover:bg-gray-700'
          } border-2 border-white font-bold`}
        >
          {category.name}
        </Button>
      ))}
    </div>
  );
};

export default CategoryFilter;
