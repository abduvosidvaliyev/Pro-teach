import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./table"

export default function CourseList({ courses }) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Nomi</TableHead>
          <TableHead>Davomiyligi</TableHead>
          <TableHead>O'quvchilar</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {courses.map((course) => (
          <TableRow key={course.id}>
            <TableCell>{course.name}</TableCell>
            <TableCell>{course.duration}</TableCell>
            <TableCell>{course.students}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}

