import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getMyBuildings, getAcceptedResidents, updateResidentPresence } from '../../api/buildings.jsx';
import SelectField from '../../components/forms/SelectField.jsx';
import Spinner from '../../components/ui/Spinner.jsx';
import Button from '../../components/ui/Button.jsx';
import Modal from '../../components/ui/Modal.jsx';
import InputField from '../../components/forms/InputField.jsx';
import { FaUsers, FaPlus, FaToggleOn, FaToggleOff, FaBuilding } from 'react-icons/fa';

const Residents = () => {
  const [buildings, setBuildings] = useState([]);
  const [selectedBuilding, setSelectedBuilding] = useState('');
  const [residents, setResidents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [buildingsLoading, setBuildingsLoading] = useState(true);
  const [showAbsenceModal, setShowAbsenceModal] = useState(false);
  const [selectedResident, setSelectedResident] = useState(null);
  const [absenceReason, setAbsenceReason] = useState('');
  const [updatingPresence, setUpdatingPresence] = useState(false);

  useEffect(() => {
    const fetchBuildings = async () => {
      try {
        const data = await getMyBuildings();
        setBuildings(data);
        if (data.length > 0) {
          setSelectedBuilding(data[0].id.toString());
        }
      } catch (error) {
        console.error('Error fetching buildings:', error);
      } finally {
        setBuildingsLoading(false);
      }
    };
    fetchBuildings();
  }, []);

  useEffect(() => {
    if (selectedBuilding) {
      const fetchResidents = async () => {
        setLoading(true);
        try {
          const data = await getAcceptedResidents(selectedBuilding);
          setResidents(data);
        } catch (error) {
          console.error('Error fetching residents:', error);
          setResidents([]);
        } finally {
          setLoading(false);
        }
      };
      fetchResidents();
    }
  }, [selectedBuilding]);

  const handleBuildingChange = (e) => {
    setSelectedBuilding(e.target.value);
  };

  const handlePresenceToggle = async (resident) => {
    if (resident.is_present) {
      // If currently present, show modal to confirm absence
      setSelectedResident(resident);
      setShowAbsenceModal(true);
    } else {
      // If currently absent, set to present
      setUpdatingPresence(true);
      try {
        await updateResidentPresence(resident.id, true);
        // Update local state
        setResidents(residents.map(r =>
          r.id === resident.id ? { ...r, is_present: true } : r
        ));
      } catch (error) {
        console.error('Error updating presence:', error);
      } finally {
        setUpdatingPresence(false);
      }
    }
  };

  const handleConfirmAbsence = async () => {
    if (!selectedResident) return;

    setUpdatingPresence(true);
    try {
      await updateResidentPresence(selectedResident.id, false, absenceReason);
      // Update local state
      setResidents(residents.map(r =>
        r.id === selectedResident.id ? { ...r, is_present: false } : r
      ));
      setShowAbsenceModal(false);
      setSelectedResident(null);
      setAbsenceReason('');
    } catch (error) {
      console.error('Error updating presence:', error);
    } finally {
      setUpdatingPresence(false);
    }
  };

  const handleCancelAbsence = () => {
    setShowAbsenceModal(false);
    setSelectedResident(null);
    setAbsenceReason('');
  };

  return (
    <div className="p-6 bg-gradient-to-br from-blue-50 to-indigo-100 min-h-screen" dir="rtl">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <FaUsers className="text-4xl text-blue-600" />
          <h1 className="text-4xl font-bold text-gray-800">إدارة السكان</h1>
        </div>

      {buildingsLoading ? (
        <p>جاري تحميل العمارات...</p>
      ) : buildings.length === 0 ? (
        <p className="text-gray-500">لا توجد عمارات مرتبطة بك</p>
      ) : (
        <>
          <div className="flex justify-between items-center mb-6">
            <div className="flex-1 max-w-md">
              <SelectField
                label="اختر العمارة"
                name="building"
                value={selectedBuilding}
                onChange={handleBuildingChange}
                options={[
                  { value: '', label: 'جميع العمارات' },
                  ...buildings.map(building => ({
                    value: building.id.toString(),
                    label: building.name
                  }))
                ]}
                required
              />
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center items-center py-12">
              <Spinner size="lg" />
            </div>
          ) : residents.length === 0 ? (
            <p className="text-gray-500">لا يوجد سكان مقبولين في هذه العمارة</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {residents.map(resident => (
                <div key={resident.id} className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-100">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-blue-600 font-bold text-lg">{resident.user_name.charAt(0)}</span>
                      </div>
                      <div>
                        <Link
                          to={`/buildings/${selectedBuilding}/residents/${resident.id}`}
                          className="font-bold text-xl text-blue-600 hover:text-blue-800 transition-colors"
                        >
                          {resident.user_name}
                        </Link>
                        <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded-full block mt-1">
                          الطابق {resident.floor_number} - شقة {resident.apartment_number}
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={() => handlePresenceToggle(resident)}
                      disabled={updatingPresence}
                      className={`p-2 rounded-full transition-colors ${
                        resident.is_present
                          ? 'bg-green-100 text-green-600 hover:bg-green-200'
                          : 'bg-red-100 text-red-600 hover:bg-red-200'
                      }`}
                      title={resident.is_present ? 'حاضر - اضغط لتسجيل الغياب' : 'غائب - اضغط لتسجيل الحضور'}
                    >
                      {resident.is_present ? <FaToggleOn size={20} /> : <FaToggleOff size={20} />}
                    </button>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-sm">
                      <span className="text-gray-600">📱</span>
                      <span className="text-gray-700">{resident.phone_number}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <FaBuilding className="text-gray-600" />
                      <span className="text-gray-700">{resident.building_name || 'غير محدد'}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <span className={`inline-block w-3 h-3 rounded-full ${resident.is_present ? 'bg-green-500' : 'bg-red-500'}`}></span>
                      <span className={`font-medium ${resident.is_present ? 'text-green-600' : 'text-red-600'}`}>
                        {resident.is_present ? 'حاضر' : 'غائب'}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {/* Absence Confirmation Modal */}
      <Modal
        isOpen={showAbsenceModal}
        onClose={handleCancelAbsence}
        title="تأكيد الغياب"
      >
        <div className="space-y-4">
          <p className="text-gray-700">
            هل أنت متأكد من تسجيل غياب {selectedResident?.user_name}؟
          </p>
          <InputField
            label="سبب الغياب (اختياري)"
            type="text"
            value={absenceReason}
            onChange={(e) => setAbsenceReason(e.target.value)}
            placeholder="أدخل سبب الغياب..."
          />
          <div className="flex gap-3 justify-end">
            <Button
              onClick={handleCancelAbsence}
              variant="secondary"
              disabled={updatingPresence}
            >
              إلغاء
            </Button>
            <Button
              onClick={handleConfirmAbsence}
              variant="danger"
              disabled={updatingPresence}
            >
              {updatingPresence ? 'جاري التسجيل...' : 'تأكيد الغياب'}
            </Button>
          </div>
        </div>
      </Modal>
      </div>
    </div>
  );
};

export default Residents;
