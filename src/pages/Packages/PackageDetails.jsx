import React, { useEffect, useState } from "react";
import { getPackageDetails, deletePackage } from "../../api/packages";
import { useParams, useNavigate } from "react-router-dom";
import Spinner from "../../components/ui/Spinner";
import  Card  from "../../components/ui/Card";
import Modal from "../../components/ui/Modal";

const PackageDetails = () => {
  const { id } = useParams();
  const [pkg, setPkg] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      const data = await getPackageDetails(id);
      setPkg(data);
    };
    fetchData();
  }, [id]);

  const handleDelete = async () => {
    try {
      await deletePackage(id);
      navigate("/packages");
    } catch (error) {
      console.error("Error deleting package:", error);
    }
  };

  if (!pkg) return <Spinner />;

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-6">
      <div className="max-w-5xl mx-auto space-y-6">
        <Card className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-primary">{pkg.name}</h2>
            <div className="space-x-2">
              <button
                onClick={() => navigate(`/packages/${id}/edit`)}
                className="bg-yellow-400 text-white px-4 py-1 rounded hover:bg-yellow-500"
              >
                تعديل
              </button>
              <button
                onClick={() => setShowDeleteModal(true)}
                className="bg-red-500 text-white px-4 py-1 rounded hover:bg-red-600"
              >
                حذف
              </button>
            </div>
          </div>
          <p className="text-gray-700 mb-2">النوع: {pkg.type}</p>
          <p className="text-gray-700 mb-2">المبلغ الشهري: {pkg.base_amount} ج.م</p>
          <p className="text-gray-500">{pkg.details}</p>
        </Card>

        <Card className="p-6">
          <h3 className="text-xl font-semibold text-gray-700 mb-4">
            الفواتير المرتبطة بالباقة
          </h3>
          {pkg.invoices?.length ? (
            <ul className="space-y-2">
              {pkg.invoices.map((inv) => (
                <li
                  key={inv.id}
                  className="border-b pb-2 flex justify-between items-center"
                >
                  <span>الوحدة #{inv.resident_unit}</span>
                  <span
                    className={`text-sm ${
                      inv.status === "paid" ? "text-green-600" : "text-red-500"
                    }`}
                  >
                    {inv.amount} ج.م ({inv.status === "paid" ? "مدفوعة" : "غير مدفوعة"})
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500">لا توجد فواتير بعد.</p>
          )}
        </Card>
      </div>

      <Modal isOpen={showDeleteModal} onClose={() => setShowDeleteModal(false)}>
        <div className="p-6">
          <h3 className="text-lg font-semibold mb-4">تأكيد الحذف</h3>
          <p className="mb-6">هل أنت متأكد من حذف هذه الباقة؟ لا يمكن التراجع عن هذا الإجراء.</p>
          <div className="flex justify-end space-x-4">
            <button
              onClick={() => setShowDeleteModal(false)}
              className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400"
            >
              إلغاء
            </button>
            <button
              onClick={() => {
                handleDelete();
                setShowDeleteModal(false);
              }}
              className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700"
            >
              حذف
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default PackageDetails;
