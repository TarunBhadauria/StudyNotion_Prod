import React from 'react'
import { useState } from 'react';
import { useEffect } from 'react'
import { getInstructorCourses } from '../../../../services/operations/profileAPI';
import { useSelector } from 'react-redux';
import { fetchInstructorCourses } from '../../../../services/operations/courseDetailsAPI';
import InstructorChart from './InstructorChart';
import Loader from "../../../common/Loader"
import { Link } from 'react-router-dom';
const InstructorDashboard = () => {
    const { token } = useSelector((state) => state.auth);
    const [loading, setLoading] = useState(false);
    const [instructorData, setInstructorData] = useState(null);
    const [courseData, setCourseData] = useState([]);
    const { user } = useSelector((state) => state.profile);

    const getInstructorDetails = async () => {
        setLoading(true)
        const { data } = await getInstructorCourses(token);
        const result = await fetchInstructorCourses(token);
        // console.log("Instructior Dashboard response ", data);
        // console.log("Instructor courses response", result);
        if (data.length) {
            setInstructorData(data);
        }
        if (result) {
            setCourseData(result);
        }
        setLoading(false);

    }

    useEffect(() => {
        getInstructorDetails();

    }, [])

    const totalAmountGenerated = instructorData?.reduce((acc, curr) => acc + curr.totalAmount, 0);
    const totalStudentsEnrolled = instructorData?.reduce((acc, curr) => acc + curr.totalStudents, 0);

    return (
        <div className=''>
            {loading ? <Loader /> :

                <div className='text-white   '>
                    <div className='space-y-1'>
                        <h1 className='text-2xl font-semibold'>Hi {user.firstName} <span className='text-2xl'>👋</span></h1>
                        <p className='text-richblack-200 text-lg'>Let's start something new</p>
                    </div>
                    {courseData.length > 0 ? (
                        <div className='space-y-8'>
                            <div className='flex items-baseline lg:h-[450px] justify-between gap-4 '>
                                {/* Instructor Chart */}
                                <div className='flex-1 h-full'>
                                    <InstructorChart courses={courseData} />
                                </div>
                                {/* Instructor courses */}
                                <div className='h-full'>
                                    <div className='bg-richblack-800 rounded-md min-w-[250px] flex flex-col  items-start px-8 justify-start py-6 gap-6 h-full'>
                                        <div>
                                            <h2 className='text-xl font-semibold'>Statistics</h2>
                                        </div>
                                        <div className=''>
                                            <p className='text-richblack-400 text-xl'>Total Courses</p>
                                            <p className='text-3xl text-richblack-50'>{courseData.length}</p>
                                        </div>
                                        <div className='text-richblack-400 text-xl'>
                                            <p>Total Students</p>
                                            <p className='text-3xl text-richblack-50'>{totalStudentsEnrolled}</p>
                                        </div>
                                        <div className='text-richblack-400 text-xl'>
                                            <p>Total Income</p>
                                            <p className='text-3xl text-richblack-50'>₹ {totalAmountGenerated}</p>
                                        </div>

                                    </div>
                                </div>

                            </div>
                            <div className='bg-richblack-800 rounded-md p-6'>
                                <div className='flex  justify-between gap-12  items-center'>
                                    <p className='text-xl font-semibold text-richblack-50'>Your Courses</p>
                                    <Link to="/dashboard/my-courses" className='text-yellow-50'>View All</Link>
                                </div>
                                <div className='flex py-2 items-center justify-center gap-6'>
                                    {courseData.slice(0, 3).map((course,index) => (
                                        <div key={index} className='w-[30%] space-y-2 '>
                                            <img src={course.thumbnail} className='w-full h-[200px] object-cover rounded-md ' />
                                            <p className='capitalize text-lg'>{course.courseName}</p>
                                            <div className='flex items-center text-sm text-richblack-400 gap-2'>
                                                <p>{course.studentsEnrolled.length} Students</p>
                                                <span>|</span>
                                                <p>Rs. {course.price} </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className=' w-full  h-[50%] overflow-x-hidden my-auto flex justify-center items-center'>
                            <div className='bg-richblack-800 my-auto  py-20 rounded-md w-full max-w-maxContent '>
                                <div className='flex flex-col gap-2 justify-center items-center'>
                                    <p className='text-2xl font-semibold text-richblack-5 '>You have not created any courses yet</p>
                                    <Link to={"/dashboard/add-course"} className='font-semibold text-yellow-50'>Crate a Course</Link>
                                </div>
                            </div>

                        </div>
                    )}

                </div>

            }
        </div>
    )
}

export default InstructorDashboard