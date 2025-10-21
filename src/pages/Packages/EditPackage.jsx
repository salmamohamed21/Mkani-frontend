import React, { useState, useEffect } from "react";
import { getPackageDetails, updatePackage } from "../../api/packages";
import { useNavigate, useParams } from "react-router-dom";
import SelectField from "../../components/forms/SelectField";
import InputField from "../../components/forms/InputField";
import Spinner from "../../components/ui/Spinner";

const EditPackage = () => {
  const { id } = useParams();
  const [form, setForm] = useState({
    name: "",
    type: "",
    base_amount: "",
    start_date: "",
    details: "",
  });
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);

  useEffect(() => {
    const fetchPackage = async () => {
      try {
        const data = await getPackageDetails(id);
        setForm({
          name: data.name || "",
          type: data.type || "",
          base_amount: data.base_amount || "",
          start_date: data.start_date || "",
          details: data.details || "",
        });
      } catch (error) {
        console.error("Error fetching package:", error);
      } finally {
        setFetchLoading(false);
      }
    };
    fetchPackage();
  }, [id]);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await updatePackage(id, form);
      navigate("/packages");
    } catch (error) {
      console.error("Error updating package:", error);
    } finally {
      setLoading(false);
    }
  };

  if (fetchLoading) return <Spinner />;

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-50">
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-xl rounded-xl p-8 w-full max-w-lg"
      >
        <h2 className="text-2xl font-bold text-primary mb-6 text-center">
          تعديل الباقة
        </h2>

        <InputField label="اسم الباقة" name="name" value={form.name} onChange={handleChange} />

        <SelectField
          label="نوع الباقة"
          name="type"
          value={form.type}
          onChange={handleChange}
          options={[
            { label: "عداد كهرباء / مياه / غاز", value: "regular_meter" },
            { label: "شحن كارت", value: "card_meter" },
            { label: "صيانة / نظافة / حارس", value: "fixed" },
            { label: "مصاريف طارئة", value: "misc" },
          ]}
        />

        <InputField
          label="المبلغ الكلي الشهري"
          name="base_amount"
          type="number"
          value={form.base_amount}
          onChange={handleChange}
        />

        <InputField
          label="تاريخ البدء"
          name="start_date"
          type="date"
          value={form.start_date}
          onChange={handleChange}
        />

        <textarea
          name="details"
          placeholder="تفاصيل إضافية"
          value={form.details}
          onChange={handleChange}
          className="w-full border rounded-md px-3 py-2 mb-3"
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-primary text-white py-2 rounded-md hover:bg-primary/90"
        >
          {loading ? "جارٍ الحفظ..." : "حفظ التعديلات"}
        </button>
      </form>
    </div>
  );
};

export default EditPackage;
