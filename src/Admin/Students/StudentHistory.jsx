import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {
    getDatabase,
    ref,
    onValue,
    set,
    update,
    get
} from "firebase/database";

import React, { useState, useEffect } from "react";

import { PaymentItem } from "../../components/ui/payment-item";
import { HistoryItem } from "../../components/ui/history-item";
import imageKnow from "../../assets/dont-know.png";

const firebaseConfig = {
    apiKey: "AIzaSyC94X37bt_vhaq5sFVOB_ANhZPuE6219Vo",
    authDomain: "project-pro-7f7ef.firebaseapp.com",
    databaseURL: "https://project-pro-7f7ef-default-rtdb.firebaseio.com",
    projectId: "project-pro-7f7ef",
    storageBucket: "project-pro-7f7ef.firebasestorage.app",
    messagingSenderId: "782106516432",
    appId: "1:782106516432:web:d4cd4fb8dec8572d2bb7d5",
    measurementId: "G-WV8HFBFPND",
};

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

export function StudentHistory({ student }) {
    const [studentData, setStudentData] = useState([]); // Student history uchun
    const [paymentHistory, setPaymentHistory] = useState([]); // Payment history uchun

    useEffect(() => {
        // Payment historyni olish
        const paymentRef = ref(database, `Students/${student.studentName}/paymentHistory`);
        const unsubscribePayment = onValue(paymentRef, (snapshot) => {
            const data = snapshot.val();
            if (data) {
                setPaymentHistory(data);
            }
        });

        // Student historyni olish
        const historyRef = ref(database, `Students/${student.studentName}/studentHistory`);
        const unsubscribeHistory = onValue(historyRef, (snapshot) => {
            const data = snapshot.val();
            if (data) {
                setStudentData(data); // studentHistory ma'lumotlarini saqlash
            }
        });

        // Cleanup funksiyasi
        return () => {
            unsubscribePayment();
            unsubscribeHistory();
        };
    }, [student.studentName]);

    return (
        <div className="p-6">
            <div className="md:col-span-2">
                {/* Student history */}
                <div className="bg-white rounded-lg shadow p-4 mb-4">
                    <h3 className="font-medium mb-4">O'quvchi tarixi</h3>
                    <div className="space-y-6">
                        {studentData && studentData.map((item, index) => (
                            <HistoryItem
                                key={index}
                                date={item.date}
                                title={item.title}
                                description={item.description}
                            />
                        ))}
                    </div>
                </div>

                {/* Payment history */}
                <div className="bg-white rounded-lg shadow p-4">
                    <h3 className="font-medium mb-4">To'lovlar tarixi</h3>
                    <div className="space-y-4">
                        {paymentHistory.length > 0 ? (
                            paymentHistory.map((payment, index) => (
                                <PaymentItem
                                    key={index}
                                    date={payment.date}
                                    amount={payment.amount}
                                    status={payment.status}
                                    method={payment.description}
                                />
                            ))
                        ) : (
                            <div className="flex flex-col items-center justify-center">
                                <img src={imageKnow} alt="No data" className="w-40 h-40" />
                                <p className="text-gray-500 mt-4">To'lovlar tarixi mavjud emas</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default StudentHistory;
