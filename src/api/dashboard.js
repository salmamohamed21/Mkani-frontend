import axiosClient from './axiosClient';

export const dashboardAPI = {
  // Get dashboard statistics
  getStats: () => {
    return axiosClient.get('api/core/dashboard/stats/');
  },

  // Get latest activities
  getActivities: () => {
    return axiosClient.get('api/core/dashboard/activities/');
  },
};
