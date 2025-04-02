import { GraduationCap } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select"

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

export function CourseCard({ course }) {
  console.log(course);
  
  const isNegativeBalance = course.balance.startsWith("-");

  const handleStatusChange = async (value) => {
    if (value === "Faol") {
      // Firebase'dagi student ma'lumotlarini yangilash
      console.log(course);
      
      const studentRef = ref(database, `Students/${course.studentName}`);
      const groupRef = ref(database, `Groups/${course.groupName}`);

      try {
        // Guruh ma'lumotlarini olish
        const groupSnapshot = await get(groupRef);
        const groupData = groupSnapshot.val();

        if (!groupData) {
          alert("Guruh ma'lumotlari topilmadi!");
          return;
        }

        // Guruh kunlari va narxini olish
        const selectedDays = groupData.days; // Guruh kunlari
        const coursePrice = groupData.price; // Kurs narxi

        // Qolgan dars kunlarini hisoblash
        const now = new Date();
        const remainingDays = selectedDays.filter((day) => {
          const dayDate = new Date(day);
          return dayDate >= now; // Faqat kelajakdagi kunlarni hisoblash
        });

        // Qolgan darslar uchun to'lov summasini hisoblash
        const perClassPrice = coursePrice / selectedDays.length; // Har bir dars narxi
        const totalDeduction = remainingDays.length * perClassPrice; // Qolgan darslar uchun umumiy to'lov

        // Firebase'dagi student ma'lumotlarini yangilash
        await update(studentRef, {
          status: "Faol",
          balance: parseFloat(course.balance) - totalDeduction, // Balansdan yechish
        });

        alert("Status Faol holatga o'tkazildi va balans yangilandi!");
      } catch (error) {
        console.error("Xatolik yuz berdi:", error);
      }
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 space-y-4">
      <div className="flex justify-between items-center">
        <span
          className={`flex items-center gap-1 ${isNegativeBalance ? "text-red-600 bg-red-50" : "text-green-600 bg-green-50"
            } px-2 py-1 rounded-md`}
        >
          <span className="text-lg">E</span>
          <span>{course.balance} so'm</span>
        </span>
        <Select defaultValue="faol" className="w-[120px]" onValueChange={handleStatusChange}>
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

