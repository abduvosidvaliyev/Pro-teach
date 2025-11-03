import { useState, useEffect } from "react";

import { PaymentItem } from "../../components/ui/payment-item";
import { HistoryItem } from "../../components/ui/history-item";
import imageKnow from "../../assets/dont-know.png";
import { onValueData } from "../../FirebaseData"

export function StudentHistory({ student }) {
    const [studentData, setStudentData] = useState([]); // Student history uchun
    const [paymentHistory, setPaymentHistory] = useState([]); // Payment history uchun

    useEffect(() => {
        // Payment historyni olish
        const unsubscribePayment = onValueData(`Students/${student.studentName}/paymentHistory`, (data) => {
            if (data) {
                setPaymentHistory(data);
            }
        });

        // Student historyni olish
        const unsubscribeHistory = onValueData(`Students/${student.studentName}/studentHistory`, (data) => {
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
