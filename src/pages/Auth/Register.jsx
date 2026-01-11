import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import {
  FaUser, FaPhone, FaIdCard, FaBirthdayCake, FaEnvelope, FaLock,
  FaHome, FaUsers
} from "react-icons/fa";
import { registerUserWithFiles } from "../../api/auth";
import Modal from "../../components/ui/Modal";

const rolesList = [
  { value: "union_head", label: "مالك أو رئيس اتحاد", icon: <FaHome />, color: "from-orange-50 to-orange-100", borderColor: "border-orange-300", textColor: "text-orange-700" },
  { value: "resident", label: "ساكن", icon: <FaUsers />, color: "from-blue-50 to-blue-100", borderColor: "border-blue-300", textColor: "text-blue-700" },
];

export default function RegisterPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    full_name: '',
    phone_number: '',
    national_id: '',
    date_of_birth: '',
    email: '',
    password: '',
    confirm_password: '',
    roles: [],
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [passwordErrors, setPasswordErrors] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });

    if (name === 'password') {
      validatePassword(value);
    }
  };

  const handleRoleToggle = (value) => {
    setForm({
      ...form,
      roles: form.roles.includes(value)
        ? form.roles.filter((r) => r !== value)
        : [...form.roles, value],
    });
  };

  const validatePassword = (password) => {
    const errors = [];
    if (password.length < 8) {
      errors.push("كلمة المرور يجب أن تكون على الأقل 8 أحرف.");
    }
    if (!/[a-z]/.test(password)) {
      errors.push("كلمة المرور يجب أن تحتوي على حرف صغير.");
    }
    if (!/[A-Z]/.test(password)) {
      errors.push("كلمة المرور يجب أن تحتوي على حرف كبير.");
    }
    if (!/\d/.test(password)) {
      errors.push("كلمة المرور يجب أن تحتوي على رقم.");
    }
    if (!/[@$!%*?&]/.test(password)) {
      errors.push("كلمة المرور يجب أن تحتوي على رمز خاص (@$!%*?&).");
    }
    setPasswordErrors(errors);
  };

  const isFormValid = form.full_name && form.phone_number && form.national_id && form.date_of_birth && form.email && form.password && form.confirm_password && passwordErrors.length === 0 && form.password === form.confirm_password && form.roles.length > 0 && agreedToTerms;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isFormValid) {
      if (form.roles.length === 0) {
        alert("اختر دور واحد على الأقل");
      } else if (!agreedToTerms) {
        alert("يرجى الموافقة على الشروط والأحكام");
      } else {
        alert("يرجى ملء جميع الحقول بشكل صحيح");
      }
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const formData = new FormData();
      formData.append('full_name', form.full_name);
      formData.append('phone_number', form.phone_number);
      formData.append('national_id', form.national_id);
      formData.append('date_of_birth', form.date_of_birth);
      formData.append('email', form.email);
      formData.append('password', form.password);
      formData.append('roles', form.roles.join(','));

      await registerUserWithFiles(formData);

      setSuccess('تم إنشاء الحساب بنجاح! سيتم توجيهك لصفحة تسجيل الدخول.');
      setTimeout(() => navigate('/login'), 3000);
    } catch (err) {
      let errorMessage = 'حدث خطأ أثناء التسجيل. حاول مرة أخرى.';
      if (err.response?.data) {
        const data = err.response.data;
        if (typeof data === 'string') {
          errorMessage = data;
        } else if (typeof data === 'object') {
          const messages = [];
          for (const [field, errors] of Object.entries(data)) {
            if (Array.isArray(errors)) {
              messages.push(`${field}: ${errors.join(', ')}`);
            } else if (typeof errors === 'string') {
              messages.push(`${field}: ${errors}`);
            }
          }
          if (messages.length > 0) {
            errorMessage = messages.join('\n');
          } else if (data.message) {
            errorMessage = data.message;
          }
        }
      }
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-cyan-900 to-blue-900 flex items-center justify-center p-4 relative overflow-hidden" dir="rtl">
        <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0" style={{ background: 'radial-gradient(circle at 50% 50%, rgba(59,130,246,0.3), rgba(255,255,255,0))' }}></div>
            <div className="absolute top-0 left-0 w-full h-full" style={{ backgroundImage: 'url(data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiMzYjgyZjYiIGZpbGwtb3BhY2l0eT0iMC4xIj48Y2lyY2xlIGN4PSIzMCIgY3k9IjMwIiByPSIyIi8+PC9nPjwvZz48L3N2Zz4K)' }}></div>
        </div>
        <div className="absolute inset-0 overflow-hidden">
            <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-500"></div>
        </div>

        <div className="container mx-auto py-8 px-4 relative z-10">
          <form
            className="max-w-full sm:max-w-lg md:max-w-xl lg:max-w-2xl mx-auto bg-white rounded-xl shadow-lg p-8 mt-8 border border-gray-200"
            onSubmit={handleSubmit}
          >
            <h2 className="text-2xl font-bold mb-6 text-center">إنشاء حساب جديد</h2>
            <div className="space-y-4">
              {[
                { name: "full_name", type: "text", placeholder: "الاسم بالكامل", icon: <FaUser />, label: "الاسم بالكامل", autocomplete: "name" },
                { name: "phone_number", type: "tel", placeholder: "رقم الهاتف", icon: <FaPhone />, label: "رقم الهاتف", autocomplete: "tel" },
                { name: "national_id", type: "text", placeholder: "الرقم القومي", icon: <FaIdCard />, label: "الرقم القومي", autocomplete: "off" },
                { name: "date_of_birth", type: "date", placeholder: "", icon: <FaBirthdayCake />, label: "تاريخ الميلاد", autocomplete: "bday" },
                { name: "email", type: "email", placeholder: "البريد الإلكتروني", icon: <FaEnvelope />, label: "البريد الإلكتروني", autocomplete: "email" },
                { name: "password", type: "password", placeholder: "كلمة المرور", icon: <FaLock />, label: "كلمة المرور", autocomplete: "new-password" },
                { name: "confirm_password", type: "password", placeholder: "تأكيد كلمة المرور", icon: <FaLock />, label: "تأكيد كلمة المرور", autocomplete: "new-password" },
              ].map((field, idx) => (
                <div key={idx} className="flex items-center border-b flex-row-reverse">
                  <label htmlFor={field.name} className="sr-only">{field.label}</label>
                  <input
                    type={field.type}
                    id={field.name}
                    name={field.name}
                    placeholder={field.placeholder}
                    autoComplete={field.autocomplete}
                    className="w-full p-2 outline-none text-right"
                    value={form[field.name]}
                    onChange={handleChange}
                    required
                  />
                  <span className="text-cyan-900 ml-2">{field.icon}</span>
                </div>
              ))}
              {passwordErrors.length > 0 && (
                <div className="mt-2">
                  <ul className="text-red-500 text-sm list-disc list-inside">
                    {passwordErrors.map((error, idx) => (
                      <li key={idx}>{error}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
            <div className="mt-6">
              <label className="block mb-2 font-semibold text-right">
                اختر الدور (يمكن اختيار أكثر من دور):
              </label>
              <div className="flex flex-col gap-3">
                {rolesList.map((r) => (
                  <button
                    type="button"
                    key={r.value}
                    className={`flex items-center gap-2 px-4 py-2 rounded border text-right transition flex-row-reverse justify-between
                      ${form.roles.includes(r.value)
                        ? "bg-cyan-100 border-cyan-600 font-bold"
                        : "bg-gray-100 border-gray-300"}`}
                    onClick={() => handleRoleToggle(r.value)}
                  >
                    <span className="text-right flex-grow">{r.label}</span> {r.icon}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-6">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={agreedToTerms}
                  onChange={(e) => setAgreedToTerms(e.target.checked)}
                  required
                />
                <span>أوافق على <button type="button" onClick={() => setIsModalOpen(true)} className="text-cyan-600 underline">الشروط والأحكام</button></span>
              </label>
            </div>
            <button
              type="submit"
              disabled={!isFormValid || loading}
              className="w-full bg-cyan-700 text-white py-2 rounded mt-8 hover:bg-cyan-800 transition disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {loading ? 'جاري الإنشاء...' : 'إنشاء الحساب'}
            </button>
          </form>
          
          <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
            <h2 className="text-xl font-bold mb-4">الشروط والأحكام</h2>
            <div className="text-right space-y-4 max-h-96 overflow-y-auto">
                <h3 className="font-bold text-lg">المقدمة</h3>
                <p>مرحبًا بكم في تطبيق "مكانى"، وهو منصة إلكترونية ذكية تُدار بواسطة شركة مكانى لتقنية المعلومات، وتهدف إلى تسهيل إدارة العقارات والمرافق المشتركة من خلال تمكين المستخدمين من سداد المستحقات، متابعة الصيانة، إدارة العقود، والتواصل بين الأطراف العقارية بطريقة رقمية فعّالة وآمنة.
        يُعد دخولك إلى التطبيق أو استخدامك لأي من خدماته موافقةً صريحة منك على هذه الشروط والأحكام، لذا يُرجى قراءتها بعناية قبل البدء بالاستخدام.</p>

                <h3 className="font-bold text-lg">أولاً: التعريفات</h3>
                <p><strong>التطبيق:</strong> تطبيق مكانى الإلكتروني بجميع خصائصه وخدماته وواجهاته.</p>
                <p><strong>المستخدم:</strong> أي شخص طبيعي أو اعتباري يقوم بإنشاء حساب داخل التطبيق بصفته مالكًا أو مستأجرًا أو فنيًا أو عضوًا باتحاد الملاك.</p>
                <p><strong>الإدارة:</strong> الجهة المالكة والمشغلة لتطبيق مكانى.</p>
                <p><strong>الخدمات:</strong> جميع الخدمات المقدمة عبر التطبيق، بما في ذلك إدارة العقارات، سداد الفواتير، طلبات الصيانة، التواصل بين المستخدمين، وإصدار التقارير المالية.</p>

                <h3 className="font-bold text-lg">ثانيًا: أهلية الاستخدام</h3>
                <p>يشترط أن يكون المستخدم قد أتم 18 عامًا ويتمتع بالأهلية القانونية الكاملة للتصرف.</p>
                <p>يُسمح باستخدام التطبيق فقط للأشخاص المرتبطين بعقارٍ مشترك (ملاك، مستأجرون، فنيون معتمدون، أو أعضاء اتحاد الملاك).</p>
                <p>يحق للإدارة رفض أو إلغاء أي حساب إذا تبين تقديم معلومات مضللة أو مخالفة للقانون أو شروط الاستخدام.</p>

                <h3 className="font-bold text-lg">ثالثًا: إنشاء الحساب</h3>
                <p>يجب على المستخدم إدخال بيانات صحيحة وكاملة عند التسجيل، مثل الاسم، رقم الهاتف، البريد الإلكتروني، ورقم الوحدة السكنية أو العقار.</p>
                <p>يتحمّل المستخدم المسؤولية الكاملة عن سرية معلومات الدخول (اسم المستخدم وكلمة المرور).</p>
                <p>يلتزم المستخدم بتحديث بياناته فور حدوث أي تغييرات لضمان استمرار دقة المعلومات داخل النظام.</p>
                <p>أي استخدام للحساب من قبل أطراف أخرى يقع تحت مسؤولية المستخدم المسجل.</p>

                <h3 className="font-bold text-lg">رابعًا: استخدام التطبيق</h3>
                <p>يُستخدم التطبيق للأغراض القانونية والمشروعة فقط، ولا يجوز استغلاله في الاحتيال أو التلاعب أو الإساءة للآخرين.</p>
                <p>يُمنع رفع أو نشر أي محتوى غير لائق أو مخالف للقانون أو النظام العام.</p>
                <p>تحتفظ الإدارة بالحق في تعليق أو إلغاء الحساب في حال مخالفة الشروط دون إشعار مسبق.</p>
                <p>يُمنع محاولة اختراق أو تعديل أنظمة التطبيق أو استخدامه بطرق غير مصرح بها.</p>

                <h3 className="font-bold text-lg">خامسًا: سداد المستحقات</h3>
                <p>يتيح التطبيق للمستخدمين سداد المستحقات الخاصة بالمرافق المشتركة (مثل المياه، الكهرباء، الغاز، الصيانة) عبر وسائل دفع إلكترونية معتمدة مثل فوري، مدى، فيزا، ماستركارد، والمحافظ الإلكترونية.</p>
                <p>تُصدر الفواتير بشكل دوري حسب سياسة كل عقار أو اتحاد ملاك، ويجب على المستخدم سداد المبالغ في المواعيد المحددة.</p>
                <p><strong>غرامات التأخير:</strong> في حال تأخر الدفع، يحق للإدارة فرض غرامة بنسبة 5% من المبلغ المستحق عن كل شهر تأخير.</p>
                <p>قد يؤدي تكرار التأخير إلى تعليق بعض الخدمات أو تقييد الوصول إلى الحساب.</p>
                <p>في حال حدوث دفع بالخطأ أو تضارب في الفواتير، يتم مراجعة الحالة من قبل الإدارة، ويتم رد المبلغ إن ثبت الخطأ وفق سياسة الاسترداد المعتمدة.</p>

                <h3 className="font-bold text-lg">سادسًا: الخصوصية وحماية البيانات</h3>
                <p>تلتزم الإدارة بالمحافظة على سرية بيانات المستخدمين وعدم مشاركتها مع أي طرف ثالث إلا في الحالات التي يقتضيها القانون أو بموافقة المستخدم.</p>
                <p>تُخزن البيانات في أنظمة إلكترونية آمنة ومشفرة وفقًا لأفضل ممارسات الأمان الرقمي.</p>
                <p>يحق للمستخدم الاطلاع على بياناته وطلب تعديلها أو حذفها في أي وقت.</p>
                <p>لا تتحمل الإدارة مسؤولية أي ضرر ناتج عن إفصاح المستخدم عن بيانات دخوله للآخرين.</p>

                <h3 className="font-bold text-lg">سابعًا: التحديثات والصيانة</h3>
                <p>يحق للإدارة تحديث التطبيق أو تعديل الخدمات أو إضافة ميزات جديدة في أي وقت دون إشعار مسبق.</p>
                <p>قد تتسبب عمليات الصيانة أو التحديث في توقف مؤقت للخدمات، وستسعى الإدارة لإشعار المستخدمين مسبقًا قدر الإمكان.</p>
                <p>استمرار استخدام التطبيق بعد التحديث يعني الموافقة على التعديلات الجديدة.</p>

                <h3 className="font-bold text-lg">ثامنًا: الرسوم والسياسات المالية</h3>
                <p>بعض الخدمات داخل التطبيق قد تكون مدفوعة بنظام الاشتراك الشهري أو السنوي.</p>
                <p>تحتفظ الإدارة بحق تعديل الأسعار أو الرسوم مع إخطار المستخدمين قبل تطبيقها.</p>
                <p>في حال استخدام طرق دفع معينة قد تُضاف رسوم إضافية حسب الجهة المقدمة للخدمة.</p>
                <p>عند وجود اعتراض على فاتورة أو دفعة مالية، يحق للمستخدم تقديم طلب مراجعة خلال مدة لا تتجاوز 7 أيام عمل من تاريخ الإصدار.</p>

                <h3 className="font-bold text-lg">تاسعًا: حدود المسؤولية</h3>
                <p>لا تتحمل الإدارة أي مسؤولية عن انقطاع المرافق العامة أو الأعطال الناتجة عن أطراف خارجية.</p>
                <p>لا تضمن الإدارة أن يكون التطبيق خالياً تمامًا من الأخطاء التقنية، لكنها تلتزم بإصلاحها في أسرع وقت ممكن.</p>
                <p>المستخدم مسؤول عن جميع الأنشطة التي تتم من خلال حسابه.</p>
                <p>لا تتحمل الإدارة أي أضرار مباشرة أو غير مباشرة ناتجة عن سوء استخدام التطبيق أو تقديم معلومات غير صحيحة.</p>

                <h3 className="font-bold text-lg">العاشر: إنهاء الاستخدام</h3>
                <p>يحق للإدارة إيقاف أو تعليق حساب المستخدم في حال مخالفته لأي من الشروط المنصوص عليها.</p>
                <p>يمكن للمستخدم طلب إغلاق حسابه في أي وقت بعد سداد جميع المستحقات المترتبة.</p>
                <p>تحتفظ الإدارة بحق الاحتفاظ ببعض البيانات اللازمة للالتزامات القانونية أو المحاسبية بعد إغلاق الحساب.</p>

                <h3 className="font-bold text-lg">الحادي عشر: القانون الواجب التطبيق وتسوية النزاعات</h3>
                <p>تخضع هذه الشروط والأحكام لقوانين جمهورية مصر العربية.</p>
                <p>في حال نشوء أي نزاع بين الإدارة والمستخدم، يتم حله وديًا قدر الإمكان، وفي حال تعذر ذلك، تكون محاكم القاهرة هي الجهة المختصة بالنظر في النزاع.</p>

                <h3 className="font-bold text-lg">الثاني عشر: قبول الشروط</h3>
                <p>باستخدام هذا التطبيق، يقر المستخدم بأنه قرأ وفهم ووافق على الالتزام بجميع الشروط والأحكام المذكورة أعلاه.</p>
                <p>تحتفظ الإدارة بحق تعديل هذه الشروط من وقت لآخر، وسيتم إشعار المستخدمين عند صدور أي تحديثات جوهرية.</p>

                <p className="text-center font-semibold mt-4">تطبيق مكانى – إدارة ذكية لكل مستخدمي العقار</p>
                <p className="text-center">© جميع الحقوق محفوظة لشركة مكانى لتقنية المعلومات.</p>
            </div>
            <button onClick={() => setIsModalOpen(false)} className="mt-4 bg-cyan-600 text-white px-4 py-2 rounded">إغلاق</button>
          </Modal>

          {error && (
            <div className="mt-4 p-4 bg-red-500/20 border border-red-500/30 text-red-300 rounded-xl text-center animate-shake backdrop-blur-sm">
              {error}
            </div>
          )}
          {success && (
            <div className="mt-4 p-4 bg-green-500/20 border border-green-500/30 text-green-300 rounded-xl text-center animate-fadeInUp backdrop-blur-sm">
              {success}
            </div>
          )}
        </div>
      </div>

      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }
        .animate-fadeInUp {
          animation: fadeInUp 0.6s ease-out;
        }
        .animate-shake {
          animation: shake 0.5s ease-in-out;
        }
      `}</style>
    </>
  );
}
