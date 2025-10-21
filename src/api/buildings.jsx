import axiosClient from "./axiosClient";

// عرض كل العمارات
export const getBuildings = async () => {
  const res = await axiosClient.get("/buildings/");
  return res.data;
};

// أسماء العمارات العامة
export const getPublicBuildingNames = async () => {
  const res = await axiosClient.get("/public/building-names/");
  return res.data;
};

// إنشاء عمارة جديدة
export const createBuilding = async (data) => {
  const res = await axiosClient.post("/buildings/", data);
  return res.data;
};

// تفاصيل عمارة
export const getBuildingDetails = async (id) => {
  const res = await axiosClient.get(`/buildings/${id}/`);
  return res.data;
};

// تحديث بيانات العمارة
export const updateBuilding = async (id, data) => {
  const res = await axiosClient.put(`/buildings/${id}/`, data);
  return res.data;
};

// تفاصيل ساكن مع المدفوعات
export const getResidentDetails = async (buildingId, residentId) => {
  const res = await axiosClient.get(`/buildings/${buildingId}/resident_details/?resident_id=${residentId}`);
  return res.data;
};

// سكان العمارة
export const getBuildingResidents = async (id) => {
  const res = await axiosClient.get(`/buildings/${id}/residents/`);
  return res.data;
};

// الباقات المرتبطة بالعمارة
export const getBuildingPackages = async (id) => {
  const res = await axiosClient.get(`/buildings/${id}/packages/summary/`);
  return res.data;
};

// عرض طلبات السكن
export const getResidentRequests = async () => {
  const res = await axiosClient.get("/residents/requests/");
  return res.data;
};

// الموافقة / الرفض
export const approveRequest = async (id) => {
  return await axiosClient.post(`/residents/requests/${id}/approve/`);
};
export const rejectRequest = async (id) => {
  return await axiosClient.post(`/residents/requests/${id}/reject/`);
};

// تفاصيل عمارة الساكن
export const getResidentBuilding = async () => {
  const res = await axiosClient.get("/buildings/resident-building/");
  return res.data;
};

// عمارات رئيس الاتحاد
export const getMyBuildings = async () => {
  const res = await axiosClient.get("/buildings/my-buildings/");
  return res.data;
};

// السكان المقبولين في عمارة معينة
export const getAcceptedResidents = async (buildingId) => {
  const res = await axiosClient.get(`/buildings/${buildingId}/accepted-residents/`);
  return res.data;
};

// تحديث حالة التواجد للساكن
export const updateResidentPresence = async (residentId, isPresent, absenceReason = null) => {
  const res = await axiosClient.patch(`/residents/${residentId}/presence/`, {
    is_present: isPresent,
    absence_reason: absenceReason,
  });
  return res.data;
};
