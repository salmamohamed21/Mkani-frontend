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
    .get("public/building-names/")
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
