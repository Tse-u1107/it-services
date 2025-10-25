import React from 'react';
import { type FooterLink, type FooterSection, type FooterProps } from './interface';

const FooterComponent: React.FC<FooterProps> = ({
  sections,
  bottomText,
  bottomLinks,
  languageSelector,
}) => {
  return (
    <footer className="w-full bg-gray-100 text-gray-700 text-sm">
      {/* Main Footer Content */}
      <div className="max-w-5xl mx-auto px-6 py-8">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8">
          {sections.map((section, index) => (
            <div key={index}>
              <h3 className="font-semibold text-gray-900 mb-3">{section.title}</h3>
              <ul className="space-y-2">
                {section.links.map((link, linkIndex) => (
                  <li key={linkIndex}>
                    <a
                      href={link.href}
                      className="text-gray-600 hover:text-gray-900 hover:underline"
                    >
                      {link.text}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Text */}
        {bottomText && (
          <div className="mt-8 pt-6 border-t border-gray-300 text-xs text-gray-600">
            <p>{bottomText}</p>
          </div>
        )}

        {/* Bottom Links and Language */}
        <div className="mt-4 pt-4 border-t border-gray-300 flex flex-wrap items-center justify-between gap-4 text-xs">
          <div className="flex flex-wrap items-center gap-4">
            {bottomLinks &&
              bottomLinks.map((link, index) => (
                <React.Fragment key={index}>
                  <a href={link.href} className="text-gray-600 hover:text-gray-900 hover:underline">
                    {link.text}
                  </a>
                  {index < bottomLinks.length - 1 && <span className="text-gray-400">|</span>}
                </React.Fragment>
              ))}
          </div>

          {languageSelector && (
            <div className="flex items-center gap-2">
              <span className="text-gray-600">{languageSelector.current}</span>
            </div>
          )}
        </div>
      </div>
    </footer>
  );
};

// Example Usage
const Footer = () => {
  const footerData: FooterSection[] = [
    {
      title: 'Category 1',
      links: [
        { text: 'Dolor sit', href: '#' },
        { text: 'Amet consectetur', href: '#' },
        { text: 'Adipiscing elit', href: '#' },
        { text: 'Sed do', href: '#' },
        { text: 'Eiusmod tempor', href: '#' },
        { text: 'Incididunt ut', href: '#' },
        { text: 'Labore et', href: '#' },
        { text: 'Dolore magna', href: '#' },
        { text: 'Aliqua ut', href: '#' },
        { text: 'Enim ad', href: '#' },
        { text: 'Minim veniam', href: '#' },
      ],
    },
    {
      title: 'Category 2',
      links: [
        { text: 'Exercitation ullamco', href: '#' },
        { text: 'Laboris nisi', href: '#' },
        { text: 'Aliquip ex', href: '#' },
      ],
    },
    {
      title: 'Category 3',
      links: [
        { text: 'Duis aute', href: '#' },
        { text: 'Irure dolor', href: '#' },
        { text: 'Reprehenderit in', href: '#' },
        { text: 'Voluptate velit', href: '#' },
        { text: 'Esse cillum', href: '#' },
      ],
    },
    {
      title: 'Category 4',
      links: [
        { text: 'Nulla pariatur', href: '#' },
        { text: 'Excepteur sint', href: '#' },
        { text: 'Occaecat cupidatat', href: '#' },
        { text: 'Non proident', href: '#' },
        { text: 'Sunt in', href: '#' },
        { text: 'Culpa qui', href: '#' },
        { text: 'Officia deserunt', href: '#' },
        { text: 'Mollit anim', href: '#' },
        { text: 'Laborum est', href: '#' },
      ],
    },
    {
      title: 'Category 5',
      links: [
        { text: 'Unde omnis', href: '#' },
        { text: 'Iste natus', href: '#' },
      ],
    },
  ];

  const bottomLinks: FooterLink[] = [
    { text: 'Privacy Policy', href: '#' },
    { text: 'Terms of Use', href: '#' },
    { text: 'Sales Policy', href: '#' },
    { text: 'Site Map', href: '#' },
  ];

  return (
    <FooterComponent
      sections={footerData}
      bottomText="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam vitae placerat augue. Nullam ac mauris eget velit consequat porta a at orci. Suspendisse lorem nibh"
      bottomLinks={bottomLinks}
      languageSelector={{
        current: 'Hong Kong',
        options: ['繁體中文', 'English'],
      }}
    />
  );
};

export default Footer;
