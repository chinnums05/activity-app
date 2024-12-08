import { Link } from 'react-router';
import { useAuth } from '../contexts/AuthContext';

const Home = () => {
  const { user } = useAuth();

  return (
    <div className="hero min-h-[80vh]">
      <div className="hero-content text-center">
        <div className="max-w-md">
          <h1 className="text-5xl font-bold">Activity Social</h1>
          <p className="py-6">
            Join activities, meet new people, and have fun together!
          </p>
          {user ? (
            <Link to="/activities" className="btn btn-primary">
              Browse Activities
            </Link>
          ) : (
            <Link to="/register" className="btn btn-primary">
              Get Started
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;