import React, { useState, useMemo, useEffect } from 'react';
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

  const findParentPaths = (
    items: NavItem[],
    targetPath: string,
    parents: string[] = []
  ): string[] | null => {
    for (const item of items) {
      if (item.link === targetPath) {
        return parents;
      }
      if (item.children) {
        const result = findParentPaths(item.children, targetPath, [...parents, item.link]);
        if (result) return result;
      }
    }
    return null;
  };

  const getActivePathChain = (items: NavItem[], targetPath: string): Set<string> => {
    const chain = new Set<string>();
    const parents = findParentPaths(items, targetPath);
    if (parents) {
      parents.forEach((p) => chain.add(p));
    }
    chain.add(targetPath);
    return chain;
  };

  const activePathChain = useMemo(() => {
    return getActivePathChain(items, currentPath);
  }, [items, currentPath]);

  useEffect(() => {
    if (currentPath && currentPath !== '/') {
      const parents = findParentPaths(items, currentPath);
      if (parents && parents.length > 0) {
        setExpandedItems((prev) => {
          const next = new Set(prev);
          parents.forEach((parent) => next.add(parent));
          return next;
        });
      }
    }
  }, [currentPath, items]);

  const toggleExpand = (link: string) => {
    setExpandedItems((prev) => {
      const next = new Set(prev);
      next.has(link) ? next.delete(link) : next.add(link);
      return next;
    });
  };

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
            children: filteredChildren.length > 0 ? filteredChildren : item.children,
          });
        }
        return acc;
      }, [] as NavItem[]);
    };

    return filterItems(items);
  }, [items, searchQuery]);

  const isActive = (link: string) => currentPath === link;
  const isInActiveChain = (link: string) => activePathChain.has(link);

  const getColorByDepth = (depth: number): string => {
    return depth === 0 ? 'text-abyss-500 font-semibold' : 'text-abyss-400';
  };

  const renderItem = (
    item: NavItem,
    depth: number = 0,
    connectorType: 'none' | 'vertical' | 'elbow' = 'none'
  ): React.ReactNode => {
    const hasChildren = item.children && item.children.length > 0;
    const isExpanded = expandedItems.has(item.link) || searchQuery !== '';
    const active = isActive(item.link);
    const inActiveChain = isInActiveChain(item.link);

    // Indentation math
    const parentIndent = 0.75 + (depth - 1) * 1;
    const paddingLeft = 0.25 + depth * 1; 

    // Calculate which child is on the active path
    let activeChildIndex = -1;
    if (hasChildren && inActiveChain) {
      activeChildIndex = item.children!.findIndex((child) => isInActiveChain(child.link));
    }

    // Check if any direct child is selected
    const childIsSelected = hasChildren && item.children!.some((child) => isActive(child.link));

    return (
      <div key={item.link} className="relative w-full">
        {depth > 0 && connectorType === 'vertical' && (
          <div
            className="absolute border-l-2 border-nyu-400"
            style={{
              left: `${parentIndent - 1}rem`,
              top: 0,
              bottom: 0,
              zIndex: 0
            }}
          />
        )}
        <div
          className={`flex items-center justify-between text-sm transition-colors duration-150 relative w-full
            ${getColorByDepth(depth)}
            ${
              active
                ? 'text-nyu-600 font-medium'
                : inActiveChain
                  ? 'text-nyu-500 font-medium'
                  : ''
            }
          `}
          style={{ paddingLeft: `${paddingLeft}rem` }}
        >
          {/* Connector: Elbow */}
          {connectorType === 'elbow' && (
            <div
              className="absolute border-l-2 border-b-2 border-nyu-400 rounded-bl-lg"
              style={{
                left: `${paddingLeft - 1.5}rem`, 
                top: 0,
                height: '50%',
                width: '0.5rem',
              }}
            />
          )}

          {/* Connector: Tail (Connects Parent to Children) */}
          {hasChildren && isExpanded && inActiveChain && childIsSelected && (
            <div
              className="absolute border-l-2 border-nyu-400"
              style={{
                 // CHANGED: Calculated relative to the padding
                left: `${paddingLeft -0.5}rem`,
                top: '50%',
                bottom: 0,
              }}
            />
          )}

          <button
            className="flex-1 text-left truncate relative z-10 mb-3"
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
              className="w-6 h-6 flex items-center mb-3 justify-center rounded hover:bg-gray-200 z-10 ml-2"
              onClick={(e) => {
                e.stopPropagation();
                toggleExpand(item.link);
              }}
            >
              <ChevronRightIcon
                className={`w-3 h-3 text-gray-400 transition-transform duration-200 ${
                  isExpanded ? 'rotate-90' : ''
                }`}
              />
            </button>
          )}
        </div>

        {hasChildren && isExpanded && (
          <div className="relative w-full">
            {item.children!.map((child, index) => {
              let childConnectorType: 'none' | 'vertical' | 'elbow' = 'none';

              if (inActiveChain && activeChildIndex !== -1) {
                if (index < activeChildIndex) {
                  childConnectorType = 'vertical';
                } else if (index === activeChildIndex) {
                  childConnectorType = 'elbow';
                }
              }

              return renderItem(child, depth + 1, childConnectorType);
            })}
          </div>
        )}
      </div>
    );
  };

  return (
    <aside className="w-80 bg-white border-r border-gray-200 h-screen overflow-y-auto flex flex-col">
      <div className="pl-22 pr-7 pt-2 w-full"> 
        <nav className="space-y-1 w-full">
          <div className='flex justify-center w-full mb-4'>
            <div className='relative w-full text-abyss-500'>
              <MagnifyingGlassIcon className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-[10px] text-abyss-500 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-nyu-500"
              />
            </div>
          </div>
          {filteredItems.map((item) => renderItem(item))}
          {filteredItems.length === 0 && (
            <div className="py-8 text-center text-gray-500 text-sm">
              {searchQuery ? `No results for "${searchQuery}"` : 'No items available'}
            </div>
          )}
        </nav>
      </div>
    </aside>
  );
};

export default LeftSidebar;