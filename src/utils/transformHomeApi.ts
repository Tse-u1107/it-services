import React from 'react';
import type { Item } from '../components/expandableList/interface';
import DOMPurify from 'dompurify';

export interface HomeApiItem {
  title: string;
  field_services_icon: string;
  body: string;
  field_linkto: string;
}

/**
 * Extracts href from HTML string
 */
const extractHref = (htmlString: string): string => {
  const match = htmlString.match(/href=["']([^"']+)["']/);
  return match ? match[1] : '';
};

/**
 * Extracts text content from HTML string
 */
const extractTextContent = (htmlString: string): string => {
  const div = document.createElement('div');
  div.innerHTML = DOMPurify.sanitize(htmlString);
  return div.textContent || div.innerText || '';
};

/**
 * Extracts img src from HTML image tag
 */
const extractImageSrc = (htmlString: string): string => {
  const match = htmlString.match(/src=["']([^"']+)["']/);
  return match ? match[1] : '';
};

/**
 * Generates a readable ID from URL or text
 */
const generateId = (linkto: string, index: number): string => {
  const href = extractHref(linkto);
  if (href) {
    // Extract last part of URL and sanitize
    const lastPart = href.split('/').filter(Boolean).pop() || '';
    return `service_${lastPart.toLowerCase().replace(/[^a-z0-9]/g, '_')}`;
  }
  return `service_${index}`;
};

/**
 * Transforms API response from 'api/home' into Item[] for AccessCardBlock
 */
export const transformHomeApiResponse = (apiResponse: HomeApiItem[]): Item[] => {
  return apiResponse.map((item, index) => {
    const cleanTitle = extractTextContent(item.title);
    const imageSrc = extractImageSrc(item.field_services_icon);
    const linkHref = extractHref(item.field_linkto.replace('https://wiki.it.shanghai.nyu.edu/', 'guides/'));

    return {
      id: generateId(item.field_linkto, index),
      title: cleanTitle,
      content: item.body,
      icon: imageSrc ? React.createElement('img', { src: 'https://wiki.it.shanghai.nyu.edu/' + imageSrc, alt: cleanTitle, className: 'icon-8' }) : null,
      linkTo: linkHref,
    };
  });
};
