import { useState, useEffect } from 'react';
import LeftSidebar from './components/leftNavBar/leftSidebar';
import ContentLayout from '../../layout/content';
import { fetchRequest } from '../../api/client/fetchRequest';
import { serviceContent } from '../../api/url';
import menuItems from './constants/menuItems.json';
import { useLocation } from 'react-router-dom';
import parse, { domToReact, type DOMNode, Element as DomElement } from 'html-react-parser';
import { ChevronRightIcon } from '@heroicons/react/24/outline';
import { extractHeadingHierarchy, type HeadingNode } from './utils/headingExtractor';
import { useCallback, useRef } from 'react';

const slugify = (text: string) => {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]+/g, '')
    .replace(/--+/g, '-');
};

interface HeadingData {
  id: string;
  text: string;
  level: number;
}
const WikiContent = ({
  html,
  onLinkClick,
  onHeadingsParsed,
}: {
  html: string;
  onLinkClick: (url: string) => void;
  onHeadingsParsed: (headings: HeadingData[]) => void;
}) => {
  const baseUrl = 'https://wiki.it.shanghai.nyu.edu';
  const headingsRef = useRef<HeadingData[]>([]);

  // Parse HTML Options
  const parseOptions = {
    replace: (node: DOMNode) => {
      if (node instanceof DomElement) {
        if (['h1', 'h2', 'h3', 'h4'].includes(node.name)) {
          const textContent = node.children
            .reduce((acc, child: any) => acc + (child.data || ''), '')
            .trim();

          if (!textContent) return;

          const id = node.attribs.id || slugify(textContent);

          if (!headingsRef.current.find((h) => h.id === id)) {
            headingsRef.current.push({
              id,
              text: textContent,
              level: parseInt(node.name.replace('h', '')),
            });
          }

          const children = domToReact(node.children as DOMNode[], parseOptions);

          if (node.name === 'h2') {
            return (
              <>
                <hr className="guide-component w-full border-t border-1 border-gray-300 my-8" style={{ border: '0.4px solid #F5F5F7'}}/>
                <h2
                  id={id}
                  className="guide-component text-2xl font-bold text-gray-900 mb-4 scroll-mt-24"
                >
                  {children}
                </h2>
              </>
            );
          }

          const sizeClasses: Record<string, string> = {
            h3: 'text-xl font-semibold text-gray-800 mt-6 mb-3 scroll-mt-24',
            h4: 'text-lg font-medium text-gray-800 mt-4 mb-2 scroll-mt-24',
          };

          return (
            <node.name id={id} className={`guide-component ${sizeClasses[node.name] || ''}`}>
              {children}
            </node.name>
          );
        }

        if (node.name === 'img' && node.attribs?.src) {
          const src = node.attribs.src.startsWith('/')
            ? `${baseUrl}${node.attribs.src}`
            : node.attribs.src;

          return (
            <img
              {...node.attribs}
              src={src}
              className="guide-component rounded-lg shadow-sm my-4 max-w-full h-auto"
            />
          );
        }

        // --- Handle Links ---
        if (node.name === 'a' && node.attribs?.href) {
          if (node.attribs.href.startsWith(baseUrl)) {
            return (
              <button
                className="guide-component text-nyu-700 underline hover:text-nyu-900"
                onClick={() => onLinkClick(node.attribs.href)}
              >
                {domToReact(node.children as DOMNode[])}
              </button>
            );
          }
        }

        // --- General Styling for paragraphs/lists ---
        if (node.attribs && !node.attribs.className?.includes('guide-component')) {
          // Optional: You can simply return the node; adding classes to everything might be overkill
          // keeping logic simple for now
        }
      }
    },
  };

  useEffect(() => {
    onHeadingsParsed(headingsRef.current);

    return () => {
      headingsRef.current = [];
    };
  }, [html, onHeadingsParsed]);

  return <div className="prose prose-lg max-w-none text-gray-600">{parse(html, parseOptions)}</div>;
};


const TableOfContents = ({ headings }: { headings: HeadingData[] }) => {
  const [activeId, setActiveId] = useState<string>('');

  useEffect(() => {
    if (headings.length === 0) return;

    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      const offset = 100;
      let currentId = headings[0].id;

      for (const heading of headings) {
        const element = document.getElementById(heading.id);
        if (element) {
          const top = element.getBoundingClientRect().top + window.scrollY;
          if (top - offset <= scrollPosition) {
            currentId = heading.id;
          }
        }
      }
      setActiveId(currentId);
    };

    // Throttle scroll event
    let ticking = false;
    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          handleScroll();
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', onScroll);
    handleScroll(); // Initial check

    return () => window.removeEventListener('scroll', onScroll);
  }, [headings]);

  if (headings.length === 0) return null;

  // Filter only h2 and h3 for cleaner TOC, remove if you want all
  const visibleHeadings = headings.filter((h) => h.level <= 3);

  return (
    <nav className="space-y-1">
      <h3 className="text-sm font-bold text-gray-900 mb-4 uppercase tracking-wider">
        On This Page
      </h3>
      <ul className="border-l-2 border-gray-100 pl-0">
        {visibleHeadings.map((heading) => (
          <li key={heading.id} className="relative">
            <a
              href={`#${heading.id}`}
              onClick={(e) => {
                e.preventDefault();
                document.getElementById(heading.id)?.scrollIntoView({ behavior: 'smooth' });
                // Manually set active immediately for snappiness
                setActiveId(heading.id);
              }}
              className={`
                block py-2 pr-2 text-sm transition-all duration-300
                ${heading.level === 3 ? 'pl-6' : 'pl-4'}
                ${
                  activeId === heading.id
                    ? ' text-nyu-700 font-regular'
                    : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50 border-l-4 border-transparent -ml-[2px]'
                }
              `}
            >
              {heading.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
};

function findMenuItemByLink(items: any[], link: string): any | null {
  for (const item of items) {
    if (item.link === link) {
      return item;
    }

    if (item.children) {
      const found = findMenuItemByLink(item.children, link);
      if (found) return found;
    }
  }

  return null;
}

function buildBreadcrumbs(items: any[], targetLink: string, trail: any[] = []): any[] | null {
  for (const item of items) {
    const currentTrail = [...trail, { title: item.title, link: item.link, uuid: item.uuid }];

    if (item.link === targetLink) {
      return currentTrail;
    }

    if (item.children) {
      const found = buildBreadcrumbs(item.children, targetLink, currentTrail);
      if (found) return found;
    }
  }

  return null;
}

function Breadcrumbs({
  crumbs,
  onNavigate,
}: {
  crumbs: any[];
  onNavigate: (data: { link: string; uuid: string }) => void;
}) {
  return (
    <nav className="flex items-center space-x-2 text-sm text-gray-600 mb-6">
      <button
        onClick={() => onNavigate({ link: '/', uuid: '' })}
        className="hover:text-nyu-700 transition-colors"
      >
        Home
      </button>
      {crumbs.map((crumb, index) => (
        <div key={crumb.link} className="flex items-center space-x-2">
          <span className="text-gray-400">
            <ChevronRightIcon className="icon-4" />
          </span>
          {index === crumbs.length - 1 ? (
            <span className="font-medium text-gray-900">{crumb.title}</span>
          ) : (
            <button
              onClick={() => onNavigate({ link: crumb.link, uuid: crumb.uuid })}
              className="hover:text-nyu-700 transition-colors"
            >
              {crumb.title}
            </button>
          )}
        </div>
      ))}
    </nav>
  );
}

interface LinkData {
  link: string;
  uuid: string;
}

const GuideRoute = () => {
  const location = useLocation();
  const { uuid, link } = location.state || {};

  const [currentPath, setCurrentPath] = useState(link || '/');
  const [requestPageUUID, setRequestPageUUID] = useState(uuid || '');

  const [contentData, setContentData] = useState<string | null>(null);
  const [contentTitle, setContentTitle] = useState<string | null>(null);
  const [headingHierarchy, setHeadingHierarchy] = useState<HeadingNode[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [headings, setHeadings] = useState<HeadingData[]>([]);

  const handleHeadingsParsed = useCallback(
    (newHeadings: HeadingData[]) => {
      // Only update if different to prevent infinite loops
      if (JSON.stringify(newHeadings) !== JSON.stringify(headings)) {
        setHeadings(newHeadings);
      }
    },
    [headings]
  );

  const breadcrumbs = currentPath !== '/' ? buildBreadcrumbs(menuItems, currentPath) : null;

  useEffect(() => {
    const fetchContent = async () => {
      if (!currentPath || currentPath === '/') {
        setContentData(null);
        setContentTitle(null);
        setHeadingHierarchy([]);
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setError(null);

        const apiWithParam = serviceContent + requestPageUUID;
        const contentResponse = await fetchRequest(apiWithParam);

        if (contentResponse?.[0]?.body) {
          const htmlContent = contentResponse[0].body;
          setContentData(htmlContent);
          setContentTitle(contentResponse[0].title);

          // Extract heading hierarchy
          const hierarchy = extractHeadingHierarchy(htmlContent);
          setHeadingHierarchy(hierarchy);

          console.log('Heading Hierarchy:', hierarchy);
        } else {
          setError('Content not found');
          setContentData(null);
          setContentTitle(null);
          setHeadingHierarchy([]);
        }
      } catch (err) {
        console.error('Error fetching content:', err);
        setError('Failed to load content');
        setContentData(null);
        setContentTitle(null);
        setHeadingHierarchy([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchContent();
  }, [currentPath, requestPageUUID]);

  const handleNavigate = (data: LinkData) => {
    setCurrentPath(data.link);
    setRequestPageUUID(data.uuid);
  };

  const handleNavigateFromButton = (url: string) => {
    const subroute = url.replace('https://wiki.it.shanghai.nyu.edu', '');
    const menuInfo = findMenuItemByLink(menuItems, subroute);
    handleNavigate(menuInfo);
  };

  return (
    <div className="bg-white min-h-screen pb-30">
      <ContentLayout
        leftSideBar={
          <LeftSidebar
            items={menuItems}
            currentPath={currentPath}
            onNavigate={(data) => handleNavigate(data)}
          />
        }
        rightSideBar={
          <div className="p-4 sticky top-[50px]">
            <div className="hidden xl:block w-64 shrink-0">
              <div className="sticky top-[100px] max-h-[calc(100vh-120px)] overflow-y-auto pb-10">
                <TableOfContents headings={headings} />
              </div>
            </div>
          </div>
        }
      >
        <div className="max-w-4xl p-0">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-nyu-700"></div>
            </div>
          ) : error ? (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
              <h3 className="font-semibold mb-1">Error</h3>
              <p>{error}</p>
            </div>
          ) : (
            <>
              {contentTitle && <h1 className="text-[40px] font-bold mb-8">{contentTitle}</h1>}
              {breadcrumbs && <Breadcrumbs crumbs={breadcrumbs} onNavigate={handleNavigate} />}
              {contentData ? (
                <WikiContent
                  html={contentData}
                  onLinkClick={(url) => handleNavigateFromButton(url)}
                  onHeadingsParsed={handleHeadingsParsed}
                />
              ) : (
                <div className="text-center py-12 text-gray-500">
                  <p>Select a topic from the sidebar to view content.</p>
                </div>
              )}
            </>
          )}
        </div>
      </ContentLayout>
    </div>
  );
};

export default GuideRoute;
