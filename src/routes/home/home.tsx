import { useEffect, useState, useRef } from 'react';
import SearchBar from '../../components/searchBar/searchBar';
import { useI18nContext } from '../../i18n/i18n-react';
import ExpandableList from '../../components/expandableList/expandableList';
import type { Item } from '../../components/expandableList/interface';
import { Link, useLocation } from 'react-router-dom';
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
import menuItemsJSON from '../../assets/menuItems.json'
import { processLinks, type FilteredLink } from './components/menuLinks';
import { loadAuthUser } from 'src/utils/userInfo';
import { fetchRequest } from '../../api/client/fetchRequest';
import { search as searchApiUrl } from '../../api/url';
import type { SearchResult } from '../../api/types/searchTypes';

interface MenuCategories {
  id: string;
  title: string;
  content: React.ReactNode; // optional, default to ""
  icon: React.ReactNode; // optional, can pass a Heroicon component
}

const HomeRoute = () => {

  const location = useLocation()
  const [searchValue, setSearchValue] = useState('');
  const { LL } = useI18nContext();

  const [userInfo, setUserInfo] = useState([])

  const [filteredLinks, setFilteredLinks] = useState<FilteredLink[]>([]);
  const [groupedLinks, setGroupedLinks] = useState<Record<string, FilteredLink[]>>({});
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  const fetchServiceList = async () => {
    const data = menuItemsJSON
    
    const result = processLinks(data);
    const { filtered, grouped, stats } = result;
    setFilteredLinks(filtered);
    setGroupedLinks(grouped);
  };

  const handleSearchChange = async (value: string) => {
    setSearchValue(value);
    
    if (!value.trim()) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    try {
      const results = await fetchRequest<SearchResult[]>(
        `${searchApiUrl}?limit=5&query=${encodeURIComponent(value)}`
      );
      setSearchResults(Array.isArray(results) ? results : []);
    } catch (error) {
      console.error('Search error:', error);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  useEffect(() => {

    const localUserInfo = loadAuthUser()

    console.log(localUserInfo, userInfo)

    async function init() {
      fetchServiceList();
      categorizeFilteredLinks();
    }

    init()

    // Handle click outside search container
    const handleClickOutside = (event: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
        setIsSearchFocused(false);
      }
    };

    if (isSearchFocused) {
      document.addEventListener('mousedown', handleClickOutside);
      // Prevent body scroll when search is focused
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = 'auto';
    };
  }, [isSearchFocused]);
  

  console.log(location)

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
              <Link to={`/guides`} state={{ title: link.title, link: link.link, uuid: link.uuid  }}>
                {link.title}
              </Link>
            </li>
          ))}
        </ul>
      ),
      icon: iconMap[category] || <UserIcon className="icon-5" />,
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
      {isSearchFocused && <div className="search-backdrop" onClick={() => setIsSearchFocused(false)} />}
      <div className="home">
        <div className="home-wrapper-1">
          <div className="mb-[40px] justify-center flex">
            <span className="font-weight-semibold text-5xl">{LL.home.greetingLong()}</span>
          </div>
          <div className="mb-[19px] relative" ref={searchContainerRef} className={isSearchFocused ? 'search-container-focused' : ''}>
            <SearchBar
              placeholder={LL.common.search() || 'Search'}
              value={searchValue}
              onChange={(e) => handleSearchChange(e.target.value)}
              onFocus={() => setIsSearchFocused(true)}
              rightButton={<MagnifyingGlassIcon className="icon-5" />}
            />
            {searchResults.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                <div className="p-4">
                  <div className="text-sm font-semibold text-gray-700 mb-3">Suggested Results</div>
                  <div className="space-y-3 max-h-96 overflow-y-auto">
                    {searchResults.map((result, index) => (
                      <div
                        key={index}
                        className="p-3 border border-gray-100 rounded hover:bg-gray-50 cursor-pointer transition-colors"
                      >
                        <div className="font-medium text-gray-900 text-sm mb-1">{result.title}</div>
                        <div className="text-gray-600 text-xs line-clamp-2 mb-2">{result.body}</div>
                        <Link
                          to={result.view_node}
                          className="text-blue-600 hover:text-blue-800 text-xs underline"
                          onClick={() => setSearchResults([])}
                        >
                          View →
                        </Link>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
          <div className="mt-8">
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
