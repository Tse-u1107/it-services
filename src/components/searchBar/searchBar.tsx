import React from 'react';
import { Link } from 'react-router-dom';
import type { SearchResult } from 'src/api/types/searchTypes';
import './searchBar.css';

interface SearchBarProps {
  placeholder?: string;
  value?: string;
  rightButton?: React.ReactNode;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onFocus?: () => void;
  results?: SearchResult[];
  onResultClick?: () => void;
  searchFocused?: boolean;
}

const SearchBar = ({
  placeholder = '',
  value = '',
  rightButton = '',
  onChange,
  onFocus,
  results = [],
  onResultClick,
  searchFocused = false
}: SearchBarProps) => {
  const isOpen = results.length > 0 && searchFocused;

  return (
    <div className="w-full flex flex-col relative z-30">
      <div className="w-full bg-white rounded-4xl shadow-sm border border-transparent focus-within:border-gray-200 transition-colors">
        <div className="flex items-center w-full p-1">
          <div className="flex-1">
            <input
              className="w-full outline-none focus:outline-none bg-transparent py-3 px-6 text-gray-700 placeholder-gray-400"
              placeholder={placeholder}
              value={value}
              onChange={onChange}
              onFocus={onFocus}
            />
          </div>
          {rightButton && (
            <div className="pr-2">
              <button className="flex items-center justify-center p-2 text-gray-500 hover:text-purple-600 transition-colors">
                {rightButton}
              </button>
            </div>
          )}
        </div>
      </div>
      <div
        className={`grid transition-[grid-template-rows] duration-300 ease-in-out ${
          isOpen ? 'grid-rows-[1fr] opacity-100 mt-2' : 'grid-rows-[0fr] opacity-0 mt-0'
        }`}
      >
        <div className="overflow-hidden">
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
            
            <div className="p-4">
              <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3 px-1">
                Suggested Results
              </div>
              <div className="flex flex-col gap-2 max-h-80 overflow-y-auto custom-scrollbar">
                {results.map((result, index) => (
                  <div
                    key={index}
                    className="group p-3 rounded-xl hover:bg-gray-50 border border-transparent hover:border-gray-100 cursor-pointer transition-all"
                  >
                    <div className="font-medium text-gray-900 text-sm mb-0.5 group-hover:text-purple-700">
                      {result.title}
                    </div>
                    {result.body && (
                      <div className="text-gray-500 text-xs line-clamp-1 mb-2">
                        {result.body}
                      </div>
                    )}
                    <Link
                      to={result.view_node}
                      className="text-blue-600 group-hover:text-blue-700 text-xs font-medium inline-flex items-center gap-1 hover:underline"
                      onClick={onResultClick}
                    >
                      View
                      <span className="text-[10px]">→</span>
                    </Link>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchBar;