import React, { useState } from 'react';
import './searchBar.css'

const SearchBar = ({
  placeholder = '',
  value = '',
  rightButton = '',
  onChange,
  onFocus,
}: {
  placeholder: string;
  value?: string;
  rightButton?: React.ReactNode;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onFocus?: () => void;
}) => {

  const [val, setVal] = useState('')

  return (
    <div id="searchBarWrapper" className="searchBarWrapper w-full rounded-4xl focus-visible:outline-none">
      <div className="flex items-center w-full">
        <div className="flex-1">
          <input
            className="w-full outline-none focus:outline-none"
            placeholder={placeholder}
            value={val || value}
            onChange={(e) => {
              onChange?.(e)
              setVal(e?.target?.value)
            }}
            onFocus={onFocus}
          />
        </div>
        <div className="absolute right-2">
          <button className="search">{rightButton}</button>
        </div>
      </div>
    </div>
  );
};

export default SearchBar;
