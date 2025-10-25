import React, { useState } from 'react';
import { ChevronDownIcon as ChevronDown } from '@heroicons/react/24/outline';

interface Item {
  id: string;
  title: string;
  content: React.ReactNode;
  icon?: React.ReactNode;
}

interface ExpandableListProps {
  items: Item[];
  allowMultiple: boolean;
}

const ListItem: React.FC<Item & { isExpanded: boolean; onToggle: () => void; isLast: boolean }> = ({
  content,
  title,
  icon,
  isExpanded,
  onToggle,
  isLast,
}) => {
  return (
    <div className="bg-white">
      <button
        className={`p-4 w-full flex justify-between items-center cursor-pointer hover:bg-gray-50 transition-colors h-[68px] ${
          !isLast || isExpanded ? 'border-b-2 border-gray-100' : ''
        }`}
        onClick={onToggle}
      >
        <div className="flex items-center gap-3">
          {icon && <span className="text-purple-900">{icon}</span>}
          <span className="font-medium text-md">{title}</span>
        </div>
        <ChevronDown
          className={`w-5 h-5 text-purple-900 transition-transform duration-300 ease-in-out ${
            isExpanded ? 'rotate-180' : 'rotate-0'
          }`}
        />
      </button>
      <div
        className={`grid transition-all duration-300 ease-in-out ${
          isExpanded ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
        }`}
      >
        <div className="overflow-hidden">
          <div className={`p-4 ${!isLast ? 'border-b-2 border-gray-100' : ''}`}>{content}</div>
        </div>
      </div>
    </div>
  );
};

const ExpandableList: React.FC<ExpandableListProps> = ({ items, allowMultiple }) => {
  const [expandedIndexes, setExpandedIndexes] = useState<Set<number>>(new Set([0]));

  const handleToggle = (index: number) => {
    if (allowMultiple) {
      setExpandedIndexes((prev) => {
        const newSet = new Set(prev);
        if (newSet.has(index)) {
          newSet.delete(index);
        } else {
          newSet.add(index);
        }
        return newSet;
      });
    } else {
      setExpandedIndexes(new Set([expandedIndexes.has(index) ? -1 : index]));
    }
  };

  return (
    <div className="rounded-[32px] overflow-hidden border border-gray-200">
      {items.map((item, index) => (
        <ListItem
          key={item.id}
          {...item}
          isExpanded={expandedIndexes.has(index)}
          onToggle={() => handleToggle(index)}
          isLast={index === items.length - 1}
        />
      ))}
    </div>
  );
};
export default ExpandableList;
