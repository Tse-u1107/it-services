import { useEffect, useState, useRef } from 'react';
import SearchBar from '../../components/navigationBar/components/searchBar/searchBar';
import { useI18nContext } from '../../i18n/i18n-react';
import ExpandableList from '../../components/expandableList/expandableList';
import type { Item } from '../../components/expandableList/interface';
import { Link } from 'react-router-dom';
// REMOVED: import './home.css'; 

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
import menuItemsJSON from '../../assets/menuItems.json';
import { processLinks, type FilteredLink } from './components/menuLinks';
import { loadAuthUser } from 'src/utils/userInfo';
import { fetchRequest } from '../../api/client/fetchRequest';
import { search as searchApiUrl, home as homeApiUrl } from '../../api/url';
import type { SearchResult } from '../../api/types/searchTypes';
import { transformHomeApiResponse, type HomeApiItem } from '../../utils/transformHomeApi';

interface MenuCategories {
  id: string;
  title: string;
  content: React.ReactNode;
  icon: React.ReactNode;
}

const HomeRoute = () => {
  const [searchValue, setSearchValue] = useState('');
  const { LL } = useI18nContext();

  const [filteredLinks, setFilteredLinks] = useState<FilteredLink[]>([]);
  const [groupedLinks, setGroupedLinks] = useState<Record<string, FilteredLink[]>>({});

  // Search State
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  const [accessItems, setAccessItems] = useState<Item[]>([]);
  const [accessItemsLoading, setAccessItemsLoading] = useState(true);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  const fetchServiceList = async () => {
    const data = menuItemsJSON;
    const result = processLinks(data);
    const { filtered, grouped } = result;
    setFilteredLinks(filtered);
    setGroupedLinks(grouped);
  };

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

  // --- Auto-Scroll Logic ---
  useEffect(() => {
    if (searchResults.length > 0 && isSearchFocused && searchContainerRef.current) {
      searchContainerRef.current.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }, [searchResults, isSearchFocused]);

  useEffect(() => {
    loadAuthUser();

    async function init() {
      fetchServiceList();
      fetchHomeApiData();
    }
    init();

    // Handle click outside search container
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(event.target as Node)
      ) {
        setIsSearchFocused(false);
      }
    };

    if (isSearchFocused) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isSearchFocused]);

  const categorizeFilteredLinks = (): MenuCategories[] => {
    const iconMap: Record<string, React.ReactNode> = {
      'Account & Access': <UserIcon className="icon-5" />,
      'Network & Connectivity': <WifiIcon className="icon-5" />,
      'Software & Applications': <WindowIcon className="icon-5" />,
      'Hardware & Devices': <CpuChipIcon className="icon-5" />,
      'Security & Policies': <ShieldCheckIcon className="icon-5" />,
      'Support & Services': <UserGroupIcon className="icon-5" />,
    };

    return Object.entries(groupedLinks).map(([category, links], index) => ({
      id: `cat_${index}`,
      title: category,
      content: (
        <ul className="[&>li:not(:last-child)]:mb-6">
          {links.map((link, i) => (
            <li key={i} className="text-md hover:underline hover:text-purple-600 transition-colors">
              <Link to={`/guides`} state={{ title: link.title, link: link.link, uuid: link.uuid }}>
                {link.title}
              </Link>
            </li>
          ))}
        </ul>
      ),
      icon: iconMap[category] || <UserIcon className="icon-5" />,
    }));
  };

  return (
    <>
      <div className="flex flex-col items-center max-w-[1080px] mx-auto pt-10 pb-8">
        <div className="w-full max-w-[760px] flex-1 mb-[76px]">
          <div className="mb-[40px] justify-center flex">
            <span className="font-weight-semibold text-5xl">{LL.home.greetingLong()}</span>
          </div>

          <div
            className={`w-full mx-auto mb-8 relative transition-all duration-300 ${isSearchFocused ? 'z-50' : 'z-10'}`}
            ref={searchContainerRef}
          >
            <SearchBar
              placeholder={LL.common.search() || 'Search'}
              value={searchValue}
              onChange={(e) => handleSearchChange(e.target.value)}
              onFocus={() => setIsSearchFocused(true)}
              rightButton={<MagnifyingGlassIcon className="icon-5" />}
              results={searchResults}
              searchFocused={isSearchFocused}
              onResultClick={() => setSearchResults([])}
            />
          </div>

          <div className="mt-8 transition-transform duration-300">
            <ExpandableList items={categorizeFilteredLinks()} allowMultiple={false} />
          </div>
        </div>
        <div className="w-full max-w-[1080px] mb-[76px]">
          {accessItemsLoading ? (
            <div className="text-center py-8">Loading quick access items...</div>
          ) : accessItems.length > 0 ? (
            <AccessCardBlock accessItems={accessItems} />
          ) : (
            <div className="text-center py-8">No quick access items available.</div>
          )}
        </div>
      </div>
      <IdBanner />
    </>
  );
};

export default HomeRoute;