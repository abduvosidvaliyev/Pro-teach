import { useState, useEffect, useRef } from 'react';
import back from '../assets/bac.mp4';
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {
    getDatabase,
    ref,
    onValue,
    set,
    update,
    get,
    push,
    remove
} from "firebase/database";
import BasicNavbar from '../Basic/BasicNavbar';
import { FaSearch, FaTrash } from "react-icons/fa"
import { FiUsers } from "react-icons/fi"
import { Modal } from "../components/ui/modal"
import style from "./Message.module.css"
import { X } from 'lucide-react';
import { Button } from '../components/ui/button';
import { MdSend } from "react-icons/md"
import { GoPencil } from "react-icons/go"

const firebaseConfig = {
    apiKey: "AIzaSyC94X37bt_vhaq5sFVOB_ANhZPuE6219Vo",
    authDomain: "project-pro-7f7ef.firebaseapp.com",
    databaseURL: "https://project-pro-7f7ef-default-rtdb.firebaseio.com",
    projectId: "project-pro-7f7ef",
    storageBucket: "project-pro-7f7ef.firebasestorage.app",
    messagingSenderId: "782106516432",
    appId: "1:782106516432:web:d4cd4fb8dec8572d2bb7d5",
    measurementId: "G-WV8HFBFPND"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const database = getDatabase(app);

const Message = () => {
    const messageRef = useRef({})
    const StudentData = JSON.parse(localStorage.getItem("StudentData"))
    const [Students, setStudents] = useState([])
    const [Groups, setGroups] = useState([])
    const [Message, setMessage] = useState([])
    const [Student, setStudent] = useState({})
    const [Group, setGroup] = useState({})
    const [GroupMembers, setGroupMembers] = useState([])
    const [MessageText, setMessageText] = useState("")
    const [searchText, setSearchText] = useState("")
    const [OpenModal, setOpenModal] = useState(false)
    const [Search, setSearch] = useState(true)
    const [searchMessage, setSearchMessage] = useState(false)
    const [chengeMessage, setchengeMessage] = useState(false)
    const [delateMessage, setdelateMessage] = useState(false)
    const [highlightedMessageTime, setHighlightedMessageTime] = useState(null);
    const [messageKey, setmessageKey] = useState(null)

    useEffect(() => {
        const studentRef = ref(database, "Students")

        onValue(studentRef, (snapshot) => {
            const data = snapshot.val()

            setStudents(Object.values(data || []))
        })

        const groupRef = ref(database, "Groups")

        onValue(groupRef, (snapshot) => {
            const data = snapshot.val()

            setGroups(Object.values(data || []))
        })
    }, [])

    useEffect(() => {
        const student = Students.find(student => student.id === StudentData.id)

        setStudent(student)
    }, [StudentData, Students])

    useEffect(() => {
        const group = Groups.find(group => group.groupName === Student?.group)

        setGroup(group)
    }, [Student, Groups])

    useEffect(() => {
        const GroupMembers = Students.filter((student) => student.group.toLowerCase() === Group?.groupName.toLowerCase())

        setGroupMembers(GroupMembers)
    }, [Students, Group])

    useEffect(() => {
        const messageRef = ref(database, `messages/${Group?.groupName}`)

        onValue(messageRef, (snapshot) => {
            const data = snapshot.val()
            if (!data) {
                setMessage([]);
                return;
            }

            const messages = Object.keys(data).map((key) => ({
                key: key,
                id: data[key].id,
                name: data[key].name,
                text: data[key].text,
                time: data[key].time

            }))
            setMessage(messages)

        })
    }, [Group])

    const [SearchMembers, setSearchMembers] = useState(GroupMembers)

    const handleMemberSearch = (value) => {
        if (value === "") {
            setSearchMembers(GroupMembers)
        }
        else {
            const searchMembers = GroupMembers.filter(member => member.studentName.toLowerCase().includes(value.toLowerCase()))

            setSearchMembers(searchMembers)
        }
    }

    const hendleMInfo = (key, text) => {
        setmessageKey(key)
        setMessageText(text)
        setchengeMessage(true)
    }

    const modalThings = () => {
        return (
            <div className={`${style.table} h-[500px] flex flex-col gap-4 pr-2 overflow-auto`}>
                <div
                    className="flex justify-start gap-3 items-center w-full"
                >
                    <h3 className="p-7 text-2xl rounded-full bg-slate-500 text-white cursor-context-menu capitalize">
                        {Group?.groupName.split(" ").map(n => n[0]).slice(0, 2).join("")}
                    </h3>
                    <div className="flex flex-col justify-start">
                        <h3 className="font-bold text-2xl text-gray-800 capitalize">
                            {Group?.groupName}
                        </h3>
                        <span className="text-sm">
                            {GroupMembers.length} o'quvchi
                        </span>
                    </div>
                </div>
                <div className="flex flex-col justify-start gap-[4px] w-full">
                    <h3 className="w-full flex items-center justify-between font-medium capitalize">
                        Guruh nomi:
                        <span className="font-bold">
                            {Group?.groupName}
                        </span>
                    </h3>
                    <h3 className="w-full flex items-center justify-between font-medium capitalize">
                        Kurs nomi:
                        <span className="font-bold">
                            {Group?.courses}
                        </span>
                    </h3>
                    <h3 className="w-full flex items-center justify-between font-medium capitalize">
                        Dars vaqti:
                        <span className="font-bold">
                            {Group?.duration}
                        </span>
                    </h3>
                    <h3 className="w-full flex items-center justify-between font-medium capitalize">
                        O'qituvchi:
                        <span className="font-bold">
                            {Group?.teachers}
                        </span>
                    </h3>
                    <h3 className="w-full flex items-center justify-between font-medium capitalize">
                        Dars kunlari:
                        <span className="font-bold">
                            {Group?.selectedDays.join(", ")}
                        </span>
                    </h3>
                    <h3 className="w-full flex items-center justify-between font-medium">
                        Xona:
                        <span className="font-bold">
                            {Group?.rooms}
                        </span>
                    </h3>
                </div>
                <div className="w-full flex flex-col border-t border-t-gray-600 pt-1 gap-3">
                    <nav className="w-full flex justify-between items-center text-gray-700 p-[4px]">
                        {
                            Search ? (
                                <div className="flex items-center gap-3 font-bold">
                                    <FiUsers size={22} />
                                    <h3>
                                        {GroupMembers.length} O'QUVCHILAR
                                    </h3>
                                </div>
                            ) : (
                                <input
                                    type="text"
                                    className={`${style.input} w-[90%] p-2 border rounded-lg`}
                                    placeholder="O'quvchini qidirish..."
                                    onChange={(e) => handleMemberSearch(e.target.value)}
                                />
                            )
                        }
                        {Search ? <FaSearch size={19} className="cursor-pointer" onClick={() => setSearch(false)} />
                            : <X className="cursor-pointer" onClick={() => setSearch(true)} />}
                    </nav>
                    <div className="w-full flex flex-col gap-[5px]">
                        {
                            GroupMembers.length > 0 ? (
                                (SearchMembers.length === 0 ? GroupMembers : SearchMembers).map((member) => (
                                    <div
                                        className="w-full flex justify-start gap-3 items-center border-b border-b-slate-300 cursor-context-menu pb-[2px] hover:bg-slate-100"
                                    >
                                        <h3
                                            className="w-12 h-12 flex justify-center items-center text-xl rounded-full bg-slate-500 text-white cursor-context-menu capitalize"
                                        >
                                            {
                                                member.studentName.split(" ").map(n => n[0]).slice(0, 2).join("")
                                            }
                                        </h3>
                                        <div className="flex flex-col items-start">
                                            <h3 className="capitalize">
                                                {member.studentName}
                                            </h3>
                                            <h3 className="text-xs">
                                                {member.ball} ball
                                            </h3>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <h3>
                                    Yuklanmoqda!
                                </h3>
                            )
                        }
                    </div>
                </div>
            </div>
        )
    }

    const handleSendMessage = () => {
        if (MessageText) {
            const time = new Date().getTime()

            const message = {
                id: StudentData.id,
                name: StudentData.login,
                text: MessageText,
                time: time
            }

            const groupMessageRef = ref(database, `messages/${Group?.groupName}`)

            push(groupMessageRef, message)
                .then(() => {
                    setMessageText("")
                })
                .catch((error) => {
                    console.error(error)
                })
        }
    }

    const handleSearchMessage = () => {
        const found = Message.find(m => m.text.toLowerCase().includes(searchText.toLowerCase()))

        if (found) {
            const ref = messageRef.current[found.time]

            if (ref) {
                ref.scrollIntoView({ behavior: "smooth", block: "center" })
                setHighlightedMessageTime(found.time)

                setTimeout(() => {
                    setHighlightedMessageTime(null)
                }, 3000);
            }
        }
        else {
            alert("Xabar topilmadi!")
        }
    }

    const handleChengeMessage = () => {
        if (!messageKey) {
            console.log("Key topilmadi");
            return;
        }

        const messageRef = ref(database, `messages/${Group?.groupName}/${messageKey}/text`)

        set(messageRef, MessageText)
            .then(() => {
                setMessageText("")
                setmessageKey(null)
                setchengeMessage(false)
                console.log("Message successful chenge!")
            })
            .catch((error) => {
                console.error(error)
            })
    }

    const handleDelateMessage = () => {
        if (!messageKey) {
            console.log("Invalid key!")
            return;
        }

        const messageRef = ref(database, `messages/${Group?.groupName}/${messageKey}`)

        remove(messageRef)
            .then(() => {
                setmessageKey(null)
                setdelateMessage(false)
            })
            .catch((error) => {
                console.error(error)
            })
    }

    const cencelChenge = () => {
        setMessageText("")
        setchengeMessage(false)
        setmessageKey(null)
    }

    return (
        <div>
            <video autoPlay loop>
                <source src={back} />
            </video>

            {
                delateMessage && (
                    <Modal
                        isOpen={delateMessage}
                        onClose={() => setdelateMessage(false)}
                        positionTop="top-[40%]"
                        title="Bu xabarni o'chirmoqchimisiz?"
                        children={
                            <div className='w-full flex justify-center items-center gap-5'>
                                <Button variant="red" onClick={handleDelateMessage}>Ha</Button>
                                <Button variant="outline" onClick={() => setdelateMessage(false)}>Yo'q</Button>
                            </div>
                        }
                    />
                )
            }

            {
                OpenModal && (
                    <Modal
                        isOpen={OpenModal}
                        onClose={() => setOpenModal(false)}
                        title={"Guruh ma'lumotlari"}
                        positionTop="top-[10%]"
                        children={modalThings()}
                    />
                )
            }

            {
                chengeMessage && (
                    <div className="w-full h-screen bg-black/50 backdrop-blur-[2px] absolute z-10" onClick={cencelChenge}></div>
                )
            }

            <div className="flex justify-between w-full">
                <BasicNavbar />
                <div className="w-[80%] px-2 flex flex-col h-screen">
                    <nav
                        className="w-full bg-[#ffffff17] px-4 shadow-xl pr-7 flex justify-between items-center border border-[#ffffff4d] rounded-b-[15px] backdrop-blur-[5px] h-[100px]"
                    >
                        {
                            Group?.groupName ? (
                                <div
                                    className="flex items-center gap-4 p-4 cursor-pointer"
                                    onClick={() => setOpenModal(true)}
                                >
                                    <h3 className="w-15 h-15 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 text-white flex items-center justify-center text-lg font-bold">
                                        {Group?.groupName.split(" ").map(n => n[0]).slice(0, 2).join("")}
                                    </h3>
                                    <div className="flex flex-col justify-start">
                                        <h3 className="text-white text-lg font-semibold capitalize">
                                            {Group?.groupName}
                                        </h3>
                                        <span className="text-sm text-white/80">
                                            {GroupMembers.length} a'zolar
                                        </span>
                                    </div>
                                </div>
                            ) : (
                                <h3>
                                    Yuklanmoqda!
                                </h3>
                            )
                        }
                        <div className="flex items-center gap-5">
                            {searchMessage && (
                                <div className="flex items-center bg-white/30 border border-white/40 rounded-lg shadow px-3 py-2 transition-all duration-300 w-64 focus-within:bg-white/60 focus-within:border-blue-400">
                                    <FaSearch className="text-slate-500 mr-2" size={18} />
                                    <input
                                        type="text"
                                        placeholder="Qidirish"
                                        className="bg-transparent outline-none text-black placeholder:text-slate-500 w-full"
                                        onChange={(e) => (handleSearchMessage(), setSearchText(e.target.value))}
                                    />
                                </div>
                            )}
                            {
                                searchMessage ? <X className="text-slate-200 cursor-pointer" onClick={() => {
                                    setSearchMessage(false)
                                    setSearchText("")
                                    setHighlightedMessageTime(null)
                                }} />
                                    : <FaSearch size={20} className="text-slate-200 cursor-pointer" onClick={() => setSearchMessage(true)} />
                            }
                        </div>
                    </nav>
                    <div className="message-text flex flex-col justify-end items-center h-[600px]">
                        <div className={`${style.textCard} w-full flex px-4 pb-6 flex-col-reverse gap-2 overflow-auto`}>
                            {
                                Message.length > 0 ? (
                                    Message
                                        .sort((a, b) => b.time - a.time)
                                        .map((messeg) => {
                                            const date = new Date(messeg.time)
                                            const time = date.toLocaleTimeString("en-US", {
                                                hour: "2-digit",
                                                minute: "2-digit",
                                                hour12: true
                                            })
                                            return (
                                                <div
                                                    key={messeg.time}
                                                    ref={(el) => messageRef.current[messeg.time] = el}
                                                    className={`flex justify-start items-end gap-2 w-auto ${highlightedMessageTime === messeg.time ? 'ring-2 ring-yellow-400' : ""}`}
                                                >
                                                    <div
                                                        className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold"
                                                    >
                                                        <h3 className="capitalize text-lg">
                                                            {messeg.name.split(" ").map(w => w[0]).slice(0, 2).join("")}
                                                        </h3>
                                                    </div>
                                                    <div
                                                        className={`min-w-40 max-w-[450px] px-4 py-3 pt-[4px] rounded-2xl shadow-lg border flex flex-col
                                                    ${messeg.id === StudentData.id
                                                                ? 'bg-blue-600/60 backdrop-blur-[5px] text-white self-end rounded-bl-none border-blue-500'
                                                                : 'bg-white/30 text-black backdrop-blur-md rounded-bl-none border-white/20'
                                                            }`
                                                        }
                                                    >
                                                        {
                                                            messeg.id !== StudentData.id ? (
                                                                <span className='text-sm font-bold text-gray-800'>
                                                                    {messeg.name}
                                                                </span>
                                                            ) : ""
                                                        }
                                                        <p className='text-base break-words whitespace-pre-line'>
                                                            {messeg.text}
                                                        </p>
                                                        <span className="text-xs self-end">
                                                            {time}
                                                        </span>
                                                    </div>
                                                    {
                                                        messeg.id === StudentData.id ? (
                                                            <div className="flex items-center gap-2 self-center select-none">
                                                                <span
                                                                    className="p-2 rounded-full hover:bg-blue-500/20 transition-colors duration-200 group cursor-pointer"
                                                                    title="Tahrirlash"
                                                                    onClick={() => hendleMInfo(messeg.key, messeg.text)}
                                                                >
                                                                    <GoPencil className="text-lg text-gray-500 group-hover:text-blue-600 transition-colors duration-200" />
                                                                </span>
                                                                <span
                                                                    className="p-2 rounded-full hover:bg-red-500/20 transition-colors duration-200 group cursor-pointer"
                                                                    title="O'chirish"
                                                                    onClick={() => { setmessageKey(messeg.key), setdelateMessage(true) }}
                                                                >
                                                                    <FaTrash className="text-base text-gray-500 group-hover:text-red-600 transition-colors duration-200" />
                                                                </span>
                                                            </div>
                                                        ) : ""
                                                    }
                                                </div>
                                            )
                                        })
                                ) : ""
                            }
                        </div>
                        <div
                            className={`${MessageText.length > 88 ? "h-[120px]" : MessageText.length > 100 ? "h-[160px]" : ""} input bg-[#e7e7e790] w-[40%] backdrop-blur-[5px] flex justify-between p-[3px] py-2 pl-3 rounded-lg items-end z-20`}
                        >
                            <textarea
                                value={MessageText}
                                className={`${style.inputMessage} placeholder:text-black ${MessageText.length > 44 ? "h-full" : "h-8"} w-[90%] max-h-[150px] px-1 outline-none text-lg resize-none`}
                                placeholder="Xabar"
                                onChange={(e) => setMessageText(e.target.value)}
                                onKeyDown={e => {
                                    if (e.key === "Enter" && !e.shiftKey) {
                                        e.preventDefault();
                                        if (MessageText && !chengeMessage) handleSendMessage()
                                        else if (MessageText && chengeMessage) handleChengeMessage()
                                    }
                                }}
                            />
                            {
                                !chengeMessage ? (
                                    <Button
                                        onClick={handleSendMessage}
                                        disabled={!MessageText}
                                    >
                                        <MdSend size={25} color={"#333"} />
                                    </Button>
                                ) : (
                                    <Button
                                        onClick={handleChengeMessage}
                                        disabled={!MessageText}
                                    >
                                        <MdSend size={25} color={"#333"} />
                                    </Button>
                                )
                            }
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Message;