import React, { useState, useMemo, useEffect, useCallback } from 'react';
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

// Extracted helper functions
const buildPathChain = (items: NavItem[], targetPath: string): Set<string> => {
  const chain = new Set<string>();
  
  const traverse = (items: NavItem[], parents: string[] = []): boolean => {
    for (const item of items) {
      if (item.link === targetPath) {
        parents.forEach(p => chain.add(p));
        chain.add(targetPath);
        return true;
      }
      if (item.children && traverse(item.children, [...parents, item.link])) {
        return true;
      }
    }
    return false;
  };
  
  traverse(items);
  return chain;
};

const filterItemsRecursive = (items: NavItem[], query: string): NavItem[] => {
  const lowerQuery = query.toLowerCase();
  
  return items.reduce((acc, item) => {
    const titleMatches = item.title.toLowerCase().includes(lowerQuery);
    const filteredChildren = item.children ? filterItemsRecursive(item.children, lowerQuery) : [];
    
    if (titleMatches || filteredChildren.length > 0) {
      acc.push({ ...item, children: filteredChildren.length > 0 ? filteredChildren : item.children });
    }
    return acc;
  }, [] as NavItem[]);
};

const LeftSidebar: React.FC<LeftSidebarProps> = ({ items, currentPath, onNavigate }) => {
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());
  const [searchQuery, setSearchQuery] = useState('');

  const activePathChain = useMemo(() => buildPathChain(items, currentPath), [items, currentPath]);

  // Auto-expand parents of current path
  useEffect(() => {
    if (currentPath && currentPath !== '/') {
      setExpandedItems(prev => new Set([...prev, ...activePathChain].filter(p => p !== currentPath)));
    }
  }, [currentPath, activePathChain]);

  const toggleExpand = useCallback((link: string) => {
    setExpandedItems(prev => {
      const next = new Set(prev);
      next.has(link) ? next.delete(link) : next.add(link);
      return next;
    });
  }, []);

  const filteredItems = useMemo(() => 
    searchQuery ? filterItemsRecursive(items, searchQuery) : items,
    [items, searchQuery]
  );

  const renderItem = useCallback((
    item: NavItem,
    depth: number = 0
  ): React.ReactNode => {
    const hasChildren = item.children && item.children.length > 0;
    const isExpanded = expandedItems.has(item.link) || !!searchQuery;
    const isActive = currentPath === item.link;
    const inActiveChain = activePathChain.has(item.link);

    const paddingLeft = 0.25 + depth;

    const textColorClass = isActive 
      ? 'text-nyu-600 font-medium' 
      : inActiveChain 
      ? 'text-nyu-500 font-medium'
      : depth === 0 
      ? 'text-abyss-500 font-medium' 
      : 'text-abyss-400 font-regular';

    return (
      <div key={item.link} className="w-full">
        <div
          className={`flex items-center justify-between text-sm transition-colors duration-150 w-full ${textColorClass}`}
          style={{ paddingLeft: `${paddingLeft}rem` }}
        >
          <button
            className="flex-1 text-left truncate mb-3"
            onClick={() => {
              if (hasChildren) toggleExpand(item.link);
              onNavigate({ link: item.link, uuid: item.uuid });
            }}
          >
            {item.title}
          </button>

          {hasChildren && (
            <button
              aria-label={isExpanded ? 'Collapse section' : 'Expand section'}
              className="w-6 h-6 flex items-center mb-3 justify-center rounded hover:bg-gray-200 ml-2"
              onClick={(e) => {
                e.stopPropagation();
                toggleExpand(item.link);
              }}
            >
              <ChevronRightIcon
                strokeWidth={2}
                className={`w-3 h-3 transition-transform duration-200 ${isExpanded ? 'rotate-90' : ''} ${textColorClass}`}
              />
            </button>
          )}
        </div>

        {hasChildren && isExpanded && (
          <div className="w-full">
            {item.children!.map((child) => renderItem(child, depth + 1))}
          </div>
        )}
      </div>
    );
  }, [expandedItems, searchQuery, currentPath, activePathChain, onNavigate, toggleExpand]);

  return (
    <aside className="w-full bg-white border-r border-gray-200 h-screen overflow-y-auto flex flex-col">
      <nav className="pl-[72px] pr-[29px] space-y-1 w-full">
        <div className="flex justify-center w-full mb-[32px]">
          <div className="relative w-full text-abyss-500">
            <MagnifyingGlassIcon className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="text-abyss-500 border border-[#ECEBF1] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-nyu-500 lg:h-[2rem] lg:w-[224px] lg:py-[10px] lg:pl-9 lg:pr-3"
            />
          </div>
        </div>
        
        {filteredItems.map(item => renderItem(item))}
        
        {filteredItems.length === 0 && (
          <div className="py-8 text-center text-gray-500 text-sm">
            {searchQuery ? `No results for "${searchQuery}"` : 'No items available'}
          </div>
        )}
      </nav>
    </aside>
  );
};

export default LeftSidebar;