import { useState, useEffect } from 'react';
import SearchBar from '../../components/searchBar/searchBar';
import { useI18nContext } from '../../i18n/i18n-react';
import Breadcrumbs from '../../components/breadCrumbs/breadCrumbs';
import CategorySection from './components/categorySection';
import { UserCircleIcon as User } from '@heroicons/react/24/outline';
import { type Item } from '../../components/expandableList/interface';
import menuItem from '../../assets/menuItems.json';
import AccessCardBlock from '../../components/accessCard/accessCardBlock';
import { fetchRequest } from '../../api/client/fetchRequest';
import { home as homeApiUrl } from '../../api/url';
import { transformHomeApiResponse, type HomeApiItem } from '../../utils/transformHomeApi';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
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
  const [accessItems, setAccessItems] = useState<Item[]>([]);
  const [accessItemsLoading, setAccessItemsLoading] = useState(true);

  const menuData: NavItem[] = menuItem;

  const filteredMenuData = menuData.filter((item) => item.title !== 'Home');

  const fetchHomeApiData = async () => {
    try {
      setAccessItemsLoading(true);
      const data = await fetchRequest<HomeApiItem[]>(homeApiUrl);
      const transformedItems = transformHomeApiResponse(Array.isArray(data) ? data : []);
      setAccessItems(transformedItems);
    } catch (error) {
      console.error('Error fetching home API data:', error);
      setAccessItems([]);
    } finally {
      setAccessItemsLoading(false);
    }
  };

  useEffect(() => {
    fetchHomeApiData();
  }, []);

  // Transform NavItem structure to match CategorySection expected format
  const transformToCategoryFormat = (navItems: NavItem[]) => {
    return navItems.map((navItem) => ({
      title: navItem.title,
      icon: User, // You can map different icons based on category if needed
      items: navItem.children
        ? navItem.children.map((child) => ({
            link: child.link,
            linkTitle: child.title,
            uuid: child.uuid,
          }))
        : [],
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
              value={searchValue}
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
          {accessItemsLoading ? (
            <div className="text-center py-8">Loading quick access items...</div>
          ) : accessItems.length > 0 ? (
            <AccessCardBlock
              accessItems={accessItems}
              title="Quick Access"
              showBrowseButton={false}
              browseButtonText="Browse all topics"
              cardBgColor="bg-off-white"
              cardTextColor="text-[#2F2F2F]"
              titleSize="text-xl"
              showCarousel={true}
            />
          ) : (
            <div className="text-center py-8">No quick access items available.</div>
          )}
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