import { useState } from 'react';
import SearchBar from '../../components/searchBar/searchBar';
import { useI18nContext } from '../../i18n/i18n-react';
import ExpandableList from '../../components/expandableList/expandableList';
import type { Item } from '../../components/expandableList/interface';

import './home.css';

import {
  MagnifyingGlassIcon,
  UserIcon,
  WifiIcon,
  WindowIcon,
  CpuChipIcon,
  ShieldCheckIcon,
  UserGroupIcon,
  PlusIcon,
} from '@heroicons/react/24/outline';
import IdBanner from './components/banner';

const AccessCard = ({
  title,
  content,
  icon,
  id,
}: {
  title: string;
  content: string;
  icon: React.ReactNode;
  id: string;
}) => {
  return (
    <div id={id} className="bg-white m-2 p-4 rounded-4xl w-1/4 relative">
      <div className="absolute top-4 left-4">{icon}</div>
      <div className="w-full mt-8">{title}</div>
      <div className="w-full">{content}</div>
      <div className="absolute bottom-4 right-4">
        <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
          <PlusIcon className="w-4 h-4 text-white" />
        </div>
      </div>
    </div>
  );
};

const HomeRoute = () => {
  const [, setSearchValue] = useState('');
  const { LL } = useI18nContext();

  const items: Item[] = [
    {
      id: '1',
      title: LL.home.list.account(),
      content: 'Account content',
      icon: <UserIcon className="w-5 h-5" />,
    },
    {
      id: '2',
      title: LL.home.list.network(),
      content: 'Network content',
      icon: <WifiIcon className="w-5 h-5" />,
    },
    {
      id: '3',
      title: LL.home.list.software(),
      content: 'Install, update, and manage software applications.',
      icon: <WindowIcon className="w-5 h-5" />,
    },
    {
      id: '4',
      title: LL.home.list.hardware(),
      content: 'Monitor and maintain hardware devices.',
      icon: <CpuChipIcon className="w-5 h-5" />,
    },
    {
      id: '5',
      title: LL.home.list.security(),
      content: 'Review security policies and access control.',
      icon: <ShieldCheckIcon className="w-5 h-5" />,
    },
    {
      id: '6',
      title: LL.home.list.support(),
      content: 'Get help and support services.',
      icon: <UserGroupIcon className="w-5 h-5" />,
    },
  ];

  const accessItems: Item[] = [
    {
      id: 'access_1',
      title: LL.home.list.account(),
      content: 'Account content',
      icon: <UserIcon className="w-5 h-5" />,
    },
    {
      id: 'access_2',
      title: LL.home.list.network(),
      content: 'Network content',
      icon: <WifiIcon className="w-5 h-5" />,
    },
    {
      id: 'access_3',
      title: LL.home.list.software(),
      content: 'Install, update, and manage software applications.',
      icon: <WindowIcon className="w-5 h-5" />,
    },
    {
      id: 'access_4',
      title: LL.home.list.hardware(),
      content: 'Monitor and maintain hardware devices.',
      icon: <CpuChipIcon className="w-5 h-5" />,
    },
    {
      id: 'access_5',
      title: LL.home.list.security(),
      content: 'Review security policies and access control.',
      icon: <ShieldCheckIcon className="w-5 h-5" />,
    },
    {
      id: 'access_6',
      title: LL.home.list.support(),
      content: 'Get help and support services.',
      icon: <UserGroupIcon className="w-5 h-5" />,
    },
  ];

  return (
    <>
      <div className="home">
        <div className="home-first">
          <h1 className="mb-5">{LL.home.greetingLong()}</h1>
          <div className="mb-5">
            <SearchBar
              placeholder={LL.common.search() || 'asdf'}
              onChange={(e) => setSearchValue(e.target.value)}
              rightButton={<MagnifyingGlassIcon className="w-5 h-5" />}
            />
          </div>
          <div>
            <ExpandableList items={items} allowMultiple={false} />
          </div>
        </div>
        <div className="w-full">
          <div className="flex justify-between">
            <div className="">Quick Access</div>
            <div>Browse all topics</div>
          </div>
          <div>
            <div className="flex flex-wrap justify-center">
              {accessItems.map((item, index) => (
                <AccessCard
                  key={item.id}
                  title={item.title}
                  content={item.content}
                  icon={item.icon}
                  id={'access_' + String(index)}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
      <IdBanner />
    </>
  );
};

export default HomeRoute;
