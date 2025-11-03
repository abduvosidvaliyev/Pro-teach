import { useEffect, useState } from "react";
import { onValueData } from "../../FirebaseData";

const Course = () => {
    const [CourseData, setCourseData] = useState([])

    useEffect(() => {
        onValueData("Courses", (data) => {
            const courseArray = Object.values(data || {});

            setCourseData(courseArray);
        });
    }, [])


    return (
        <div>
            <h1 className='text-3xl font-bold'>Course</h1>
            <div className="flex flex-col gap-2 mt-4">
                <div className="flex items-center gap-2">
                    <span className="font-semibold">Courses:</span>
                    {CourseData.map((course, index) => (
                        <span key={index} className="text-gray-600">{course.name}</span>
                    ))}
                </div>
                <div className="flex items-center gap-2">
                    <span className="font-semibold">Duration:</span>
                    <span>6 months</span>
                </div>
                <div className="flex items-center gap-2">
                    <span className="font-semibold">Instructor:</span>
                    <span>John Doe</span>
                </div>
            </div>
        </div>
    )
}

export default Course