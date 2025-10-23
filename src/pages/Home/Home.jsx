import React, { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import Card from "../../components/ui/Card";
import { FaCoins, FaBuilding, FaUsers, FaTools, FaChartLine, FaCalendarAlt, FaExclamationTriangle, FaMobileAlt, FaArrowRight, FaCheckCircle, FaStar, FaBell, FaBox } from "react-icons/fa";
import homeImg from "../../assets/home.jpg";
import enrollImg from "../../assets/enroll.png";
import { dashboardAPI } from "../../api/dashboard";
import LoadingPage from "../../components/ui/LoadingPage";

function Home() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalBuildings: 0,
    totalResidents: 0,
    totalPackages: 0,
    monthlyRevenue: 0,
    pendingMaintenance: 0
  });
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showAllActivities, setShowAllActivities] = useState(false);

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (user && user.roles?.includes('union_head')) {
        setLoading(true);
        try {
          // Fetch statistics
          const statsResponse = await dashboardAPI.getStats();
          setStats(statsResponse.data);

          // Fetch activities
          const activitiesResponse = await dashboardAPI.getActivities();
          setActivities(activitiesResponse.data);
        } catch (error) {
          console.error('Error fetching dashboard data:', error);
          // Fallback to mock data if API fails
          setStats({
            totalBuildings: 5,
            totalResidents: 120,
            totalPackages: 15,
            monthlyRevenue: 25000,
            pendingMaintenance: 8
          });
          setActivities([
            {
              id: 'mock_1',
              type: 'payment',
              title: 'تم دفع فاتورة كهرباء - عمارة الأمل',
              description: 'مبلغ: 500 ج.م',
              timestamp: new Date().toISOString(),
              icon: 'FaCheckCircle',
              color: 'green'
            },
            {
              id: 'mock_2',
              type: 'maintenance',
              title: 'طلب صيانة جديد - شقة 201',
              description: 'مشكلة في السباكة',
              timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
              icon: 'FaTools',
              color: 'orange'
            },
            {
              id: 'mock_3',
              type: 'resident',
              title: 'انضمام ساكن جديد - عمارة النخيل',
              description: 'أحمد محمد',
              timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
              icon: 'FaUsers',
              color: 'blue'
            }
          ]);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchDashboardData();
  }, [user]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-slate-50" dir="rtl">
      {/* Hero Section */}
      <section
        className="relative w-full h-[400px] md:h-[450px] rounded-2xl overflow-hidden flex shadow-lg bg-gradient-to-b from-[#6a67ce] to-[#1b173b] mx-5 mt-5"
        dir="rtl"
      >
        {/* Left side: Text */}
        <div className="w-1/2 relative bg-gradient-to-b from-[#6a67ce] to-[#1b173b] flex flex-col justify-center items-center text-white text-center px-6">
          <div className="relative z-10 animate-fade-slide">
            <h1 className="text-3xl md:text-4xl font-bold mb-4 drop-shadow-md">
              مسكن أفضل لحياة أسعد
            </h1>
            <p className="text-lg md:text-xl mb-6 opacity-90">
              كل ما يخص مسكنك في مكان واحد!
            </p>
            {!user && (
              <button
                onClick={() => navigate("/register")}
                className="mx-auto px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 flex items-center gap-2"
              >
                <FaStar className="text-lg" />
                ابدء رحلتك الان
              </button>
            )}
          </div>
        </div>

        {/* Right side: Image */}
        <div className="relative w-1/2 h-full">
          <img
            src={homeImg}
            alt="Mkani Hero"
            className="w-full h-full object-cover"
            style={{
              clipPath: "polygon(0 0, 80% 0, 100% 50%, 80% 100%, 0 100%)",
              objectPosition: "50% 35%",
            }}
          />
        </div>
      </section>

      {user ? (
        // Dashboard for authenticated users (union heads)
        <div className="py-10 px-6">
          <div className="max-w-7xl mx-auto">
            {/* Statistics Cards with Enhanced Design */}
            {user && user.roles?.includes('union_head') && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                <Card className="p-8 text-center bg-gradient-to-br from-blue-50 to-blue-100 border-l-4 border-blue-500 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
                  <div className="relative">
                    <FaBuilding className="text-4xl text-blue-600 mx-auto mb-4 animate-pulse" />
                  </div>
                  <h3 className="text-3xl font-bold text-gray-800 mb-2">{stats.totalBuildings}</h3>
                  <p className="text-gray-600 font-medium">عدد العمارات</p>
                  <div className="mt-4 flex justify-center">
                    <FaArrowRight className="text-blue-400 text-sm" />
                  </div>
                </Card>

                <Card className="p-8 text-center bg-gradient-to-br from-green-50 to-green-100 border-l-4 border-green-500 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
                  <div className="relative">
                    <FaUsers className="text-4xl text-green-600 mx-auto mb-4 animate-pulse" />
                  </div>
                  <h3 className="text-3xl font-bold text-gray-800 mb-2">{stats.totalResidents}</h3>
                  <p className="text-gray-600 font-medium">عدد السكان</p>
                  <div className="mt-4 flex justify-center">
                    <FaArrowRight className="text-green-400 text-sm" />
                  </div>
                </Card>

                <Card className="p-8 text-center bg-gradient-to-br from-orange-50 to-orange-100 border-l-4 border-orange-500 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
                  <div className="relative">
                    <FaTools className="text-4xl text-orange-500 mx-auto mb-4 animate-pulse" />
                  </div>
                  <h3 className="text-3xl font-bold text-gray-800 mb-2">{stats.pendingMaintenance}</h3>
                  <p className="text-gray-600 font-medium">طلبات الصيانة المعلقة</p>
                  <div className="mt-4 flex justify-center">
                    <FaArrowRight className="text-orange-400 text-sm" />
                  </div>
                </Card>
              </div>
            )}

            {/* Enhanced Activity and Notes Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Recent Activity with Timeline */}
              <Card className="p-8 bg-gradient-to-br from-white to-gray-50 shadow-xl border-0 lg:col-span-2">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-3 bg-blue-100 rounded-full">
                    <FaChartLine className="text-2xl text-blue-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-800">آخر النشاطات</h3>
                </div>
                <div className={`space-y-4 ${showAllActivities ? 'max-h-96 overflow-y-auto' : ''}`}>
                  {activities.length > 0 ? (
                    <>
                      {(showAllActivities ? activities : activities.slice(0, 3)).map((activity) => {
                        const getIcon = (iconName) => {
                          switch (iconName) {
                            case 'FaCheckCircle':
                              return <FaCheckCircle className={`text-${activity.color}-600 text-sm`} />;
                            case 'FaTools':
                              return <FaTools className={`text-${activity.color}-600 text-sm`} />;
                            case 'FaUsers':
                              return <FaUsers className={`text-${activity.color}-600 text-sm`} />;
                            case 'FaBell':
                              return <FaBell className={`text-${activity.color}-600 text-sm`} />;
                            case 'FaBox':
                              return <FaBox className={`text-${activity.color}-600 text-sm`} />;
                            default:
                              return <FaCheckCircle className={`text-${activity.color}-600 text-sm`} />;
                          }
                        };

                        const getTimeAgo = (timestamp) => {
                          const now = new Date();
                          const activityTime = new Date(timestamp);
                          const diffInHours = Math.floor((now - activityTime) / (1000 * 60 * 60));

                          if (diffInHours < 1) return 'منذ دقائق';
                          if (diffInHours < 24) return `منذ ${diffInHours} ساعة`;
                          const diffInDays = Math.floor(diffInHours / 24);
                          if (diffInDays === 1) return 'أمس';
                          return `منذ ${diffInDays} يوم`;
                        };

                        return (
                          <div key={activity.id} className="flex items-start gap-4 p-4 bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200">
                            <div className={`flex-shrink-0 w-10 h-10 bg-${activity.color}-100 rounded-full flex items-center justify-center`}>
                              {getIcon(activity.icon)}
                            </div>
                            <div className="flex-1">
                              <p className="text-gray-800 font-medium">{activity.title}</p>
                              <p className="text-sm text-gray-600 mb-1">{activity.description}</p>
                              <p className="text-sm text-gray-500 flex items-center gap-1">
                                <FaCalendarAlt className="text-xs" />
                                {getTimeAgo(activity.timestamp)}
                              </p>
                            </div>
                          </div>
                        );
                      })}
                      {activities.length > 3 && (
                        <div className="text-center pt-4">
                          <button
                            onClick={() => setShowAllActivities(!showAllActivities)}
                            className="px-6 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors duration-200"
                          >
                            {showAllActivities ? 'عرض أقل' : 'عرض الكل'}
                          </button>
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <FaBell className="text-4xl mx-auto mb-4 text-gray-300" />
                      <p>لا توجد نشاطات حديثة</p>
                    </div>
                  )}
                </div>
              </Card>

              {/* Important Notes with Enhanced Design */}
              <Card className="p-8 bg-gradient-to-br from-white to-gray-50 shadow-xl border-0">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-3 bg-yellow-100 rounded-full">
                    <FaExclamationTriangle className="text-2xl text-yellow-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-800">ملاحظات مهمة</h3>
                </div>
                <div className="space-y-4">
                  <div className="p-6 bg-gradient-to-r from-yellow-50 to-yellow-100 border border-yellow-200 text-yellow-800 rounded-xl shadow-sm">
                    <div className="flex items-start gap-3">
                      <FaExclamationTriangle className="text-yellow-600 mt-1 flex-shrink-0" />
                      <div>
                        <p className="font-semibold mb-1">تحديث مهم</p>
                        <p className="text-sm">جميع العمليات المالية والتنفيذية متاحة الآن فقط عبر تطبيق "مكاني" على الهاتف المحمول.</p>
                      </div>
                    </div>
                  </div>
                  <div className="p-6 bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-200 text-blue-800 rounded-xl shadow-sm">
                    <div className="flex items-start gap-3">
                      <FaMobileAlt className="text-blue-600 mt-1 flex-shrink-0" />
                      <div>
                        <p className="font-semibold mb-1">تطبيق مكاني</p>
                        <p className="text-sm">قم بتحميل التطبيق للوصول لجميع الميزات المتقدمة والتحكم الكامل في إدارة عقارك.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>


            </div>
          </div>
        </div>
      ) : (
        // Landing page for non-authenticated users with Enhanced Design
        <div className="py-20 px-5">
          <div className="max-w-7xl mx-auto">
            {/* App Download Banner */}
            <div className="rounded-3xl p-6 md:p-12 mb-16 shadow-2xl relative overflow-hidden">
              <div className="relative z-10 flex flex-col items-center gap-6 md:gap-8">
                <div className="flex flex-col md:flex-row items-center justify-center gap-6 mb-6">
                  <div className="text-center md:text-right">
                    <h2 className="text-2xl md:text-4xl lg:text-5xl font-bold text-gray-800 animate-fade-in mb-4">
                      حمل تطبيق مكاني الآن!
                    </h2>
                    <p className="text-lg md:text-xl text-gray-600 leading-relaxed max-w-2xl">
                      نظام إدارة العقارات الشامل على الهاتف المحمول - سهولة في الإدارة، كفاءة في الأداء، وتحكم كامل في عقارك من أي مكان
                    </p>
                  </div>
                  <img
                    src={enrollImg}
                    alt="تطبيق مكاني"
                    className="w-24 h-24 md:w-32 md:h-32 lg:w-40 lg:h-40 rounded-2xl shadow-2xl transform hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <button className="px-6 md:px-8 py-3 md:py-4 bg-blue-600 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 flex items-center gap-2 text-sm md:text-base">
                    <FaMobileAlt className="text-base md:text-lg" />
                    حمل من Google Play
                  </button>
                  <button className="px-6 md:px-8 py-3 md:py-4 bg-gray-800 text-white font-bold rounded-xl border-2 border-gray-800 hover:bg-white hover:text-gray-800 transition-all duration-300 flex items-center gap-2 text-sm md:text-base">
                    <FaMobileAlt className="text-base md:text-lg" />
                    حمل من App Store
                  </button>
                </div>
              </div>
            </div>

            {/* Features Grid with Enhanced Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="group p-8 bg-gradient-to-br from-blue-50 to-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-4 border border-gray-100">
                <div className="relative mb-6">
                  <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-blue-200 rounded-2xl flex items-center justify-center mx-auto group-hover:scale-110 transition-transform duration-300">
                    <FaBuilding className="text-4xl text-blue-600" />
                  </div>
                  <div className="absolute -top-2 -right-2 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                    <FaCheckCircle className="text-white text-xs" />
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-3 text-center">إدارة العمارات</h3>
                <p className="text-gray-600 text-center leading-relaxed">إدارة شاملة لجميع العمارات والوحدات مع متابعة تفصيلية لكل تفاصيل</p>
              </div>

              <div className="group p-8 bg-gradient-to-br from-blue-50 to-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-4 border border-gray-100">
                <div className="relative mb-6">
                  <div className="w-20 h-20 bg-gradient-to-br from-green-100 to-green-200 rounded-2xl flex items-center justify-center mx-auto group-hover:scale-110 transition-transform duration-300">
                    <FaUsers className="text-4xl text-green-600" />
                  </div>
                  <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                    <FaCheckCircle className="text-white text-xs" />
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-3 text-center">إدارة السكان</h3>
                <p className="text-gray-600 text-center leading-relaxed">متابعة شاملة لجميع السكان والمدفوعات مع إشعارات فورية</p>
              </div>

              <div className="group p-8 bg-gradient-to-br from-blue-50 to-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-4 border border-gray-100">
                <div className="relative mb-6">
                  <div className="w-20 h-20 bg-gradient-to-br from-purple-100 to-purple-200 rounded-2xl flex items-center justify-center mx-auto group-hover:scale-110 transition-transform duration-300">
                    <FaTools className="text-4xl text-purple-600" />
                  </div>
                  <div className="absolute -top-2 -right-2 w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center">
                    <FaCheckCircle className="text-white text-xs" />
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-3 text-center">طلبات الصيانة</h3>
                <p className="text-gray-600 text-center leading-relaxed">نظام متكامل لطلبات الصيانة والمتابعة مع تقارير مفصلة</p>
              </div>

              <div className="group p-8 bg-gradient-to-br from-blue-50 to-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-4 border border-gray-100">
                <div className="relative mb-6">
                  <div className="w-20 h-20 bg-gradient-to-br from-yellow-100 to-yellow-200 rounded-2xl flex items-center justify-center mx-auto group-hover:scale-110 transition-transform duration-300">
                    <FaCoins className="text-4xl text-yellow-500" />
                  </div>
                  <div className="absolute -top-2 -right-2 w-6 h-6 bg-yellow-500 rounded-full flex items-center justify-center">
                    <FaCheckCircle className="text-white text-xs" />
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-3 text-center">المدفوعات</h3>
                <p className="text-gray-600 text-center leading-relaxed">إدارة المدفوعات والفواتير بسهولة مع تتبع دقيق للمالية</p>
              </div>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}

export default Home;
