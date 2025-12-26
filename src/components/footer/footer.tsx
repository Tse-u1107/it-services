import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import logoLong from 'src/assets/logo_long_purple.png';
import { FaInstagram, FaFacebookF, FaLinkedinIn } from 'react-icons/fa';
import { ComputerDesktopIcon, MoonIcon, SunIcon } from '@heroicons/react/24/outline';

const Footer = () => {
  const [selectedMode, setSelectedMode] = useState<'light' | 'system' | 'dark'>('system');
  const location = useLocation();
  const { pathname } = location;

  const sections = [
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
  ];
  const handleLightMode = () => {
    setSelectedMode('light');
  };

  const handleSystemMode = () => {
    setSelectedMode('system');
  };

  const handleDarkMode = () => {
    setSelectedMode('dark');
  };

  return (
    <footer
      className={`w-full bg-gray-100 text-gray-700 text-sm ${pathname === '/home' ? 'bg-[#f5f5f7]' : 'bg-white'}`}
    >
      {/* Main Footer Content */}
      <div className="max-w-5xl mx-auto px-6 py-8">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8">
          <div className="">
            <img src={logoLong} />
          </div>
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

        <div className="mt-8 pt-6 text-xs text-gray-600">
          <p>© 2025, NYU Shanghai</p>
        </div>

        <div className="pt-4 flex flex-wrap items-center justify-between gap-4 text-xs">
          <div className="flex items-center">
            <a
              href="https://www.instagram.com/nyushanghai/"
              aria-label="Instagram"
              target="_blank"
              rel="noopener noreferrer"
              className="px-2 text-gray-500 hover:text-gray-900 transition-colors"
            >
              <FaInstagram className="w-4 h-4" />
            </a>

            <span className="h-4 w-px bg-gray-300" />

            <a
              href="https://www.facebook.com/nyushanghai/"
              aria-label="Facebook"
              target="_blank"
              rel="noopener noreferrer"
              className="px-2 text-gray-500 hover:text-gray-900 transition-colors"
            >
              <FaFacebookF className="w-4 h-4" />
            </a>

            <span className="h-4 w-px bg-gray-300" />

            <a
              href="https://www.linkedin.com/school/nyushanghai/"
              aria-label="LinkedIn"
              target="_blank"
              rel="noopener noreferrer"
              className="px-2 text-gray-500 hover:text-gray-900 transition-colors"
            >
              <FaLinkedinIn className="w-4 h-4" />
            </a>
          </div>

          <div className="flex items-center rounded-full border border-gray-300 bg-white p-1 text-xs">
            <button
              onClick={handleLightMode}
              className={`p-2 rounded-full transition ${selectedMode === 'light' ? 'bg-gray-300 text-gray-900' : 'text-gray-700 hover:bg-gray-100'}`}
            >
              <SunIcon strokeWidth={2} className="icon-4" />
            </button>

            <button
              onClick={handleSystemMode}
              className={`p-2 rounded-full transition ${selectedMode === 'system' ? 'bg-gray-300 text-gray-900' : 'text-gray-700 hover:bg-gray-100'}`}
            >
              <ComputerDesktopIcon strokeWidth={2} className="icon-4" />
            </button>

            <button
              onClick={handleDarkMode}
              className={`p-2 rounded-full transition ${selectedMode === 'dark' ? 'bg-gray-300 text-gray-900' : 'text-gray-700 hover:bg-gray-100'}`}
            >
              <MoonIcon strokeWidth={2} className="icon-4" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
