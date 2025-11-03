import { FaCamera } from "react-icons/fa"
import { FiDownload } from "react-icons/fi"
import { Button } from "../../../components/ui/button"
import { Input } from "../../../components/ui/input"
import { Textarea } from "../../../components/ui/textarea"
import { Label } from "../../../components/ui/UiLabel"
import style from "../Control.module.css"
import { onValueData, setData } from "../../../FirebaseData"
import { AddNotify } from "../../../components/ui/Toast"
import { uploadLogo } from "../../../uploadImage"
import { useEffect, useState } from "react"
import { X } from "lucide-react"

const Info = () => {

    const [CompanyInfo, setCompanyInfo] = useState([])
    const [ChengeInfo, setChengeInfo] = useState({
        name: "",
        number: "",
        about: "",
        logo: ""
    })
    const [click, setclick] = useState(false)
    const [openImg, setOpenImg] = useState(false);
    const [Img, setImg] = useState(false);
    const [Image, setImage] = useState("")

    useEffect(() => {
        onValueData("System/CompanyInfo", (data) => {
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
        const file = ChengeInfo.logo;

        if (!ChengeInfo.name || !ChengeInfo.number) {
            alert("Iltimos, barcha maydonlarni to'ldiring!");
            return;
        }

        try {
            let imageUrl = CompanyInfo?.logo; // default — eski logo

            // faqat yangi fayl bo‘lsa upload qilinadi
            if (file && file instanceof File) {
                imageUrl = await uploadLogo(file);
            }

            await setData("System/CompanyInfo", {
                name: ChengeInfo.name,
                number: ChengeInfo.number,
                description: ChengeInfo.about,
                logo: imageUrl,

            });

            AddNotify({ addTitle: "Kompaniya ma'lumotlari saqlandi!" });
            setclick(true);
        } catch (err) {
            console.error("Xatolik:", err);
        }
    };

    useEffect(() => {
        setOpenImg(false)
    }, [ChengeInfo.logo]);

    // kompaniyaning tanlangan logosoni korish
    const handleUploadImg = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const url = URL.createObjectURL(file);
        setImage(url);
        setChengeInfo({ ...ChengeInfo, logo: file });
    }

    // saqlash buttonini ochishni tekshirish
    const handleCheck = (e) => {
        if (e.target.value !== CompanyInfo?.name || CompanyInfo?.number || CompanyInfo?.description || CompanyInfo?.logo) {
            setclick(true)
        } else {
            setclick(false)
        }
    }


    return (
        <>

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
                        onChange={(e) => (setChengeInfo({ ...ChengeInfo, name: e.target.value }), handleCheck(e))}
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
                        onChange={(e) => (setChengeInfo({ ...ChengeInfo, number: e.target.value }), handleCheck(e))}
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
                        onChange={(e) => (setChengeInfo({ ...ChengeInfo, about: e.target.value }), handleCheck(e))}
                        className={`${style.input} h-full rounded-md p-2 resize-none border border-gray-300 text-base`}
                    />
                    <h3 className="absolute right-2 bottom-2 text-gray-400 text-sm">
                        {ChengeInfo.about.length}/500
                    </h3>
                </div>
                {
                    CompanyInfo?.logo === "" ? (
                        <div className="flex flex-col gap-2 justify-end h-[330px]">
                            <Label htmlFor="file">
                                Kompaniya logotipi
                            </Label>
                            {
                                Image === "" ? (
                                    <>
                                        <Label htmlFor="file" className="w-full h-full pb-2 text-[#7e7e7e] cursor-pointer rounded-lg flex flex-col items-center justify-center gap-2 text-lg font-semibold letter-spacing-2 hover:bg-[#f4f4f4] transition-colors duration-200 border-2 border-dashed border-gray-300">
                                            <FiDownload size={30} />
                                            Yuklash
                                        </Label>
                                        <Input
                                            id="file"
                                            type="file"
                                            className="hidden"
                                            onChange={(e) => (handleUploadImg(e), handleCheck(e))}
                                        />
                                    </>
                                ) : (
                                    <div className="flex flex-col w-full h-[330px] overflow-hidden relative rounded-lg gap-2">
                                        <img
                                            className={`${style.image} w-full h-full cursor-pointer object-cover rounded-xl`}
                                            src={Image} alt=""
                                            onClick={() => setOpenImg(true)}
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
                                            onChange={(e) => (handleUploadImg(e), handleCheck(e))}
                                        />
                                    </div>
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
                                src={Image ? Image : CompanyInfo?.logo}
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
                                onChange={(e) => (handleUploadImg(e), handleCheck(e))}
                            />
                        </div>
                    )
                }
            </div>
            <div className="flex col-span-2 justify-end">
                <Button
                    className={`w-24 px-2 py-2 bg-blue-900 text-white rounded-md transition-colors`}
                    onClick={handleFileUpload}
                    disabled={!click}
                >
                    Saqlash
                </Button>
            </div>
        </>
    )
}

export default Info