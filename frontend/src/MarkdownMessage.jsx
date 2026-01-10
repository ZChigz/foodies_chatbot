import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkBreaks from 'remark-breaks';

const MarkdownMessage = ({ content }) => {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm, remarkBreaks]}
      components={{
        // Paragraphs - Minimal margins for compact layout
        p: ({ node, ...props }) => {
          const isInsideList = node?.position?.start?.line && props.children;
          return isInsideList ? (
            <span className="inline text-sm md:text-base leading-snug text-gray-700" {...props} />
          ) : (
            <p className="mb-1 last:mb-0 text-sm md:text-base leading-snug text-gray-700" {...props} />
          );
        },

        // Tables - Mobile responsive with brand colors
        table: ({ node, ...props }) => (
          <div className="overflow-x-auto my-3 rounded-lg border border-gray-200">
            <table className="min-w-full border-collapse text-sm" {...props} />
          </div>
        ),
        thead: ({ node, ...props }) => (
          <thead className="bg-[#FFCC66] text-[#111827]" {...props} />
        ),
        th: ({ node, ...props }) => (
          <th className="px-3 py-2 text-left font-semibold border-b-2 border-gray-300" {...props} />
        ),
        tbody: ({ node, ...props }) => (
          <tbody className="bg-white" {...props} />
        ),
        tr: ({ node, isHeader, ...props }) => (
          <tr className="border-b border-gray-200 hover:bg-yellow-50 transition-colors" {...props} />
        ),
        td: ({ node, ...props }) => (
          <td className="px-3 py-2 text-gray-700" {...props} />
        ),

        // Lists - Compact spacing for receipt-like appearance
        ul: ({ node, ...props }) => (
          <ul className="my-0 py-0" {...props} />
        ),
        ol: ({ node, ...props }) => (
          <ol className="my-0 py-0" {...props} />
        ),
        li: ({ node, children, ...props }) => {
          return (
            <li className="flex items-start gap-2 text-sm md:text-base mb-1" style={{ listStyle: 'none' }} {...props}>
              <span className="text-[#FFCC66] font-bold mt-0.5 flex-shrink-0">•</span>
              <span className="text-gray-700 leading-snug flex-1">{children}</span>
            </li>
          );
        },

        // Headings - Compact spacing for dense layout
        h1: ({ node, ...props }) => (
          <h1 className="text-xl md:text-2xl font-bold text-gray-900 mt-3 mb-1 first:mt-0 pb-1 border-b-2 border-yellow-400 leading-snug" {...props} />
        ),
        h2: ({ node, ...props}) => (
          <h2 className="text-lg md:text-xl font-bold text-[#FFCC66] mt-2 mb-1 first:mt-0 leading-snug" {...props} />
        ),
        h3: ({ node, ...props }) => (
          <h3 className="text-base md:text-lg font-bold text-gray-900 mt-2 mb-1 first:mt-0 leading-snug" {...props} />
        ),

        // Strong/Bold
        strong: ({ node, ...props }) => (
          <strong className="font-semibold text-gray-900" {...props} />
        ),

        // Emphasis/Italic
        em: ({ node, ...props }) => (
          <em className="italic text-gray-600" {...props} />
        ),

        // Code - Inline and block
        code: ({ node, inline, ...props }) =>
          inline ? (
            <code className="bg-yellow-100 text-yellow-800 px-1.5 py-0.5 rounded text-xs md:text-sm font-mono" {...props} />
          ) : (
            <code className="block bg-gray-100 text-gray-800 p-2 md:p-3 rounded-lg my-2 text-xs md:text-sm font-mono overflow-x-auto" {...props} />
          ),

        // Blockquote
        blockquote: ({ node, ...props }) => (
          <blockquote className="border-l-3 border-[#FFCC66] pl-3 py-1 my-2 text-gray-600 italic text-sm md:text-base" {...props} />
        ),

        // Horizontal Rule
        hr: ({ node, ...props }) => (
          <hr className="my-3 border-gray-300" {...props} />
        ),

        // Links
        a: ({ node, ...props }) => (
          <a
            className="text-yellow-600 hover:text-yellow-700 underline font-medium break-words"
            target="_blank"
            rel="noopener noreferrer"
            {...props}
          />
        ),

        // Line breaks
        br: ({ node, ...props }) => <br className="leading-tight" {...props} />,
      }}
    >
      {content}
    </ReactMarkdown>
  );
};

export default MarkdownMessage;
