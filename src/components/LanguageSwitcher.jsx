import React from 'react';
import { Globe } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { getStoredLanguage, setStoredLanguage } from '../utils/translate';

const LanguageSwitcher = ({ currentLanguage, onLanguageChange }) => {
  const handleLanguageChange = () => {
    const newLanguage = currentLanguage === 'en' ? 'so' : 'en';
    setStoredLanguage(newLanguage);
    onLanguageChange(newLanguage);
  };

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleLanguageChange}
      className="fixed top-4 right-4 z-50 flex items-center gap-2 bg-gray-800 text-white hover:bg-gray-700"
    >
      <Globe className="h-4 w-4" />
      {currentLanguage === 'en' ? 'SO' : 'EN'}
    </Button>
  );
};

export default LanguageSwitcher;