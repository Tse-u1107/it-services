import React, { useState } from 'react';
import { ChevronRightIcon } from '@heroicons/react/24/outline';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';

interface NavItem {
  id: string;
  label: string;
  path: string;
  children?: NavItem[];
}

interface LeftSidebarProps {
  items: NavItem[];
  currentPath: string;
  onNavigate: (path: string) => void;
}

const LeftSidebar: React.FC<LeftSidebarProps> = ({ items, currentPath, onNavigate }) => {
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());

  const toggleExpand = (id: string) => {
    setExpandedItems((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const renderNavItem = (item: NavItem, depth = 0) => {
    const hasChildren = item.children && item.children.length > 0;
    const isExpanded = expandedItems.has(item.id);
    const isActive = currentPath === item.path;

    return (
      <div key={item.id}>
        <button
          onClick={() => {
            if (hasChildren) {
              toggleExpand(item.id);
            } else {
              onNavigate(item.path);
            }
          }}
          style={{
            color: isActive ? undefined : depth === 0 ? '#2B2B2B' : '#666666',
            fontWeight: isActive ? undefined : depth === 0 ? '600' : '400',
          }}
          className={`
            w-full flex items-center justify-between px-4 py-2.5 text-left text-sm
            transition-colors duration-150
            ${isActive ? 'bg-blue-50 text-blue-600 font-medium' : 'hover:bg-gray-50'}
            ${depth > 0 ? 'pl-' + (4 + depth * 4) : ''}
          `}
        >
          <span>{item.label}</span>
          {hasChildren && (
            <ChevronRightIcon
              className={`w-4 h-4 transition-transform duration-200 ${
                isExpanded ? 'rotate-90' : ''
              }`}
            />
          )}
        </button>

        {hasChildren && isExpanded && (
          <div>{item.children!.map((child) => renderNavItem(child, depth + 1))}</div>
        )}
      </div>
    );
  };

  return (
    <aside className="w-86 bg-white border-r border-gray-200 min-h-screen">
      <div className="pl-22 pr-7 py-4">
        <div className="px-4 mb-4 relative">
          <MagnifyingGlassIcon className="w-4 h-4 absolute left-7 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
          <input
            type="text"
            placeholder="Search"
            className="w-full pl-9 pr-3 py-2 border-1 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-nyu-700"
          />
        </div>

        <nav className="space-y-1">
          <div className="px-4 py-2 text-sm font-semibold text-nyu-700 uppercase tracking-wider">
            HELP
          </div>
          {items.filter((item) => item.id.startsWith('help-')).map((item) => renderNavItem(item))}

          <div className="px-4 py-2 text-sm font-semibold text-nyu-700 uppercase tracking-wider mt-6">
            CONTACT
          </div>
          {items
            .filter((item) => item.id.startsWith('contact-'))
            .map((item) => renderNavItem(item))}

          <div className="px-4 py-2 text-sm font-semibold text-nyu-700 uppercase tracking-wider mt-6">
            EXAMPLE
          </div>
          {items
            .filter((item) => item.id.startsWith('example-'))
            .map((item) => renderNavItem(item))}
        </nav>
      </div>
    </aside>
  );
};

export default LeftSidebar;
