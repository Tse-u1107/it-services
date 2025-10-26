import { useState } from 'react';
import LeftSidebar from '../../components/leftNavBar/leftSidebar';
import { sampleNavItems } from './components/sample';

const GuideRoute = () => {
  const [currentPath, setCurrentPath] = useState('/help/account/password');

  const handleNavigate = (path: string) => {
    setCurrentPath(path);
    console.log('Navigating to:', path);
  };

  return (
    <div className='bg-white'>
      <LeftSidebar items={sampleNavItems} currentPath={currentPath} onNavigate={handleNavigate} />
    </div>
  );
};

export default GuideRoute;
