import React from 'react';

export const highlightText = (text: string, query: string) => {
  if (!query) return text;
  const parts = text.split(new RegExp(`(${query})`, 'gi'));
  return parts.map((part, index) =>
    part.toLowerCase() === query.toLowerCase() ? React.createElement('strong', { key: index }, part) : part
  );
};
