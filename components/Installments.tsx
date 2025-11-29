"use client"
import { useEffect, useState } from "react";
import { IoMdPhonePortrait, IoMdClose, IoMdCash, IoMdImage } from "react-icons/io";
import { FaMoneyBillWave, FaUserFriends, FaChartLine, FaExclamationCircle } from "react-icons/fa";
import api from "@/utils/api";
import { useAuth } from "@/utils/contextapi";

interface InstallmentRequest {
    personID: string;
    clientName: string;
    phoneNumber: string;
    address: string;
    adviceName: string;
    installmentCount: string;
    totalAmount: number;
    installmentID: number;
    paidAmount: number;
    remainingAmount: number;
    trustReceipt: string;
    installmentDate: string;
}

interface InstallmentsProps {
    refreshTrigger?: number;
}

export default function Installments({ refreshTrigger = 0 }: InstallmentsProps) {
    const { userData } = useAuth();
    const [installments, setInstallments] = useState<InstallmentRequest[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [stats, setStats] = useState({
        totalCustomers: 0,
        activeCustomers: 0,
        totalCollected: 0,
        remainingAmount: 0
    });

    // Payment Modal State
    const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
    const [selectedInstallmentId, setSelectedInstallmentId] = useState<number | null>(null);
    const [paymentAmount, setPaymentAmount] = useState("");
    const [paymentLoading, setPaymentLoading] = useState(false);

    // Image Preview State
    const [previewImage, setPreviewImage] = useState<string | null>(null);

    const fetchInstallments = async () => {
        if (!userData?.userId) return;
        setLoading(true);
        setError(null);
        try {
            const res = await api.get(`/api/Evaluation App/GetInstallmentRequests?personID=${userData.userId}`);
            const data: InstallmentRequest[] = res.data;
            setInstallments(data);

            // Calculate Stats
            const totalCollected = data.reduce((acc, curr) => acc + curr.paidAmount, 0);
            const remaining = data.reduce((acc, curr) => acc + curr.remainingAmount, 0);

            setStats({
                totalCustomers: data.length,
                activeCustomers: data.filter(i => i.remainingAmount > 0).length,
                totalCollected,
                remainingAmount: remaining
            });

        } catch (error: any) {
            console.error("Error fetching installments:", error);
            if (error.response && error.response.status === 404) {
                setInstallments([]);
                setStats({
                    totalCustomers: 0,
                    activeCustomers: 0,
                    totalCollected: 0,
                    remainingAmount: 0
                });
            } else {
                setError("حدث خطأ أثناء تحميل البيانات");
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchInstallments();
    }, [userData, refreshTrigger]);

    const handleAddPayment = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedInstallmentId) return;

        setPaymentLoading(true);
        try {
            await api.post(`/api/Evaluation App/AddInstallmentPayment?installmentID=${selectedInstallmentId}&PaidAmount=${paymentAmount}`);
            setIsPaymentModalOpen(false);
            setPaymentAmount("");
            setSelectedInstallmentId(null);
            fetchInstallments();
            alert("تم تسجيل الدفعة بنجاح ✅");
        } catch (error) {
            console.error(error);
            alert("حدث خطأ أثناء تسجيل الدفعة ❌");
        } finally {
            setPaymentLoading(false);
        }
    };

    const dashboard = [
        { title: "إجمالي العملاء", value: stats.totalCustomers, icon: <FaUserFriends />, color: "text-blue-500", bg: "bg-blue-50" },
        { title: "العملاء النشطين", value: stats.activeCustomers, icon: <FaChartLine />, color: "text-yellow-500", bg: "bg-yellow-50" },
        { title: "إجمالي المحصل", value: stats.totalCollected.toLocaleString(), icon: <FaMoneyBillWave />, color: "text-green-500", bg: "bg-green-50" },
        { title: "المبالغ المتبقية", value: stats.remainingAmount.toLocaleString(), icon: <FaExclamationCircle />, color: "text-red-500", bg: "bg-red-50" }
    ];

    return (
        <div className="mt-8 space-y-8">
            {/* Dashboard Cards */}
            <div className="grid lg:grid-cols-4 md:grid-cols-2 grid-cols-1 gap-5">
                {dashboard.map((item, index) => (
                    <div key={index} className="p-6 bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300 transform hover:-translate-y-1">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-500 text-sm font-medium mb-2">{item.title}</p>
                                <h3 className={`text-2xl font-bold ${item.color}`}>{item.value}</h3>
                            </div>
                            <div className={`p-4 rounded-2xl ${item.bg} ${item.color} text-xl shadow-sm`}>
                                {item.icon}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Installments Grid */}
            {loading ? (
                <div className="flex flex-col items-center justify-center py-20">
                    <div className="w-12 h-12 border-4 border-main-color border-t-transparent rounded-full animate-spin mb-4"></div>
                    <p className="text-gray-500 font-medium">جاري تحميل البيانات...</p>
                </div>
            ) : error ? (
                <div className="text-center py-12 bg-red-50 rounded-2xl border border-red-100">
                    <p className="text-red-500 font-medium">{error}</p>
                    <button onClick={fetchInstallments} className="mt-4 text-main-color hover:underline font-medium">إعادة المحاولة</button>
                </div>
            ) : installments.length === 0 ? (
                <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-gray-300">
                    <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400">
                        <FaUserFriends size={32} />
                    </div>
                    <h3 className="text-xl font-bold text-gray-800 mb-2">لا يوجد أقساط حالياً</h3>
                    <p className="text-gray-500">قم بإضافة قسط جديد للبدء في تتبع المدفوعات</p>
                </div>
            ) : (
                <div className="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-6">
                    {installments.map((item) => {
                        const progress = item.totalAmount > 0 ? (item.paidAmount / item.totalAmount) * 100 : 0;

                        return (
                            <div key={item.installmentID} className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-300 group">
                                <div className="p-6">
                                    <div className="flex justify-between items-start mb-6">
                                        <div>
                                            <h3 className="text-lg font-bold text-gray-900 group-hover:text-main-color transition-colors">{item.clientName}</h3>
                                            <div className="flex items-center gap-2 text-gray-500 text-sm mt-2">
                                                <IoMdPhonePortrait className="text-main-color" />
                                                <span dir="ltr" className="font-medium">{item.phoneNumber}</span>
                                            </div>
                                        </div>
                                        <span className="bg-blue-50 text-main-color text-xs px-3 py-1.5 rounded-full font-bold border border-blue-100">
                                            {item.adviceName}
                                        </span>
                                    </div>

                                    {/* Progress Bar */}
                                    <div className="mb-6">
                                        <div className="flex justify-between text-sm mb-2">
                                            <span className="text-gray-600 font-medium">نسبة السداد</span>
                                            <span className="font-bold text-main-color">{Math.round(progress)}%</span>
                                        </div>
                                        <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden shadow-inner">
                                            <div
                                                className={`h-3 rounded-full transition-all duration-1000 ease-out ${progress >= 100 ? 'bg-green-500' : 'bg-main-color'}`}
                                                style={{ width: `${progress}%` }}
                                            ></div>
                                        </div>
                                    </div>

                                    {/* Details Grid */}
                                    <div className="grid grid-cols-2 gap-3 text-sm mb-6 bg-gray-50 p-4 rounded-xl border border-gray-100">
                                        <div>
                                            <p className="text-gray-500 text-xs mb-1">المبلغ الإجمالي</p>
                                            <p className="font-bold text-gray-900">{item.totalAmount.toLocaleString()}</p>
                                        </div>
                                        <div>
                                            <p className="text-gray-500 text-xs mb-1">المدفوع</p>
                                            <p className="font-bold text-green-600">{item.paidAmount.toLocaleString()}</p>
                                        </div>
                                        <div>
                                            <p className="text-gray-500 text-xs mb-1">المتبقي</p>
                                            <p className="font-bold text-red-500">{item.remainingAmount.toLocaleString()}</p>
                                        </div>
                                        <div>
                                            <p className="text-gray-500 text-xs mb-1">قيمة القسط</p>
                                            <p className="font-bold text-gray-900">{(item.totalAmount / Number(item.installmentCount)).toFixed(0)}</p>
                                        </div>
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="flex gap-3">
                                        {item.trustReceipt && (
                                            <button
                                                onClick={() => setPreviewImage(item.trustReceipt)}
                                                className="cursor-pointer flex-1 bg-gray-100 text-gray-700 py-3.5 rounded-xl text-sm font-bold hover:bg-gray-200 transition-all flex items-center justify-center gap-2"
                                                title="عرض صورة الإيصال"
                                            >
                                                <IoMdImage size={20} />
                                                <span className="hidden sm:inline">الإيصال</span>
                                            </button>
                                        )}

                                        <button
                                            onClick={() => {
                                                setSelectedInstallmentId(item.installmentID);
                                                setIsPaymentModalOpen(true);
                                            }}
                                            disabled={item.remainingAmount <= 0}
                                            className={`cursor-pointer flex-2 flex items-center justify-center gap-2 py-3.5 rounded-xl text-sm font-bold transition-all duration-300 ${item.remainingAmount <= 0
                                                    ? 'bg-green-100 text-green-700 cursor-default'
                                                    : 'bg-main-color text-white hover:bg-blue-600 shadow-lg shadow-blue-500/30'
                                                }`}
                                        >
                                            {item.remainingAmount <= 0 ? (
                                                <>
                                                    <span>تم السداد</span>
                                                    <span>✅</span>
                                                </>
                                            ) : (
                                                <>
                                                    <IoMdCash size={18} />
                                                    <span>تسجيل دفعة</span>
                                                </>
                                            )}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Add Payment Modal */}
            {isPaymentModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    {/* Backdrop with Fade In */}
                    <div
                        className="absolute inset-0 bg-black/40 backdrop-blur-sm animate-fadeIn"
                        onClick={() => setIsPaymentModalOpen(false)}
                    />

                    {/* Modal Content with Scale In */}
                    <div className="relative bg-white rounded-2xl w-full max-w-md shadow-2xl animate-scaleIn">
                        <div className="p-5 border-b border-gray-100 flex justify-between items-center">
                            <h3 className="text-xl font-bold text-gray-800">تسجيل دفعة جديدة</h3>
                            <button
                                onClick={() => setIsPaymentModalOpen(false)}
                                className="p-2 hover:bg-gray-100 text-gray-400 hover:text-gray-600 rounded-full transition-colors"
                            >
                                <IoMdClose size={24} />
                            </button>
                        </div>
                        <form onSubmit={handleAddPayment} className="p-6 space-y-5">
                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-gray-700">المبلغ المدفوع</label>
                                <div className="relative">
                                    <input
                                        required
                                        type="number"
                                        className="w-full p-4 rounded-xl border border-gray-200 focus:border-main-color focus:ring-4 focus:ring-blue-50 outline-none text-xl font-bold text-gray-800 transition-all pl-12"
                                        placeholder="0.00"
                                        value={paymentAmount}
                                        onChange={e => setPaymentAmount(e.target.value)}
                                    />
                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-medium">ج.م</span>
                                </div>
                            </div>
                            <button
                                type="submit"
                                disabled={paymentLoading}
                                className="w-full bg-green-600 text-white py-3.5 rounded-xl font-bold text-lg hover:bg-green-700 active:scale-[0.98] transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            >
                                {paymentLoading ? (
                                    <>
                                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                        <span>جاري التسجيل...</span>
                                    </>
                                ) : (
                                    <span>تأكيد الدفع</span>
                                )}
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {/* Image Preview Modal */}
            {previewImage && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div
                        className="absolute inset-0 bg-black/80 backdrop-blur-md animate-fadeIn"
                        onClick={() => setPreviewImage(null)}
                    />
                    <div className="relative bg-white p-2 rounded-2xl max-w-4xl w-full max-h-[90vh] animate-scaleIn shadow-2xl flex flex-col">
                        <div className="absolute top-4 right-4 z-10">
                            <button
                                onClick={() => setPreviewImage(null)}
                                className="bg-black/50 hover:bg-black/70 text-white p-2 rounded-full backdrop-blur-sm transition-all"
                            >
                                <IoMdClose size={24} />
                            </button>
                        </div>
                        <div className="flex-1 overflow-hidden rounded-xl bg-gray-100 flex items-center justify-center">
                            <img
                                src={previewImage}
                                alt="Trust Receipt"
                                className="max-w-full max-h-[85vh] object-contain"
                            />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}