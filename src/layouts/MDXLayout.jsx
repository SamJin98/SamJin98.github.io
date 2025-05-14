import React from 'react';
import { MDXProvider } from '@mdx-js/react';
import MDXComponents from '../components/MDXComponents';

export default function MDXLayout({ children }) {
  return (
    <MDXProvider components={MDXComponents}>
      <div className="mdx-content">
        {children}
      </div>
    </MDXProvider>
  );
} 