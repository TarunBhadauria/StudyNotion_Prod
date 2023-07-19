import React from 'react'
import { useEffect } from 'react';
import { useState } from 'react'
import { useSelector } from 'react-redux';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import IconBtn from '../../common/IconBtn';
import { MdKeyboardArrowLeft, MdKeyboardArrowUp, MdKeyboardArrowDown } from 'react-icons/md'

const CourseVideoDetails = ({ setModalData }) => {

  const [activeSection, setActiveSection] = useState("");
  const [videoBar, setVideoBar] = useState("");
  const location = useLocation();
  const {
    courseEntireData,
    completedLectures,
    totalNoOfLectures,
    courseSectionData
  } = useSelector((state) => state.viewCourse);
  const navigate = useNavigate();
  const { sectionId, subSectionId } = useParams();


  const updateFlags = () => {

    if (!courseSectionData.length) {
      return;
    }

    const currentSectionIndex = courseSectionData.findIndex(
      (data) => data._id === sectionId);
    const currentSubSectionIndex = courseSectionData[currentSectionIndex]?.subSection.findIndex(
      (data) => data._id === subSectionId);

    const activeSectionId = courseSectionData[currentSectionIndex]?._id;
    const activeSubSectionId = courseSectionData[currentSectionIndex]?.subSection[currentSubSectionIndex]?._id;


    setActiveSection(activeSectionId);
    setVideoBar(activeSubSectionId);

  }

  useEffect(() => {
    updateFlags();
    // eslint-disable-next-line
  }, [courseEntireData, courseSectionData, location.pathname]);



  return (
    <div className=' bg-richblack-700 lg:h-[680px]'>

      <div className='bg-richblack-800 flex flex-col text-richblack-25 '>
        {/* Buttons */}
        <div className='flex flex-col justify-center  items-start mx-auto'>
          <div className='flex gap-14 items-center justify-center py-6'>
            <div className='p-2 rounded-full hover:scale-90 bg-richblack-200' onClick={() => { navigate("/dashboard/enrolled-courses") }}>
              <MdKeyboardArrowLeft size={25} className="text-richblack-800" />
            </div>
            <div>
              <IconBtn text={"Add Review"} onclick={() => { setModalData(true) }} />
            </div>
          </div>

          {/* Text and lectures */}
          <div className=''>
            <h1 className='text-xl font-bold'>{courseEntireData.courseName}</h1>
            <p className='text-richblack-500'>{completedLectures.length}/{totalNoOfLectures}</p> 
          </div>
        </div>

        <div className='w-[90%] mx-auto my-2 border-b-2 border-richblack-500'>

        </div>

        {/* Section and Sub Section  */}

        <div>
          {
            courseSectionData.map((section) => (
              <div>
                <div key={section._id} onClick={() => { setActiveSection(section._id) }} className='bg-richblack-600 flex p-4 text-richblack-100 justify-between gap-4'>
                  <p className=' text-richblack-5 font-bold'>{section.sectionName}</p>
                  {activeSection === section._id ? (<MdKeyboardArrowDown />) : (<MdKeyboardArrowUp />)}
                </div>
                {activeSection === section._id &&
                  section.subSection.map((subSection, index) => (
                    <div className={`flex gap-2 p-2 items-center justify-start  hover:cursor-pointer  ${videoBar === subSection._id ? "bg-yellow-200 text-richblack-800" : "bg-richblack-800 text-richblack-25 hover:bg-richblack-900"}`}
                      onClick={() => {
                        navigate(`/view-course/${courseEntireData._id}/section/${section._id}/sub-section/${subSection._id}`)
                        setVideoBar(subSection._id)
                      }} key={subSection._id}>
                      <input type={'checkbox'} checked={completedLectures.includes(subSection._id)} />
                      <p>{subSection.title}</p>
                    </div>
                  ))}

              </div>


            ))
          }
        </div>


      </div>

    </div>
  )
}

export default CourseVideoDetails