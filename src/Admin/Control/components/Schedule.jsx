import { useEffect, useState } from "react"
import { onValueData } from "../../../FirebaseData"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../../components/ui/table"
import { FaPencil } from "react-icons/fa6"
import { Button } from "../../../components/ui/button"

const Schedule = () => {
    const [Lessondays, setLessondays] = useState([])

    useEffect(() => {
      onValueData("System/LessonDays", (data) =>{
        setLessondays(data || {})
      })
    }, [])
    
    return (
        <>
            <h1 className="text-2xl font-semibold pb-6 border-b border-b-gray-200">
                Ish tartibi
            </h1>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Kun</TableHead>
                        <TableHead>Ish boshlanishi</TableHead>
                        <TableHead>Ish tugashi</TableHead>
                        <TableHead>Tanaffus</TableHead>
                        <TableHead>Izoh</TableHead>
                        <TableHead>Amallar</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {Lessondays.length > 0 ? (
                        Lessondays.map((day, index) => {
                            return (
                                <TableRow key={index}>
                                    <TableCell>{day.day}</TableCell>
                                    <TableCell>{day.startWork}</TableCell>
                                    <TableCell>{day.finishWork}</TableCell>
                                    <TableCell>{day.abreak}</TableCell>
                                    <TableCell>{day.description === "" ? "_" : day.description.slice(0, 30) + "..."}</TableCell>
                                    <TableHead>
                                        <Button className="text-yellow-400 bg-yellow-200/60 text-sm flex items-center gap-1">
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
        </>
    )
}

export default Schedule