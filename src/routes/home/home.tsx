import { useEffect, useState } from 'react';
import SearchBar from '../../components/searchBar/searchBar';
import { useI18nContext } from '../../i18n/i18n-react';
import ExpandableList from '../../components/expandableList/expandableList';
import type { Item } from '../../components/expandableList/interface';
import { Link } from 'react-router-dom';
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

import { fetchRequest } from '../../api/client/fetchRequest';
import { menuLinks, serviceList } from '../../api/url';
import { processLinks, type FilteredLink } from './components/menuLinks';

interface MenuCategories {
  id: string;
  title: string;
  content: React.ReactNode; // optional, default to ""
  icon: React.ReactNode; // optional, can pass a Heroicon component
}

interface MenuLinks {
  result: {
    filtered: FilteredLink[];
    grouped: Record<string, FilteredLink[]>;
    stats: {
      total: number;
      filtered: number;
      categories: number;
    };
  };
}

const HomeRoute = () => {
  const [, setSearchValue] = useState('');
  const { LL } = useI18nContext();

  const [menuItems, setMenuItems] = useState<MenuLinks>({
    result: {
      filtered: [],
      grouped: {},
      stats: { total: 0, filtered: 0, categories: 0 },
    },
  });

  const [filteredLinks, setFilteredLinks] = useState<FilteredLink[]>([]);
  const [groupedLinks, setGroupedLinks] = useState<Record<string, FilteredLink[]>>({});

  const [test, setTest] = useState(0)

  const fetchServiceList = async () => {
    const data = await fetchRequest(serviceList);
    const menuLinkData = await fetchRequest(menuLinks)
    
    const result = processLinks(data);
    const { filtered, grouped, stats } = result;
    setMenuItems({
      result: { filtered, grouped, stats },
    });
    setFilteredLinks(filtered);
    setGroupedLinks(grouped);
    // console.log(data);
    console.log(menuLinkData)
    setTest(data[5].view_node)
  };

  console.log(test)


  useEffect(() => {
    fetchServiceList();
    categorizeFilteredLinks();
  }, []);

  const categorizeFilteredLinks = (): MenuCategories[] => {
    const iconMap: Record<string, React.ReactNode> = {
      'Account & Access': <UserIcon className="icon-5" />,
      'Network & Connectivity': <WifiIcon className="icon-5" />,
      'Software & Applications': <WindowIcon className="icon-5" />,
      'Hardware & Devices': <CpuChipIcon className="icon-5" />,
      'Security & Policies': <ShieldCheckIcon className="icon-5" />,
      'Support & Services': <UserGroupIcon className="icon-5" />,
    };

    console.log(groupedLinks);

    return Object.entries(groupedLinks).map(([category, links], index) => ({
      id: `cat_${index}`,
      title: category,
      content: (
        <ul className="[&>li:not(:last-child)]:mb-6">
          {links.map((link, i) => (
            <li key={i} className="text-md hover:underline hover:text-purple-600 transition-colors">
              <Link to={`/guides${link.url}`} state={{ title: link.title }}>
                {link.title}
              </Link>
            </li>
          ))}
        </ul>
      ),
      icon: iconMap[category] || <UserIcon className="icon-5" />, // fallback icon
    }));
  };

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

  return (
    <>
      <div className="home">
        <div className="home-wrapper-1">
          <div className="mb-[40px] justify-center flex">
            <span className="font-weight-semibold text-5xl">{LL.home.greetingLong()}</span>
          </div>
          <div className="mb-[19px]">
            <SearchBar
              placeholder={LL.common.search() || 'Search'}
              onChange={(e) => setSearchValue(e.target.value)}
              rightButton={<MagnifyingGlassIcon className="icon-5" />}
            />
          </div>
          <div>
            <ExpandableList items={categorizeFilteredLinks()} allowMultiple={false} />
          </div>
        </div>
        <div className="home-wrapper-2">
          <AccessCardBlock accessItems={accessItems} />
        </div>
      </div>
      <IdBanner />
    </>
  );
};

export default HomeRoute;
