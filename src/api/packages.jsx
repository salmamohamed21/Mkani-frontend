import axiosClient from "./axiosClient";

export const PackagesAPI = {
  getAll: (params) => axiosClient.get("api/packages/", { params }),
  getById: (id) => axiosClient.get(`api/packages/${id}/`),
  create: (data) => axiosClient.post("api/packages/", data),
  update: (id, data) => axiosClient.put(`api/packages/${id}/`, data),
  remove: (id) => axiosClient.delete(`api/packages/${id}/`),
  getResidents: (id) => axiosClient.get(`api/packages/${id}/residents/`),
  invoiceHistory: () => axiosClient.get("api/packages/invoices/history/"),
  getTypes: () => axiosClient.get("api/packages/types/"),
};

export const getPackages = (params) => PackagesAPI.getAll(params);
export const addPackage = (data) => PackagesAPI.create(data);
export const getPackageDetails = (id) => PackagesAPI.getById(id);
export const updatePackage = (id, data) => PackagesAPI.update(id, data);
export const deletePackage = (id) => PackagesAPI.remove(id);
export const getPackageResidents = (id) => PackagesAPI.getResidents(id);
export const getInvoiceHistory = () => PackagesAPI.invoiceHistory();
export const getPackageTypes = () => PackagesAPI.getTypes();
