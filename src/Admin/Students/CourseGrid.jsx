import { useState, useEffect } from 'react';
import { CourseCard } from './CourseCard';
import imageGotcha from '../../assets/gotcha.png';
import { onValueData } from "../../FirebaseData";

const CourseGrid = ({ student }) => {
  const [courses, setCourses] = useState([]);
  const [groupsData, setGroupsData] = useState(null); // Default qiymatni `null` qilib qo'ydik
  const [courseAbout, setCourseAbout] = useState([]);

  useEffect(() => {
    if (!student?.group) return;

    const unsubscribe = onValueData(`Groups/${student.group}`, (data) => {
      setGroupsData(data);
    });

    return () => unsubscribe();
  }, [student.group]);

  useEffect(() => {
    if (!groupsData?.courses) return;

    const unsubscribe = onValueData(`Courses/${groupsData.courses}`, (data) => {
      setCourseAbout(data);
    });

    return () => unsubscribe();
  }, [groupsData]);

  useEffect(() => {
    if (!groupsData || !courseAbout) return;

    const newStudent = {
      studentName: student.studentName,
      groupName: student.group,
      balance: student.balance,
      teacher: groupsData.teachers || "Hali kiritilmagan",
      payment: courseAbout.price || 0,
      days: groupsData.selectedDays,
      startDate: student.addedDate,
    };

    setCourses([newStudent]);
  }, [groupsData, courseAbout, student]);

  return (
    <div className={`grid ${groupsData ? "md:grid-cols-2" : "grid-cols-1"} gap-6 p-4`}>
      {Array.isArray(courses) && courses.some(course => course.groupName) ? (
        courses.map((course, index) => (
          <CourseCard key={index} course={course} />
        ))
      ) : (
        <div className="flex flex-col items-center justify-center w-full h-full">
          <img src={imageGotcha} alt="No groups available" className="w-40 h-40" />
          <p className="text-gray-500 mt-4">Guruhlar mavjud emas</p>
        </div>
      )}
    </div>
  );
};

export default CourseGrid;