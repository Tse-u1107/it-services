import { useNavigate, useLocation } from 'react-router-dom';
import { MagnifyingGlassIcon, ChevronDownIcon } from '@heroicons/react/24/outline';
import './Navbar.css';
import { login } from 'src/api/url';
import { fetchRequest } from 'src/api/client/fetchRequest';
import { loadAuthUser } from 'src/utils/userInfo';
import { useEffect, useState, useRef } from 'react';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { pathname } = location;

  const [authUser, setAuthUser] = useState();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const fetchServiceList = async () => {
    const data = await fetchRequest(login);
    console.log(data);
    return data.result;
  };

  const handleLogin = async () => {
    const res = await fetchServiceList();
    window.open(res.url);
  };

  useEffect(() => {
    const data = loadAuthUser();
    setAuthUser(data);
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleMenuAction = (action) => {
    console.log(`Menu action: ${action}`);
    setIsDropdownOpen(false);
  };

  return (
    <nav className="navbar h-15">
      <div className="navbar-container">
        <div className="navbar-links mx-2 flex-1">
          <button
            className={pathname === '/home' ? 'active' : ''}
            onClick={() => navigate('/home')}
          >
            Home
          </button>
          <button
            className={pathname === '/categories' ? 'active' : ''}
            onClick={() => navigate('/categories')}
          >
            Categories
          </button>
          <button
            className={pathname === '/guides' ? 'active' : ''}
            onClick={() => navigate('/guides')}
          >
            Guides
          </button>
          <button className={pathname === '/faq' ? 'active' : ''} onClick={() => navigate('/faq')}>
            FAQ
          </button>
          <button
            className={pathname === '/about' ? 'active' : ''}
            onClick={() => navigate('/about')}
          >
            About
          </button>
          {authUser ? (
            <div className="relative inline-block" ref={dropdownRef}>
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center gap-1 hover:opacity-80 transition-opacity"
              >
                User: {authUser?.email}
                <ChevronDownIcon className={`w-4 h-4 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} />
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
            <button onClick={() => handleLogin()}>Login</button>
          )}
          <button className="bg-transparent">
            <MagnifyingGlassIcon className="w-5 h-5 bg-transparent" />
          </button>
        </div>
        <div>
          <button>Lang</button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;