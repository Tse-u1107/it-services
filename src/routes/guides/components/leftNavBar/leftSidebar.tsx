import React, { useState, useMemo } from 'react';
import { ChevronRightIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';

interface NavItem {
  title: string;
  link: string;
  uuid: string;
  children?: NavItem[];
}

interface LeftSidebarProps {
  items: NavItem[];
  currentPath: string;
  onNavigate: (data: { link: string; uuid: string }) => void;
}

const LeftSidebar: React.FC<LeftSidebarProps> = ({ items, currentPath, onNavigate }) => {
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());
  const [searchQuery, setSearchQuery] = useState('');

  const toggleExpand = (link: string) => {
    setExpandedItems(prev => {
      const next = new Set(prev);
      next.has(link) ? next.delete(link) : next.add(link);
      return next;
    });
  };

  // Recursive search filter with memoization
  const filteredItems = useMemo(() => {
    if (!searchQuery) return items;

    const query = searchQuery.toLowerCase();
    
    const filterItems = (items: NavItem[]): NavItem[] => {
      return items.reduce((acc, item) => {
        const matchesTitle = item.title.toLowerCase().includes(query);
        const filteredChildren = item.children ? filterItems(item.children) : [];
        
        if (matchesTitle || filteredChildren.length > 0) {
          acc.push({
            ...item,
            children: filteredChildren.length > 0 ? filteredChildren : item.children
          });
        }
        return acc;
      }, [] as NavItem[]);
    };

    return filterItems(items);
  }, [items, searchQuery]);

  // Check if current path matches item
  const isActive = (link: string) => {
    return currentPath === link || currentPath.startsWith(link + '/');
  };

  // Recursive render function
  const renderItem = (item: NavItem, depth: number = 0): React.ReactNode => {
    const hasChildren = item.children && item.children.length > 0;
    const isExpanded = expandedItems.has(item.link) || searchQuery !== '';
    const active = isActive(item.link);

    return (
      <div key={item.link}>
        <button
          onClick={() => {
            if (hasChildren) {
              toggleExpand(item.link);
            }
            onNavigate({ link: item.link, uuid: item.uuid });
          }}
          className={`
            w-full flex items-center justify-between px-4 py-2 text-left text-sm
            transition-colors
            ${active ? 'bg-blue-50 text-blue-600 font-medium' : 'text-gray-700 hover:bg-gray-50'}
            ${depth === 0 ? 'font-semibold' : ''}
          `}
          style={{ paddingLeft: `${1 + depth * 1}rem` }}
        >
          <span className="truncate">{item.title}</span>
          {hasChildren && (
            <ChevronRightIcon
              className={`w-4 h-4 flex-shrink-0 ml-2 transition-transform ${
                isExpanded ? 'rotate-90' : ''
              }`}
            />
          )}
        </button>

        {hasChildren && isExpanded && (
          <div>
            {item.children!.map(child => renderItem(child, depth + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <aside className="w-80 bg-white border-r border-gray-200 h-screen overflow-y-auto">
      <div className="p-4">
        <div className="relative mb-4">
          <MagnifyingGlassIcon className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <nav>
          {filteredItems.map(item => renderItem(item))}
          
          {filteredItems.length === 0 && (
            <div className="px-4 py-8 text-center text-gray-500 text-sm">
              {searchQuery ? `No results for "${searchQuery}"` : 'No items available'}
            </div>
          )}
        </nav>
      </div>
    </aside>
  );
};

export default LeftSidebar;