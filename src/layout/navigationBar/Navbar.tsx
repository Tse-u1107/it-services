import { useNavigate, useLocation } from 'react-router-dom';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import './Navbar.css';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { pathname } = location;

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
          <button 
            className={pathname === '/faq' ? 'active' : ''} 
            onClick={() => navigate('/faq')}
          >
            FAQ
          </button>
          <button 
            className={pathname === '/about' ? 'active' : ''} 
            onClick={() => navigate('/about')}
          >
            About
          </button>
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
