const IdBanner = () => {
  return (
    <div className="w-full bg-black" style={{ minHeight: '130px' }}>
      <div className="max-w-7xl mx-auto px-6 py-6 flex items-center justify-between gap-8">
        {/* Text Content */}
        <div className="text-white flex-1">
          <p className="text-lg mb-2">
            Need to get<br />
            in touch?
          </p>
          <p className="text-sm mb-3">
            NYU Shanghai printing and advance<br />
            printing service offers secure and professional
          </p>
          <div className="flex gap-4 text-sm">
            <a href="#" className="hover:underline">Id card lost &gt;</a>
            <a href="#" className="hover:underline">Id card lost &gt;</a>
          </div>
        </div>

        {/* Placeholder Image */}
        <div className="flex-shrink-0">
          <div className="w-32 h-32 bg-gray-700 rounded-lg flex items-center justify-center text-gray-400 text-xs text-center p-4">
            Image<br />Placeholder<br />(Replace TBD)
          </div>
        </div>
      </div>
    </div>
  );
};

export default IdBanner;