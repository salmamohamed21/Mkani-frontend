import React, { useEffect, useState } from "react";
import { getTechnicianTasks } from "../../api/maintenance";
import Spinner from "../../components/ui/Spinner";
import Card from "../../components/ui/Card";

const TechnicianView = () => {
  const [tasks, setTasks] = useState([]);
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [statusFilter, setStatusFilter] = useState("");

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const data = await getTechnicianTasks();
        // Sort by created_at descending (newest first)
        const sortedData = data.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
        setTasks(sortedData);
        setFilteredTasks(sortedData);
      } catch (err) {
        setError(err.message || "حدث خطأ في تحميل المهام");
      } finally {
        setLoading(false);
      }
    };
    fetchTasks();
  }, []);

  useEffect(() => {
    if (statusFilter) {
      setFilteredTasks(tasks.filter(task => task.status === statusFilter));
    } else {
      setFilteredTasks(tasks);
    }
  }, [statusFilter, tasks]);

  const getStatusIcon = (status) => {
    switch (status) {
      case "completed":
        return "✅";
      case "in_progress":
        return "🔄";
      case "pending":
        return "⏳";
      case "rejected":
        return "❌";
      default:
        return "❓";
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800 border-green-200";
      case "in_progress":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "rejected":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ar-SA', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) return <Spinner />;
  if (error) return <div className="text-red-500 text-center py-10">{error}</div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 py-12 px-6">
      <div className="max-w-7xl mx-auto">
        <Card className="p-8 shadow-2xl bg-white/90 backdrop-blur-lg border border-white/20">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-10">
            <div className="flex items-center mb-6 lg:mb-0">
              <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-3 rounded-full mr-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <h2 className="text-4xl font-bold text-gray-800">
                طلبات الصيانة
              </h2>
            </div>
            <div className="flex items-center gap-4">
              <label className="text-gray-700 font-medium">تصفية حسب الحالة:</label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white shadow-lg transition-all duration-200 hover:shadow-xl"
              >
                <option value="">جميع الحالات</option>
                <option value="pending">⏳ في الانتظار</option>
                <option value="in_progress">🔄 قيد التنفيذ</option>
                <option value="completed">✅ مكتمل</option>
                <option value="rejected">❌ مرفوض</option>
              </select>
            </div>
          </div>

          {filteredTasks.length === 0 ? (
            <div className="text-center py-16">
              <div className="bg-gray-100 rounded-full p-6 inline-block mb-4">
                <svg className="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <p className="text-gray-500 text-xl font-medium">لا توجد طلبات صيانة متاحة</p>
            </div>
          ) : (
            <div className="overflow-x-auto rounded-2xl shadow-xl">
              <table className="w-full table-auto border-collapse bg-white rounded-2xl overflow-hidden shadow-inner">
                <thead className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white">
                  <tr>
                    <th className="px-8 py-6 text-right font-bold text-lg">
                      <div className="flex items-center justify-end gap-2">
                        <span>اسم المهمة</span>
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                        </svg>
                      </div>
                    </th>
                    <th className="px-8 py-6 text-right font-bold text-lg">
                      <div className="flex items-center justify-end gap-2">
                        <span>تفاصيل المهمة</span>
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                        </svg>
                      </div>
                    </th>
                    <th className="px-8 py-6 text-right font-bold text-lg">
                      <div className="flex items-center justify-end gap-2">
                        <span>اليوزر</span>
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                        </svg>
                      </div>
                    </th>
                    <th className="px-8 py-6 text-right font-bold text-lg">
                      <div className="flex items-center justify-end gap-2">
                        <span>تاريخ التنفيذ</span>
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                        </svg>
                      </div>
                    </th>
                    <th className="px-8 py-6 text-right font-bold text-lg">
                      <div className="flex items-center justify-end gap-2">
                        <span>الحالة</span>
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                      </div>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredTasks.map((task) => (
                    <tr key={task.id} className="hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 transition-all duration-300 group">
                      <td className="px-8 py-6 text-gray-800 font-semibold text-lg group-hover:text-blue-700 transition-colors">
                        {task.description.split(' ').slice(0, 3).join(' ')}...
                      </td>
                      <td className="px-8 py-6 text-gray-600 max-w-xs" title={task.description}>
                        <div className="truncate">{task.description}</div>
                      </td>
                      <td className="px-8 py-6 text-gray-700 font-medium">
                        <div className="flex items-center gap-2">
                          <svg className="w-4 h-4 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
                          </svg>
                          {task.resident_name || "غير محدد"}
                        </div>
                      </td>
                      <td className="px-8 py-6 text-gray-600 text-sm font-medium">
                        <div className="flex items-center gap-2">
                          <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                          </svg>
                          {formatDate(task.created_at)}
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <span
                          className={`inline-flex items-center gap-2 px-4 py-2 text-sm font-bold rounded-full border-2 ${getStatusColor(task.status)} shadow-sm`}
                        >
                          <span className="text-lg">{getStatusIcon(task.status)}</span>
                          {task.status === "pending" ? "في الانتظار" :
                           task.status === "in_progress" ? "قيد التنفيذ" :
                           task.status === "completed" ? "مكتمل" :
                           task.status === "rejected" ? "مرفوض" : task.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

export default TechnicianView;
