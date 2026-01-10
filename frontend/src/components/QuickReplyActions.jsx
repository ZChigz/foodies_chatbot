import { motion } from 'framer-motion';

/**
 * QuickReplyActions Component
 * Renders interactive pill-shaped buttons in a grid layout
 * 2 buttons on top row, last button spans full width on bottom
 * 
 * @param {Array} options - Array of {label, value} objects
 * @param {Function} onSelect - Callback when button is clicked
 */
const QuickReplyActions = ({ options, onSelect }) => {
  if (!options || options.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.2 }}
      className="grid grid-cols-2 gap-2 mt-3 w-full"
    >
      {options.map((option, index) => {
        // Last button spans full width (2 columns)
        const isLastButton = index === options.length - 1;
        const spanClass = isLastButton ? 'col-span-2' : '';
        
        return (
          <motion.button
            key={index}
            onClick={() => onSelect(option.value)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={`${spanClass} px-4 py-3 rounded-full border-2 border-[#FFCC66] bg-white text-gray-900 font-semibold text-sm hover:bg-[#FFCC66] hover:text-[#111827] transition-all duration-200 shadow-sm hover:shadow-md text-center`}
          >
            {option.label}
          </motion.button>
        );
      })}
    </motion.div>
  );
};

export default QuickReplyActions;
