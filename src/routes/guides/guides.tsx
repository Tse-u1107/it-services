import { useState, useEffect } from 'react';
import LeftSidebar from './components/leftNavBar/leftSidebar';
import { sampleNavItems } from './components/sample';
import { useParams, useLocation } from 'react-router-dom';
import ContentLayout from '../../layout/content';
import { fetchRequest } from '../../api/client/fetchRequest';
import { jsonApi } from '../../api/url';

const GuideRoute = () => {
  const [currentPath, setCurrentPath] = useState('/help/account/password');
  const { id } = useParams();
  const [contentData, setContentData] = useState<string | null>(null);
  const [contentTitle, setContentTitle] = useState<string | null>(null);

  const location = useLocation();
  const { title } = location.state || {};

  const getPageContent = async (route: string) => {
    const data = await fetchRequest(route);
    return data;
  };

  useEffect(() => {
    const fetchContent = async () => {
      const jsonDynamic = jsonApi + encodeURIComponent(title);
      const jsonData = await getPageContent(jsonDynamic)
      setContentData(jsonData.data[0]?.attributes?.body)
      setContentTitle(jsonData.data[0]?.attributes?.title)
    };

    fetchContent();
  }, [id]);

  const handleNavigate = (path: string) => {
    setCurrentPath(path);
    console.log('Navigating to:', path);
  };

  return (
    <div className="bg-white">
      <ContentLayout
        leftSideBar={
          <LeftSidebar
            items={sampleNavItems}
            currentPath={currentPath}
            onNavigate={handleNavigate}
          />
        }
        rightSideBar={<div>asdf</div>}
      >
        <div>
          {contentTitle}
          {contentData?.value}
        </div>
      </ContentLayout>
    </div>
  );
};

export default GuideRoute;
