import { useState, useEffect, useMemo, useCallback } from 'react';
import LeftSidebar from './components/leftNavBar/leftSidebar';
import GuideLayout from '../../layout/guideLayout/guideLayout';
import { fetchRequest } from '../../api/client/fetchRequest';
import { serviceContent } from '../../api/url';
import menuItems from './constants/menuItems.json';
import { useLocation, useNavigate } from 'react-router-dom';
import parse, { domToReact, type DOMNode, Element as DomElement } from 'html-react-parser';
import { ChevronRightIcon } from '@heroicons/react/24/outline';
import LoadingSpinner from 'src/components/loadingSpinner/loadingSpinner';

// ============================================================================
// UTILITIES
// ============================================================================

const slugify = (text: string) => {
  return text
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]+/g, '')
    .replace(/--+/g, '-');
};

const findMenuItemByLink = (items: any[], link: string): any | null => {
  for (const item of items) {
    if (item.link === link) return item;
    if (item.children) {
      const found = findMenuItemByLink(item.children, link);
      if (found) return found;
    }
  }
  return null;
};

const buildBreadcrumbs = (items: any[], targetLink: string, trail: any[] = []): any[] | null => {
  for (const item of items) {
    const currentTrail = [...trail, { title: item.title, link: item.link, uuid: item.uuid }];
    if (item.link === targetLink) return currentTrail;
    if (item.children) {
      const found = buildBreadcrumbs(item.children, targetLink, currentTrail);
      if (found) return found;
    }
  }
  return null;
};

// ============================================================================
// TYPES
// ============================================================================

interface HeadingData {
  id: string;
  text: string;
  level: number;
}

interface LinkData {
  link: string;
  uuid: string;
}

// ============================================================================
// HOOKS
// ============================================================================

const useHeadingsFromHTML = (html: string): HeadingData[] => {
  return useMemo(() => {
    if (!html) return [];

    try {
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, 'text/html');
      const headingElements = doc.querySelectorAll('h1, h2, h3, h4');

      return Array.from(headingElements).map((el) => ({
        id: el.id || slugify(el.textContent || ''),
        text: el.textContent?.trim() || '',
        level: parseInt(el.tagName[1]),
      }));
    } catch (error) {
      console.error('Error parsing headings:', error);
      return [];
    }
  }, [html]);
};

const useActiveHeading = (headings: HeadingData[]) => {
  const [activeId, setActiveId] = useState<string>('');

  useEffect(() => {
    if (headings.length === 0) return;

    const observerOptions = {
      root: null,
      rootMargin: '-100px 0px -66% 0px',
      threshold: 0,
    };

    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      const visibleHeadings = entries.filter((entry) => entry.isIntersecting);
      
      if (visibleHeadings.length > 0) {
        const topmost = visibleHeadings.reduce((top, current) => {
          return current.boundingClientRect.top < top.boundingClientRect.top ? current : top;
        });
        
        setActiveId(topmost.target.id);
      } else if (entries.length > 0) {
        const lastEntry = entries[entries.length - 1];
        if (!lastEntry.isIntersecting && lastEntry.boundingClientRect.top < 0) {
          setActiveId(lastEntry.target.id);
        }
      }
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);

    headings.forEach((heading) => {
      const element = document.getElementById(heading.id);
      if (element) {
        observer.observe(element);
      }
    });

    return () => observer.disconnect();
  }, [headings]);

  return activeId;
};

// ============================================================================
// HTML PARSING HELPERS
// ============================================================================

const extractTextFromNode = (nodes: any[]): string => {
  return nodes.reduce((acc, child) => {
    if (child.data) return acc + child.data;
    if (child.children) return acc + extractTextFromNode(child.children);
    return acc;
  }, '');
};

const createHeadingReplacer = (baseUrl: string) => {
  const headingSizes: Record<string, string> = {
    h3: 'text-xl font-semibold text-gray-800 mt-6 mb-3 scroll-mt-24',
    h4: 'text-lg font-medium text-gray-800 mt-4 mb-2 scroll-mt-24',
  };

  return (node: DomElement, parseOptions: any) => {
    const textContent = extractTextFromNode(node.children).trim();
    if (!textContent) return;

    const id = node.attribs.id || slugify(textContent);
    const children = domToReact(node.children as DOMNode[], parseOptions);

    if (node.name === 'h2') {
      return (
        <>
          <hr
            className="guide-component font-perstare w-full"
            style={{ border: '0' }}
          />
          <h2
            id={id}
            className="guide-component font-perstare text-2xl font-bold text-gray-900 mb-4 scroll-mt-24"
          >
            {children}
          </h2>
        </>
      );
    }

    return (
      <node.name id={id} className={`guide-component font-perstare ${headingSizes[node.name] || ''}`}>
        {children}
      </node.name>
    );
  };
};

const createImageReplacer = (baseUrl: string) => {
  return (node: DomElement) => {
    if (!node.attribs?.src) return;

    const src = node.attribs.src.startsWith('/')
      ? `${baseUrl}${node.attribs.src}`
      : node.attribs.src;

    return (
      <img
        {...node.attribs}
        src={src}
        className="guide-component font-perstare rounded-lg shadow-sm my-4 max-w-full h-auto"
        alt={node.attribs.alt || ''}
      />
    );
  };
};

const createLinkReplacer = (baseUrl: string, onLinkClick: (url: string) => void) => {
  return (node: DomElement) => {
    if (!node.attribs?.href) return;

    if (node.attribs.href.startsWith(baseUrl)) {
      return (
        <button
          className="guide-component font-perstare text-nyu-950 underline hover:text-nyu-500"
          onClick={() => onLinkClick(node.attribs.href)}
        >
          {domToReact(node.children as DOMNode[])}
        </button>
      );
    }
  };
};

// ============================================================================
// COMPONENTS
// ============================================================================

const WikiContent = ({
  html,
  onLinkClick,
}: {
  html: string;
  onLinkClick: (url: string) => void;
}) => {
  const baseUrl = 'https://wiki.it.shanghai.nyu.edu';

  const replaceHeading = createHeadingReplacer(baseUrl);
  const replaceImage = createImageReplacer(baseUrl);
  const replaceLink = createLinkReplacer(baseUrl, onLinkClick);

  const parseOptions = {
    replace: (node: DOMNode) => {
      if (!(node instanceof DomElement)) return;

      if (['h1', 'h2', 'h3', 'h4'].includes(node.name)) {
        return replaceHeading(node, parseOptions);
      }
      if (node.name === 'img') {
        return replaceImage(node);
      }
      if (node.name === 'a') {
        return replaceLink(node);
      }
    },
  };

  return <div className="prose prose-lg max-w-none text-gray-600">{parse(html, parseOptions)}</div>;
};

const TableOfContents = ({ headings }: { headings: HeadingData[] }) => {
  const activeId = useActiveHeading(headings);
  const visibleHeadings = headings.filter((h) => h.level <= 3);

  if (visibleHeadings.length === 0) return null;

  const handleClick = (e: React.MouseEvent, headingId: string) => {
    e.preventDefault();
    document.getElementById(headingId)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="p-4 sticky top-[50px]">
      <div className="hidden xl:block w-64 shrink-0">
        <div className="sticky top-[100px] max-h-[calc(100vh-120px)] overflow-y-auto pb-10">
          <nav className="space-y-1">
            <h3 className="text-[14px] font-semibold text-abyss-500 mb-4">On this page</h3>
            <ul>
              {visibleHeadings.map((heading) => (
                <li key={heading.id} className="relative">
                  <a
                    href={`#${heading.id}`}
                    onClick={(e) => handleClick(e, heading.id)}
                    className={`
                      block mb-[16px] pr-2 text-sm transition-all duration-300 
                      ${
                        activeId === heading.id
                          ? 'text-nyu-700 font-regular'
                          : 'text-gray-500 font-regular hover:text-abyss-400 hover:bg-gray-50 border-transparent'
                      }
                    `}
                  >
                    {heading.text}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>
    </div>
  );
};

const Breadcrumbs = ({
  crumbs,
  onNavigate,
}: {
  crumbs: any[];
  onNavigate: (data: LinkData) => void;
}) => {
  return (
    <nav className="flex items-center space-x-2 text-sm text-abyss-950 mb-[24px]">
      <button
        onClick={() => onNavigate({ link: '/', uuid: '' })}
        className="hover:text-nyu-700 transition-colors"
      >
        Home
      </button>
      {crumbs.map((crumb, index) => (
        <div key={crumb.link} className="flex items-center space-x-2">
          <span>
            <ChevronRightIcon className="icon-4 text-abyss-950" />
          </span>
          {index === crumbs.length - 1 ? (
            <span className="font-medium text-black">{crumb.title}</span>
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
};

// ============================================================================
// MAIN COMPONENT
// ============================================================================

const GuideRoute = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Extract the pathname from URL, removing /guides prefix
  const pathSegments = location.pathname.split('/').filter(Boolean);
  const currentPath = pathSegments.length > 1 ? '/' + pathSegments.slice(1).join('/') : '/';

  // Memoize selected menu item to prevent unnecessary re-renders
  const selectedMenuItem = useMemo(() => {
    if (currentPath === '/') return null;
    return findMenuItemByLink(menuItems, currentPath);
  }, [currentPath]);

  const [contentData, setContentData] = useState<string | null>(null);
  const [contentTitle, setContentTitle] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const headings = useHeadingsFromHTML(contentData || '');
  const breadcrumbs = currentPath !== '/' ? buildBreadcrumbs(menuItems, currentPath) : null;

  useEffect(() => {
    setIsLoading(true);
    const fetchContent = async () => {
      if (!currentPath || currentPath === '/' || !selectedMenuItem) {
        setContentData(null);
        setContentTitle(null);
        setIsLoading(false);
        return;
      }

      try {
        setError(null);

        const apiWithParam = serviceContent + selectedMenuItem.uuid;
        const contentResponse = await fetchRequest(apiWithParam);

        if (contentResponse?.[0]?.body) {
          setContentData(contentResponse[0].body);
          setContentTitle(contentResponse[0].title);
        } else {
          setError('Content not found');
          setContentData(null);
          setContentTitle(null);
        }
        setIsLoading(false);
      } catch (err) {
        console.error('Error fetching content:', err);
        setError('Failed to load content');
        setContentData(null);
        setContentTitle(null);
        setIsLoading(false);
      }
    };

    fetchContent();
  }, [currentPath, selectedMenuItem]);

  const handleNavigate = useCallback((data: LinkData) => {
    // Navigate to dynamic subroute using the link from menu
    navigate(`/guides${data.link}`);
  }, [navigate]);

  const handleNavigateFromButton = useCallback((url: string) => {
    const subroute = url.replace('https://wiki.it.shanghai.nyu.edu', '');
    const menuInfo = findMenuItemByLink(menuItems, subroute);
    if (menuInfo) handleNavigate(menuInfo);
  }, [handleNavigate]);

  return (
    <div className="bg-white min-h-screen pb-30">
      <GuideLayout
        leftSideBar={
          <LeftSidebar items={menuItems} currentPath={currentPath} onNavigate={handleNavigate} />
        }
        error={String(error)}
        rightSideBar={<TableOfContents headings={headings} />}
      >
        <div className="max-w-4xl px-[14px] p-0">
          {breadcrumbs && <Breadcrumbs crumbs={breadcrumbs} onNavigate={handleNavigate} />}
          {contentTitle && <h1 className="text-[40px] font-bold mb-8">{contentTitle}</h1>}
          {contentData ? (
            <WikiContent html={contentData} onLinkClick={handleNavigateFromButton} />
          ) : (
            <div className="text-center py-12 text-gray-500">
              <p>Select a topic from the sidebar to view content.</p>
            </div>
          )}
        </div>
      </GuideLayout>
      {isLoading && <LoadingSpinner />}
    </div>
  );
};

export default GuideRoute;