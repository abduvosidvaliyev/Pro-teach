"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs"
import { Button } from "../components/ui/button"
import { Input } from "../components/ui/input"
import { Label } from "../components/ui/Label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/ui/table"
import { Badge } from "../components/ui/badge"
import { Pie, PieChart, ResponsiveContainer, Cell, Legend, Tooltip } from "recharts"
import { UserPlus, Users, Trash2, UserCheck } from "lucide-react"
// import { useNavigate, Link } from 'react-router-dom';

const initialLeads = [
  {
    id: 1,
    name: "Alisher Zokirov",
    phone: "+998 90 123 45 67",
    status: "Yangi",
    source: "Veb-sayt",
    date: "2023-06-20",
    course: "Web dasturlash",
    time: "Abetdan oldin",
    notes: "Web dasturlash kursi bilan qiziqdi",
  },
  {
    id: 2,
    name: "Malika Rahimova",
    phone: "+998 90 234 56 78",
    status: "Qiziqgan",
    source: "Instagram",
    date: "2023-06-19",
    course: "Data Science",
    time: "Abetdan keyin",
    notes: "Data Science kursi haqida so'radi",
  },
  {
    id: 3,
    name: "Bobur Aliyev",
    phone: "+998 90 345 67 89",
    status: "Kutilmoqda",
    source: "Tavsiya",
    date: "2023-06-18",
    course: "Mobile dasturlash",
    time: "Abetdan oldin",
    notes: "Mobile dasturlash kursiga yozilmoqchi",
  },
  {
    id: 4,
    name: "Nilufar Karimova",
    phone: "+998 90 456 78 90",
    status: "Qayta aloqa",
    source: "Facebook",
    date: "2023-06-17",
    course: "UI/UX dizayn",
    time: "Abetdan keyin",
    notes: "UI/UX dizayn kursi bilan qiziqdi",
  },
  {
    id: 5,
    name: "Jasur Umarov",
    phone: "+998 90 567 89 01",
    status: "Yopilgan",
    source: "Google",
    date: "2023-06-16",
    course: "Python",
    time: "Abetdan oldin",
    notes: "Python kursi uchun to'lov qildi",
  },
]

const statusColors = {
  Yangi: "bg-blue-500",
  Qiziqgan: "bg-yellow-500",
  Kutilmoqda: "bg-purple-500",
  Yopilgan: "bg-green-500",
}


const sourceData = [
  { name: "Veb-sayt", value: 35 },
  { name: "Instagram", value: 25 },
  { name: "Facebook", value: 20 },
  { name: "Google", value: 15 },
  { name: "Tavsiya", value: 5 },
]

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"]

const courses = [
  "Web dasturlash",
  "Data Science",
  "Mobile dasturlash",
  "UI/UX dizayn",
  "Python",
  "Java",
  "JavaScript",
  "React",
]

export default function LeadsPage() {
  const [leads, setLeads] = useState(initialLeads)
  const [newLead, setNewLead] = useState({
    name: "",
    phone: "",
    status: "Yangi",
    source: "",
    course: "",
    time: "",
    notes: "",
  })
  const [filterStatus, setFilterStatus] = useState("all")

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setNewLead({ ...newLead, [name]: value })
  }

  const handleStatusChange = (value) => {
    setNewLead({ ...newLead, status: value })
  }

  const handleSourceChange = (value) => {
    setNewLead({ ...newLead, source: value })
  }

  const handleCourseChange = (value) => {
    setNewLead({ ...newLead, course: value })
  }

  const handleTimeChange = (value) => {
    setNewLead({ ...newLead, time: value })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const id = leads.length + 1
    const date = new Date().toISOString().split("T")[0]
    setLeads([...leads, { ...newLead, id, date }])
    setNewLead({ name: "", phone: "", status: "Yangi", source: "", course: "", time: "", notes: "" })
  }

  const filteredLeads = filterStatus === "all" ? leads : leads.filter((lead) => lead.status === filterStatus)

  const handleDeleteLead = (id) => {
    setLeads(leads.filter((lead) => lead.id !== id))
  }

  const handleAddToGroup = (id) => {
    // Bu yerda guruhga qo'shish logikasini amalga oshirish kerak
    console.log(`Lid ${id} guruhga qo'shildi`)
  }

  return (
    <div className="container mx-auto p-4 space-y-8">
      <h1 className="text-3xl font-bold mb-4">Lidlar boshqaruvi</h1>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Jami Lidlar</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{leads.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Yangi Lidlar</CardTitle>
            <UserPlus className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{leads.filter((lead) => lead.status === "Yangi").length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Lidlar manbasi</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={sourceData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {sourceData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Legend />
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="list" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="list">Lidlar ro'yxati</TabsTrigger>
          <TabsTrigger value="add">Yangi lid qo'shish</TabsTrigger>
        </TabsList>
        <TabsContent value="list">
          <Card>
            <CardHeader>
              <CardTitle>Lidlar ro'yxati</CardTitle>
              <CardDescription>Barcha lidlar va ularning ma'lumotlari</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex justify-end mb-4">
                <Select onValueChange={setFilterStatus} defaultValue={filterStatus}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Status bo'yicha filtrlash" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Barchasi</SelectItem>
                    <SelectItem value="Yangi">Yangi</SelectItem>
                    <SelectItem value="Qiziqgan">Qiziqgan</SelectItem>
                    <SelectItem value="Kutilmoqda">Kutilmoqda</SelectItem>
                    <SelectItem value="Qayta aloqa">Qayta aloqa</SelectItem>
                    <SelectItem value="Yopilgan">Yopilgan</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Ism</TableHead>
                    <TableHead>Telefon</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Manba</TableHead>
                    <TableHead>Kurs</TableHead>
                    <TableHead>Vaqt</TableHead>
                    <TableHead>Sana</TableHead>
                    <TableHead>Amallar</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredLeads.map((lead) => (
                    <TableRow key={lead.id}>
                      <TableCell className="font-medium">{lead.name}</TableCell>
                      <TableCell>{lead.phone}</TableCell>
                      <TableCell>
                        <Badge variant="default" className={statusColors[lead.status]}>{lead.status}</Badge>
                      </TableCell>
                      <TableCell>{lead.source}</TableCell>
                      <TableCell>{lead.course}</TableCell>
                      <TableCell>{lead.time}</TableCell>
                      <TableCell>{lead.date}</TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button variant="secondary" size="sm" onClick={() => handleAddToGroup(lead.id)}>
                            <UserCheck className="w-4 h-4 mr-2" />
                            Guruhga qo'shish
                          </Button>
                          <Button size="sm" variant="red" onClick={() => handleDeleteLead(lead.id)}>
                            <Trash2 className="w-4 h-4 mr-2" />
                            O'chirish
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="add">
          <Card>
            <CardHeader>
              <CardTitle>Yangi lid qo'shish</CardTitle>
              <CardDescription>Yangi lid ma'lumotlarini kiriting</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Ism</Label>
                    <Input id="name" name="name" value={newLead.name} onChange={handleInputChange} required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Telefon</Label>
                    <Input id="phone" name="phone" value={newLead.phone} onChange={handleInputChange} required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="status">Status</Label>
                    <Select onValueChange={handleStatusChange} defaultValue={newLead.status}>
                      <SelectTrigger>
                        <SelectValue placeholder="Status tanlang" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Yangi">Yangi</SelectItem>
                        <SelectItem value="Qiziqgan">Qiziqgan</SelectItem>
                        <SelectItem value="Kutilmoqda">Kutilmoqda</SelectItem>
                        <SelectItem value="Qayta aloqa">Qayta aloqa</SelectItem>
                        <SelectItem value="Yopilgan">Yopilgan</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="source">Manba</Label>
                    <Select onValueChange={handleSourceChange} defaultValue={newLead.source}>
                      <SelectTrigger>
                        <SelectValue placeholder="Manba tanlang" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Veb-sayt">Veb-sayt</SelectItem>
                        <SelectItem value="Instagram">Instagram</SelectItem>
                        <SelectItem value="Facebook">Facebook</SelectItem>
                        <SelectItem value="Google">Google</SelectItem>
                        <SelectItem value="Tavsiya">Tavsiya</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="course">Kurs</Label>
                    <Select onValueChange={handleCourseChange} defaultValue={newLead.course}>
                      <SelectTrigger>
                        <SelectValue placeholder="Kurs tanlang" />
                      </SelectTrigger>
                      <SelectContent>
                        {courses.map((course) => (
                          <SelectItem key={course} value={course}>
                            {course}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="time">Vaqt</Label>
                    <Select onValueChange={handleTimeChange} defaultValue={newLead.time}>
                      <SelectTrigger>
                        <SelectValue placeholder="Vaqt tanlang" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Abetdan oldin">Abetdan oldin</SelectItem>
                        <SelectItem value="Abetdan keyin">Abetdan keyin</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2 col-span-2">
                    <Label htmlFor="notes">Qo'shimcha ma'lumot</Label>
                    <Input id="notes" name="notes" value={newLead.notes} onChange={handleInputChange} />
                  </div>
                </div>
                <Button type="submit" className="w-full">
                  <UserPlus className="w-4 h-4 mr-2" />
                  Yangi lid qo'shish
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

