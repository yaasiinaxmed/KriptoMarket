const translations = {
  en: {
    backToList: "Back to list",
    about: "About",
    seeMore: "See more",
    seeLess: "See less",
    price: "Price",
    marketCap: "Market Cap",
    change24h: "24h %",
    links: "Links",
    website: "Website",
    twitter: "Twitter",
    github: "GitHub",
    whitepaper: "Whitepaper",
    availableExchanges: "Available Exchanges",
    footer: "© 2024 KriptoMarket. All rights reserved.",
    empowering: "Empowering your crypto journey with trust and transparency.",
    builtBy: "Built with 💙 by",
    name: "Name",
    volume: "Volume(24h)",
    circulatingSupply: "Circulating Supply",
    search: "Search coins...",
    tryAgain: "Try again",
  },
  so: {
    backToList: "Ku noqo liiska",
    about: "Ku saabsan",
    seeMore: "Arag wax badan",
    seeLess: "Arag wax yar",
    price: "Qiimaha",
    marketCap: "Suuqa Xaddiga",
    change24h: "Isbeddelka 24h",
    links: "Link-yada",
    website: "Website",
    twitter: "Twitter",
    github: "GitHub",
    whitepaper: "Warqadda cad",
    availableExchanges: "Exchange-yada laga heli karo",
    footer: "© 2024 KriptoMarket. All rights reserved.",
    empowering: "Awood u siinaya safarka crypto-gaaga iyadoo lagu kalsoon yahay oo la daahfurayo.",
    builtBy: "Built with 💙 by",
    name: "Magaca",
    volume: "Xaddiga(24h)",
    circulatingSupply: "Sarifka Wareegaya",
    search: "Raadi lacagaha...",
    tryAgain: "Isku day mar kale",
  }
};

export const getStoredLanguage = () => {
  return localStorage.getItem('language') || 'en';
};

export const setStoredLanguage = (lang) => {
  localStorage.setItem('language', lang);
};

export const translate = (key, language) => {
  return translations[language][key] || key;
};

export const translateDescription = (description, language) => {
  if (language === 'en') return description;
  // This is a placeholder translation. In a real-world scenario, you would use a proper translation API or service.
  return "Faahfaahin ku saabsan lacagta crypto ayaa lagu bixin doonaa halkan marka la helo tarjumaad sax ah.";
};