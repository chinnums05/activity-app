import { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import api from '../services/api';
import { useSocket } from './ChatContext';
import { useAuth } from './AuthContext';

const ActivityContext = createContext();

export const ActivityProvider = ({ children }) => {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(false);
  const socket = useSocket();
  const { user } = useAuth();

  useEffect(() => {
    if (socket && user) {
      // Listen for activity join notifications
      socket.on('activityJoinNotification', ({ activityTitle, userName }) => {
        toast.success(`${userName} joined your activity: ${activityTitle}`, {
          position: 'top-right',
          duration: 5000,
          style: {
            background: '#333',
            color: '#fff',
          },
        });
      });

      // Listen for activity updates
      socket.on('activityUpdated', ({ activityId, data }) => {
        setActivities(prevActivities => 
          prevActivities.map(activity => 
            activity.id === activityId ? data : activity
          )
        );
      });

      return () => {
        socket.off('activityJoinNotification');
        socket.off('activityUpdated');
      };
    }
  }, [socket, user]);

  const fetchActivities = async () => {
    setLoading(true);
    try {
      const response = await api.get('/activities');
      if (response.data.status === 'success') {
        setActivities(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching activities:', error);
    } finally {
      setLoading(false);
    }
  };

  const createActivity = async (activityData) => {
    try {
      const formData = new FormData();
      formData.append('title', activityData.title);
      formData.append('description', activityData.description);
      activityData.images.forEach((image) => {
        formData.append('images', image);
      });

      const response = await api.post('/activities', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      if (response.data.status === 'success') {
        setActivities([response.data.data, ...activities]);
        return response.data.data;
      } else {
        throw new Error('Failed to create activity');
      }
    } catch (error) {
      throw error.response?.data || error;
    }
  };

  const joinActivity = async (activityId) => {
    try {
      const response = await api.post(`/activities/${activityId}/join`);
      if (response.data.status === 'success') {
        // Update the activities state with the returned data
        setActivities(prevActivities =>
          prevActivities.map(activity =>
            activity.id === activityId ? response.data.data : activity
          )
        );
        return response.data.data;
      } else {
        throw new Error('Failed to join activity');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to join activity');
      throw error;
    }
  };

  return (
    <ActivityContext.Provider
      value={{
        activities,
        loading,
        fetchActivities,
        createActivity,
        joinActivity,
      }}
    >
      {children}
    </ActivityContext.Provider>
  );
};

export const useActivities = () => useContext(ActivityContext);