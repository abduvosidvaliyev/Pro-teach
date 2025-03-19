import { GraduationCap } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select"

export function CourseCard({ course }) {
  const isNegativeBalance = course.balance.startsWith("-")

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 space-y-4">
      <div className="flex justify-between   items-center">
        <span
          className={`flex items-center gap-1 ${isNegativeBalance ? "text-red-600 bg-red-50" : "text-green-600 bg-green-50"} px-2 py-1 rounded-md`}
        >
          <span className="text-lg">E</span>
          <span>{course.balance} so'm</span>
        </span>
        <Select defaultValue="faol" className="w-[120px]">
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
  )
}

