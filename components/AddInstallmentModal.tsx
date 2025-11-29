"use client";
import { useState } from "react";
import { IoMdClose, IoMdCloudUpload } from "react-icons/io";
import api from "@/utils/api";
import { useAuth } from "@/utils/contextapi";

interface AddInstallmentModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

export default function AddInstallmentModal({ isOpen, onClose, onSuccess }: AddInstallmentModalProps) {
    const { userData } = useAuth();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        ClientName: "",
        PhoneNumber: "",
        Address: "",
        AdviceName: "",
        InstallmentCount: "",
        TotalAmount: "",
        ImageUrl: null as File | null
    });

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!userData?.userId) return;

        setLoading(true);
        const data = new FormData();
        data.append("PersonID", userData.userId.toString());
        data.append("ClientName", formData.ClientName);
        data.append("PhoneNumber", formData.PhoneNumber);
        data.append("Address", formData.Address);
        data.append("AdviceName", formData.AdviceName);
        data.append("InstallmentCount", formData.InstallmentCount);
        data.append("TotalAmount", formData.TotalAmount);

        if (formData.ImageUrl) {
            data.append("ImageUrl", formData.ImageUrl);
        }

        try {
            await api.post("/api/Evaluation App/SaveInstallmentRequest", data, {
                headers: { "Content-Type": "multipart/form-data" }
            });

            onSuccess();
            onClose();
            setFormData({
                ClientName: "",
                PhoneNumber: "",
                Address: "",
                AdviceName: "",
                InstallmentCount: "",
                TotalAmount: "",
                ImageUrl: null
            });
        } catch (error) {
            console.error("Error adding installment:", error);
            alert("حدث خطأ أثناء الإضافة");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop with Fade In */}
            <div
                className="absolute inset-0 bg-black/40 backdrop-blur-sm animate-fadeIn"
                onClick={onClose}
            />

            {/* Modal Content with Scale In */}
            <div className="relative bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl animate-scaleIn">
                {/* Header */}
                <div className="p-5 border-b border-gray-100 flex justify-between items-center sticky top-0 bg-white z-10">
                    <h3 className="text-xl font-bold text-gray-800">إضافة قسط جديد</h3>
                    <button
                        onClick={onClose}
                        className="cursor-pointer p-2 hover:bg-gray-100 text-gray-400 hover:text-gray-600 rounded-full transition-colors"
                    >
                        <IoMdClose size={24} />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6 space-y-5">
                    {/* بيانات العميل */}
                    <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                            <label className="text-sm font-medium text-gray-700">اسم العميل</label>
                            <input
                                required
                                type="text"
                                className="text-black w-full p-3 rounded-lg border border-gray-200 focus:border-main-color focus:ring-2 focus:ring-blue-50 outline-none transition-all"
                                value={formData.ClientName}
                                onChange={e => setFormData({ ...formData, ClientName: e.target.value })}
                            />
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-sm font-medium text-gray-700">رقم الهاتف</label>
                            <input
                                required
                                type="tel"
                                className="text-black w-full p-3 rounded-lg border border-gray-200 focus:border-main-color focus:ring-2 focus:ring-blue-50 outline-none transition-all"
                                value={formData.PhoneNumber}
                                onChange={e => {
                                    const val = e.target.value;
                                    if (/^\d*$/.test(val)) setFormData({ ...formData, PhoneNumber: val });
                                }}
                            />
                        </div>
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-sm font-medium text-gray-700">العنوان</label>
                        <input
                            required
                            type="text"
                            className="text-black w-full p-3 rounded-lg border border-gray-200 focus:border-main-color focus:ring-2 focus:ring-blue-50 outline-none transition-all"
                            value={formData.Address}
                            onChange={e => setFormData({ ...formData, Address: e.target.value })}
                        />
                    </div>

                    {/* بيانات القسط */}
                    <div className="space-y-1.5">
                        <label className="text-sm font-medium text-gray-700">المنتج / الجهاز</label>
                        <input
                            required
                            type="text"
                            className="text-black w-full p-3 rounded-lg border border-gray-200 focus:border-main-color focus:ring-2 focus:ring-blue-50 outline-none transition-all"
                            value={formData.AdviceName}
                            onChange={e => setFormData({ ...formData, AdviceName: e.target.value })}
                        />
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                            <label className="text-sm font-medium text-gray-700">المبلغ الإجمالي</label>
                            <input
                                required
                                type="number"
                                className="text-black w-full p-3 rounded-lg border border-gray-200 focus:border-main-color focus:ring-2 focus:ring-blue-50 outline-none transition-all"
                                value={formData.TotalAmount}
                                onChange={e => {
                                    const val = e.target.value;
                                    if (/^\d*\.?\d*$/.test(val)) setFormData({ ...formData, TotalAmount: val });
                                }}
                            />
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-sm font-medium text-gray-700">عدد الأقساط</label>
                            <input
                                required
                                type="number"
                                className="text-black w-full p-3 rounded-lg border border-gray-200 focus:border-main-color focus:ring-2 focus:ring-blue-50 outline-none transition-all"
                                value={formData.InstallmentCount}
                                onChange={e => {
                                    const val = e.target.value;
                                    if (/^\d*$/.test(val)) setFormData({ ...formData, InstallmentCount: val });
                                }}
                            />
                        </div>
                    </div>

                    {/* رفع الصورة */}
                    <div className="space-y-1.5">
                        <label className="text-sm font-medium text-gray-700">صورة الإيصال</label>
                        <div className="relative">
                            <input
                                type="file"
                                accept="image/*"
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                onChange={e => setFormData({ ...formData, ImageUrl: e.target.files ? e.target.files[0] : null })}
                            />
                            <div className={`w-full p-4 rounded-lg border-2 border-dashed transition-all flex items-center justify-center gap-2 ${formData.ImageUrl ? 'border-green-500 bg-green-50 text-green-700' : 'border-gray-300 hover:border-main-color hover:bg-blue-50 text-gray-500'}`}>
                                <IoMdCloudUpload size={20} />
                                <span className="text-sm font-medium">
                                    {formData.ImageUrl ? formData.ImageUrl.name : "اضغط لرفع صورة"}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={loading}
                        className="cursor-pointer w-full bg-main-color text-white py-3.5 rounded-xl font-bold hover:bg-blue-600 active:scale-[0.98] transition-all disabled:opacity-70 disabled:cursor-not-allowed mt-2"
                    >
                        {loading ? "جاري الحفظ..." : "حفظ القسط"}
                    </button>
                </form>
            </div>
        </div>
    );
}
