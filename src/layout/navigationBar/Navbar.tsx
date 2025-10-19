import { useNavigate } from 'react-router-dom';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import './Navbar.css'

const Navbar = () => {
  const navigate = useNavigate();
  return (
    <nav className="navbar h-15">
      <div className="navbar-container">

        <div className="navbar-links mx-2 flex-1">
          <button onClick={() => navigate('/home')}>Home</button>
          <button onClick={() => navigate('/categories')}>Categories</button>
          <button onClick={() => navigate('/guides')}>Guides</button>
          <button onClick={() => navigate('/faq')}>FAQ</button>
          <button onClick={() => navigate('/about')}>About</button>
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
