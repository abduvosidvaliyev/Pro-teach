import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./table"

export default function StudentList({ students }) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Ism</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Kurs</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {students.map((student) => (
          <TableRow key={student.id}>
            <TableCell>{student.name}</TableCell>
            <TableCell>{student.email}</TableCell>
            <TableCell>{student.course}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}

