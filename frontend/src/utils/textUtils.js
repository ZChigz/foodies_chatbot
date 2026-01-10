/**
 * Removes citation annotations from AI responses
 * Pattern: 【4:0†Foodies Official Knowledge Base.docx】
 * 
 * @param {string} text - The text containing citations
 * @returns {string} - Clean text without citations
 */
export const cleanMessageText = (text) => {
  if (!text) return '';
  
  // Regex explanation:
  // 【 - Opening bracket (escaped)
  // \d+ - One or more digits
  // : - Colon
  // \d+ - One or more digits
  // † - Dagger symbol
  // [^】]+ - Any characters except closing bracket
  // 】 - Closing bracket (escaped)
  const citationPattern = /【\d+:\d+†[^】]+】/g;
  
  return text.replace(citationPattern, '').trim();
};

/**
 * Alternative: More specific pattern if you want to validate the filename
 */
export const cleanMessageTextStrict = (text) => {
  if (!text) return '';
  
  // This pattern specifically looks for .docx, .pdf, .txt extensions
  const citationPattern = /【\d+:\d+†[^】]+\.(docx|pdf|txt|doc)】/gi;
  
  return text.replace(citationPattern, '').trim();
};

/**
 * Extract citations from text (useful if you want to show them separately)
 */
export const extractCitations = (text) => {
  if (!text) return [];
  
  const citationPattern = /【\d+:\d+†([^】]+)】/g;
  const citations = [];
  let match;
  
  while ((match = citationPattern.exec(text)) !== null) {
    citations.push(match[1]); // The filename
  }
  
  return citations;
};
