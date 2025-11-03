"use client"

import { useEffect, useState } from "react";

import style from "./Control.module.css";
import ProfileCard from "../Profile/ProfileCard"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs";
import { Card } from "../../components/ui/card";
import { IoInformationCircleOutline, IoSettingsOutline } from "react-icons/io5";
import { GrSchedule } from "react-icons/gr"
import { TbLockPassword } from "react-icons/tb"
import { Label } from "../../components/ui/UiLabel"
import { Input } from "../../components/ui/input"
import { FiDownload } from "react-icons/fi";
import { FaCamera } from "react-icons/fa";
import { FaPencil } from "react-icons/fa6";
import { Textarea } from "../../components/ui/textarea";
import { uploadLogo } from "../../uploadImage";
import { Button } from "../../components/ui/button";
import { X } from "lucide-react";
import { AddNotify } from "../../components/ui/Toast";
import { onValueData, setData } from "../../FirebaseData";
import { ToastContainer } from "react-toastify";
import { Table, TableBody, TableCell, TableHeader } from "../../components/ui/table"
import { TableRow, TableHead } from "../../components/ui/table";
import Schedule from "./components/schedule";
import Info from "./components/Info";

function Control() {
  const [Lessondays, setLessondays] = useState([])
  const [CompanyInfo, setCompanyInfo] = useState([])
  const [ChengeInfo, setChengeInfo] = useState({
    name: "",
    number: "",
    about: "",
    logo: ""
  })
  const [openImg, setOpenImg] = useState(false);
  const [Img, setImg] = useState(false);
  const [TabsValue, setTabsValue] = useState("info")
  const [Image, setImage] = useState("")


  return (
    <>

      <ToastContainer />

      {openImg && (
        <div className="flex fixed w-full h-screen top-0 left-0 bg-black/50 justify-center items-center z-30" onClick={() => setOpenImg(false)}>
          <X onClick={() => setOpenImg(false)} className="cursor-pointer absolute right-3 top-2 z-50 text-slate-100" />
          <img className="w-[50%] h-[550px]" src={Image} alt="" />
        </div>
      )}

      {Img && (
        <div className="flex fixed w-full h-screen top-0 left-0 bg-black/50 justify-center items-center z-30" onClick={() => setImg(false)}>
          <X onClick={() => setImg(false)} className="cursor-pointer absolute right-3 top-2 z-50 text-slate-100" />
          <img className="h-[550px] object-cover" src={ChengeInfo.logo} alt="" />
        </div>
      )}

      <div
        className="px-5 pl-7 py-5 flex flex-col gap-5 items-start"
        style={{
          marginLeft: "var(--sidebar-width, 250px)",
          width: "var(--sidebar-width), 100%",
          transition: "all 0.5s ease, background 0.3s ease, width 0.5s ease",
        }}
      >
        <nav className="w-full flex justify-between">
          <h3 className="text-3xl">
            Sozlamalar
          </h3>
          <ProfileCard />
        </nav>
        <Tabs
          className="w-full flex items-start gap-5"
          defaultValue="info"
          onValueChange={(e) => setTabsValue(e)}
          value={TabsValue}
        >
          <Card className="h-[85vh] w-[25%]">
            <TabsList className="w-full h-full flex-col items-start justify-start px-2 py-3 bg-transparent">
              <TabsTrigger
                value="info"
                className={`w-full text-start cursor-pointer hover:bg-slate-100 rounded-md flex items-center py-4 font-medium text-gray-700 gap-2 text-lg ${TabsValue === "info" ? "px-6 bg-slate-100" : "px-4"}`}
              >
                <IoInformationCircleOutline size={25} className="text-gray-400" color={TabsValue === "info" ? "#02029e" : ""} />
                Kompaniya ma'lumotlari
              </TabsTrigger>
              <TabsTrigger
                value="schedule"
                className={`w-full font-medium cursor-pointer hover:bg-slate-100 rounded-md text-gray-700 py-4 text-start flex items-center gap-2 text-lg ${TabsValue === "schedule" ? "px-6 bg-slate-100" : "px-4"}`}
              >
                <GrSchedule size={20} className="text-gray-400" color={TabsValue === "schedule" ? "#02029e" : ""} />
                Ish tartibi
              </TabsTrigger>
              <TabsTrigger
                value="permission"
                className={`w-full font-medium cursor-pointer hover:bg-slate-100 rounded-md text-gray-700 py-4 text-start flex items-center gap-2 text-lg ${TabsValue === "permission" ? "px-6 bg-slate-100" : "px-4"}`}
              >
                <IoSettingsOutline size={25} className="text-gray-400" color={TabsValue === "permission" ? "#02029e" : ""} />
                Ruxsatlar
              </TabsTrigger>
              <TabsTrigger
                value="pasword"
                className={`w-full font-medium cursor-pointer hover:bg-slate-100 rounded-md text-gray-700 py-4 text-start flex items-center gap-2 text-lg ${TabsValue === "pasword" ? "px-6 bg-slate-100" : "px-4"}`}
              >
                <TbLockPassword size={25} className="text-gray-400" color={TabsValue === "pasword" ? "#02029e" : ""} />
                Parol
              </TabsTrigger>
            </TabsList>
          </Card>
          <Card className="h-[85vh] w-[75%] p-5">
            <TabsContent value="info" className="w-full h-full flex flex-col gap-6 ">
              <Info setOpenImg={setOpenImg} setImg={setImg} setImage={setImage} Image={Image}/>
            </TabsContent>
            <TabsContent value="schedule" className="w-full h-full flex flex-col gap-6">
              <Schedule />
            </TabsContent>
          </Card>
        </Tabs>
      </div>
    </>
  );
}

export default Control;
