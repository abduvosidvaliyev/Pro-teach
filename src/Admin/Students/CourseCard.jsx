import { GraduationCap } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select"
import { useState, useEffect } from "react";

import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-analytics.js";
import {
  getDatabase,
  ref,
  set,
  onValue,
  update,
  get,
  remove,
} from "https://www.gstatic.com/firebasejs/11.0.2/firebase-database.js";

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
const analytics = getAnalytics(app);
const database = getDatabase(app);

const countWeekdaysInMonth = (selectedDays) => {
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth();
  const lastDay = new Date(year, month + 1, 0).getDate();

  const dayMapping = {
    yak: 0, // Yakshanba
    du: 1,  // Dushanba
    se: 2,  // Seshanba
    chor: 3, // Chorshanba
    pay: 4, // Payshanba
    ju: 5,  // Juma
    sha: 6, // Shanba
  };

  let count = {};
  selectedDays.forEach((day) => {
    count[day] = 0; // Har bir kun uchun boshlang'ich qiymat
  });

  for (let day = 1; day <= lastDay; day++) {
    const date = new Date(year, month, day);
    const weekday = date.getDay();

    // Agar kun `selectedDays` ichida bo'lsa, hisoblash
    for (const [key, value] of Object.entries(dayMapping)) {
      if (selectedDays.includes(key) && weekday === value) {
        count[key]++;
      }
    }
  }

  return count;
};

const countWeekdaysToEndOfMonth = (selectedDays) => {
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth();
  const lastDay = new Date(year, month + 1, 0).getDate();

  const dayMapping = {
    yak: 0, // Yakshanba
    du: 1,  // Dushanba
    se: 2,  // Seshanba
    chor: 3, // Chorshanba
    pay: 4, // Payshanba
    ju: 5,  // Juma
    sha: 6, // Shanba
  };

  let count = {};
  selectedDays.forEach((day) => {
    count[day] = 0; // Har bir kun uchun boshlang'ich qiymat
  });

  for (let day = today.getDate(); day <= lastDay; day++) {
    const date = new Date(year, month, day);
    const weekday = date.getDay();

    // Agar kun `selectedDays` ichida bo'lsa, hisoblash
    for (const [key, value] of Object.entries(dayMapping)) {
      if (selectedDays.includes(key) && weekday === value) {
        count[key]++;
      }
    }
  }

  return count;
};

export function CourseCard({ course }) {
  const [status, setStatus] = useState("Nofaol" ); // Default qiymat
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth()); // Hozirgi oy

  useEffect(() => {
    const studentRef = ref(database, `Students/${course.studentName}`);
    get(studentRef)
      .then((snapshot) => {
        if (snapshot.exists()) {
          const studentData = snapshot.val();
          console.log("Fetched status from Firebase:", studentData.status); // Qo'shimcha log
          setStatus(studentData.status || "Nofaol"); // Firebase-dan statusni olish
        } else {
          console.error("Student data not found in Firebase.");
        }
      })
      .catch((error) => {
        console.error("Error fetching student status:", error);
      });
  }, [course.studentName]);
  console.log(course);

  // Safely determine the balance value
  const balanceValue = course.balance; // To'g'ridan-to'g'ri balance qiymatini ishlatamiz

  const isNegativeBalance =
    typeof balanceValue === "string"
      ? balanceValue.startsWith("-")
      : balanceValue < 0; // Raqam yoki string bo'lsa, salbiyligini tekshiring

  // Yangi oyga o'tganda avtomatik to'lovni amalga oshirish
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date(); // Hozirgi vaqtni olish
      const newMonth = now.getMonth(); // Hozirgi oyni olish

      if (newMonth !== currentMonth) {
        setCurrentMonth(newMonth); // Oyni yangilash

        // Barcha o'quvchilarni tekshirish
        const studentsRef = ref(database, `Students`);
        get(studentsRef)
          .then((snapshot) => {
            if (snapshot.exists()) {
              const studentsData = snapshot.val();

              // Har bir o'quvchini tekshirish
              Object.entries(studentsData).forEach(([studentName, studentData]) => {
                if (studentData.status === "Faol") {
                  const currentBalance = studentData.balance || 0;
                  const groupName = studentData.group;

                  if (!groupName) {
                    console.error(`Group name not found for student: ${studentName}`);
                    return;
                  }

                  // Guruh ma'lumotlarini olish
                  const groupRef = ref(database, `Groups/${groupName}`);
                  get(groupRef)
                    .then((groupSnapshot) => {
                      if (groupSnapshot.exists()) {
                        const groupData = groupSnapshot.val();
                        const courseFee = groupData.price || 0;

                        const updatedBalance = currentBalance - courseFee;
                        console.log(
                          `Auto-deduction for ${studentName}: ${courseFee}`
                        );
                        console.log(
                          `Updated Balance for ${studentName}: ${updatedBalance}`
                        );

                        // Firebase-ni yangilash
                        const studentRef = ref(
                          database,
                          `Students/${studentName}`
                        );
                        update(studentRef, { balance: updatedBalance })
                          .then(() => {
                            console.log(
                              `Balance updated for ${studentName} for new month.`
                            );
                          })
                          .catch((error) => {
                            console.error(
                              `Error updating balance for ${studentName}:`,
                              error
                            );
                          });
                      } else {
                        console.error(
                          `Group data not found for group: ${groupName}`
                        );
                      }
                    })
                    .catch((error) => {
                      console.error(
                        `Error fetching group data for group: ${groupName}`,
                        error
                      );
                    });
                }
              });
            } else {
              console.error("No students found in Firebase.");
            }
          })
          .catch((error) => {
            console.error("Error fetching students data:", error);
          });
      }
    }, 1000 * 60 * 60); // Har bir soatda tekshirish

    return () => clearInterval(interval); // Komponent unmount bo'lganda intervalni tozalash
  }, [currentMonth]);

  const handleStatusChange = (value) => {
    const studentRef = ref(database, `Students/${course.studentName}`);
  
    if (value === "Faol") {
      // Studentning statusini Firebase-da yangilash
      update(studentRef, { status: "Faol" })
        .then(() => {
          console.log("Student status updated to Faol in Firebase.");
          setStatus("Faol"); // Mahalliy state-ni ham yangilash
        })
        .catch((error) => {
          console.error("Error updating student status in Firebase:", error);
        });
  
      // Qo'shimcha hisob-kitoblar (agar kerak bo'lsa)
      get(studentRef)
        .then((snapshot) => {
          if (snapshot.exists()) {
            const studentData = snapshot.val();
            const currentBalance = studentData.balance;
            const groupName = studentData.group;
  
            if (!groupName) {
              console.error("Group name not found for the student.");
              return;
            }
  
            // Guruh ma'lumotlarini olish
            const groupRef = ref(database, `Groups/${groupName}`);
            get(groupRef)
              .then((groupSnapshot) => {
                if (groupSnapshot.exists()) {
                  const groupData = groupSnapshot.val();
                  const selectedDays = groupData.selectedDays || [];
  
                  console.log("Selected Days from Group:", selectedDays);
                  console.log("Current Balance:", currentBalance);
  
                  // Hisob-kitoblar
                  const totalLessonDays = countWeekdaysInMonth(selectedDays);
                  const totalLessonDaysCount = Object.values(totalLessonDays).reduce(
                    (sum, count) => sum + count,
                    0
                  );
  
                  const perLessonCost = 400000 / totalLessonDaysCount;
                  const remainingLessonDays = countWeekdaysToEndOfMonth(selectedDays);
                  const remainingLessonDaysCount = Object.values(remainingLessonDays).reduce(
                    (sum, count) => sum + count,
                    0
                  );
  
                  const totalDeduction = Math.round(
                    perLessonCost * remainingLessonDaysCount
                  );
                  const updatedBalance = currentBalance - totalDeduction;
  
                  console.log("Total Deduction:", totalDeduction);
                  console.log("Updated Balance:", updatedBalance);
  
                  // Balansni yangilash
                  update(studentRef, { balance: updatedBalance })
                    .then(() =>
                      console.log(
                        `Balance updated successfully. Deducted: ${totalDeduction}, Remaining Balance: ${updatedBalance}`
                      )
                    )
                    .catch((error) =>
                      console.error("Error updating balance:", error)
                    );
                } else {
                  console.error("Group data not found in Firebase.");
                }
              })
              .catch((error) => {
                console.error("Error fetching group data:", error);
              });
          } else {
            console.error("Student data not found in Firebase.");
          }
        })
        .catch((error) => {
          console.error("Error fetching student data:", error);
        });
    } else {
      // Agar boshqa status tanlansa, faqat statusni yangilash
      update(studentRef, { status: value })
        .then(() => {
          console.log(`Student status updated to ${value} in Firebase.`);
          setStatus(value); // Mahalliy state-ni ham yangilash
        })
        .catch((error) => {
          console.error("Error updating student status in Firebase:", error);
        });
    }
  };
  

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 space-y-4">
      <div className="flex justify-between items-center">
        <span
          className={`flex items-center gap-1 ${
            isNegativeBalance ? "text-red-600 bg-red-50" : "text-green-600 bg-green-50"
          } px-2 py-1 rounded-md`}
        >
          <span className="text-lg">E</span>
          <span>{balanceValue} so'm</span> {/* Bu yerda faqat string yoki raqam render qilinadi */}
        </span>
        <Select
          value={status} // `defaultValue` o'rniga `value` ishlatamiz
          className="w-[120px]"
          onValueChange={handleStatusChange}
        >
          <SelectTrigger className="w-[120px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Faol">Faol</SelectItem>
            <SelectItem value="Muzlatish">Muzlatish</SelectItem>
            <SelectItem value="Nofaol">Nofaol</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex justify-between items-start">
        <h2 className="text-2xl font-semibold">{course.name}</h2>
        <span className="text-xl">0</span>
      </div>

      <div className="space-y-3">
        <div>
          <div className="text-sm text-gray-500">Guruh intervali :</div>
          <div>{course.dateRange}</div>
        </div>

        <div className="flex items-center gap-2">
          <GraduationCap className="text-green-600" />
          <span>{course.teacher}</span>
        </div>

        <div>
          <div className="text-sm text-gray-500">Dars kunlari :</div>
          <div>{course.time}</div>
        </div>

        <div className="flex flex-wrap gap-2">
          {course.days.map((day) => (
            <span key={day} className="bg-gray-200 px-3 py-1 rounded-full text-sm">
              {day}
            </span>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <div className="text-sm text-gray-500">Boshlangan sana</div>
            <div className="text-green-600">{course.startDate}</div>
          </div>
          <div>
            <div className="text-sm text-gray-500">O'chiriladigan sana</div>
            <div className="text-red-600">{course.endDate}</div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <div className="text-sm text-gray-500">Keyingi to'lov</div>
            <div>{course.nextPayment}</div>
          </div>
          <div>
            <div className="text-sm text-gray-500">To'lov narxi</div>
            <div className="text-green-600">{course.paymentAmount} so'm</div>
          </div>
        </div>
      </div>
    </div>
  );
}

