import { PlusIcon, ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import { type Item } from '../expandableList/interface';
import { useState, useEffect } from 'react';
import AccessCardSkeleton from './accessCardSkeleton';
import { useNavigate } from 'react-router-dom';

const ITEMS_PER_PAGE = 6;
const STORAGE_KEY = 'accessCardCarouselPage';

interface AccessCardBlockProps {
  accessItems: Item[];
  title?: string;
  showBrowseButton?: boolean;
  browseButtonText?: string;
  cardBgColor?: string;
  cardTextColor?: string;
  titleSize?: string;
  itemsPerPage?: number;
  showCarousel?: boolean;
  isLoading?: boolean;
}

const AccessCardBlock = ({
  accessItems,
  title = 'Quick Access',
  showBrowseButton = true,
  browseButtonText = 'Browse all topics',
  cardBgColor = 'bg-white',
  cardTextColor = 'text-gray-700',
  titleSize = 'text-[28px]',
  itemsPerPage = ITEMS_PER_PAGE,
  showCarousel = true,
  isLoading = false,
}: AccessCardBlockProps) => {
  const [currentPage, setCurrentPage] = useState(0);
  const [isClient, setIsClient] = useState(false);

  // Initialize from memory on mount
  useEffect(() => {
    setIsClient(true);
    const temp = localStorage.getItem(STORAGE_KEY);
    setCurrentPage(Number(temp));
  }, []);

  // Save current page to memory
  const handlePageChange = (pageNum: number) => {
    setCurrentPage(pageNum);
  };

  const totalPages = Math.ceil(accessItems.length / itemsPerPage);
  const startIndex = currentPage * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = showCarousel ? accessItems.slice(startIndex, endIndex) : accessItems;

  const goToPreviousPage = () => {
    if (currentPage > 0) {
      handlePageChange(currentPage - 1);
      localStorage.setItem(STORAGE_KEY, String(currentPage - 1));
    }
  };

  const goToNextPage = () => {
    if (currentPage < totalPages - 1) {
      handlePageChange(currentPage + 1);
      localStorage.setItem(STORAGE_KEY, String(currentPage + 1));
    }
  };

  const navigate = useNavigate();

  // Prevent hydration mismatch
  if (!isClient) {
    return (
      <div className="w-full">
        <div className="flex justify-between mb-[39px]">
          <div className={`font-medium ${titleSize} leading-[100%]`}>{title}</div>
          {showBrowseButton && (
            <button
              onClick={() => navigate('/guides')}
              className="font-medium text-base leading-[100%] text-[#686868] hover:text-black cursor-pointer"
            >
              {browseButtonText} {'>'}
            </button>
          )}
        </div>
        <div className="flex flex-wrap gap-[56px]">
          {isLoading
            ? Array.from({ length: itemsPerPage }).map((_, index) => (
                <AccessCardSkeleton key={index} />
              ))
            : accessItems
                .slice(0, itemsPerPage)
                .map((item, index) => (
                  <AccessCard
                    key={item.id}
                    item={item}
                    index={index}
                    bgColor={cardBgColor}
                    textColor={cardTextColor}
                  />
                ))}
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="flex justify-between mb-[39px]">
        <div className={`font-medium ${titleSize} leading-[100%]`}>{title}</div>
        {showBrowseButton && (
          <button
            onClick={() => navigate('/guides')}
            className="font-medium text-base leading-[100%] text-[#686868] hover:text-black cursor-pointer"
          >
            {browseButtonText} {'>'}
          </button>
        )}
      </div>

      {/* Carousel Container */}
      <div className="relative flex items-stretch gap-2">
        {/* Left Arrow */}
        {totalPages > 1 && (
          <button
            onClick={goToPreviousPage}
            disabled={currentPage === 0}
            className={`flex-shrink-0 px-3 rounded-lg transition-all flex items-center justify-center ${
              currentPage === 0
                ? 'opacity-40 text-black/20'
                : 'text-abyss-400 hover:text-abyss-600 cursor-pointer'
            }`}
            aria-label="Previous page"
          >
            <ChevronLeftIcon className="icon-8" />
          </button>
        )}

        {/* Items Grid */}
        <div className="flex flex-wrap gap-[56px] flex-1">
          {isLoading
            ? Array.from({ length: itemsPerPage }).map((_, index) => (
                <AccessCardSkeleton key={index} />
              ))
            : currentItems.map((item, index) => (
                <AccessCard
                  key={item.id}
                  item={item}
                  index={startIndex + index}
                  bgColor={cardBgColor}
                  textColor={cardTextColor}
                />
              ))}
        </div>

        {/* Right Arrow */}
        {totalPages > 1 && (
          <button
            onClick={goToNextPage}
            disabled={currentPage === totalPages - 1}
            className={`flex-shrink-0 px-3 rounded-lg transition-all flex items-center justify-center ${
              currentPage === totalPages - 1
                ? 'opacity-40 text-black/20'
                : 'text-abyss-400 hover:text-abyss-600 cursor-pointer'
            }`}
            aria-label="Next page"
          >
            <ChevronRightIcon className="icon-8" />
          </button>
        )}
      </div>
    </div>
  );
};

interface AccessCardProps {
  item: Item;
  index: number;
  bgColor?: string;
  textColor?: string;
}

export const AccessCard = ({
  item,
  index,
  bgColor = 'bg-white',
  textColor = 'text-gray-700',
}: AccessCardProps) => {
  const navigate = useNavigate();
  return (
    <div
      key={item.id}
      id={'access_' + String(index)}
      className={`${bgColor} p-[25px] rounded-[25px] w-[calc(33.333%-37.33px)] relative`}
    >
      <div className="icon-8 relative mb-[15px]">{item.icon}</div>
      <div className="font-[16px] font-medium mb-[15px] line-clamp-1">{item.title}</div>
      <div
        className={`font-[16px] font-regular text-[#7E7E7E] w-full mb-[8px] ${textColor} line-clamp-3`}
      >
        {item.content}
      </div>
      <div className="flex justify-end">
        {item.linkTo ? (
          <button
            onClick={() => navigate(`/${item.linkTo}`)}
            rel="noopener noreferrer"
            className="bg-black rounded-full flex items-center justify-center cursor-pointer icon-8 hover:bg-gray-800 transition-colors"
            aria-label={`Open ${item.title}`}
          >
            <PlusIcon className="icon-8 text-white" />
          </button>
        ) : (
          <button className="bg-black rounded-full flex items-center justify-center cursor-pointer icon-8 hover:bg-gray-800 transition-colors">
            <PlusIcon className="icon-8 text-white" />
          </button>
        )}
      </div>
    </div>
  );
};

export default AccessCardBlock;
