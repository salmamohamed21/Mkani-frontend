import axiosClient from './axiosClient';

export const createRentalListing = async (rentalData) => {
  try {
    const response = await axiosClient.post('/rentals/listings/', rentalData);
    return response.data;
  } catch (error) {
    console.error('Error creating rental listing:', error);
    throw error;
  }
};

export const getRentalListings = async (params = {}) => {
  try {
    const response = await axiosClient.get('/rentals/listings/', { params });
    return response.data;
  } catch (error) {
    console.error('Error fetching rental listings:', error);
    throw error;
  }
};

export const getRentalListing = async (id) => {
  try {
    const response = await axiosClient.get(`/rentals/listings/${id}/`);
    return response.data;
  } catch (error) {
    console.error('Error fetching rental listing:', error);
    throw error;
  }
};

export const updateRentalListing = async (id, rentalData) => {
  try {
    const response = await axiosClient.patch(`/rentals/listings/${id}/`, rentalData);
    return response.data;
  } catch (error) {
    console.error('Error updating rental listing:', error);
    throw error;
  }
};

export const deleteRentalListing = async (id) => {
  try {
    const response = await axiosClient.delete(`/rentals/listings/${id}/`);
    return response.data;
  } catch (error) {
    console.error('Error deleting rental listing:', error);
    throw error;
  }
};

export const requestRental = async (listingId) => {
  try {
    const response = await axiosClient.post('/rentals/requests/', { listing_id: listingId });
    return response.data;
  } catch (error) {
    console.error('Error requesting rental:', error);
    throw error;
  }
};

export const approveRentalRequest = async (listingId, action) => {
  try {
    const response = await axiosClient.post('/rentals/approvals/', {
      listing_id: listingId,
      action: action
    });
    return response.data;
  } catch (error) {
    console.error('Error approving rental request:', error);
    throw error;
  }
};
