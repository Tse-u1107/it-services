import React from 'react';
import { type FooterLink, type FooterSection, type FooterProps } from './interface';

const FooterComponent: React.FC<FooterProps> = ({ 
  sections, 
  bottomText, 
  bottomLinks,
  languageSelector 
}) => {
  return (
    <footer className="w-full bg-gray-100 text-gray-700 text-sm">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8">
          {sections.map((section, index) => (
            <div key={index}>
              <h3 className="font-semibold text-gray-900 mb-3">
                {section.title}
              </h3>
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
            {bottomLinks && bottomLinks.map((link, index) => (
              <React.Fragment key={index}>
                <a 
                  href={link.href} 
                  className="text-gray-600 hover:text-gray-900 hover:underline"
                >
                  {link.text}
                </a>
                {index < bottomLinks.length - 1 && (
                  <span className="text-gray-400">|</span>
                )}
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
      title: "Shop and Learn",
      links: [
        { text: "Store", href: "#" },
        { text: "Mac", href: "#" },
        { text: "iPad", href: "#" },
        { text: "iPhone", href: "#" },
        { text: "Watch", href: "#" },
        { text: "Vision", href: "#" },
        { text: "AirPods", href: "#" },
        { text: "TV & Home", href: "#" },
        { text: "AirTag", href: "#" },
        { text: "Accessories", href: "#" },
        { text: "Gift Cards", href: "#" },
      ]
    },
    {
      title: "Account",
      links: [
        { text: "Manage Your Apple Account", href: "#" },
        { text: "Apple Store Account", href: "#" },
        { text: "iCloud.com", href: "#" },
      ]
    },
    {
      title: "Entertainment",
      links: [
        { text: "Apple TV+", href: "#" },
        { text: "Apple Music", href: "#" },
        { text: "Apple Podcasts", href: "#" },
        { text: "Apple Books", href: "#" },
        { text: "App Store", href: "#" },
      ]
    },
    {
      title: "Apple Store",
      links: [
        { text: "Find a Store", href: "#" },
        { text: "Genius Bar", href: "#" },
        { text: "Today at Apple", href: "#" },
        { text: "Apple Camp", href: "#" },
        { text: "Apple Store App", href: "#" },
        { text: "Certified Refurbished", href: "#" },
        { text: "Apple Trade In", href: "#" },
        { text: "Order Status", href: "#" },
        { text: "Shopping Help", href: "#" },
      ]
    },
    {
      title: "For Business",
      links: [
        { text: "Apple and Business", href: "#" },
        { text: "Shop for Business", href: "#" },
      ]
    },
  ];

  const bottomLinks: FooterLink[] = [
    { text: "Privacy Policy", href: "#" },
    { text: "Terms of Use", href: "#" },
    { text: "Sales Policy", href: "#" },
    { text: "Site Map", href: "#" },
  ];

  return (
    <FooterComponent 
      sections={footerData}
      bottomText="More ways to shop: Find an Apple Store or other retailer near you. Or call 800-608-998. Dealer in precious metals and stones Category A registration Registration No A-B-24-03-06075."
      bottomLinks={bottomLinks}
      languageSelector={{
        current: "Hong Kong",
        options: ["繁體中文", "English"]
      }}
    />
  );
};

export default Footer;