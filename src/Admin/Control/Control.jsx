"use client"

import { useState } from "react";

import ProfileCard from "../Profile/ProfileCard"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs";
import { Card } from "../../components/ui/card";
import { IoInformationCircleOutline, IoSettingsOutline } from "react-icons/io5";
import { GrSchedule } from "react-icons/gr"
import { TbLockPassword } from "react-icons/tb"
import { ToastContainer } from "react-toastify";
import Schedule from "./components/Schedule";
import Info from "./components/Info";
import Permissions from "./components/Permissions";

function Control() {
  const [TabsValue, setTabsValue] = useState("info")
  return (
    <>

      <ToastContainer />

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
                value="permissions"
                className={`w-full font-medium cursor-pointer hover:bg-slate-100 rounded-md text-gray-700 py-4 text-start flex items-center gap-2 text-lg ${TabsValue === "permissions" ? "px-6 bg-slate-100" : "px-4"}`}
              >
                <IoSettingsOutline size={25} className="text-gray-400" color={TabsValue === "permissions" ? "#02029e" : ""} />
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
          <Card className="h-[85vh] w-[75%] p-5 py-6">
            <TabsContent value="info" className="w-full h-full flex flex-col gap-6 ">
              <Info />
            </TabsContent>
            <TabsContent value="schedule" className="w-full h-full flex flex-col gap-6 overflow-y-scroll">
              <Schedule />
            </TabsContent>
            <TabsContent value="permissions" className="w-full h-full flex flex-col gap-6 overflow-y-auto">
              <Permissions />
            </TabsContent>
          </Card>
        </Tabs>
      </div>
    </>
  );
}

export default Control;
