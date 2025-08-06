import { useEffect, useState } from "react";
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

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const database = getDatabase(app);

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
import { Textarea } from "../../components/ui/textarea";
import { uploadImage, uploadLogo } from "../../uploadImage";
import { Button } from "../../components/ui/button";
import { X } from "lucide-react";
import { AddNotify } from "../../components/ui/Toast";
import { supabase } from "../../supabaseClient";

function Control() {
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

  useEffect(() => {
    const CompanyInfoRef = ref(database, "System/CompanyInfo");

    onValue(CompanyInfoRef, (snapshot) => {
      const data = snapshot.val();
      setCompanyInfo(data || {});
    });
  }, [])

  useEffect(() => {
    setChengeInfo({
      name: CompanyInfo?.name || "",
      number: CompanyInfo?.number || "",
      about: CompanyInfo?.description || "",
      logo: CompanyInfo?.logo || ""
    });
  }, [CompanyInfo]);

  const formatPhoneNumber = (value) => {
    const onlyDigits = value.replace(/\D/g, "").slice(0, 12); // faqat raqamlar va 12 ta belgigacha

    let result = "+998";

    if (onlyDigits.length > 3) result += " " + onlyDigits.slice(3, 5);
    if (onlyDigits.length > 5) result += " " + onlyDigits.slice(5, 8);
    if (onlyDigits.length > 8) result += " " + onlyDigits.slice(8, 10);
    if (onlyDigits.length > 10) result += " " + onlyDigits.slice(10, 12);

    return result;
  };

  const handleFileUpload = async () => {
    const file = ChengeInfo.logo?.target?.files[0];
    if (!ChengeInfo.name || !ChengeInfo.number || !file) {
      alert("Iltimos, barcha maydonlarni to'ldiring!");
      return;
    }

    try {

      const imageUrl = await uploadLogo(file);

      const studentRef = ref(database, `System/CompanyInfo`);

      set(studentRef, {
        name: ChengeInfo.name,
        number: ChengeInfo.number,
        description: ChengeInfo.about,
        logo: imageUrl
      }).then(() => {
        AddNotify({ addTitle: "Kompaniya ma'lumotlari saqlandi!" })
      })
        .catch((err) => {
          console.error("Xatolik:", err);
        });

    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    setOpenImg(false)
  }, [ChengeInfo.logo]);

  const handleUploadImg = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setImage(url);
    setChengeInfo({ ...ChengeInfo, logo: e });
  }

  const handleChengeImage = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      const studentRef = ref(database, `System/CompanyInfo`);

      // Firebase'dan eski rasm URL ni olamiz
      const snapshot = await get(studentRef);
      const oldImageUrl = snapshot.val()?.logo;

      // Agar eski rasm Supabase'dan bo‘lsa — o‘chirib tashlaymiz
      if (oldImageUrl?.includes('supabase.co')) {
        const filePath = oldImageUrl.split('/').pop().split('?')[0]; // Fayl nomini ajratib olamiz
        await supabase.storage.from('companylogobucket').remove([filePath]);
      }

      // Supabase'ga rasmni yuklaymiz
      const imageUrl = await uploadLogo(file);

      // Firebase Realtime Database'dagi studentga rasm linkini yozamiz
      await update(studentRef, { logo: imageUrl })
        .then(() => {
          console.log("Yuklandi!")
        })
        .catch((err) => {
          console.error(err)
        })
    } catch (error) {
      console.error(error);
    }

  }

  return (
    <>

      {openImg && (
        <div className="flex fixed w-full h-screen top-0 left-0 bg-black/50 justify-center items-center z-30" onClick={() => setOpenImg(false)}>
          <X onClick={() => setOpenImg(false)} className="cursor-pointer absolute right-3 top-2 z-50 text-slate-100" />
          <img className="w-[900px] h-[550px]" src={Image} alt="" />
        </div>
      )}

      {Img && (
        <div className="flex fixed w-full h-screen top-0 left-0 bg-black/50 justify-center items-center z-30" onClick={() => setImg(false)}>
          <X onClick={() => setImg(false)} className="cursor-pointer absolute right-3 top-2 z-50 text-slate-100" />
          <img className="h-[550px] object-contain" src={ChengeInfo.logo} alt="" />
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
              <h1 className="text-2xl font-semibold pb-6 border-b border-b-gray-200">
                Kompaniya ma'lumotlari
              </h1>
              <div className="grid grid-cols-2 gap-x-6 gap-y-7">
                <div className="flex flex-col gap-2">
                  <Label htmlFor="name">
                    Kompaniya nomi
                  </Label>
                  <Input
                    id="name"
                    type="text"
                    value={ChengeInfo.name}
                    placeholder="Kompaniya nomi"
                    className={`${style.input} h-[50px]`}
                    onChange={(e) => setChengeInfo({ ...ChengeInfo, name: e.target.value })}
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <Label htmlFor="number">
                    Kompaniya raqami
                  </Label>
                  <Input
                    id="number"
                    type="text"
                    value={formatPhoneNumber(ChengeInfo.number)}
                    placeholder="Kompaniya raqami"
                    className={`${style.input} h-[50px]`}
                    onChange={(e) => setChengeInfo({ ...ChengeInfo, number: e.target.value })}
                  />
                </div>
                <div className="flex flex-col gap-2 relative h-[330px]">
                  <Label htmlFor="about">
                    Kompaniya haqida
                  </Label>
                  <Textarea
                    id="about"
                    maxLength={500}
                    value={ChengeInfo.about}
                    placeholder="Kompaniya haqida"
                    onChange={(e) => setChengeInfo({ ...ChengeInfo, about: e.target.value })}
                    className={`${style.input} h-full rounded-md p-2 resize-none border border-gray-300 text-base`}
                  />
                  <h3 className="absolute right-2 bottom-2 text-gray-400 text-sm">
                    {ChengeInfo.about.length}/500
                  </h3>
                </div>
                {
                  CompanyInfo?.logo === "" ? (
                    <div className="flex flex-col gap-2 h-[330px]">
                      {
                        Image === "" ? (
                          <>
                            <Label htmlFor="file">
                              Kompaniya logotipi
                            </Label>
                            <Label htmlFor="file" className="w-full h-full pb-2 bg-[#e3e3e3] text-[#7e7e7e] cursor-pointer rounded-lg flex flex-col items-center justify-center gap-2 text-lg font-semibold letter-spacing-2 hover:bg-[#e9e9e9] transition-colors duration-200">
                              <FiDownload size={30} />
                              Yuklash
                            </Label>
                            <Input
                              id="file"
                              type="file"
                              className="hidden"
                              onChange={(e) => handleUploadImg(e)}
                            />
                          </>
                        ) : (
                          <img
                            className="w-full h-full"
                            src={Image} alt=""
                            onClick={() => setOpenImg(true)}
                          />
                        )
                      }
                    </div>
                  ) : (
                    <div className="flex flex-col w-full h-[330px] overflow-hidden relative rounded-lg gap-2">
                      <Label>
                        Kompaniya logotipi
                      </Label>
                      <img
                        className={`${style.image} w-full h-full rounded-lg cursor-pointer object-cover`}
                        src={CompanyInfo?.logo}
                        onClick={() => setImg(true)}
                        alt="User image"
                      />
                      <Label
                        className={`${style.chengeImage} bg-black/60 w-full h-2/6 absolute rounded-lg flex justify-center items-center cursor-pointer -bottom-3/6`}
                        htmlFor="file"
                      >
                        <FaCamera size={30} color='#fff' />
                      </Label>
                      <Input
                        id="file"
                        type="file"
                        className="hidden"
                        onChange={(e) => handleChengeImage(e)}
                      />
                    </div>
                  )
                }
              </div>
              <div className="flex col-span-2 justify-end">
                <Button
                  className="w-24 px-2 py-2 bg-blue-900 text-white rounded-md hover:bg-blue-800 transition-colors"
                  onClick={handleFileUpload}
                >
                  Saqlash
                </Button>
              </div>
            </TabsContent>
            <TabsContent value="schedule" className="w-full h-full flex flex-col gap-6">
              <h1 className="text-2xl font-semibold pb-6 border-b border-b-gray-200">
                Ish tartibi
              </h1>
              <p className="text-gray-500 text-lg">
                Ushbu bo'limda kompaniyaning ish tartibini sozlashingiz mumkin.
              </p>
            </TabsContent>
          </Card>
        </Tabs>
      </div>
    </>
  );
}

export default Control;
