import { Link } from 'react-router';
import { useAuth } from '../contexts/AuthContext';
import { FiMessageCircle } from 'react-icons/fi';

const Navbar = () => {
  const { user, logout } = useAuth();

  return (
    <div className="navbar bg-base-100 shadow-lg">
      <div className="container mx-auto">
        <div className="flex-1">
          <Link to="/" className="btn btn-ghost text-xl">Activity Social</Link>
        </div>
        <div className="flex-none">
          {user ? (
            <div className="flex items-center gap-4">
              <Link 
                to="/chat" 
                className="btn btn-ghost btn-circle"
                title="Chat Room"
              >
                <FiMessageCircle className="w-5 h-5" />
              </Link>
              <div className="dropdown dropdown-end">
                <label tabIndex={0} className="btn btn-ghost btn-circle avatar">
                  <div className="w-10 rounded-full">
                    <img src={`https://ui-avatars.com/api/?name=${user.username}`} alt="avatar" />
                  </div>
                </label>
                <ul className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52">
                  <li><Link to="/profile">Profile</Link></li>
                  <li><Link to="/activities">My Activities</Link></li>
                  <li><Link to="/chat">Chat Room</Link></li>
                  <li><button onClick={logout}>Logout</button></li>
                </ul>
              </div>
            </div>
          ) : (
            <div className="flex gap-2">
              <Link to="/login" className="btn btn-ghost">Login</Link>
              <Link to="/register" className="btn btn-primary">Register</Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;