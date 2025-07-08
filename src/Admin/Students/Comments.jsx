import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {
  getDatabase,
  ref,
  onValue,
  set,
  update,
  push,
  remove,
  get
} from "firebase/database";

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

import style from "./StudentDetail.module.css"

import { Plus } from "lucide-react"
import { Button } from "../../components/ui/button"
import { Card } from "../../components/ui/card"
import { useEffect, useState } from "react";
import { Input } from "../../components/ui/input";

export const Comments = ({ studentInfo }) => {
  const date = new Date().toISOString().split("T")
  const today = date[0] + " " + date[1].slice(0, 5)

  const [coment, setComent] = useState([])
  const [AddComent, setAddComent] = useState(false)
  const [ComentText, setComentText] = useState("")

  useEffect(() => {
    const studentComentRef = ref(database, `Students/${studentInfo.studentName}/comments`)

    onValue(studentComentRef, (snapshot) => {
      const data = snapshot.val()

      setComent(Object.values(data || []))
    })
  }, [])

  const handleAddComent = () => {
    if (ComentText !== " ") {
      const studentComentRef = ref(database, `Students/${studentInfo.studentName}/comments`)

      push(studentComentRef, {
        coment: ComentText,
        time: today
      })
        .then(() => {
          setAddComent(false)
          setComentText("")
        })
        .catch((error) => {
          console.error(error)          
        })
    }
  }

  return (
    <div className="p-6">
      <div className="flex justify-end mb-6">
        <Button className="bg-[#6366F1] hover:bg-[#5558DD] text-white gap-2" onClick={() => setAddComent(true)}>
          <Plus className="h-5 w-5" />
          Yangi eslatma
        </Button>
      </div>
      <div className={`w-full h-[420px] overflow-y-auto ${style.coment}`}>
        <div className="space-y-4 w-[440px] shadow">
          {coment.map((comment) => (
            <Card className="p-4 relative">
              <div className="flex gap-3">
                <div className="w-2 h-2 rounded-full bg-green-500 mt-2" />
                <div className="space-y-1">
                  <p className="text-base">{comment.coment}</p>
                  <p className="text-sm text-gray-500">{comment.time}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
        {
          AddComent && (
            <div className="space-y-4 w-[440px] mt-3 shadow-lg">
              <Card className="p-4 relative flex flex-col gap-[2px]">
                <div className="flex gap-3">
                  <div className="w-2 h-2 rounded-full bg-green-500 mt-2" />
                  <div className="space-y-1">
                    <Input
                      type="text"
                      value={ComentText}
                      placeholder="Eslatma..."
                      className={`${style.input} w-[250px] h-[30px]`}
                      onChange={(e) => setComentText(e.target.value)}
                    />
                    <p className="text-sm text-gray-500">{today}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 self-end">
                  <Button onClick={() => setAddComent(false)} className={`${style.comentCancel} hover:bg-slate-200`}>Bekor qilish</Button>
                  <Button
                    className={`${style.comentCancel} border border-blue-600 text-blue-600 hover:bg-blue-50`}
                    onClick={handleAddComent}
                    disabled={!ComentText}
                  >
                    Qo'shish
                  </Button>
                </div>
              </Card>
            </div>
          )
        }
      </div>
    </div>
  )
}

