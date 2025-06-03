import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-analytics.js";
import {
    getDatabase,
    ref,
    set,
    onValue,
    update,
    remove
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


import React, { useEffect, useState } from "react";
import { GrMoney } from "react-icons/gr";
import { SidebarPanel } from "../../Sidebar";
import { Card, CardContent } from "../../components/ui/card"
import { Label } from "../../components/ui/UiLabel";
import { Input } from "../../components/ui/input";
import { Checkbox } from "../../components/ui/checkbox";
import { Button } from "../../components/ui/button"
import { Modal } from "../../components/ui/modal"
import SelectReact from "react-select"
import style from "./Dashboard.module.css"

import ScatterChart from "../../components/ui/ScatterChart"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../components/ui/table";
import { IoTrashOutline } from "react-icons/io5";
import { FaPencil } from "react-icons/fa6";
import { Sidebar, SidebarContent, SidebarHeader, SidebarProvider } from "../../components/ui/sidebar";
import { cn } from "../../lib/utils";
import { X } from "lucide-react";
import { ToastContainer } from "react-toastify";
import { DelateNotify, AddNotify, ChengeNotify } from "../../components/ui/Toast"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select"

const getCurrentDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
};

const Expenses = () => {
    const [GetTeacher, setGetTeacher] = useState([])
    const getCurrentMonth = () => {
        const today = new Date();
        return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}`;
    };
    const [selectedMonth, setSelectedMonth] = useState(getCurrentMonth());
    const [GetExpenses, setGetExpenses] = useState([])
    const [date, setDate] = React.useState(getCurrentDate());
    const [Expenses, setExpenses] = useState("")
    const [checked, setchecked] = useState("")
    const [isOpen, setisOpen] = useState(false)
    const [open, setOpen] = useState(false)
    const [ExpensesId, setExpensesId] = useState("")
    const [ChengeExpense, setChengeExpense] = useState({})
    const [object, setobject] = useState({})
    const [SidebarRecipient, setSidebarRecipient] = useState(null);
    const [IsOpen, setIsOpen] = useState(false)
    const [ExpenseId, setExpenseId] = useState(null)

    const [AddExpense, setAddExpense] = useState({
        expenseName: "",
        date: getCurrentDate(),
        amount: "",
        recipient: "",
        paymentType: ""
    })

    const CloseModal = () => setIsOpen(false)

    useEffect(() => {
        const TeacherRef = ref(database, "Teachers");
        onValue(TeacherRef, (snapshot) => {
            const data = snapshot.val();
            setGetTeacher(Object.values(data || []));
        });
    }, []);

    // Oylik select uchun barcha mavjud oylarni olish
    const [availableMonths, setAvailableMonths] = useState([getCurrentMonth()]);

    useEffect(() => {
        const ExpensesRef = ref(database, "Expenses");
        onValue(ExpensesRef, (snapshot) => {
            const data = snapshot.val();
            if (data) {
                setAvailableMonths(Object.keys(data));
            }
        });
    }, []);

    //  Tanlangan oy uchun xarajatlarni olish
    useEffect(() => {
        const ExpensesRef = ref(database, `Expenses/${selectedMonth}`);
        onValue(ExpensesRef, (snapshot) => {
            const data = snapshot.val();
            setGetExpenses(Object.values(data || []));
            // Jami xarajatni ham shu yerda hisoblang
            setExpenses(
                data
                    ? Object.values(data).reduce((acc, curr) => Number(acc) + Number(curr.amount || 0), 0)
                    : 0
            );
        });
    }, [selectedMonth]);

    useEffect(() => {
        const chengeExpense = GetExpenses.find((firstExpense) => firstExpense.id === ExpensesId)

        setChengeExpense(chengeExpense)
    }, [ExpensesId])

    useEffect(() => {
        setobject({
            id: ChengeExpense?.id || "",
            expenseName: ChengeExpense?.expenseName || "",
            amount: ChengeExpense?.amount || "",
            date: ChengeExpense?.date
                ? new Date(new Date(ChengeExpense.date).getTime() - new Date().getTimezoneOffset() * 60000)
                    .toISOString()
                    .split("T")[0]
                : "",
            recipient: ChengeExpense?.recipient || "",
            paymentType: ChengeExpense?.paymentType || "",
        })
    }, [ChengeExpense])

    useEffect(() => {
        if (ChengeExpense?.recipient) {
            setSidebarRecipient({ value: ChengeExpense.recipient, label: ChengeExpense.recipient });
        }
    }, [ChengeExpense]);

    useEffect(() => {
        if (isOpen && ChengeExpense?.paymentType) {
            setobject((prevState) => ({
                ...prevState,
                paymentType: ChengeExpense.paymentType,
            }));
        }
    }, [isOpen, ChengeExpense]);

    // Code for updating the Expense
    const handleUptadeExpenses = (e) => {
        e.preventDefault()

        if (object.expenseName && object.amount && object.date && SidebarRecipient.value && object.paymentType) {
            const updates = {};
            updates[`/Expenses/${selectedMonth}/Expense${object.id}`] = {
                ...object,
                recipient: SidebarRecipient.value, // SidebarRecipient qiymatini olish
            };
            update(ref(database), updates)
                .then(() => {
                    setOpen(false);
                    setisOpen(false);
                    ChengeNotify({ ChengeTitle: "Ma'lumot o'zgartirildi!" })
                })
                .catch((error) => {
                    console.error("Error updating data:", error);
                });

        } else {
            alert("Bosh joylarni to'ldiring!")
        }
    }

    // Add new expense
    const handleAddExpense = (e) => {
        e.preventDefault()

        if (
            AddExpense.amount &&
            AddExpense.expenseName &&
            AddExpense.date &&
            AddExpense.recipient &&
            AddExpense.paymentType &&
            AddExpense.date <= getCurrentDate()
        ) {
            const monthKey = selectedMonth;
            const newExpenseRef = ref(database, `Expenses/${monthKey}/Expense${GetExpenses.length + 1}`);
            set(newExpenseRef, {
                ...AddExpense,
                id: GetExpenses.length + 1
            })
                .then(() => {
                    setAddExpense({
                        expenseName: "",
                        date: getCurrentDate(),
                        amount: "",
                        recipient: "",
                        paymentType: ""
                    });
                    setchecked("");
                    setDate(getCurrentDate());
                    AddNotify({ AddTitle: "Xarajat qo'shildi!" });
                })
                .catch((error) => {
                    console.error("Error adding data:", error);
                });
        } else {
            if (AddExpense.date > getCurrentDate()) {
                alert("Sana bugundan oldin bo'lmasligi kerak!")
            }
            else {
                alert("Bosh joylarni to'ldiring!")
            }
        }
    }

    // Delate Expense
    const handleDelateExpense = () => {
        if (ExpenseId) {
            const expenseRef = ref(database, `Expenses/${selectedMonth}/Expense${ExpenseId}`);
            remove(expenseRef)
                .then(() => {
                    // O‘chirgandan keyin shu oydagi chiqimlar qolgan-qolmaganini tekshir
                    const ExpensesRef = ref(database, `Expenses/${selectedMonth}`);
                    onValue(ExpensesRef, (snapshot) => {
                        const data = snapshot.val();
                        if (!data || Object.keys(data).length === 0) {
                            // Agar bu oyda chiqim qolmasa va bu oy hozirgi oy bo‘lmasa, hozirgi oyni tanla
                            const currentMonth = getCurrentMonth();
                            if (selectedMonth !== currentMonth) {
                                setSelectedMonth(currentMonth);
                            }
                            // Agar hozirgi oy selectda yo‘q bo‘lsa, qo‘shib qo‘y
                            setAvailableMonths((prev) => {
                                if (!prev.includes(currentMonth)) {
                                    return [...prev, currentMonth];
                                }
                                return prev;
                            });
                        }
                    }, { onlyOnce: true });
                    CloseModal();
                    DelateNotify({ DelateTitle: "Xarajat o'chirildi!" });
                })
                .catch((error) => {
                    console.error("Error removing data:", error);
                });
        }
    };
    // Search by expense name
    const handleSearchExpense = (value) => {
        const filteredExpenses = GetExpenses.filter((expense) =>
            expense.expenseName.toLowerCase().includes(value.toLowerCase()) ||
            expense.recipient.toLowerCase().includes(value.toLowerCase()) ||
            expense.date.toLowerCase().includes(value.toLowerCase()) ||
            expense.paymentType.toLowerCase().includes(value.toLowerCase()) ||
            expense.amount.toString().toLowerCase().includes(value.toLowerCase())
        );

        setGetExpenses(filteredExpenses);

        if (value === "") {
            const ExpensesRef = ref(database, "Expenses")
            onValue(ExpensesRef, (snapshot) => {
                const data = snapshot.val()
                setGetExpenses(Object.values(data || {}))
            })
        }
    }

    useEffect(() => {
        if (selectedMonth === getCurrentMonth()) {
            setAddExpense((prev) => ({
                ...prev,
                date: getCurrentDate(),
            }));
        } else {
            setAddExpense((prev) => ({
                ...prev,
                date: "",
            }));
        }
    }, [selectedMonth]);

    return (
        <>
            <ToastContainer />

            {
                IsOpen ? <Modal
                    title="Xarajat o'chirilsinmi?"
                    isOpen={IsOpen}
                    onClose={CloseModal}
                    positionTop="top-[40%]"
                    children={
                        <div className="flex justify-center items-center gap-8">
                            <Button variant="red" className="px-6" onClick={handleDelateExpense}>Ha</Button>
                            <Button variant="outline" className="px-6" onClick={() => setIsOpen(false)}>Yo'q</Button>
                        </div>
                    }
                /> : ""
            }

            <SidebarProvider>
                {isOpen && (
                    <div
                        className="fixed w-full h-[100vh] bg-black/50 backdrop-blur-[2px] z-30 inset-0 transition-all duration-900 ease-in-out"
                        onClick={() => {
                            setOpen(false);
                            setisOpen(false);
                        }}
                    ></div>
                )}
                <Sidebar
                    className={cn(
                        "fixed inset-y-0 right-0 z-50 w-[400px] border-l border-gray-300 bg-white transition-transform duration-300 ease-in-out",
                        !open ? "translate-x-full" : "translate-x-0"
                    )}
                    side="right"
                    collapsible="none"
                >
                    <SidebarHeader className="flex  items-center justify-between border border-gray-300 p-4">
                        <h2 className="text-xl font-semibold">Xarajat ma'lumotlarini o'zgartirish</h2>
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => {
                                setOpen(false);
                                setisOpen(false)
                            }}
                            className="rounded-full hover:bg-gray-100"
                        >
                            <X className="h-5 w-5" />
                            <span className="sr-only">Yopish</span>
                        </Button>
                    </SidebarHeader>
                    <SidebarContent>
                        <form
                            className="space-y-6 p-6 text-left"
                        >
                            <div className="flex flex-col gap-2">
                                <Label htmlFor="name">Nomi</Label>
                                <Input
                                    id="name"
                                    type="text"
                                    value={object.expenseName}
                                    onChange={(e) => setobject((prevState) => ({ ...prevState, expenseName: e.target.value }))}
                                />
                            </div>

                            <div className="flex flex-col gap-2">
                                <Label htmlFor="date">Sana</Label>
                                <Input
                                    id="date"
                                    type="date"
                                    className={style.input}
                                    value={AddExpense.date}
                                    onChange={(e) => {
                                        setAddExpense((prevState) => ({
                                            ...prevState,
                                            date: e.target.value || "",
                                        }));
                                    }}
                                    placeholder="YYYY-MM-DD"
                                />
                            </div>

                            <div className="flex flex-col gap-2">
                                <Label>
                                    Oluvchi
                                </Label>
                                <SelectReact
                                    value={SidebarRecipient || null}
                                    onChange={(e) => setChengeExpense(({ ...ChengeExpense, recipient: e.value }))}
                                    options={GetTeacher.map((teacher) => ({ value: teacher.name, label: teacher.name }))}
                                    placeholder="Oluvchini tanlang"
                                />
                            </div>

                            <div className="flex flex-col gap-2">
                                <Label htmlFor="amount">Sum</Label>
                                <Input
                                    id="amount"
                                    type="text"
                                    value={object.amount}
                                    onChange={(e) => setobject((prevState) => ({ ...prevState, amount: e.target.value }))}
                                />
                            </div>

                            <div className="flex flex-col gap-3">
                                <Label>To'lov turi</Label>
                                <div className="flex flex-col gap-2">
                                    <Label
                                        htmlFor="Cash"
                                        className="flex gap-2 items-center text-sm font-normal cursor-pointer"

                                    >
                                        <Checkbox
                                            id="Cash"
                                            checked={object.paymentType === "Naqt pul" ? true : false} // object.paymentType ni tekshirish
                                            className="rounded-full"
                                            onClick={() => {
                                                setobject((prevState) => ({
                                                    ...prevState,
                                                    paymentType: "Naqt pul",
                                                }))
                                            }}
                                        />
                                        Naqt pul
                                    </Label>
                                    <Label
                                        htmlFor="Card"
                                        className="flex gap-2 items-center text-sm font-normal cursor-pointer"
                                    >
                                        <Checkbox
                                            id="Card"
                                            checked={object.paymentType === "Plastik karta" ? true : false} // object.paymentType ni tekshirish
                                            onClick={() => {
                                                setobject((prevState) => ({
                                                    ...prevState,
                                                    paymentType: "Plastik karta",
                                                }))
                                            }}
                                            className="rounded-full"
                                        />
                                        Plastik karta
                                    </Label>
                                    <Label
                                        htmlFor="Click"
                                        className="flex gap-2 items-center text-sm font-normal cursor-pointer"

                                    >
                                        <Checkbox
                                            id="Click"
                                            checked={object.paymentType === "Click" ? true : false} // object.paymentType ni tekshirish
                                            className="rounded-full"
                                            onClick={() => {
                                                setobject((prevState) => ({
                                                    ...prevState,
                                                    paymentType: "Click",
                                                }))
                                            }}
                                        />
                                        Click
                                    </Label>
                                    <Label
                                        htmlFor="Bank"
                                        className="flex gap-2 items-center text-sm font-normal cursor-pointer"

                                    >
                                        <Checkbox
                                            id="Bank"
                                            checked={object.paymentType === "Bank hisobi" ? true : false} // object.paymentType ni tekshirish
                                            className="rounded-full"
                                            onClick={() => {
                                                setobject((prevState) => ({
                                                    ...prevState,
                                                    paymentType: "Bank hisobi",
                                                }))
                                            }}
                                        />
                                        Bank hisobi
                                    </Label>
                                </div>
                            </div>

                            <Button
                                variant="outline"
                                className="bg-blue-700 text-white"
                                onClick={(e) => handleUptadeExpenses(e)}
                            >
                                Saqlash
                            </Button>
                        </form>
                    </SidebarContent>
                </Sidebar>
            </SidebarProvider>

            <div className="Expenses">
                <SidebarPanel />

                <div
                    className="expenses p-6 flex flex-col gap-5"
                    style={{
                        marginLeft: "var(--sidebar-width, 250px)",
                        width: "var(--sidebar-width), 100%",
                        transition: "all 0.5s ease, background 0.3s ease, width 0.5s ease",
                    }}
                >
                    <nav className="w-full flex justify-start items-center gap-5">
                        <h3 className="text-3xl font-normal">Xarajatlar</h3>

                        <Select
                            value={selectedMonth}
                            onValueChange={e => setSelectedMonth(e)}
                        >
                            <SelectTrigger className="w-[150px]">
                                <SelectValue placeholder="Oyni tanlash" />
                            </SelectTrigger>
                            <SelectContent>
                                {
                                    availableMonths.map(month => (
                                        <SelectItem key={month} value={month}>
                                            {month}
                                        </SelectItem>
                                    ))
                                }
                            </SelectContent>
                        </Select>
                    </nav>

                    <Card className="w-full flex flex-col gap-8 py-6 bg-transparent border-transparent">
                        <CardContent className="HeaderTop w-full flex justify-between">
                            <div className="HeaderTopLeft w-[70%] flex flex-col gap-7">
                                <nav
                                    className="w-full h-[90px] before:left-[1px] before:rounded-lg before:w-[5px] before:h-full before:bg-blue-500 before:absolute relative bg-white shadow-xl p-5 rounded-xl flex justify-between items-center"
                                >
                                    <h3 className="text-2xl flex gap-1">
                                        Jami xarajat miqdori:
                                        <span>
                                            {Expenses
                                                ? new Intl.NumberFormat("uz-UZ").format(Expenses) + " UZS"
                                                : "0 UZS"
                                            }
                                        </span>
                                    </h3>
                                    <GrMoney className="text-2xl text-blue-500" />
                                </nav>
                                <ScatterChart expenses={GetExpenses} selectedMonth={selectedMonth} />
                            </div>
                            <Card className="w-[28%] p-5 flex flex-col gap-5 border-t-2 border-t-blue-500">
                                <h3 className="text-xl">Yangi xarajatlar</h3>
                                <div className="flex flex-col gap-6">
                                    <div className="flex flex-col gap-2">
                                        <Label htmlFor="name">Nomi</Label>
                                        <Input
                                            id="name"
                                            type="text"
                                            placeholder="Xarajat nomi"
                                            className={style.input}
                                            onChange={(e) => setAddExpense((prevState) => ({ ...prevState, expenseName: e.target.value }))}
                                            value={AddExpense.expenseName}
                                        />
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <Label htmlFor="date">Sana</Label>
                                        <Input
                                            id="date"
                                            type="date"
                                            className={style.input}
                                            value={AddExpense.date}
                                            onChange={(e) => {
                                                setAddExpense((prevState) => ({
                                                    ...prevState,
                                                    date: e.target.value || "",
                                                }));
                                            }}
                                            placeholder="YYYY-MM-DD"
                                        />
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <Label htmlFor="recipient">Oluvchi</Label>
                                        <SelectReact
                                            className="w-full"
                                            onChange={(e) => setAddExpense(({ ...AddExpense, recipient: e.value }))}
                                            options={GetTeacher.map((teacher) => ({ value: teacher.name, label: teacher.name }))}
                                            placeholder="Oluvchini tanlang"
                                        />
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <Label htmlFor="price">Sum</Label>
                                        <Input
                                            type="text"
                                            placeholder="Narxi"
                                            className={style.input}
                                            onChange={(e) => setAddExpense((prevState) => ({ ...prevState, amount: e.target.value }))}
                                            value={AddExpense.amount}
                                        />
                                    </div>
                                    <div className="flex flex-col gap-3">
                                        <Label>To'lov turi</Label>
                                        <div className="flex flex-col gap-2">
                                            <Label
                                                htmlFor="Cash"
                                                className="flex gap-2 items-center text-sm font-normal cursor-pointer"
                                                onClick={() => {
                                                    setchecked(checked === "Cash" ? "" : checked !== "Cash" ? "Cash" : ""),
                                                        setAddExpense((prevState) =>
                                                        ({
                                                            ...prevState,
                                                            paymentType: checked === "Cash" ? "" : checked !== "Cash" ? "Naqt pul" : ""
                                                        }))
                                                }}
                                            >
                                                <Checkbox
                                                    id="Cash"
                                                    checked={checked === "" ? false : checked === "Cash" ? true : false}
                                                    className="rounded-full"
                                                />
                                                Naqt pul
                                            </Label>
                                            <Label
                                                htmlFor="Card"
                                                className="flex gap-2 items-center text-sm font-normal cursor-pointer"
                                                onClick={() => {
                                                    setchecked(checked === "Card" ? "" : checked !== "Card" ? "Card" : ""),
                                                        setAddExpense((prevState) =>
                                                        ({
                                                            ...prevState,
                                                            paymentType: checked === "Card" ? "" : checked !== "Card" ? "Plastik karta" : ""
                                                        }))
                                                }}
                                            >
                                                <Checkbox
                                                    id="Card"
                                                    checked={checked === "" ? false : checked === "Card" ? true : false}
                                                    className="rounded-full"
                                                />
                                                Plastik karta
                                            </Label>
                                            <Label
                                                htmlFor="Click"
                                                className="flex gap-2 items-center text-sm font-normal cursor-pointer"
                                                onClick={() => {
                                                    setchecked(checked === "Click" ? "" : checked !== "Click" ? "Click" : ""),
                                                        setAddExpense((prevState) =>
                                                        ({
                                                            ...prevState,
                                                            paymentType: checked === "Click" ? "" : checked !== "Click" ? "Click" : ""
                                                        }))
                                                }}
                                            >
                                                <Checkbox
                                                    id="Click"
                                                    checked={checked === "" ? false : checked === "Click" ? true : false}
                                                    className="rounded-full"
                                                />
                                                Click
                                            </Label>
                                            <Label
                                                htmlFor="Bank"
                                                className="flex gap-2 items-center text-sm font-normal cursor-pointer"
                                                onClick={() => {
                                                    setchecked(checked === "Bank" ? "" : checked !== "Bank" ? "Bank" : ""),
                                                        setAddExpense((prevState) =>
                                                        ({
                                                            ...prevState,
                                                            paymentType: checked === "Bank" ? "" : checked !== "Bank" ? "Bank hisobi" : ""
                                                        }))
                                                }}
                                            >
                                                <Checkbox
                                                    id="Bank"
                                                    checked={checked === "" ? false : checked === "Bank" ? true : false}
                                                    className="rounded-full"
                                                />
                                                Bank hisobi
                                            </Label>
                                        </div>
                                    </div>
                                    <Button
                                        variant="outline"
                                        className="w-[80px] rounded-3xl bg-blue-700 text-white"
                                        onClick={(e) => handleAddExpense(e)}
                                    >
                                        Saqlash
                                    </Button>
                                </div>
                            </Card>
                        </CardContent>
                        <CardContent className="HeaderBottom w-full flex flex-col gap-5 pt-12 border-t border-t-gray-200">
                            <div className="w-full flex justify-between items-center">
                                <h3 className="text-xl ">
                                    Xarajatlar soni: {GetExpenses.length} ta
                                </h3>
                                <Input
                                    type="text"
                                    placeholder="Qidiruv"
                                    className={`${style.input} w-[300px]`}
                                    onChange={(e) => handleSearchExpense(e.target.value)}
                                />
                            </div>

                            <Table className={`${style.table} w-full`}>
                                <TableHeader>
                                    <TableRow className="hover:bg-white">
                                        <TableHead>ID</TableHead>
                                        <TableHead>Sana</TableHead>
                                        <TableHead>Nomi</TableHead>
                                        <TableHead>Oluvchi</TableHead>
                                        <TableHead>To'lov turi</TableHead>
                                        <TableHead>Sum</TableHead>
                                        <TableHead>Amallar</TableHead>
                                    </TableRow>
                                </TableHeader>
                                {
                                    GetExpenses.length > 0 ? (
                                        <TableBody>
                                            {GetExpenses.map((expense, index) => (
                                                <TableRow key={index}>
                                                    <TableCell>{expense.id}</TableCell>
                                                    <TableCell>{expense.date}</TableCell>
                                                    <TableCell>{expense.expenseName}</TableCell>
                                                    <TableCell>{expense.recipient}</TableCell>
                                                    <TableCell>{expense.paymentType}</TableCell>
                                                    <TableCell>
                                                        {expense.amount
                                                            ? new Intl.NumberFormat("uz-UZ").format(expense.amount) + " UZS"
                                                            : "0 UZS"}
                                                    </TableCell>
                                                    <TableCell className="flex gap-2 items-center">
                                                        <div
                                                            className="w-7 h-7 rounded-full border cursor-pointer border-yellow-500 flex justify-center items-center"
                                                            onClick={() => { setisOpen(true), setOpen(true), setExpensesId(expense.id) }}
                                                        >
                                                            <FaPencil className="text-base text-yellow-500" />
                                                        </div>
                                                        <div
                                                            className="w-7 h-7 rounded-full border cursor-pointer border-red-500 flex justify-center items-center"
                                                            onClick={() => (setIsOpen(true), setExpenseId(expense.id))}
                                                        >
                                                            <IoTrashOutline className="text-lg text-red-500" />
                                                        </div>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    ) : ""
                                }
                            </Table>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </>
    );
}

export default Expenses;