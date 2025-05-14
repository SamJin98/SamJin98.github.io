import React, { useState } from 'react';

export default function CodeBlock({ children, className, title, language }) {
  const [copied, setCopied] = useState(false);

  // Extract code content - removing line numbers if present
  const extractCode = () => {
    if (!children) return '';
    if (typeof children === 'string') return children;

    // If we have React children (as from MDX), extract the text content
    const code = React.Children.toArray(children)
      .map(child => {
        if (typeof child === 'string') return child;
        if (child.props && child.props.children) {
          // Handle line numbers by removing them
          if (Array.isArray(child.props.children)) {
            return child.props.children
              .filter(c => !c.props || !c.props.className || !c.props.className.includes('code-line-number'))
              .map(c => typeof c === 'string' ? c : (c.props && c.props.children ? c.props.children : ''))
              .join('');
          }
          return typeof child.props.children === 'string' ? child.props.children : '';
        }
        return '';
      })
      .join('');
      
    return code;
  };

  const copyToClipboard = () => {
    const code = extractCode();
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Determine language from className if not provided
  const detectLanguage = () => {
    if (language) return language;
    if (className) {
      const match = /language-(\w+)/.exec(className);
      return match ? match[1] : '';
    }
    return '';
  };

  const lang = detectLanguage();

  return (
    <div className="code-block-wrapper relative rounded-md overflow-hidden mb-6">
      {(title || lang) && (
        <div className="code-block-header flex justify-between items-center px-4 py-2 bg-[#161b22] text-sm border-b border-[#30363d]">
          <div className="flex items-center gap-2">
            {title && <span className="text-white/80">{title}</span>}
            {lang && <span className="text-xs px-2 py-0.5 rounded bg-[#0d1117] text-gray-400">{lang}</span>}
          </div>
        </div>
      )}
      
      <div className="relative">
        <pre className={className}>
          {children}
        </pre>
        
        <button
          onClick={copyToClipboard}
          className="absolute top-2 right-2 p-2 rounded-md bg-[#1f2937]/30 hover:bg-[#1f2937]/50 transition-colors"
          aria-label="Copy code to clipboard"
        >
          {copied ? (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M9 16.2L4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2z" fill="#4ADE80" />
            </svg>
          ) : (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M16 1H4C2.9 1 2 1.9 2 3v14h2V3h12V1zm3 4H8C6.9 5 6 5.9 6 7v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"
                fill="#CBD5E1"
              />
            </svg>
          )}
        </button>
      </div>
    </div>
  );
} 