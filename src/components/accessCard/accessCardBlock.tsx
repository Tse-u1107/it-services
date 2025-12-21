import { PlusIcon, ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import { type Item } from '../expandableList/interface';
import { useState, useEffect } from 'react';

const ITEMS_PER_PAGE = 6;
const STORAGE_KEY = 'accessCardCarouselPage';

const AccessCardBlock = ({ accessItems }: { accessItems: Item[] }) => {
  const [currentPage, setCurrentPage] = useState(0);
  const [isClient, setIsClient] = useState(false);

  // Initialize from localStorage on mount
  useEffect(() => {
    setIsClient(true);
    const savedPage = localStorage.getItem(STORAGE_KEY);
    if (savedPage) {
      const pageNum = parseInt(savedPage, 10);
      // Validate the page number
      const maxPage = Math.ceil(accessItems.length / ITEMS_PER_PAGE) - 1;
      if (pageNum >= 0 && pageNum <= maxPage) {
        setCurrentPage(pageNum);
      }
    }
  }, [accessItems.length]);

  // Save current page to localStorage
  const handlePageChange = (pageNum: number) => {
    setCurrentPage(pageNum);
    localStorage.setItem(STORAGE_KEY, pageNum.toString());
  };

  const totalPages = Math.ceil(accessItems.length / ITEMS_PER_PAGE);
  const startIndex = currentPage * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentItems = accessItems.slice(startIndex, endIndex);

  const goToPreviousPage = () => {
    if (currentPage > 0) {
      handlePageChange(currentPage - 1);
    }
  };

  const goToNextPage = () => {
    if (currentPage < totalPages - 1) {
      handlePageChange(currentPage + 1);
    }
  };

  // Prevent hydration mismatch
  if (!isClient) {
    return (
      <div className="w-full">
        <div className="flex justify-between mb-[39px]">
          <div className="font-medium text-[28px] leading-[100%]">Quick Access</div>
          <button className="font-medium text-base leading-[100%] text-[#686868] hover:text-black cursor-pointer">
            Browse all topics {'>'}
          </button>
        </div>
        <div className="flex flex-wrap gap-[56px]">
          {accessItems.slice(0, 6).map((item, index) => (
            <AccessCard key={item.id} item={item} index={index} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="flex justify-between mb-[39px]">
        <div className="font-medium text-[28px] leading-[100%]">Quick Access</div>
        <button className="font-medium text-base leading-[100%] text-[#686868] hover:text-black cursor-pointer">
          Browse all topics {'>'}
        </button>
      </div>

      {/* Carousel Container */}
      <div className="relative">
        {/* Items Grid */}
        <div className="flex flex-wrap gap-[56px]">
          {currentItems.map((item, index) => (
            <AccessCard key={item.id} item={item} index={startIndex + index} />
          ))}
        </div>

        {/* Navigation Arrows */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-4 mt-8">
            {/* Previous Button */}
            <button
              onClick={goToPreviousPage}
              disabled={currentPage === 0}
              className={`p-2 rounded-full border border-gray-300 transition-all ${
                currentPage === 0
                  ? 'opacity-50 cursor-not-allowed'
                  : 'hover:bg-gray-100 cursor-pointer'
              }`}
              aria-label="Previous page"
            >
              <ChevronLeftIcon className="w-5 h-5 text-gray-700" />
            </button>

            {/* Page Indicators */}
            <div className="flex gap-2">
              {Array.from({ length: totalPages }).map((_, index) => (
                <button
                  key={index}
                  onClick={() => handlePageChange(index)}
                  className={`w-2 h-2 rounded-full transition-all ${
                    index === currentPage
                      ? 'bg-purple-900 w-8'
                      : 'bg-gray-300 hover:bg-gray-400'
                  }`}
                  aria-label={`Go to page ${index + 1}`}
                  aria-current={index === currentPage ? 'page' : undefined}
                />
              ))}
            </div>

            {/* Next Button */}
            <button
              onClick={goToNextPage}
              disabled={currentPage === totalPages - 1}
              className={`p-2 rounded-full border border-gray-300 transition-all ${
                currentPage === totalPages - 1
                  ? 'opacity-50 cursor-not-allowed'
                  : 'hover:bg-gray-100 cursor-pointer'
              }`}
              aria-label="Next page"
            >
              <ChevronRightIcon className="w-5 h-5 text-gray-700" />
            </button>
          </div>
        )}

        {/* Page Counter */}
        {totalPages > 1 && (
          <div className="text-center mt-4 text-sm text-gray-600">
            Page {currentPage + 1} of {totalPages}
          </div>
        )}
      </div>
    </div>
  );
};

interface AccessCardProps {
  item: Item;
  index: number;
}

const AccessCard = ({ item, index }: AccessCardProps) => {
  return (
    <div
      key={item.id}
      id={'access_' + String(index)}
      className="bg-white p-6 rounded-[25px] w-[calc(33.333%-37.33px)] relative h-[230px]"
    >
      <div className="w-8 h-8 relative mb-4">{item.icon}</div>
      <div className="font-medium text-base leading-[128%] mb-4">{item.title}</div>
      <div className="font-normal text-base leading-[128%] w-full mt-4 text-[#7e7e7e] line-clamp-3">
        <span>{item.content}</span>
      </div>
      <div className="absolute bottom-6 right-6">
        {item.linkTo ? (
          <a
            href={item.linkTo}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-black rounded-full flex items-center justify-center cursor-pointer w-8 h-8 hover:bg-gray-800 transition-colors"
            aria-label={`Open ${item.title}`}
          >
            <PlusIcon className="w-8 h-8 text-white" />
          </a>
        ) : (
          <button className="bg-black rounded-full flex items-center justify-center cursor-pointer w-8 h-8 hover:bg-gray-800 transition-colors">
            <PlusIcon className="w-8 h-8 text-white" />
          </button>
        )}
      </div>
    </div>
  );
};

export default AccessCardBlock;
