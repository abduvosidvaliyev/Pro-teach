import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {
    getDatabase,
    ref,
    onValue,
    set,
    update,
    get,
    remove
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


import { useEffect, useMemo, useState } from "react"
import { SidebarPanel } from "../../Sidebar"
import DoughnutChart from "../../components/ui/DoughnutChart"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs"
import { IoArrowBackSharp } from "react-icons/io5";
import { Button } from "../../components/ui/button"
import { FiArrowDown, FiArrowDownLeft, FiArrowRight, FiArrowUpRight, FiChevronDown, FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { Sidebar, SidebarContent, SidebarHeader, SidebarProvider } from "../../components/ui/sidebar"
import { X } from "lucide-react";
import { cn } from "../../lib/utils";
import { Label } from "../../components/ui/UiLabel"
import { Input } from "../../components/ui/input"
import style from "./Dashboard.module.css"
import SelectReact from "react-select"
import "./Dashboard.css"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select"
import ReactPaginate from "react-paginate";

// select options
const options = [
    { value: "Student to'ladi", label: "Student to'ladi" },
    { value: "Boshqadan pul olish", label: "Boshqadan pul olish" },
    { value: "Direktordan pul olish", label: "Direktordan pul olish" },
    { value: "Adashib chiqim bo'lgani qaytarish", label: "Adashib chiqim bo'lgani qaytarish" },

    // Add more options as needed
]

const paymentType = [
    { value: "Naqt", label: "Naqt" },
    { value: "Click", label: "Click" },
    { value: "Bank orqali", label: "Bank orqali" }
]

const outputOptions = [
    { value: "Hodimga oylik", label: "Hodimga oylik" },
    { value: "Hodimga avans", label: "Hodimga avans" },
    { value: "Abet", label: "Abet" },
    { value: "Tamirlash ishlari", label: "Tamirlash ishlari" },
    { value: "Ujen", label: "Ujen" },
    { value: "Boshqa", label: "Boshqa" },
    { value: "Adashib kiritilgan", label: "Adashib kiritilgan" },
    { value: "Talaba pulini qaytarish", label: "Talaba pulini qaytarish" },
    { value: "Tadbirlar", label: "Tadbirlar" },
    { value: "Boshqaga pul o'tgazish", label: "Boshqaga pul o'tgazish" },
    { value: "Arenda", label: "Arenda" },
    { value: "Yo'lkiro", label: "Yo'lkiro" },
    { value: "Bonus", label: "Bonus" },
    { value: "Elektr energiya", label: "Elektr energiya" },

    // Add more options as needed
]

const pages = [
    { value: 5, label: 5 },
    { value: 10, label: 10 },
    { value: 20, label: 20 },
    { value: 50, label: 50 },
]

const InputAndOutput = () => {
    const [TabsValue, setTabsValue] = useState("input")
    const [activePage, setActivePage] = useState("list");
    const [GetInput, setGetInput] = useState([]);
    const [GetOutput, setGetOutput] = useState([]);
    const [GetStudents, setGetStudents] = useState([])
    const [GetIncome1, setGetIncome] = useState([]);
    const [GetIncome2, setGetIncome2] = useState([]);
    const [GetIncome, setGetIncome1] = useState([]);
    const [GetIncome3, setGetIncome3] = useState([]);
    const [TotalMoney, setTotalMoney] = useState(0);
    const [isOpen, setisOpen] = useState(false)
    const [open, setOpen] = useState(false)
    const [chevron, setchevron] = useState(false)
    const [Balance, setBalance] = useState(0)
    const [AddIncome, setAddIncome] = useState({
        paymentType: "",
        amount: "",
        date: "",
        name: "",
        tranzaksiya: "",
        color: "",
        comment: "",
        Income: []
    })
    const [AddOutput, setAddOutput] = useState({
        paymentType: "",
        amount: "",
        date: "",
        name: "",
        tranzaksiya: "",
        color: "",
        comment: "",
        Income: []
    })

    const [PER_PAGE, setPER_PAGE] = useState(10)

    useEffect(() => {
        const InputRef = ref(database, "InputOutput/Input");
        onValue(InputRef, (snapshot) => {
            const data = snapshot.val();
            setGetInput(Object.values(data || {}));
        });

        const OutputRef = ref(database, "InputOutput/Output");
        onValue(OutputRef, (snapshot) => {
            const data = snapshot.val();
            setGetOutput(Object.values(data || {}));
        });

        const IncomeRef = ref(database, "InputOutput/Input/INP1/Income");
        onValue(IncomeRef, (snapshot) => {
            const data = snapshot.val()
            setGetIncome(Object.values(data || {}));
        });

        const Income2Ref = ref(database, "InputOutput/Input/INP2/Income");
        onValue(Income2Ref, (snapshot) => {
            const data = snapshot.val();
            setGetIncome2(Object.values(data || {}));
        });

        const Income1Ref = ref(database, "InputOutput/Output/OUT1/Income");
        onValue(Income1Ref, (snapshot) => {
            const data = snapshot.val();
            setGetIncome1(Object.values(data || {}));
        });

        const Income3Ref = ref(database, "InputOutput/Output/OUT2/Income");
        onValue(Income3Ref, (snapshot) => {
            const data = snapshot.val();
            setGetIncome3(Object.values(data || {}));
        });

        const StudentsRef = ref(database, "Students");
        onValue(StudentsRef, (snapshot) => {
            const data = snapshot.val();
            setGetStudents(Object.values(data || {}));
        });

        const AllBalanceRef = ref(database, "AllBalance")
        onValue(AllBalanceRef, (snapshot) => {
            const data = snapshot.val()
            setBalance(data)
        })

    }, []);

    useEffect(() => {
        const totalMoney = GetInput.reduce((acc, item) => {
            return Number(acc) + Number(item.amount);
        }, 0);

        setTotalMoney(totalMoney);
    }, [GetInput]);

    const [currentPage, setCurrentPage] = useState(0);

    // Barcha payment yozuvlarini flat qilish
    const allPayments = useMemo(() => {
        return GetStudents.flatMap(student =>
            Array.isArray(student.paymentHistory) && student.paymentHistory.length > 0
                ? student.paymentHistory
                    .filter(payment => typeof payment.amount === "string" && payment.amount.startsWith("+"))
                    .map(payment => ({
                        ...payment,
                        studentName: student.name || student.studentName
                    }))
                : []
        );
    }, [GetStudents, PER_PAGE]);

    const pageCount = Math.ceil(allPayments.length / PER_PAGE);

    // Hozirgi sahifadagi yozuvlar
    const currentPayments = useMemo(() => {
        const start = currentPage * PER_PAGE;
        return allPayments.slice(start, start + PER_PAGE);
    }, [allPayments, currentPage]);

    const handlePageClick = ({ selected }) => {
        setCurrentPage(selected);
    };

    // const renderContent = () => {
    //     if (activePage === "list") {
    //         return (
    //             <div className="w-full h-[540px] overflow-y-auto bg-white flex flex-col justify-between items-start rounded-xl shadow-lg">
    //                 <Table className="w-full h-full p-5 bg-white rounded-xl">
    //                     <TableHeader>
    //                         <TableRow className="sticky top-0 bg-white">
    //                             <TableHead>№</TableHead>
    //                             <TableHead>Turi</TableHead>
    //                             <TableHead>Summa</TableHead>
    //                         </TableRow>
    //                     </TableHeader>
    //                     <TableBody>
    //                         <TableRow onClick={() => { setActivePage("Informations"); setCurrentPage(0); }} className="cursor-pointer text-[#0de739]">
    //                             <TableCell>1</TableCell>
    //                             <TableCell>Studentlardan tushgan pul</TableCell>
    //                             <TableCell>
    //                                 {Number(Balance).toLocaleString("uz-UZ", {
    //                                     style: "currency",
    //                                     currency: "UZS"
    //                                 })}
    //                             </TableCell>
    //                         </TableRow>
    //                     </TableBody>
    //                 </Table>
    //                 <h3 className="text-base w-full flex justify-between items-center p-5">
    //                     Jami:
    //                     <span>
    //                         {Number(Balance).toLocaleString("uz-UZ", {
    //                             style: "currency",
    //                             currency: "UZS",
    //                         })}
    //                     </span>
    //                 </h3>
    //             </div>
    //         );
    //     } 
    //     else {
    //         return (
    //             <div className="h-[540px] w-full flex flex-col items-start justify-start gap-4 p-5 bg-white rounded-xl shadow-lg">
    //                 <Button
    //                     variant="outline"
    //                     className="px-3 py-1 bg-gray-300 rounded-md hover:bg-gray-400 mb-2"
    //                     onClick={() => setActivePage("list")}
    //                 >
    //                     <IoArrowBackSharp className="text-lg" />
    //                 </Button>

    //                 <div className="flex-1 overflow-y-auto w-full">
    //                     <Table>
    //                         <TableHeader>
    //                             <TableRow className="sticky top-0 bg-white">
    //                                 <TableHead>№</TableHead>
    //                                 <TableHead>Sana</TableHead>
    //                                 <TableHead>Kim</TableHead>
    //                                 <TableHead>Tranzaksiya</TableHead>
    //                                 <TableHead>Summa</TableHead>
    //                                 <TableHead>To'lov turi</TableHead>
    //                                 <TableHead>Turi</TableHead>
    //                             </TableRow>
    //                         </TableHeader>
    //                         <TableBody>
    //                             {currentPayments.map((payment, idx) => (
    //                                 <TableRow key={idx}>
    //                                     <TableCell>{currentPage * PER_PAGE + idx + 1}</TableCell>
    //                                     <TableCell>{payment.date}</TableCell>
    //                                     <TableCell>{payment.studentName}</TableCell>
    //                                     <TableCell>Studentdan tushgan pul</TableCell>
    //                                     <TableCell>{payment.amount}</TableCell>
    //                                     <TableCell>No'malum</TableCell>
    //                                     <TableCell><FiArrowDownLeft className="text-green-600 text-xl" /></TableCell>
    //                                 </TableRow>
    //                             ))}
    //                         </TableBody>
    //                     </Table>
    //                 </div>

    //                 {/* ReactPaginate */}
    <div className="self-end flex items-center gap-3">
        <Select
            value={String(PER_PAGE)}
            onValueChange={val => {
                setPER_PAGE(Number(val));
                setCurrentPage(0);
            }}
            defaultValue={String(pages[1].value)}
        >
            <SelectTrigger className="w-[120px]">
                <SelectValue placeholder="Qator sonini tanlash" />
            </SelectTrigger>
            <SelectContent>
                {pages.map((page) => (
                    <SelectItem key={page.value} value={String(page.value)}>
                        {page.value} tadan
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
        <ReactPaginate
            pageCount={pageCount}
            onPageChange={handlePageClick}
            forcePage={currentPage}
            previousLabel={<FiChevronLeft />}
            nextLabel={<FiChevronRight />}
            breakLabel="..."
            marginPagesDisplayed={1}
            pageRangeDisplayed={1}
            containerClassName="pagination"
            activeClassName="active"
        />
    </div>
    //             </div>
    //         );
    //     }
    // };

    // const renderContent2 = (value) => {
    //     let incomeData;
    //     if (activePage === "GetIncome1") incomeData = GetIncome;
    //     else if (activePage === "GetIncome2") incomeData = GetIncome3;
    //     // else if (activePage === "GetIncome3") incomeData = GetIncome3;

    //     if (activePage === "list") {
    //         return (
    //             <div className="w-full h-[540px] overflow-y-auto bg-white flex flex-col justify-between items-start rounded-xl shadow-lg">
    //                 <Table className="w-full h-full p-5 bg-white rounded-xl">
    //                     <TableHeader className="w-full">
    //                         <TableRow className="hover:bg-transparent sticky top-0 active:bg-transparent">
    //                             <TableHead className="text-gray-950">№</TableHead>
    //                             <TableHead className="text-gray-950">Turi</TableHead>
    //                             <TableHead className="text-gray-950">Summa</TableHead>
    //                         </TableRow>
    //                     </TableHeader>
    //                     <TableBody className="w-full">
    //                         {value.length > 0 ?
    //                             value.map((item, index) => {
    //                                 return (
    //                                     <TableRow
    //                                         key={index}
    //                                         style={{ color: item.color }}
    //                                         className="hover:bg-gray-200 cursor-pointer"
    //                                         onClick={() => setActivePage(`GetIncome${item.id}`)}
    //                                     >
    //                                         <TableCell>{item.id}</TableCell>
    //                                         <TableCell>{item.type}</TableCell>
    //                                         <TableCell>
    //                                             {
    //                                                 Number(item.amount).toLocaleString("uz-UZ", {
    //                                                     style: "currency",
    //                                                     currency: "UZS",
    //                                                 })
    //                                             }
    //                                         </TableCell>
    //                                     </TableRow>
    //                                 );
    //                             })
    //                             : ""
    //                         }
    //                     </TableBody>
    //                 </Table>
    //                 <h3 className="text-base w-full flex justify-between items-center p-5">
    //                     Jami:
    //                     <span>
    //                         {
    //                             value.length > 0 ?
    //                                 Number(value.reduce((acc, item) => {
    //                                     return Number(acc) + Number(item.amount);
    //                                 }, 0)).toLocaleString("uz-UZ", {
    //                                     style: "currency",
    //                                     currency: "UZS",
    //                                 })
    //                                 : Number(TotalMoney).toLocaleString("uz-UZ", {
    //                                     style: "currency",
    //                                     currency: "UZS",
    //                                 })
    //                         }
    //                     </span>
    //                 </h3>
    //             </div>
    //         );
    //     }
    //     else {
    //         return (
    //             <div className="h-[540px] w-full flex flex-col items-start justify-start gap-2 p-5 bg-white rounded-xl shadow-lg">
    //                 <div className="w-full flex items-center justify-start">
    //                     <Button
    //                         variant="outline"
    //                         className=" px-3 py-1 bg-gray-300 rounded-md hover:bg-gray-400"
    //                         onClick={() => setActivePage("list")}
    //                     >
    //                         <IoArrowBackSharp className="text-lg" />
    //                     </Button>
    //                 </div>
    //                 <Table>
    //                     <TableHeader className="w-full">
    //                         <TableRow className="hover:bg-transparent sticky top-0 active:bg-transparent">
    //                             <TableHead className="text-gray-950">№</TableHead>
    //                             <TableHead className="text-gray-950">Sana</TableHead>
    //                             <TableHead className="text-gray-950">Tranzaksiya</TableHead>
    //                             <TableHead className="text-gray-950">Summa</TableHead>
    //                             <TableHead className="text-gray-950">To'lov turi</TableHead>
    //                             <TableHead className="text-gray-950">Turi</TableHead>
    //                         </TableRow>
    //                     </TableHeader>
    //                     <TableBody className="w-full">
    //                         {
    //                             incomeData?.map(item => {
    //                                 return (
    //                                     <TableRow
    //                                         key={item.id}
    //                                         className="hover:bg-gray-200 cursor-pointer"
    //                                     >
    //                                         <TableCell>{item.id}</TableCell>
    //                                         <TableCell>{item.date}</TableCell>
    //                                         <TableCell>{item.name}</TableCell>
    //                                         <TableCell>
    //                                             {Number(item.amount).toLocaleString("uz-UZ", {
    //                                                 style: "currency",
    //                                                 currency: "UZS",
    //                                             })}
    //                                         </TableCell>
    //                                         <TableCell>{item.paymentType}</TableCell>
    //                                         <TableCell>
    //                                             <FiArrowUpRight className="text-[#d90d0d]" />
    //                                         </TableCell>
    //                                     </TableRow>
    //                                 );
    //                             })
    //                         }
    //                     </TableBody>
    //                 </Table>
    //             </div>
    //         );
    //     }
    // };

    return (
        <>
            <div className="InputAndOutput">

                <div
                    className="w-full"
                    style={{
                        marginLeft: "var(--sidebar-width, 250px)",
                        width: "var(--sidebar-width), 100%",
                        transition: "all 0.5s ease, background 0.3s ease, width 0.5s ease",
                    }}
                >
                    <nav className="w-full p-8 pl-10 shadow-lg">
                        <h3 className="text-3xl font-normal ">
                            Kirim va Chiqim bo'yicha hisobot
                        </h3>
                    </nav>

                    {/* <div className="w-full px-8 py-11 flex gap-5">
                        <Tabs
                            defaultValue="input"
                            className="w-full h-full flex flex-col items-start justify-start gap-5"
                            onValueChange={(value) => {
                                setTabsValue(value);
                            }}
                        >
                            <TabsList className="w-auto h-auto p-1 border-2 border-gray-300 rounded-lg">
                                <TabsTrigger
                                    className={`px-5 py-2 ${TabsValue === "output" ? "hover:bg-gray-200" : ""} cursor-pointer ${TabsValue === "input" ? "text-white bg-slate-800" : ""} rounded-lg`}
                                    value="input"
                                >
                                    Kirim
                                </TabsTrigger>
                                <TabsTrigger
                                    className={`px-5 py-2 ${TabsValue === "input" ? "hover:bg-gray-200" : ""} cursor-pointer ${TabsValue === "output" ? "text-white bg-slate-800" : ""} rounded-lg`}
                                    value="output"
                                >
                                    Chiqim
                                </TabsTrigger>
                            </TabsList>
                            <TabsContent value="input" className="w-full h-full flex items-center justify-between gap-5">
                                <div className="p-5 bg-white rounded-xl shadow-lg">
                                    <DoughnutChart color="#0de739" type="Studentlardan tushgan pul" amount={Balance} />
                                </div>
                                {renderContent()}
                            </TabsContent>
                            <TabsContent value="output" className="w-full h-full flex items-center justify-between gap-5">
                                <div className="p-5 bg-white rounded-xl shadow-lg">
                                    <DoughnutChart />
                                </div>
                                {renderContent2(GetOutput)}
                            </TabsContent>
                        </Tabs>
                    </div> */}
                </div>
            </div>
        </>
    );
};

export default InputAndOutput;