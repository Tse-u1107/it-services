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
} from '@heroicons/react/24/outline';
import IdBanner from './components/banner';
import AccessCardBlock from '../../components/accessCard/accessCardBlock';

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
        <div>
          <AccessCardBlock 
            accessItems={accessItems}
          />
        </div>
      </div>
      <IdBanner />
    </>
  );
};

export default HomeRoute;
