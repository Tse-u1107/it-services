import { useNavigate, useLocation } from 'react-router-dom';
import { MagnifyingGlassIcon, ChevronDownIcon } from '@heroicons/react/24/outline';
import { login } from 'src/api/url';
import { fetchRequest } from 'src/api/client/fetchRequest';
import { loadAuthUser, clearAuthUser } from 'src/utils/userInfo';
import { useEffect, useState, useRef } from 'react';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { pathname } = location;

  const [authUser, setAuthUser] = useState<any>();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const fetchServiceList = async () => {
    const data = await fetchRequest(login);
    console.log(data);
    return data.result;
  };

  const handleLogin = async () => {
    const res = await fetchServiceList();
    window.open(res.url);
    
    const handleMessage = (event: MessageEvent) => {
      if (event.origin !== window.location.origin) return;
      
      if (event.data.type === 'LOGIN_SUCCESS') {
        const data = loadAuthUser();
        setAuthUser(data);
        
        window.removeEventListener('message', handleMessage);
      }
    };
    
    window.addEventListener('message', handleMessage);
  };

  useEffect(() => {
    const data = loadAuthUser();
    setAuthUser(data);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleMenuAction = (action: string) => {
    if (action === 'logout') {
      clearAuthUser();
      setAuthUser(null);
      setIsDropdownOpen(false);
      navigate('/home');
    }
    setIsDropdownOpen(false);
  };

  // Helper to generate tailwind classes for navigation links
  const getLinkClass = (path: string) => {
    const baseStyle =
      'px-4 py-2 text-[14px] font-normal transition-all duration-200 bg-transparent border-b-2 cursor-pointer';
    const activeStyle = 'text-[#57068c] border-[#57068c] pb-[7px]';
    const inactiveStyle =
      'text-[#1d1d1f] border-transparent hover:text-[#6e6e73] hover:border-[#57068c] hover:pb-[7px]';

    return `${baseStyle} ${pathname === path ? activeStyle : inactiveStyle}`;
  };

  return (
    <nav
      className={`sticky top-0 z-35 flex h-[55px] w-full justify-center border-b border-[#e5e5ea]/50 mb-[2px] bg-white`}
    >
      <div className="flex w-full max-w-[1400px] items-center justify-between px-6">
        <div className="flex flex-1" />
        <div className="mx-2 flex flex-1 items-center gap-8">
          <div className="flex flex-1 items-center gap-8">
            <button onClick={() => navigate('/home')} className="text-purple-700  icon-6">
              <img src="src/assets/logo_0.png" className="icon-6" />
            </button>
            <button className={getLinkClass('/home')} onClick={() => navigate('/home')}>
              Home
            </button>
            {/* <button className={getLinkClass('/categories')} onClick={() => navigate('/categories')}>
              Categories
            </button> */}
            <button className={getLinkClass('/guides')} onClick={() => navigate('/guides')}>
              Guides
            </button>
            <button className={getLinkClass('/faq')} onClick={() => navigate('/faq')}>
              FAQ
            </button>
            <button className={getLinkClass('/about')} onClick={() => navigate('/about')}>
              About
            </button>
            <button className="flex items-center justify-center bg-transparent px-2 text-[#1d1d1f] hover:text-[#6e6e73]">
              <MagnifyingGlassIcon className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="flex flex-1 justify-end items-center gap-6">
          {/* User Profile / Login Section */}
          {authUser ? (
            <div className="relative inline-block" ref={dropdownRef}>
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center gap-1 text-[14px] text-[#1d1d1f] hover:opacity-80 transition-opacity px-4"
              >
                User: {authUser?.email}
                <ChevronDownIcon
                  className={`w-4 h-4 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`}
                />
              </button>

              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 border border-gray-200">
                  <button
                    onClick={() => handleMenuAction('profile')}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                  >
                    Profile
                  </button>
                  <button
                    onClick={() => handleMenuAction('settings')}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                  >
                    Settings
                  </button>
                  <button
                    onClick={() => handleMenuAction('logout')}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors border-t border-gray-100"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button
              className={getLinkClass('login-btn-placeholder')} // Uses inactive style by default
              onClick={() => handleLogin()}
            >
              Login
            </button>
          )}
          <button className="px-4 py-2 text-[14px] text-[#1d1d1f] hover:text-[#6e6e73] transition-colors">
            EN/CN
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
