import React from 'react';
import { Outlet } from 'react-router-dom';

const ContentLayout = ({
  leftSideBar,
  rightSideBar,
  children,
}: {
  leftSideBar: React.ReactNode;
  rightSideBar: React.ReactNode;
  children: React.ReactNode;
}) => {
  return (
    <div className="flex flex-col min-h-screen bg-off-white">
      <div className="flex flex-1 w-full gap-6">
        {/* Left sidebar */}
        <aside className="hidden lg:block shrink-0">{leftSideBar}</aside>

        {/* Main content */}
        <main className="flex-1 min-w-0">{children}</main>

        {/* Right sidebar */}
        <aside className="hidden xl:block w-72 shrink-0">{rightSideBar}</aside>
      </div>
    </div>
  );
};

export default ContentLayout;
