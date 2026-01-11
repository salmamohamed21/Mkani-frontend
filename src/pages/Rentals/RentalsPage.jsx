import React, { useEffect, useState } from "react";
import { getRentalListings } from "../../api/rentals.jsx";
import Card from "../../components/ui/Card";
import LoadingPage from "../../components/ui/LoadingPage";
import { FaHome, FaMapMarkerAlt, FaBed, FaRulerCombined, FaBuilding, FaMoneyBillWave, FaUser, FaPhone, FaWhatsapp, FaSearch, FaFilter, FaChevronDown, FaChevronUp } from "react-icons/fa";
import InputField from "../../components/forms/InputField";
import Button from "../../components/ui/Button";
import { useNavigate } from "react-router-dom";

const RentalsPage = () => {
  const [rentalListings, setRentalListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [ownerPhoneNumber, setOwnerPhoneNumber] = useState("");
  const [filterCriteria, setFilterCriteria] = useState({
    minMonthlyPrice: "",
    maxMonthlyPrice: "",
    minRooms: "",
    minArea: "",
  });
  const [showFilters, setShowFilters] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRentalListings = async () => {
      setLoading(true);
      try {
        const params = {};
        if (ownerPhoneNumber) {
          params.owner_phone_number = ownerPhoneNumber;
        }
        if (filterCriteria.minMonthlyPrice) {
          params.min_monthly_price = filterCriteria.minMonthlyPrice;
        }
        if (filterCriteria.maxMonthlyPrice) {
          params.max_monthly_price = filterCriteria.maxMonthlyPrice;
        }
        if (filterCriteria.minRooms) {
          params.min_rooms = filterCriteria.minRooms;
        }
        if (filterCriteria.minArea) {
          params.min_area = filterCriteria.minArea;
        }

        const response = await getRentalListings(params);
        setRentalListings(response);
      } catch (error) {
        console.error('Error fetching rental listings:', error);
        setRentalListings([]);
      } finally {
        setLoading(false);
      }
    };

    fetchRentalListings();
  }, [ownerPhoneNumber, filterCriteria]);

  if (loading) {
    return <LoadingPage />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-slate-50 p-4 sm:p-6 lg:p-8" dir="rtl">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4 flex items-center justify-center gap-3">
            <FaHome className="text-blue-600" />
            جميع إعلانات الإيجار
          </h2>
          <p className="text-lg text-gray-600">تصفح جميع الشقق والوحدات المتاحة للإيجار</p>
        </div>

        {/* Filter and Search Section */}
        <div className="mb-8 p-6 bg-white rounded-xl shadow-lg border border-gray-100" dir="rtl">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-4">
            <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
              <FaFilter className="text-blue-600" />
              خيارات البحث والتصفية
            </h3>
            <Button
              onClick={() => setShowFilters(!showFilters)}
              variant="secondary"
              className="flex items-center gap-2 px-4 py-2"
            >
              {showFilters ? <FaChevronUp /> : <FaChevronDown />}
              {showFilters ? "إخفاء الفلاتر المتقدمة" : "إظهار الفلاتر المتقدمة"}
            </Button>
          </div>

          <div className="space-y-4">
            <InputField
              label="البحث برقم هاتف المالك"
              type="text"
              id="ownerPhoneNumber"
              name="ownerPhoneNumber"
              placeholder="أدخل رقم هاتف المالك"
              value={ownerPhoneNumber}
              onChange={(value) => setOwnerPhoneNumber(value)}
              icon={<FaPhone />}
            />

            {showFilters && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <InputField
                  label="الحد الأدنى للسعر الشهري"
                  type="number"
                  id="minMonthlyPrice"
                  name="minMonthlyPrice"
                  placeholder="مثال: 1000"
                  value={filterCriteria.minMonthlyPrice}
                  onChange={(value) => setFilterCriteria(prev => ({ ...prev, minMonthlyPrice: value }))}
                  icon={<FaMoneyBillWave />}
                />
                <InputField
                  label="الحد الأقصى للسعر الشهري"
                  type="number"
                  id="maxMonthlyPrice"
                  name="maxMonthlyPrice"
                  placeholder="مثال: 5000"
                  value={filterCriteria.maxMonthlyPrice}
                  onChange={(value) => setFilterCriteria(prev => ({ ...prev, maxMonthlyPrice: value }))}
                  icon={<FaMoneyBillWave />}
                />
                <InputField
                  label="الحد الأدنى لعدد الغرف"
                  type="number"
                  id="minRooms"
                  name="minRooms"
                  placeholder="مثال: 2"
                  value={filterCriteria.minRooms}
                  onChange={(value) => setFilterCriteria(prev => ({ ...prev, minRooms: value }))}
                  icon={<FaBed />}
                />
                <InputField
                  label="الحد الأدنى للمساحة (متر مربع)"
                  type="number"
                  id="minArea"
                  name="minArea"
                  placeholder="مثال: 80"
                  value={filterCriteria.minArea}
                  onChange={(value) => setFilterCriteria(prev => ({ ...prev, minArea: value }))}
                  icon={<FaRulerCombined />}
                />
              </div>
            )}
          </div>
        </div>


        {rentalListings.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {rentalListings.map((listing) => {
              const ownerName = [listing.owner_details?.first_name, listing.owner_details?.last_name].filter(Boolean).join(" ") || "المالك";
              const whatsappNumber = listing.owner_details?.phone_number?.replace(/\D/g, '');

              return (
                <Card key={listing.id} className="flex flex-col p-0 bg-white shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border-0 rounded-2xl overflow-hidden">
                  <div className="p-5">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="p-3 bg-blue-100 rounded-full">
                        <FaHome className="text-2xl text-blue-600" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-gray-800">{listing.building_details?.name}</h3>
                        <p className="text-xs text-gray-500 flex items-center gap-1">
                          <FaMapMarkerAlt className="text-red-500" />
                          {listing.building_details?.address}
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3 text-sm text-gray-700 mb-4">
                      <div className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg">
                        <FaBuilding className="text-blue-600" />
                        <span>الدور: {listing.unit_details?.floor}</span>
                      </div>
                      <div className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg">
                        <FaBuilding className="text-blue-600" />
                        <span>شقة: {listing.unit_details?.unit_number}</span>
                      </div>
                      {listing.unit_details?.area && (
                        <div className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg">
                          <FaRulerCombined className="text-green-600" />
                          <span>{listing.unit_details.area} م²</span>
                        </div>
                      )}
                      {listing.unit_details?.rooms && (
                        <div className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg">
                          <FaBed className="text-purple-600" />
                          <span>{listing.unit_details.rooms} غرف</span>
                        </div>
                      )}
                    </div>
                    
                    {listing.comment && (
                      <div className="mb-4 p-3 bg-yellow-50 border-r-4 border-yellow-400">
                        <p className="text-sm text-gray-700 italic">"{listing.comment}"</p>
                      </div>
                    )}

                    <div className="border-t pt-4">
                      <div className="space-y-2">
                        {listing.monthly_price && (
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-600">الإيجار الشهري:</span>
                            <span className="font-bold text-lg text-green-600">{listing.monthly_price} جنيه</span>
                          </div>
                        )}
                        {listing.daily_price && (
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-600">اليومي:</span>
                            <span className="font-semibold text-blue-600">{listing.daily_price} جنيه</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-gray-50 p-4 mt-auto">
                      <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <FaUser className="text-gray-500" />
                        <span className="font-semibold text-gray-800">{ownerName}</span>
                      </div>
                      <div className="text-xs text-gray-500" dir="ltr">
                        {listing.owner_details?.phone_number}
                      </div>
                    </div>
                    
                    {whatsappNumber ? (
                      <a
                        href={`https://wa.me/${whatsappNumber}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-green-500 to-teal-500 text-white font-bold rounded-lg hover:shadow-lg transition-all duration-300 transform hover:scale-105"
                      >
                        <FaWhatsapp className="text-xl" />
                        تواصل مع المالك
                      </a>
                    ) : (
                        <div className="text-center text-sm text-gray-500">
                          (لا يتوفر رقم للتواصل)
                        </div>
                    )}
                  </div>
                </Card>
              )
            })}
          </div>
        ) : (
          <div className="text-center py-12">
            <FaHome className="text-6xl text-gray-300 mx-auto mb-4" />
            <p className="text-xl text-gray-500">لا توجد إعلانات إيجار حالياً</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default RentalsPage;
