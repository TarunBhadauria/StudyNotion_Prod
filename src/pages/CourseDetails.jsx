import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'
import { getCourseDetails } from '../services/operations/courseDetailsAPI';
import { buyCourse } from '../services/operations/paymentApi';
import StarRatings from 'react-star-ratings';
import { FaLanguage } from 'react-icons/fa'
import { GoInfo } from 'react-icons/go'
import CourseCard from '../components/core/CoursePage/CourseCard';
import Loader from '../components/common/Loader';
import Footer from '../components/common/Footer';

import CourseContent from '../components/core/CoursePage/CourseContent';
const CourseDetails = () => {

  const { token } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { courseId } = useParams();
  const user = useSelector((state) => state.profile)
  const handlePayment = () => {
    if (token) {
      buyCourse(user, token, [courseId], navigate, dispatch);
      return;
    }
  }

  const [courseData, setCourseData] = useState(null);
  const [showSection, setShowSection] = useState(false);
  
  const courseDetails = async () => {

    const response = await getCourseDetails(courseId, token);
    const courseDetails = await response?.data?.data?.courseDetails;
    // console.log(courseDetails.courseName)
    setCourseData(courseDetails);

  }

  useEffect(() => {
    courseDetails();
    // console.log("CourseData", courseData)
  }, []);

  return (
    <div>
      {!courseData ? <Loader /> :
        <div className=' mx-auto  text-richblack-5 space-y-4'>
          <div className=' bg-richblack-800 px-8 py-24 relative flex justify-between items'>

            <div className='w-11/12 max-w-maxContent mx-auto'>
              {/* Left section */}
              <div className='flex flex-col gap-2 items-start justify-center'>
                <p className='text-3xl font-semiBold'>{courseData.courseName}</p>
                <p className='text-sm text-richblack-200'>{courseData.courseDescription}</p>
                <div className='flex items-center justify-center  gap-2'>
                  <p className='text-yellow-100 text-lg font-bold'>4</p>
                  <StarRatings
                    rating={4}
                    starRatedColor="yellow"
                    numberOfStars={5}
                    name='4.5'
                    starDimension="20px"
                    starSpacing="5px"
                  />
                  <p className='text-richblack-25'>({courseData.ratingAndReviews.length}) Ratings {courseData.studentsEnrolled.length}   Student's Enrolled</p>
                </div>
                <p className='text-richblack-25'>Created By {courseData.instructor.firstName} {courseData.instructor.lastName}</p>
                <div className='flex gap-4 items-center'>
                  <div className='flex items-center gap-2'>
                    <GoInfo size={22} />
                    <p>Created At 02/2023</p>
                  </div>
                  <div className='flex items-center gap-2'>
                    <FaLanguage size={25} />
                    <p>English</p>
                  </div>
                </div>
              </div>

              {/* Right Section */}
              <div>
                <CourseCard image={courseData.thumbnail} price={courseData.price} handlePayment={handlePayment} user={user} courseId={courseId} course = {courseData}/>
              </div>

            </div>

          </div>
          {/* What you will learn */}
          <div className='space-y-4 px-32 w-11/12 max-w-maxContent'>
            <div className='p-8 space-y-4 outline outline-2 w-[80%] outline-richblack-700'>
              <p className='text-3xl font-semibold'>What you'll learn</p>
              <ul className='text-richblack-50 capitalize space-y-2'>
                <li>{courseData.whatYouWillLearn}</li>
                <li>Learn object oriented programming in Python</li>
                <li>Learn how to make your own web-scraping tool using Python</li>
                <li>Know how to Read and Parse JSON and XML files</li>
              </ul>
            </div>
            {/* About The Author */}
            <div className='space-y-2'>
              <p className='text-2xl'>Author</p>
              <div className='flex items-center justify-start gap-2'>
                <img src={courseData.instructor.image} className="rounded-full w-14" alt='Instructor ' />
                <p className='text'>{courseData.instructor.firstName} {courseData.instructor.lastName}</p>
              </div>
              <p className='text-sm text-richblack-50'>I will be your lead trainer in this course. Within no time, I will help you to understand the <br /> subject in an easy manner.
                I have a huge experience in online training and recording videos. Let's get started!</p>
            </div>
            {/* Course Content */}
            <div className='w-[80%] space-y-2'>
              <div>
                <p className='text-3xl font-semibold'>Course content</p>
                <div className='flex justify-between gap-10'>
                  <p>{courseData.courseContent.length} sections • {courseData.courseContent.length} lectures • 2h 27min total length</p>
                  <p className='text-yellow-50 hover:cursor-pointer' onClick={()=>{setShowSection((false))}}>Collapse all sections</p>
                </div>
              </div>
              {courseData.courseContent.map((course,index)=>(
                <CourseContent key={index} showSection={showSection} setShowSection={setShowSection} courseData={course}/>
              ))}
            </div>
          </div>


        </div>

      }
      <Footer />
    </div>
  )
}

export default CourseDetails