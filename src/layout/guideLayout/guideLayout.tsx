import React, { useEffect } from 'react';
import { useState } from 'react';

const GuideLayout = ({
  leftSideBar,
  rightSideBar,
  children,
  error,
}: {
  leftSideBar: React.ReactNode;
  rightSideBar: React.ReactNode;
  children: React.ReactNode;
  error: string;
}) => {
  const [showError, setShowError] = useState(false);

  useEffect(() => {
    if (error != 'null' && error != 'undefined' && error != '') {
      setShowError(true);
    }
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-off-white">
      <div className="flex flex-1 w-full gap-[22px] bg-white">
        {/* Left sidebar */}
        <aside className="pt-[60px] hidden shrink-0 lg:w-[342px] lg:block">{leftSideBar}</aside>

        {/* Main content */}
        <main className="pt-[53.5px] flex-1 min-w-0">
          {showError && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
              <h3 className="font-semibold mb-1">Error</h3>
              <p>{error}</p>
            </div>
          )}
          {children}
        </main>

        {/* Right sidebar */}
        <aside className="pt-[60px] right-0 hidden xl:block w-72 shrink-0">{rightSideBar}</aside>
      </div>
    </div>
  );
};

export default GuideLayout;
