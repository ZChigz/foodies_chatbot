/**
 * Formats plain text menu data into styled React components
 * Detects emojis for headers and colons for menu items
 * 
 * @param {string} text - Raw menu text with line breaks
 * @returns {JSX.Element} - Formatted menu UI
 */
export const formatMenuText = (text) => {
  if (!text) return null;

  // Split text by line breaks
  const lines = text.split('\n').filter(line => line.trim() !== '');

  // Emoji regex pattern to detect headers
  const emojiRegex = /[\u{1F300}-\u{1F9FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]/u;

  return (
    <div className="space-y-1">
      {lines.map((line, index) => {
        const trimmedLine = line.trim();

        // Check if line contains an emoji (Category Header)
        if (emojiRegex.test(trimmedLine)) {
          return (
            <h3
              key={index}
              className="text-base md:text-lg font-bold text-[#FFCC66] mt-4 first:mt-0 mb-2 pb-1 border-b-2 border-yellow-400"
            >
              {trimmedLine}
            </h3>
          );
        }

        // Check if line contains a colon (Menu Item)
        if (trimmedLine.includes(':')) {
          const colonIndex = trimmedLine.indexOf(':');
          const itemName = trimmedLine.substring(0, colonIndex).trim();
          const price = trimmedLine.substring(colonIndex + 1).trim();

          return (
            <div key={index} className="flex justify-between items-start py-1">
              <span className="font-semibold text-gray-800 text-sm md:text-base">
                {itemName}
              </span>
              <span className="text-gray-600 text-sm md:text-base ml-2 flex-shrink-0">
                {price}
              </span>
            </div>
          );
        }

        // Regular text (fallback)
        return (
          <p key={index} className="text-gray-700 text-sm md:text-base leading-relaxed">
            {trimmedLine}
          </p>
        );
      })}
    </div>
  );
};

/**
 * Check if text looks like a menu (has emojis or colons)
 */
export const isMenuFormat = (text) => {
  if (!text) return false;
  
  const emojiRegex = /[\u{1F300}-\u{1F9FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]/u;
  const hasEmoji = emojiRegex.test(text);
  const hasColons = text.includes(':');
  
  return hasEmoji || hasColons;
};

export default formatMenuText;
