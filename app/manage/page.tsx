"use client";
import { useEffect, useState } from "react";
import Installments from "@/components/Installments";
import CustomContainer from "@/ui/CustomContainer";
import { RiMoneyDollarCircleFill } from "react-icons/ri";
import { IoMdAdd } from "react-icons/io";
import AddInstallmentModal from "@/components/AddInstallmentModal";
import { useAuth } from "@/utils/contextapi";
import Image from "next/image";

const ManagePage: React.FC = () => {
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [refreshTrigger, setRefreshTrigger] = useState(0);
    const {userData} =  useAuth();

    const handleSuccess = () => {
        setRefreshTrigger(prev => prev + 1);
    };

    useEffect(() => {
        const Id = userData?.userId;
        if (!Id) {
            location.href = "/";
        }
    }, [userData?.userId]);

    return (
        <section className="py-14 bg-linear-to-br from-blue-50 via-indigo-50 to-purple-50 min-h-screen">
            <CustomContainer>
                {/* Header Section */}
                <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-8">
                    <div className="flex items-center gap-4">
                        <div className="">
                            {/* <RiMoneyDollarCircleFill
                                className="text-main-color"
                                size={32}
                            /> */}
                            <Image
                            src="/icon.jpg"
                            alt=""
                            width={50}
                            height={50}
                            loading="lazy"
                            className="w-14 h-14 rounded-lg"
                            />
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold text-gray-800">إدارة الأقساط</h2>
                            <p className="text-gray-500 text-sm"> أولاد السيد رجب </p>
                        </div>
                    </div>

                    <button
                        onClick={() => setIsAddModalOpen(true)}
                        className="cursor-pointer flex items-center gap-2 bg-main-color text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-600 transition-all shadow-lg shadow-blue-500/30 hover:shadow-blue-500/40 active:scale-95"
                    >
                        <IoMdAdd size={22} />
                        <span>إضافة قسط جديد</span>
                    </button>
                </div>

                {/* Main Content */}
                <Installments refreshTrigger={refreshTrigger} />

                {/* Add Modal */}
                <AddInstallmentModal
                    isOpen={isAddModalOpen}
                    onClose={() => setIsAddModalOpen(false)}
                    onSuccess={handleSuccess}
                />
            </CustomContainer>
        </section>
    );
};

export default ManagePage;