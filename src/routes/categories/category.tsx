import { useState } from 'react';
import SearchBar from '../../components/searchBar/searchBar';
import { useI18nContext } from '../../i18n/i18n-react';
import Breadcrumbs from '../../components/breadCrumbs/breadCrumbs';
import CategorySection from './components/categorySection';
import { UserCircleIcon as User } from '@heroicons/react/24/outline';
import { type Item } from '../../components/expandableList/interface';
import { PlusIcon } from '@heroicons/react/24/outline';
import menuItem from '../../assets/menuItems.json'
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

interface NavItem {
  title: string;
  link: string;
  uuid: string;
  children?: NavItem[];
}

const CategoryRoute = () => {
  const { LL } = useI18nContext();

  const [searchValue, setSearchValue] = useState('');

  console.log(searchValue);

  const menuData: NavItem[] = menuItem

  const filteredMenuData = menuData.filter(item => item.title !== "Home");

  const accessItems: Item[] = [
    {
      id: 'access_1',
      title: LL.home.list.account(),
      content: 'Account content',
      icon: <UserIcon className="icon-8" />,
    },
    {
      id: 'access_2',
      title: LL.home.list.network(),
      content: 'Network content',
      icon: <WifiIcon className="icon-8" />,
    },
    {
      id: 'access_3',
      title: LL.home.list.software(),
      content: 'Install, update, and manage software applications.',
      icon: <WindowIcon className="icon-8" />,
    },
    {
      id: 'access_4',
      title: LL.home.list.hardware(),
      content: 'Monitor and maintain hardware devices.',
      icon: <CpuChipIcon className="icon-8" />,
    },
    {
      id: 'access_5',
      title: LL.home.list.security(),
      content: 'Review security policies and access control.',
      icon: <ShieldCheckIcon className="icon-8" />,
    },
    {
      id: 'access_6',
      title: LL.home.list.support(),
      content: 'Get help and support services.',
      icon: <UserGroupIcon className="icon-8" />,
    },
  ];

  // Transform NavItem structure to match CategorySection expected format
  const transformToCategoryFormat = (navItems: NavItem[]) => {
    return navItems.map(navItem => ({
      title: navItem.title,
      icon: User, // You can map different icons based on category if needed
      items: navItem.children 
        ? navItem.children.map(child => ({
            link: child.link,
            linkTitle: child.title,
            uuid: child.uuid
          }))
        : []
    }));
  };

  const categories = transformToCategoryFormat(filteredMenuData);

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
    <div className="flex justify-center bg-white">
      <div className="w-[1100px] mt-[54px]">
        <div className="flex mb-20">
          <div>
            <div className="font-bold text-[40px] mb-8 mr-23">
              <h1>Categories</h1>
            </div>
            <div>
              <Breadcrumbs />
            </div>
          </div>
          <div className="flex w-full items-center">
            <SearchBar
              placeholder={LL.common.search()}
              onChange={(e) => setSearchValue(e.target.value)}
              rightButton={<MagnifyingGlassIcon className="icon-5" />}
            />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
          {categories.map((category, index) => (
            <CategorySection
              key={index}
              title={category.title}
              icon={category.icon}
              items={category.items}
            />
          ))}
        </div>
        <div className="mb-20">
          <div className="w-full">
            <div className="flex justify-between mb-10">
              <div className="font-medium text-xl">Quick Access</div>
              <button className="font-medium text-md text-[#686868] hover:text-black cursor-pointer">
                Browse all topics {'>'}
              </button>
            </div>
            <div className="flex flex-wrap gap-[56px]">
              {accessItems.map((item, index) => (
                <div
                  key={item.id}
                  id={'access_' + String(index)}
                  className="bg-off-white p-6 rounded-[25px] w-[calc(33.333%-37.33px)] relative h-[230px]"
                >
                  <div className="w-8 h-8 relative mb-4">{item.icon}</div>
                  <div className="font-medium text-base mb-4">{item.title}</div>
                  <div className="font-normal text-base w-full mt-4 color-[#2F2F2F]">
                    {item.content}
                  </div>
                  <div className="absolute bottom-6 right-6">
                    <button className="bg-black rounded-full flex items-center justify-center cursor-pointer w-8 h-8">
                      <PlusIcon className="w-8 h-8 text-white" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="mb-46">
          <HelpSection
            sections={[
              { title: 'Getting started', items: helpData.gettingStarted },
              { title: 'Popular', items: helpData.popular },
            ]}
          />
        </div>
      </div>
    </div>
  );
};

export default CategoryRoute;