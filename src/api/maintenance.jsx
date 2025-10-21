import axiosClient from "./axiosClient";

export const getMaintenanceRequests = () => axiosClient.get("maintenance/");
export const createMaintenanceRequest = (data) => axiosClient.post("maintenance/create/", data);
export const updateMaintenanceStatus = (id, data) => axiosClient.post(`maintenance/${id}/status/`, data);
export const getTechnicianTasks = () => axiosClient.get("maintenance/assigned/").then(res => res.data);
