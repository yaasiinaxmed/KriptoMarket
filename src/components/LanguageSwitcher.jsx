import React from 'react';
import { Globe } from 'lucide-react';
import { Button } from "@/components/ui/button";

const LanguageSwitcher = ({ currentLanguage, onLanguageChange }) => {
  return (
    <Button
      variant="outline"
      size="sm"
      onClick={() => onLanguageChange(currentLanguage === 'en' ? 'so' : 'en')}
      className="fixed top-4 right-4 z-50 flex items-center gap-2"
    >
      <Globe className="h-4 w-4" />
      {currentLanguage === 'en' ? 'SO' : 'EN'}
    </Button>
  );
};

export default LanguageSwitcher;