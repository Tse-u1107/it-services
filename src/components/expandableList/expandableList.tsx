import React, { useState } from 'react';
import { type Item } from './interface';
import './expandableList.css';
import { ChevronDownIcon } from '@heroicons/react/24/outline';

interface ExpandableListProps {
  items: Item[];
  allowMultiple: boolean;
}

const ListItem: React.FC<Item & { isExpanded: boolean; onToggle: () => void }> = ({
  id,
  content,
  title,
  icon,
  isExpanded,
  onToggle,
}) => {
  return (
    <div key={id} className="list-item">
      <button className="item-title-wrapper" onClick={onToggle}>
        <div className="item-title">
          {icon && <span>{icon}</span>}
          <span>{title}</span>
        </div>
        <div>
          <ChevronDownIcon
            className={`w-5 h-5 transition-transform duration-300 ${isExpanded ? 'rotate-180' : 'rotate-0'}`}
          />
        </div>
      </button>
      <div className={`item-content-wrapper ${isExpanded ? 'expanded' : ''}`}>
        {content}
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
    <div id="expandableListComponent" className="list-main">
      {items.map((item, index) => (
        <ListItem
          key={item.id}
          {...item}
          isExpanded={expandedIndexes.has(index)}
          onToggle={() => handleToggle(index)}
        />
      ))}
    </div>
  );
};

export default ExpandableList;