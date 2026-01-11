import axiosInstance from "../services/axiosInstance";
import publicAxiosInstance from "../services/publicAxiosInstance";

export function getBuildings() {
  return axiosInstance
    .get("api/buildings/")
    .then((response) => response.data)
    .catch((error) => {
      console.error("Error fetching buildings:", error);
      return [];
    });
}

export function getPublicBuildingNames() {
  return publicAxiosInstance
    .get("api/public/building-names/")
    .then((response) => response.data)
    .catch((error) => {
      console.error("Error fetching public building names:", error);
      return [];
    });
}

export function getMyBuildings() {
  return axiosInstance
    .get("api/buildings/my-buildings/")
    .then((response) => response.data)
    .catch((error) => {
      console.error("Error fetching my buildings:", error);
      return [];
    });
}

export function updateBuilding(id, data) {
  return axiosInstance
    .put(`api/buildings/${id}/`, data)
    .then((response) => response.data)
    .catch((error) => {
      console.error("Error updating building:", error);
      throw error;
    });
}

export function getAvailableUnits(buildingId) {
  return axiosInstance
    .get(`api/buildings/units/available_units/?building_id=${buildingId}`)
    .then((response) => response.data)
    .catch((error) => {
      console.error("Error fetching available units:", error);
      return [];
    });
}

export function updateApartment(unitId, data) {
  return axiosInstance
    .patch(`api/buildings/units/${unitId}/`, data)
    .then((response) => response.data)
    .catch((error) => {
      console.error("Error updating apartment:", error);
      throw error;
    });
}
