import { useState } from 'react';
import { useActivities } from '../contexts/ActivityContext';
import { useAuth } from '../contexts/AuthContext';
import moment from 'moment';

const ActivityCard = ({ activity }) => {
  const { joinActivity } = useActivities();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);

  const handleJoin = async () => {
    setLoading(true);
    try {
      await joinActivity(activity.id);
    } catch (error) {
      console.error('Error joining activity:', error);
    } finally {
      setLoading(false);
    }
  };

  const isParticipant = activity.participants?.some(
    (participant) => participant.id === user.id
  );

  return (
    <div className="card bg-base-100 shadow-xl">
      {activity.images?.length > 0 && (
        <figure>
          <img
            src={activity.images[0]}
            alt={activity.title}
            className="h-48 w-full object-cover"
          />
        </figure>
      )}
      <div className="card-body">
        <h2 className="card-title">{activity.title}</h2>
        <p>{activity.description}</p>
        <div className="text-sm text-gray-500">
          Created {moment(activity.createdAt).fromNow()}
        </div>
        <div className="flex items-center gap-2 mt-2">
          <div className="avatar-group -space-x-6">
            {activity.participants?.slice(0, 3).map((participant) => (
              <div className="avatar" key={participant.id}>
                <div className="w-8">
                  <img
                    src={`https://ui-avatars.com/api/?name=${participant.username}`}
                    alt={participant.username}
                  />
                </div>
              </div>
            ))}
          </div>
          {activity.participants?.length > 3 && (
            <span className="text-sm text-gray-500">
              +{activity.participants.length - 3} more
            </span>
          )}
        </div>
        <div className="card-actions justify-end mt-4">
          {!isParticipant && (
            <button
              className={`btn btn-primary ${loading ? 'loading' : ''}`}
              onClick={handleJoin}
              disabled={loading}
            >
              Join Activity
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ActivityCard;