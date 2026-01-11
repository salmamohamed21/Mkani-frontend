import React, { useState, useEffect } from 'react';
import { getRentalListings, deleteRentalListing } from '../../api/rentals.jsx';
import { FaEdit, FaTrash, FaUserPlus, FaBuilding, FaUserCheck, FaHome, FaSpinner } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';

const MyRentalsPage = () => {
  const [rentals, setRentals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedRental, setSelectedRental] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRentals = async () => {
      try {
        const data = await getRentalListings();
        setRentals(data);
      } catch (err) {
        setError('Failed to fetch rental listings.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchRentals();
  }, []);

  const handleDeleteClick = (rental) => {
    setSelectedRental(rental);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!selectedRental) return;
    setDeleting(true);
    try {
      await deleteRentalListing(selectedRental.id);
      setRentals(rentals.filter((r) => r.id !== selectedRental.id));
      setIsDeleteModalOpen(false);
      setSelectedRental(null);
    } catch (err) {
      console.error('Failed to delete rental:', err);
      // Optionally: show an error message to the user
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <FaSpinner className="animate-spin text-4xl text-blue-500" />
        <p className="ml-4 text-lg">جارٍ تحميل إعلاناتك...</p>
      </div>
    );
  }

  if (error) {
    return <div className="text-center text-red-500 p-8">{error}</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8" dir="rtl">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">إعلاناتي للإيجار</h1>
        </div>

        {rentals.length === 0 ? (
          <NoRentalsGuide />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {rentals.map((rental) => (
              <RentalCard key={rental.id} rental={rental} onDeleteClick={handleDeleteClick} />
            ))}
          </div>
        )}
      </div>
       <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="تأكيد الحذف"
        >
        <p>هل أنت متأكد أنك تريد حذف هذا الإعلان؟ لا يمكن التراجع عن هذا الإجراء.</p>
        <div className="flex justify-end gap-4 mt-6">
            <Button variant="secondary" onClick={() => setIsDeleteModalOpen(false)} disabled={deleting}>
            إلغاء
            </Button>
            <Button variant="danger" onClick={confirmDelete} disabled={deleting}>
            {deleting ? 'جاري الحذف...' : 'حذف'}
            </Button>
        </div>
        </Modal>
    </div>
  );
};

const RentalCard = ({ rental, onDeleteClick }) => {
    const navigate = useNavigate();
    return (
        <Card className="overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col">
            <div className="p-5 flex-grow">
                <div className="font-bold text-xl mb-2 text-gray-800">{rental.building_name}</div>
                <p className="text-gray-600 text-sm mb-4">{rental.address}</p>
                
                <div className="border-t border-b border-gray-200 py-3 my-3">
                    <div className="flex justify-around text-center">
                        {rental.daily_price && <div><p className="font-bold text-lg text-green-600">{rental.daily_price}</p><p className="text-xs text-gray-500">/ يوم</p></div>}
                        {rental.monthly_price && <div><p className="font-bold text-lg text-green-600">{rental.monthly_price}</p><p className="text-xs text-gray-500">/ شهر</p></div>}
                        {rental.yearly_price && <div><p className="font-bold text-lg text-green-600">{rental.yearly_price}</p><p className="text-xs text-gray-500">/ سنة</p></div>}
                    </div>
                </div>

                <p className="text-gray-700 text-base mt-2">{rental.comment}</p>
            </div>
            <div className="p-4 bg-gray-50 flex justify-end gap-3">
                <Button size="sm" variant="outline" onClick={() => navigate(`/my-rentals/edit/${rental.id}`)} className="flex items-center gap-2">
                    <FaEdit /> تعديل
                </Button>
                <Button size="sm" variant="danger" onClick={() => onDeleteClick(rental)} className="flex items-center gap-2">
                    <FaTrash /> حذف
                </Button>
            </div>
        </Card>
    );
};


const NoRentalsGuide = () => {
    const steps = [
        { icon: <FaUserPlus size={30} />, title: "إنشاء حساب", description: "ابدأ بإنشاء حساب كـ 'ساكن' وسجل دخولك إلى المنصة." },
        { icon: <FaBuilding size={30} />, title: "إضافة شقتك", description: "أضف بيانات شقتك مع اختيار نوعك كـ 'مالك'." },
        { icon: <FaUserCheck size={30} />, title: "المراجعة والاعتماد", description: "سينتظر طلبك مراجعة واعتماد رئيس اتحاد العمارة المسؤول." },
        { icon: <FaHome size={30} />, title: "عرضها للإيجار", description: "بمجرد الموافقة، يمكنك عرض شقتك للإيجار بسهولة من صفحة ملفك الشخصي." },
    ];

    return (
        <div className="text-center bg-white p-8 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-4 text-gray-700">لا توجد إعلانات حالياً</h2>
            <p className="text-gray-500 mb-8">اتبع الخطوات التالية لعرض شقتك للإيجار وجذب المستأجرين.</p>
            
            <div className="relative flex justify-center items-center mb-8">
                 <div className="absolute top-1/2 left-0 w-full h-0.5 bg-gray-200" style={{ zIndex: 0, transform: 'translateY(-50%)' }}></div>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8 w-full max-w-5xl mx-auto z-10">
                    {steps.map((step, index) => (
                        <div key={index} className="flex flex-col items-center text-center">
                            <div className="bg-blue-500 text-white rounded-full w-20 h-20 flex items-center justify-center border-4 border-white shadow-lg">
                                {step.icon}
                            </div>
                            <h3 className="font-bold mt-4 mb-1 text-gray-800">{step.title}</h3>
                            <p className="text-sm text-gray-600">{step.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default MyRentalsPage;
