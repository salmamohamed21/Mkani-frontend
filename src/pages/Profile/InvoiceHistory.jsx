import React, { useEffect, useState, useMemo } from "react";
import { getInvoiceHistory } from "../../api/packages";
import Spinner from "../../components/ui/Spinner";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";

const InvoiceHistory = () => {
  const [invoices, setInvoices] = useState([]);
  const [statusFilter, setStatusFilter] = useState("all");
  const [buildingFilter, setBuildingFilter] = useState("all");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        const response = await getInvoiceHistory();
        setInvoices(response.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchInvoices();
  }, []);

  const uniqueBuildings = useMemo(() => {
    const buildings = [...new Set(invoices.map(inv => inv.building_name))];
    return buildings;
  }, [invoices]);

  const filteredInvoices = useMemo(() => {
    return invoices.filter((inv) => {
      const matchesStatus = statusFilter === "all" || inv.status === statusFilter;
      const matchesBuilding = buildingFilter === "all" || inv.building_name === buildingFilter;
      const matchesDateFrom = !dateFrom || new Date(inv.due_date) >= new Date(dateFrom);
      const matchesDateTo = !dateTo || new Date(inv.due_date) <= new Date(dateTo);
      const matchesSearch = !searchQuery ||
        inv.package_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        inv.resident_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        inv.building_name.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesStatus && matchesBuilding && matchesDateFrom && matchesDateTo && matchesSearch;
    });
  }, [invoices, statusFilter, buildingFilter, dateFrom, dateTo, searchQuery]);

  const clearFilters = () => {
    setStatusFilter("all");
    setBuildingFilter("all");
    setDateFrom("");
    setDateTo("");
    setSearchQuery("");
  };

  if (loading) return <Spinner />;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-10 px-6">
      <div className="max-w-7xl mx-auto">
        <Card className="p-8 shadow-xl bg-white rounded-2xl">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8">
            <h2 className="text-3xl font-bold text-gray-800 mb-4 lg:mb-0">
              سجل الفواتير
            </h2>
            <div className="flex flex-wrap gap-4">
              <input
                type="text"
                placeholder="البحث في الفواتير..."
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Button onClick={clearFilters} className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg">
                مسح الفلاتر
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">الحالة</label>
              <select
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="all">الكل</option>
                <option value="paid">المدفوعة</option>
                <option value="unpaid">الغير مدفوعة</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">المبنى</label>
              <select
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={buildingFilter}
                onChange={(e) => setBuildingFilter(e.target.value)}
              >
                <option value="all">الكل</option>
                {uniqueBuildings.map((building) => (
                  <option key={building} value={building}>{building}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">من تاريخ</label>
              <input
                type="date"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={dateFrom}
                onChange={(e) => setDateFrom(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">إلى تاريخ</label>
              <input
                type="date"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={dateTo}
                onChange={(e) => setDateTo(e.target.value)}
              />
            </div>
          </div>

          {filteredInvoices.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-400 text-6xl mb-4">📄</div>
              <p className="text-gray-500 text-lg">لا توجد فواتير مطابقة للفلاتر المحددة</p>
            </div>
          ) : (
            <div className="space-y-3 sm:space-y-4">
              {filteredInvoices.map((inv, index) => (
                <div key={inv.id} className="bg-white rounded-lg sm:rounded-xl shadow-sm border border-gray-100 p-4 sm:p-6 hover:shadow-md transition-shadow duration-200">
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                    <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                      <div className="min-w-0">
                        <p className="text-xs sm:text-sm text-gray-500 font-medium">الباقة</p>
                        <p className="text-gray-900 font-semibold text-sm sm:text-base truncate">{inv.package_name}</p>
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs sm:text-sm text-gray-500 font-medium">المبنى</p>
                        <p className="text-gray-900 text-sm sm:text-base truncate">{inv.building_name}</p>
                      </div>
                      <div className="min-w-0 sm:col-span-2 lg:col-span-1">
                        <p className="text-xs sm:text-sm text-gray-500 font-medium">الساكن</p>
                        <p className="text-gray-900 text-sm sm:text-base truncate">{inv.resident_name}</p>
                      </div>
                    </div>
                    <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                      <div className="min-w-0">
                        <p className="text-xs sm:text-sm text-gray-500 font-medium">المبلغ</p>
                        <p className="text-lg sm:text-2xl font-bold text-green-600">{inv.amount} جنيه</p>
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs sm:text-sm text-gray-500 font-medium">تاريخ الاستحقاق</p>
                        <p className="text-gray-900 text-sm sm:text-base">
                          {new Date(inv.due_date).toLocaleDateString("ar-EG", {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                          })}
                        </p>
                      </div>
                      <div className="min-w-0 sm:col-span-2 lg:col-span-1">
                        <p className="text-xs sm:text-sm text-gray-500 font-medium">طريقة الدفع</p>
                        <p className="text-gray-900 text-sm sm:text-base truncate">{inv.payment_method || 'غير محدد'}</p>
                      </div>
                    </div>
                    <div className="flex justify-center lg:justify-end lg:ml-6">
                      <span className={`inline-flex items-center px-3 py-1.5 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm font-semibold ${
                        inv.status === "paid"
                          ? "bg-green-50 text-green-700 border border-green-200"
                          : "bg-red-50 text-red-700 border border-red-200"
                      }`}>
                        {inv.status === "paid" ? (
                          <>
                            <svg className="w-4 h-4 sm:w-5 sm:h-5 mr-1 sm:mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                            مدفوعة
                          </>
                        ) : (
                          <>
                            <svg className="w-4 h-4 sm:w-5 sm:h-5 mr-1 sm:mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                            </svg>
                            غير مدفوعة
                          </>
                        )}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

export default InvoiceHistory;
