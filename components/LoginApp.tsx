'use client';

import { ChangeEvent, useEffect, useState } from 'react';
import { MdAccountBalance, MdLock, MdVisibility, MdVisibilityOff } from 'react-icons/md';
import { FaMoneyCheckAlt } from 'react-icons/fa';
import api from '@/utils/api';
import { useAuth } from '@/utils/contextapi';
import { useRouter } from 'next/navigation';


export default function LoginApp() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [errors, setErrors] = useState<{ username?: string; password?: string }>({});
    const [showPassword, setShowPassword] = useState(false);
    const [touched, setTouched] = useState<{ username?: boolean; password?: boolean }>({});
    const { login, userData } = useAuth();
    const router = useRouter();


    const validatePassword = (pass: string): string | null => {
        if (pass.length < 8) {
            return 'كلمة المرور يجب أن تكون 8 أحرف على الأقل';
        }
        if (!/[A-Z]/.test(pass)) {
            return 'كلمة المرور يجب أن تحتوي على حرف كبير';
        }
        if (!/[a-z]/.test(pass)) {
            return 'كلمة المرور يجب أن تحتوي على حرف صغير';
        }
        if (!/[0-9]/.test(pass)) {
            return 'كلمة المرور يجب أن تحتوي على رقم';
        }
        return null;
    };

    /**
     * معالج فقدان التركيز - لعرض الأخطاء فقط بعد التفاعل
     */
    const handleBlur = (field: 'username' | 'password') => {
        setTouched({ ...touched, [field]: true });

        const newErrors: { username?: string; password?: string } = { ...errors };

        if (field === 'username' && !username.trim()) {
            newErrors.username = 'اسم المستخدم مطلوب';
        } else if (field === 'username') {
            delete newErrors.username;
        }

        if (field === 'password') {
            const passwordError = validatePassword(password);
            if (passwordError) {
                newErrors.password = passwordError;
            } else {
                delete newErrors.password;
            }
        }

        setErrors(newErrors);
    };

    /**
     * معالج إرسال النموذج
     */
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const newErrors: { username?: string; password?: string } = {};

 
        if (!username.trim()) {
            newErrors.username = 'اسم المستخدم مطلوب';
            return;
        }

      
        const passwordError = validatePassword(password);
        if (passwordError) {
            newErrors.password = passwordError;
            return;
        }

        setErrors(newErrors);
        setTouched({ username: true, password: true });

        try {
            const res = await api.post("/api/Evaluation App/Login", {
                username,
                password
            })

            console.log(res);
            const { personID } = res.data;

            if (personID) {
                login({ userId: Number(personID) });
                window.location.href = "/manage";
            } else {
                console.error("No personID returned from login API");
            }

        } catch (error) {
            console.log(error);
        }

    };

    useEffect(() => {
        const Id = userData?.userId;
        if (Id) {
            router.push("/manage");
        }
    }, [userData?.userId]);


    return (
        <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-blue-50 via-indigo-50 to-purple-50 p-4">
            {/* حاوية النموذج */}
            <div className="w-full max-w-md">
                {/* بطاقة تسجيل الدخول */}
                <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-10 space-y-8 border border-gray-100">
                    {/* الشعار والعنوان */}
                    <div className="text-center space-y-4">
                        {/* أيقونة نظام الأقساط */}
                        <div className="flex justify-center">
                            <div className="relative">
                                <div className="w-24 h-24 bg-main-color rounded-2xl flex items-center justify-center shadow-xl transform rotate-3 transition-transform hover:rotate-6">
                                    <FaMoneyCheckAlt className="w-12 h-12 text-white" />
                                </div>
                                <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center shadow-lg">
                                    <MdAccountBalance className="w-5 h-5 text-white" />
                                </div>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <h1 className="text-3xl md:text-4xl font-bold text-gray-800">
                                نظام إدارة الأقساط
                            </h1>
                            <p className="text-gray-600 text-sm md:text-base">
                                سجّل دخولك لإدارة الأقساط والمدفوعات
                            </p>
                        </div>
                    </div>

                    {/* النموذج */}
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* حقل اسم المستخدم */}
                        <div className="space-y-2">
                            <label htmlFor="username" className="block text-sm font-semibold text-gray-700">
                                اسم المستخدم
                            </label>
                            <div className="relative">
                                <input
                                    id="username"
                                    type="text"
                                    value={username}
                                    onChange={(e) => {
                                        setUsername(e.target.value);
                                        if (touched.username && !e.target.value.trim()) {
                                            setErrors({ ...errors, username: 'اسم المستخدم مطلوب' });
                                        } else if (touched.username) {
                                            const newErrors = { ...errors };
                                            delete newErrors.username;
                                            setErrors(newErrors);
                                        }
                                    }}
                                    onBlur={() => handleBlur('username')}
                                    className={`w-full px-4 py-3.5 pr-12 rounded-xl border-2 transition-all duration-200 outline-none ${touched.username && errors.username
                                        ? 'border-red-500 focus:border-red-600 bg-red-50'
                                        : 'border-gray-300 focus:border-main-color focus:bg-blue-50'
                                        } text-gray-800 placeholder:text-gray-400`}
                                    placeholder="أدخل اسم المستخدم"
                                    dir="rtl"
                                />
                                <MdAccountBalance className={`absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 ${touched.username && errors.username ? 'text-red-500' : 'text-gray-400'
                                    }`} />
                            </div>
                            {touched.username && errors.username && (
                                <p className="text-red-500 text-sm mt-1 text-right flex items-center justify-end gap-1">
                                    <span>{errors.username}</span>
                                    <span className="text-lg">⚠️</span>
                                </p>
                            )}
                        </div>

                        {/* حقل كلمة المرور */}
                        <div className="space-y-2">
                            <label htmlFor="password" className="block text-sm font-semibold text-gray-700">
                                كلمة المرور
                            </label>
                            <div className="relative">
                                <input
                                    id="password"
                                    type={showPassword ? 'text' : 'password'}
                                    value={password}
                                    onChange={(e) => {
                                        setPassword(e.target.value);
                                        if (touched.password) {
                                            const passwordError = validatePassword(e.target.value);
                                            if (passwordError) {
                                                setErrors({ ...errors, password: passwordError });
                                            } else {
                                                const newErrors = { ...errors };
                                                delete newErrors.password;
                                                setErrors(newErrors);
                                            }
                                        }
                                    }}
                                    onBlur={() => handleBlur('password')}
                                    className={`w-full px-4 py-3.5 pr-12 pl-12 rounded-xl border-2 transition-all duration-200 outline-none ${touched.password && errors.password
                                        ? 'border-red-500 focus:border-red-600 bg-red-50'
                                        : 'border-gray-300 focus:border-main-color focus:bg-blue-50'
                                        } text-gray-800 placeholder:text-gray-400`}
                                    placeholder="أدخل كلمة المرور"
                                    dir="rtl"
                                />
                                <MdLock className={`absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 ${touched.password && errors.password ? 'text-red-500' : 'text-gray-400'
                                    }`} />

                                {/* زر إظهار/إخفاء كلمة المرور */}
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
                                >
                                    {showPassword ? (
                                        <MdVisibilityOff className="w-5 h-5" />
                                    ) : (
                                        <MdVisibility className="w-5 h-5" />
                                    )}
                                </button>
                            </div>
                            {touched.password && errors.password && (
                                <p className="text-red-500 text-sm mt-1 text-right flex items-center justify-end gap-1">
                                    <span>{errors.password}</span>
                                    <span className="text-lg">⚠️</span>
                                </p>
                            )}
                        </div>


                        {/* زر تسجيل الدخول */}
                        <button
                            type="submit"
                            className="cursor-pointer w-full bg-main-color text-white py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl hover:bg-blue-600 transform hover:scale-[1.02] transition-all duration-200 active:scale-[0.98]"
                        >
                            تسجيل الدخول
                        </button>
                    </form>
                </div>

                {/* نص تذييلي */}
                <p className="text-center text-gray-600 text-sm mt-6">
                    © 2025 نظام إدارة الأقساط - جميع الحقوق محفوظة
                </p>
            </div>
        </div>
    );
}
