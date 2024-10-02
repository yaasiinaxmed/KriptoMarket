import React from 'react';
import { Globe } from 'lucide-react';
import { Button } from "@/components/ui/button";

const LanguageSwitcher = ({ currentLanguage, onLanguageChange }) => {
  return (
    <Button
      variant="outline"
      size="icon"
      onClick={() => onLanguageChange(currentLanguage === 'en' ? 'so' : 'en')}
      className="fixed top-4 right-4 z-50"
    >
      <Globe className="h-4 w-4" />
      <span className="sr-only">Toggle Language</span>
    </Button>
  );
};

export default LanguageSwitcher;