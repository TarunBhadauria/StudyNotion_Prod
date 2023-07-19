import React from 'react'
import { useState } from 'react'
import { Pie } from 'react-chartjs-2';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

const InstructorChart = ({ courses }) => {
    const [currentData, setCurrentData] = useState("students");
    // console.log("data", courses);
    const getRandomColors = (colorsLength) => {
        let colors = []
        for (let i = 0; i < colorsLength; i++) {
            const color = `rgb(${Math.floor(Math.random() * 256)},${Math.floor(Math.random() * 256)},${Math.floor(Math.random() * 256)})`
            colors.push(color);
        }
        return colors;
    }

    // Create Sutdents data
    const studentsData = {
        labels: courses.map((course) => course.courseName),
        datasets: [
            {
                data: courses.map((course) => course.studentsEnrolled.length),
                backgroundColor: getRandomColors(courses.length)
            }
        ]
    }
    // // Create Income Data 
    const incomeData = {
        labels: courses.map((course) => course.courseName),
        datasets: [
            {
                data: courses.map((course) => course.price),
                backgroundColor: getRandomColors(courses.length)
            }
        ]
    }

    // Create Options

    const options = {
            maintainAspectRatio:false
    }


    return (
        <div className='text-white my-4 space-y-2 h-full  bg-richblack-800 p-6 rounded-md'>
            <h2 className='text-lg font-bold '>Visualize</h2>
            <div className='flex items-center gap-2'>
                <button className={`${currentData === "students" ? "bg-richblack-600 text-yellow-100 font-semibold rounded-md" : ""} px-3 py-2`}
                    onClick={() => { setCurrentData("students") }}>
                    Students
                </button>
                <button className={`${currentData === "income" ? "bg-richblack-600 text-yellow-100 font-semibold rounded-md" : ""} px-3 py-2`}
                    onClick={() => { setCurrentData("income") }}>
                    Income
                </button>
            </div>
            <div className=' h-[80%]  mx-auto mt-4 '>
                <Pie
                    data={currentData === "students" ? studentsData : incomeData}
                    options={options}
                />
            </div>
        </div>
    )
}

export default InstructorChart