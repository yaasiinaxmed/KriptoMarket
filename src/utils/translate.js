// This is a mock translation function. In a real-world scenario,
// you would integrate with a proper translation API.
export const translate = async (text, targetLanguage) => {
  // Simulating API call delay
  await new Promise(resolve => setTimeout(resolve, 500));

  if (targetLanguage === 'so') {
    // Mock Somali translation (replace with actual translations)
    return text.split(' ').map(word => word.split('').reverse().join('')).join(' ');
  }
  
  // Return original text for English
  return text;
};