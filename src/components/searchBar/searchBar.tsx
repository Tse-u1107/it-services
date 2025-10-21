import React, { useState } from 'react';

const SearchBar = ({
  placeholder = '',
  value = '',
  rightButton = '',
  onChange,
}: {
  placeholder: string;
  value?: string;
  rightButton?: React.ReactNode;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) => {

  const [val, setVal] = useState('')

  return (
    <div id="searchBarWrapper" className="bg-nyu-700 searchBarWrapper bg-white relative rounded-4xl">
      <div className="flex items-center">
        <div className="flex-1">
          <input
            className="w-full p-4 outline-none rounded-4xl"
            placeholder={placeholder}
            value={val || value}
            onChange={(e) => {
              onChange?.(e)
              setVal(e?.target?.value)
            }}
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
