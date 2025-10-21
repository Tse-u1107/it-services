import { useState } from 'react';
import SearchBar from '../../components/searchBar/searchBar';
import { useI18nContext } from '../../i18n/i18n-react';
import Breadcrumbs from '../../components/breadCrumbs/breadCrumbs';
import CategorySection from './components/categorySection';
import { UserCircleIcon as User } from '@heroicons/react/24/outline';
import AccessCardBlock from '../../components/accessCard/accessCardBlock';
import { type Item } from '../../components/expandableList/interface';

import {
  MagnifyingGlassIcon,
  UserIcon,
  WifiIcon,
  WindowIcon,
  CpuChipIcon,
  ShieldCheckIcon,
  UserGroupIcon,
} from '@heroicons/react/24/outline';
import HelpSection from './components/helpSection';

const CategoryRoute = () => {
  const { LL } = useI18nContext();

  const [searchValue, setSearchValue] = useState('');

  console.log(searchValue);

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

  const categories = [
    {
      title: 'Account & access',
      icon: User,
      items: [
        { link: '/password-reset', linkTitle: 'Password reset / Recovery' },
        { link: '/two-factor', linkTitle: 'Two-factor Authentication' },
        { link: '/account-issues', linkTitle: 'Account issues for Students/Faculty/Staff' },
        { link: '/two-factor-setup', linkTitle: 'Two-factor Authentication' },
        { link: '/two-factor-troubleshoot', linkTitle: 'Two-factor Authentication' },
      ],
    },
    {
      title: 'Account & access',
      icon: User,
      items: [
        { link: '/password-reset', linkTitle: 'Password reset / Recovery' },
        { link: '/two-factor', linkTitle: 'Two-factor Authentication' },
        { link: '/account-issues', linkTitle: 'Account issues for Students/Faculty/Staff' },
        { link: '/two-factor-setup', linkTitle: 'Two-factor Authentication' },
      ],
    },
    {
      title: 'Account & access',
      icon: User,
      items: [
        { link: '/password-reset', linkTitle: 'Password reset / Recovery' },
        { link: '/two-factor', linkTitle: 'Two-factor Authentication' },
        { link: '/account-issues', linkTitle: 'Account issues for Students/Faculty/Staff' },
        { link: '/two-factor-setup', linkTitle: 'Two-factor Authentication' },
        { link: '/two-factor-troubleshoot', linkTitle: 'Two-factor Authentication' },
      ],
    },
    {
      title: 'Account & access',
      icon: User,
      items: [
        { link: '/password-reset', linkTitle: 'Password reset / Recovery' },
        { link: '/two-factor', linkTitle: 'Two-factor Authentication' },
        { link: '/account-issues', linkTitle: 'Account issues for Students/Faculty/Staff' },
        { link: '/two-factor-setup', linkTitle: 'Two-factor Authentication' },
        { link: '/two-factor-troubleshoot', linkTitle: 'Two-factor Authentication' },
      ],
    },
  ];

  const helpData = {
    gettingStarted: [
      {
        title: 'Account issues',
        description:
          'It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout.',
        href: '#',
      },
      {
        title: 'Account setup',
        description:
          'The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters.',
        href: '#',
      },
    ],
    popular: [
      {
        title: 'ID card lost',
        description:
          'It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout.',
        href: '#',
      },
      {
        title: 'Password reset',
        description: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry.',
        href: '#',
      },
    ],
  };

  return (
    <div>
      <div className="flex">
        <div>
          <div>
            <h1>Categories</h1>
          </div>
          <div>
            <Breadcrumbs />
          </div>
        </div>
        <div>
          <SearchBar
            placeholder={LL.common.search()}
            onChange={(e) => setSearchValue(e.target.value)}
            rightButton={<MagnifyingGlassIcon className="w-5 h-5" />}
          />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {categories.map((category, index) => (
          <CategorySection
            key={index}
            title={category.title}
            icon={category.icon}
            items={category.items}
          />
        ))}
      </div>
      <div>
        <AccessCardBlock accessItems={accessItems} />
      </div>
      <div>
        <HelpSection
          sections={[
            { title: 'Getting started', items: helpData.gettingStarted },
            { title: 'Popular', items: helpData.popular },
          ]}
        />
      </div>
    </div>
  );
};

export default CategoryRoute;
