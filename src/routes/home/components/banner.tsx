const IdBanner = () => {
  return (
    <div className="w-full bg-black flex justify-center items-center h-[385px]">
      <div className="w-full max-w-[1080px] px-4 flex items-center justify-between">
        <div className="text-white flex-grow max-w-[285px]">
          <h2 className="font-extrabold text-5xl leading-none mb-4">Need to get in touch?</h2>
          <p className="font-medium text-base leading-[170%] text-[#d6d6d6] mb-4">
            NYU Shanghai printing and advanced printing offers secure and professional services.
          </p>
          <div className="flex flex-col gap-1 font-medium text-xl leading-[170%]">
            <a href="#" className="hover:underline hover:text-[#F5C0FF]">
              Id card lost &gt;
            </a>
            <a href="#" className="hover:underline hover:text-[#F5C0FF]">
              Id card lost &gt;
            </a>
          </div>
        </div>

        <div className="flex-shrink-0">
          <div className="w-32 h-32 bg-gray-700 rounded-lg flex items-center justify-center text-gray-400 text-xs text-center p-4">
            Image Placeholder (Replace TBD)
          </div>
        </div>
      </div>
    </div>
  );
};

export default IdBanner;
