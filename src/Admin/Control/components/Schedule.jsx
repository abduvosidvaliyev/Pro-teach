import { useEffect, useState } from "react"
import { onValueData, setData } from "../../../FirebaseData"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../../components/ui/table"
import { FaPencil, FaPlus, FaTrash } from "react-icons/fa6"
import { Button } from "../../../components/ui/button"
import { Sidebar, SidebarContent, SidebarHeader, SidebarProvider } from "../../../components/ui/sidebar"
import { X } from "lucide-react"
import { Label } from "../../../components/ui/UiLabel"
import { Input } from "../../../components/ui/input"
import { Textarea } from "../../../components/ui/textarea"
import { AddNotify, ChengeNotify } from "../../../components/ui/Toast"

const Schedule = () => {
    const [Lessondays, setLessondays] = useState([])
    const [SelectedDay, setSelectedDay] = useState([])
    const [LessonTimes, setLessonTimes] = useState([])
    const [OpenSidebar, setOpenSidebar] = useState(false)
    const [click, setclick] = useState(false)
    const [addTime, setaddTime] = useState(false)
    const [newTime, setnewTime] = useState("")
    const [changeTime, setchangeTime] = useState("")
    const [changeTimeModal, setChangeTimeModal] = useState(false)

    useEffect(() => {
        onValueData("System/LessonDays", (data) => {
            setLessondays(Object.values(data || {}))
        })
        onValueData("LessonTimes", (data) => {
            setLessonTimes(Object.values(data || {}))
        })
    }, [])

    const handleSelectDay = (day) => {
        const selectedDay = Lessondays.find(days => days.day === day)

        setSelectedDay(selectedDay)
    }

    const handleChangeDay = (day) => {
        handleSelectDay(day)
        setOpenSidebar(true)
    }

    const hanldeSaveDay = (e) => {
        e.preventDefault()
        setData(`System/LessonDays/${SelectedDay.day}`, SelectedDay)
            .then(() => {
                setOpenSidebar(false)
                ChengeNotify({ ChengeTitle: "Muvaffaqiyatli o'zgartirildi!" })
            })
    }

    const handleCheck = (e) => {
        if (e.target.value !== SelectedDay.startWork || SelectedDay.finishWork || SelectedDay.abreakStart || SelectedDay.abreakFinish || SelectedDay.description) {
            setclick(true)
        } else {
            setclick(false)
        }
    }

    const handleAddTime = () => {
        console.log(newTime);

        const updatedTimes = [...LessonTimes, newTime];
        setData("LessonTimes", updatedTimes)
            .then(() => {
                setaddTime(false);
                AddNotify({ AddTitle: "Dars vaqti muvaffaqiyatli qo'shildi!" });
            })
            .catch((error) => {
                console.error("Error adding lesson time: ", error);
            });
    }

    const handleChangeTime = (index) => {
        setData(`LessonTimes/${index}`, changeTime)
            .then(() => {
                setChangeTimeModal(false);
                setchangeTime("");
                ChengeNotify({ ChengeTitle: "Dars vaqti muvaffaqiyatli o'zgartirildi!" });
            })
            .catch((error) => {
                console.error("Error updating lesson time: ", error);
            });
    }

    return (
        <>
            <SidebarProvider>
                {
                    OpenSidebar && (
                        <div
                            className="fixed w-full h-[100vh] z-30  inset-0 backdrop-blur-[2px] bg-black/50 transition-all duration-900 ease-in-out"
                            onClick={() => {
                                setOpenSidebar(false);
                            }}
                        ></div>
                    )
                }
                <Sidebar
                    className={`fixed inset-y-0 right-0 z-50 w-[400px] border-l border-gray-300 bg-white transition-transform duration-300 ease-in-out ${OpenSidebar ? "translate-x-0" : "translate-x-full"}`}
                    side="right"
                >
                    <SidebarHeader className="flex items-center justify-between border border-gray-300 p-4">
                        <h2 className="text-lg font-normal">Ma'lumotlarni o'zgartirish</h2>
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setOpenSidebar(false)}
                            className="rounded-full hover:bg-gray-100"
                        >
                            <X className="h-5 w-5" />
                        </Button>
                    </SidebarHeader>

                    <SidebarContent className="flex flex-col gap-4 p-4">
                        <h3 className="text-xl font-semibold">
                            {SelectedDay.day}
                        </h3>
                        <form className="flex flex-col gap-4 p-4">
                            <Label htmlFor="workTime" className="flex flex-col gap-2">
                                <span>
                                    Ish vaqti
                                </span>
                                <div className="flex items-center justify-start gap-2">
                                    <Input
                                        id="workTime"
                                        type="time"
                                        className="w-auto"
                                        value={SelectedDay.startWork}
                                        onChange={(e) => { setSelectedDay({ ...SelectedDay, startWork: e.target.value }), handleCheck(e) }}
                                    />
                                    <span className="text-xl">
                                        -
                                    </span>
                                    <Input
                                        type="time"
                                        className="w-auto"
                                        value={SelectedDay.finishWork}
                                        onChange={(e) => { setSelectedDay({ ...SelectedDay, finishWork: e.target.value }), handleCheck(e) }}
                                    />
                                </div>
                            </Label>
                            <Label htmlFor="abreakTime" className="flex flex-col gap-2">
                                <span>
                                    Tanaffus
                                </span>
                                <div className="flex items-center justify-start gap-2">
                                    <Input
                                        id="abreakTime"
                                        type="time"
                                        className="w-auto"
                                        value={SelectedDay.abreakStart}
                                        onChange={(e) => { setSelectedDay({ ...SelectedDay, abreakStart: e.target.value }), handleCheck(e) }}
                                    />
                                    <span className="text-xl">
                                        -
                                    </span>
                                    <Input
                                        type="time"
                                        className="w-auto"
                                        value={SelectedDay.abreakFinish}
                                        onChange={(e) => { setSelectedDay({ ...SelectedDay, abreakFinish: e.target.value }), handleCheck(e) }}
                                    />
                                </div>
                            </Label>
                            <Label htmlFor="description" className="flex flex-col gap-2">
                                <span>
                                    Izoh
                                </span>
                                <Textarea
                                    id="description"
                                    placeholder="Izoh kiriting"
                                    className="h-32 resize-none border-gray-300"
                                    value={SelectedDay.description}
                                    onChange={(e) => { setSelectedDay({ ...SelectedDay, description: e.target.value }), handleCheck(e) }}
                                >
                                </Textarea>
                            </Label>
                            <div className="flex items-center gap-4 justify-end">
                                <Button
                                    className="border-1 border-solid"
                                    onClick={(e) => { e.preventDefault(), handleSelectDay(SelectedDay.day) }}
                                >
                                    Bekor qilish
                                </Button>
                                <Button
                                    className="bg-[#1c398e] text-white"
                                    onClick={(e) => hanldeSaveDay(e)}
                                    disabled={!click}
                                >
                                    Saqlash
                                </Button>
                            </div>
                        </form>
                    </SidebarContent>
                </Sidebar>
            </SidebarProvider>

            <h1 className="text-2xl font-semibold pb-6 border-b border-b-gray-200">
                Ish tartibi
            </h1>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Kun</TableHead>
                        <TableHead>Ish vaqti</TableHead>
                        <TableHead>Tanaffus</TableHead>
                        <TableHead>Izoh</TableHead>
                        <TableHead>Amallar</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {Lessondays.length > 0 ? (
                        Lessondays
                            .sort((a, b) => {
                                const days = ["Dushanba", "Seshanba", "Chorshanba", "Payshanba", "Juma", "Shanba", "Yakshanba"];
                                return days.indexOf(a.day) - days.indexOf(b.day);
                            })
                            .map((day, index) => {
                                return (
                                    <TableRow key={index}>
                                        <TableCell className="font-semibold">{day.day}</TableCell>
                                        {
                                            (day.startWork || day.finishWork || day.abreakFinish || day.abreakStart) !== ""
                                                ? (
                                                    <>
                                                        <TableCell>{day.startWork} - {day.finishWork}</TableCell>
                                                        <TableCell>{day.abreakStart} - {day.abreakFinish}</TableCell>
                                                    </>
                                                )
                                                : <TableCell colSpan={2} className="text-center">Yopiq</TableCell>
                                        }
                                        <TableCell
                                            className="cursor-default"
                                            title={day.description || ""}
                                        >
                                            {
                                                day.description === "" ? "_"
                                                    : day.description.length < 30 ? day.description
                                                        : day.description.slice(0, 30) + "..."
                                            }
                                        </TableCell>
                                        <TableHead>
                                            <Button
                                                className="text-yellow-400 bg-yellow-200/60 text-sm hover:bg-yellow-200/90 flex items-center gap-1"
                                                onClick={() => handleChangeDay(day.day)}
                                            >
                                                <FaPencil />
                                                <span>
                                                    O'zgartirish
                                                </span>
                                            </Button>
                                        </TableHead>
                                    </TableRow>
                                );
                            })
                    ) : (
                        <TableRow>
                            <TableCell colSpan={6} className="text-center">
                                Ma’lumot topilmadi
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
            <div className="flex w-full items-center justify-between">
                <h1 className="text-xl font-bold mt-5">
                    Dars vaqtlari
                </h1>
                <Button
                    className="text-white bg-blue-600/70 text-sm hover:bg-blue-600/90 flex items-center gap-1"
                    onClick={() => setaddTime(true)}
                >
                    <FaPlus />
                    <span>
                        Qo'shish
                    </span>
                </Button>
            </div>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Darslarning boshlanish vaqti</TableHead>
                        <TableHead>Amallar</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {LessonTimes.length > 0 ? (
                        LessonTimes
                            .sort((a, b) => {
                                return a.localeCompare(b);
                            })
                            .map((time, index) => {
                                return (
                                    <TableRow key={index}>
                                        <TableCell className="font-semibold">
                                            {
                                                changeTimeModal === index ? (
                                                    <Input
                                                        type="time"
                                                        className="w-auto"
                                                        autoFocus
                                                        defaultValue={time}
                                                        onChange={(e) => setchangeTime(e.target.value)}
                                                        onKeyDown={(e) => e.key === "Enter" ? handleChangeTime(index) : e.key === "Escape" ? setChangeTimeModal(false) : null}
                                                    />
                                                ) : time
                                            }
                                        </TableCell>
                                        <TableHead className="flex items-center gap-2" >
                                            <Button
                                                className="text-yellow-400 bg-yellow-200/60 text-sm hover:bg-yellow-200/90 flex items-center gap-1"
                                                onClick={() => setChangeTimeModal(index)}
                                                disabled={changeTimeModal === index}
                                            >
                                                <FaPencil />
                                                <span>
                                                    O'zgartirish
                                                </span>
                                            </Button>
                                        </TableHead>
                                    </TableRow>
                                );
                            })
                    ) : (
                        <TableRow>
                            <TableCell colSpan={6} className="text-center">
                                Boshlash vaqti yo'q
                            </TableCell>
                        </TableRow>
                    )}
                    {
                        addTime && (
                            <TableRow>
                                <TableCell>
                                    <Input
                                        autoFocus
                                        type="time"
                                        className="w-auto"
                                        onChange={(e) => setnewTime(e.target.value)}
                                        onKeyDown={(e) => e.key === "Escape" ? setaddTime(false) : null}
                                    />
                                </TableCell>
                                <TableHead className="flex items-center gap-2" >
                                    <Button
                                        className="text-green-400 bg-green-200/60 text-sm hover:bg-green-200/90 flex items-center gap-1"
                                        onClick={handleAddTime}
                                        disabled={newTime === ""}
                                    >
                                        <span>
                                            Saqlash
                                        </span>
                                    </Button>
                                    <Button
                                        className="text-red-400 bg-red-200/60 text-sm hover:bg-red-200/90 flex items-center gap-1"
                                        onClick={() => setaddTime(false)}
                                    >
                                        <span>
                                            Bekor qilish
                                        </span>
                                    </Button>
                                </TableHead>
                            </TableRow>
                        )
                    }
                </TableBody>
            </Table>
        </>
    )
}

export default Schedule