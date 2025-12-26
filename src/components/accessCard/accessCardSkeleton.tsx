const AccessCardSkeleton = () => {
  return (
    <div className="bg-white p-[25px] rounded-[25px] w-[calc(33.333%-37.33px)] animate-pulse">
      <div className="h-8 w-8 bg-gray-300 rounded-full mb-[15px]"></div>

      <div className="h-5 bg-gray-300 rounded mb-[15px] w-3/4"></div>

      <div className="space-y-2 mb-[8px]">
        <div className="h-4 bg-gray-300 rounded w-full"></div>
        <div className="h-4 bg-gray-300 rounded w-full"></div>
        <div className="h-4 bg-gray-300 rounded w-2/3"></div>
      </div>

      <div className="flex justify-end">
        <div className="h-8 w-8 bg-gray-300 rounded-full"></div>
      </div>
    </div>
  );
};

export default AccessCardSkeleton;
