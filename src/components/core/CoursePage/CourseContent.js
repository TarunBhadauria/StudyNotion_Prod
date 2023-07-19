import React from 'react'
import { MdKeyboardArrowUp } from "react-icons/md"
import { GoDeviceDesktop } from "react-icons/go"

const CourseContent = ({ courseData, showSection, setShowSection }) => {
    // console.log("courseData", courseData)
    return (
        <div>
            <div className='flex justify-between px-3 py-4 bg-richblack-600 items-center ' onClick={() => { setShowSection(!showSection) }}>
                <div className='flex gap-2 items-center'>
                    <MdKeyboardArrowUp size={25} className={`${showSection ? "rotate-180" : ""} transition-all duration-200`} />
                    <p>{courseData.sectionName}</p>
                </div>
                <div className='flex gap-2 items-center'>
                    <p className='text-yellow-50'>{courseData.subSection.length} Lectures</p>
                    <p>51 min</p>
                </div>
            </div>
            {courseData.subSection.map((subSection,index) => (
                <div key={index} className={`${showSection ? "flex h-10" : "h-0 overflow-hidden flex"} transition-all duration-200 mt-4 justify-between items-center px-6 `}>
                    <div className='flex gap-2 items-center'>
                        <GoDeviceDesktop />
                        <p>{subSection.title}</p>
                    </div>
                    <p>2:09</p>
                </div>
            ))}
        </div>
    )
}

export default CourseContent