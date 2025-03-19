"use client";
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-analytics.js";
import {
  getDatabase,
  ref,
  set,
  onValue,
  update,
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

import { useState, useEffect } from "react";
import { X, Clock, Plus } from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarProvider,
} from "./sidebar";
import { Button } from "./button";
import { Input } from "./input";
import { Checkbox } from "./checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./select";
import { Label } from "./Label";
import { cn } from "../../lib/utils";

const daysOfWeek = [
  { id: "du", label: "Du" },
  { id: "se", label: "Se" },
  { id: "chor", label: "Chor" },
  { id: "pay", label: "Pay" },
  { id: "ju", label: "Ju" },
  { id: "shan", label: "Shan" },
  { id: "yak", label: "Yak" },
];



export function CourseSidebar() {
  const [teachersData, setTeachersData] = useState([]);
  const [roomsData, setRoomsData] = useState([]);
  const [open, setOpen] = useState(false);
  const [selectedDays, setSelectedDays] = useState([]);
  const [isOpen, setIsOpen] = useState(false);

  const handleDayChange = (day) => {
    setSelectedDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission logic here
    console.log("Form submitted");
    setOpen(false);
  };
  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

    useEffect(() => {
      const coursesRef = ref(database, "Teachers");
      onValue(coursesRef, (snapshot) => {
        const data = snapshot.val();
        const teacherData = Object.keys(data).map((key) => ({
          id: key,
          label: key,
          name: data[key].name,
        }));
        setTeachersData(teacherData);
      });

      const coursesRef2 = ref(database, "Rooms");
      onValue(coursesRef2, (snapshot) => {
        const data = snapshot.val();
        const roomData = Object.keys(data).map((key) => ({
          id: key,
          label: key,
          name: data[key].name,
        }));
        setRoomsData(roomData);
      });
    }, []);
   

  return (
    <SidebarProvider>
      <Button
        onClick={() => {
          setOpen(true);
          toggleSidebar();
        }}
        className=" h-10 w-10 rounded-full p-0 border border-blue-500 bg-white hover:bg-blue-50"
        variant="outline"
      >
        <Plus className="h-5 w-5 text-blue-500" />
        <span className="sr-only">Yangi kurs qo'shish</span>
      </Button>
      {isOpen && (
        <div
          className="fixed w-full  h-[100vh] z-30  inset-0 backdrop-blur-sm transition-all duration-900 ease-in-out"
          onClick={() => {
            setOpen(false);
            toggleSidebar();
          }}
        ></div>
      )}
      <Sidebar
        className={cn(
          "fixed inset-y-0 right-0 z-50 w-[400px] border-l border-gray-300 bg-white transition-transform duration-300 ease-in-out",
          open ? "translate-x-0" : "translate-x-full"
        )}
        side="right"
        collapsible="none"
      >
        <SidebarHeader className="flex  items-center justify-between border border-gray-300 p-4">
          <h2 className="text-xl font-semibold">Yangi kurs qo'shish</h2>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => {
              setOpen(false);
              toggleSidebar();
            }}
            className="rounded-full hover:bg-gray-100"
          >
            <X className="h-5 w-5  " />
            <span className="sr-only">Yopish</span>
          </Button>
        </SidebarHeader>

        <SidebarContent>
          <form onSubmit={handleSubmit} className="space-y-6 p-6 text-left ">
            <div className="space-y-6">
              <Label htmlFor="courseName">Kurs nomi</Label>
              <Input
                id="courseName"
                placeholder="Kurs nomini kiriting"
                className="w-full"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="teacher">O'qituvchi</Label>
              <Select>
                <SelectTrigger id="teacher" className="w-full">
                  <SelectValue placeholder="O'qituvchini tanlang..." />
                </SelectTrigger>
                <SelectContent>
                  {teachersData.map((teacher) => (
                    <SelectItem key={teacher.id} value={teacher.id}>
                      {teacher.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="price">Narxi</Label>
              <Input
                id="price"
                placeholder="Narxini kiriting"
                className="w-full"
                required
              />
            </div>

            <div className="space-y-3">
              <Label>Dars kunlari</Label>
              <div className="flex flex-wrap gap-3">
                {daysOfWeek.map((day) => (
                  <div key={day.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={day.id}
                      checked={selectedDays.includes(day.id)}
                      onCheckedChange={() => handleDayChange(day.id)}
                    />
                    <Label
                      htmlFor={day.id}
                      className="text-sm font-normal cursor-pointer"
                    >
                      {day.label}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label>Dars vaqti</Label>
              <div className="grid grid-cols-2 gap-4">
                <div className="relative">
                  <Input type="time" className="w-full pl-10" required />
                  <Clock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
                </div>
                <div className="relative">
                  <Input type="time" className="w-full pl-10" required />
                  <Clock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="room">Xona</Label>
              <Select>
                <SelectTrigger id="room" className="w-full">
                  <SelectValue placeholder="Xonani tanlang..." />
                </SelectTrigger>
                <SelectContent>
                  {roomsData.map((room) => (
                    <SelectItem key={room.id} value={room.id}>
                      {room.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Button
              type="submit"
              className="w-full bg-black hover:opacity-80 text-white"
            >
              Saqlash
            </Button>
          </form>
        </SidebarContent>
      </Sidebar>
    </SidebarProvider>
  );
}
