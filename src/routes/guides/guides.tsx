import { useState, useEffect } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import LeftSidebar from './components/leftNavBar/leftSidebar';
import { sampleNavItems } from './components/sample';
import ContentLayout from '../../layout/content';
import { fetchRequest } from '../../api/client/fetchRequest';
import { jsonApi, menuLinks } from '../../api/url';
import menuItems from './constants/menuItems.json'

interface NavItem {
  id: string;
  label: string;
  path: string;
  children?: NavItem[];
}

interface LinkData {
  title: string;
}

function parseLinksToNavItems(linkDataArray: LinkData[]): NavItem[] {
  const navItems: NavItem[] = [];

  linkDataArray.forEach((item) => {
    const hrefMatch = item.title.match(/href="([^"]+)"/);
    const textMatch = item.title.match(/>([^<]+)<\/a>/);

    if (!hrefMatch || !textMatch) return;

    const path = hrefMatch[1];
    const label = textMatch[1]
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"')
      .trim();

    const segments = path.split('/').filter(Boolean);
    const id = segments.join('-').toLowerCase().replace(/[^a-z0-9-]/g, '-');

    navItems.push({
      id,
      label,
      path,
    });
  });

  return navItems;
}

const GuideRoute = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const params = useParams();

  const [currentPath, setCurrentPath] = useState('/');
  
  // Build current path from URL params (supports wildcard routes like /guide/*)
  // const currentPath = '/' + (params['*'] || '');
  
  const [contentData, setContentData] = useState<string | null>(null);
  const [contentTitle, setContentTitle] = useState<string | null>(null);
  const [navbarItems, setNavbarItems] = useState<NavItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch page content when path changes
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
        
        // Find the matching nav item to get the proper title
        // const matchingItem = navbarItems.find(item => item.path === currentPath);
        // const titleToFetch = matchingItem?.label || currentPath.split('/').pop() || '';


        const titleToFetch = String(currentPath.replaceAll('-', '%20'))
        console.log(titleToFetch)
        
        const jsonDynamic = jsonApi + encodeURIComponent(titleToFetch);
        const jsonData = await fetchRequest(jsonDynamic);
        console.log(jsonData, jsonDynamic)
        
        if (jsonData?.data?.[0]?.attributes) {
          setContentData(jsonData.data[0].attributes.body);
          setContentTitle(jsonData.data[0].attributes.title);
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
  }, [currentPath, navbarItems]);

  const handleNavigate = (path: string) => {
    navigate(`/guide${path}`);
  };


  return (
    <div className="bg-white min-h-screen">
      <ContentLayout
        leftSideBar={
          <LeftSidebar
            items={menuItems}
            currentPath={currentPath}
            onNavigate={setCurrentPath}
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
        <div className="max-w-4xl mx-auto p-6">
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
                <h1 className="text-3xl font-bold text-gray-900 mb-6">
                  {contentTitle}
                </h1>
              )}
              {contentData ? (
                <div 
                  className="prose prose-lg max-w-none"
                  dangerouslySetInnerHTML={{ __html: contentData }}
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