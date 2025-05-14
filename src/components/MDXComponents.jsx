import React from 'react';
import CodeBlock from './CodeBlock';

const MDXComponents = {
  // Custom code block handling
  pre: ({ children, ...props }) => {
    // If the pre doesn't contain a code block, render it normally
    if (!children || !children.props || children.props.mdxType !== 'code') {
      return <pre {...props}>{children}</pre>;
    }
    
    const { className, children: code } = children.props;
    
    // Extract metadata from className
    const metaString = className?.replace(/language-\w+\s?/, '') || '';
    const language = (className?.match(/language-(\w+)/) || [])[1];
    const meta = {};
    
    // Parse metadata if available
    if (metaString) {
      metaString.split(' ').forEach(item => {
        const [key, value] = item.split('=');
        if (key && value) {
          // Remove quotes if present
          meta[key] = value.replace(/^['"](.*)['"]$/, '$1');
        } else if (key) {
          meta[key] = true;
        }
      });
    }
    
    return (
      <CodeBlock 
        className={className}
        language={language}
        title={meta.title || meta.filename}
        {...props}
      >
        {code}
      </CodeBlock>
    );
  },
  
  // Add more custom MDX components here as needed
  // For example:
  a: ({ href, children, ...props }) => (
    <a href={href} target={href.startsWith('http') ? '_blank' : undefined} rel={href.startsWith('http') ? 'noopener noreferrer' : undefined} {...props}>
      {children}
    </a>
  ),
  
  // You can also customize other HTML elements
  table: (props) => (
    <div className="overflow-x-auto w-full">
      <table className="w-full" {...props} />
    </div>
  ),
  
  // Customize headings with anchor links
  h2: ({ id, children, ...props }) => (
    <h2 id={id} {...props}>
      <a href={`#${id}`} className="anchor-link">
        {children}
      </a>
    </h2>
  ),
  
  h3: ({ id, children, ...props }) => (
    <h3 id={id} {...props}>
      <a href={`#${id}`} className="anchor-link">
        {children}
      </a>
    </h3>
  ),
};

export default MDXComponents; 