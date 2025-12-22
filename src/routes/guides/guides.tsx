import { useState, useEffect } from 'react';
import LeftSidebar from './components/leftNavBar/leftSidebar';
import ContentLayout from '../../layout/content';
import { fetchRequest } from '../../api/client/fetchRequest';
import { serviceContent } from '../../api/url';
import menuItems from './constants/menuItems.json';
import { useLocation } from 'react-router-dom';
import parse, { domToReact, type DOMNode, Element as DomElement } from 'html-react-parser';

function WikiContent({ html, onLinkClick }: { html: string; onLinkClick: (url: string) => void }) {
  const baseUrl = 'https://wiki.it.shanghai.nyu.edu';

  return (
    <div className="prose prose-lg max-w-none">
      {parse(html, {
        replace: (node) => {
          if (node instanceof DomElement) {
            if (node.name === 'img' && node.attribs && node.attribs.src) {
              if (node.attribs.src.startsWith('/')) {
                return (
                  <img
                    {...node.attribs}
                    src={`${baseUrl}${node.attribs.src}`} 
                  />
                );
              }
            }

            // Links
            if (node.name === 'a' && node.attribs?.href?.startsWith(baseUrl)) {
              const url = node.attribs.href;
              return (
                <button className="text-blue-600 underline" onClick={() => onLinkClick(url)}>
                  {domToReact(node.children as DOMNode[])}
                </button>
              );
            }
          }
          return undefined;
        },
      })}
    </div>
  );
}
function findMenuItemByLink(items: any[], link: string): any | null {
  for (const item of items) {
    if (item.link === link) {
      return item; // Found!
    }

    if (item.children) {
      const found = findMenuItemByLink(item.children, link);
      if (found) return found;
    }
  }

  return null;
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

  console.log(currentPath);

  const [contentData, setContentData] = useState<string | null>(null);
  const [contentTitle, setContentTitle] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchContent = async () => {
      if (!currentPath || currentPath === '/') {
        setContentData(null);
        setContentTitle(null);
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setError(null);

        const apiWithParam = serviceContent + requestPageUUID;
        const contentResponse = await fetchRequest(apiWithParam);
        console.log(contentResponse);

        if (contentResponse?.[0]?.body) {
          setContentData(contentResponse?.[0]?.body);
          setContentTitle(contentResponse?.[0]?.title);
        } else {
          setError('Content not found');
          setContentData(null);
          setContentTitle(null);
        }
      } catch (err) {
        console.error('Error fetching content:', err);
        setError('Failed to load content');
        setContentData(null);
        setContentTitle(null);
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
    console.log(menuInfo);
    handleNavigate(menuInfo);
  };

  return (
    <div className="bg-white min-h-screen pt-15 pb-30">
      <ContentLayout
        leftSideBar={
          <LeftSidebar
            items={menuItems}
            currentPath={currentPath}
            onNavigate={(data) => handleNavigate(data)}
          />
        }
        rightSideBar={
          <div className="p-4">
            <div className="text-sm text-gray-600">
              {/* Right sidebar - table of contents could go here */}
            </div>
          </div>
        }
      >
        <div className="max-w-4xl mx-auto p-6 pt-[0px]">
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
              {contentTitle && (
                <h1 className="text-3xl font-bold text-gray-900 mb-6">{contentTitle}</h1>
              )}
              {contentData ? (
                <WikiContent
                  html={contentData}
                  onLinkClick={(url) => handleNavigateFromButton(url)}
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
