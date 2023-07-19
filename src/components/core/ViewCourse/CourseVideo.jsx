import React, { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
// import { BsFillPlayFill } from 'react-icons/bs'
import IconBtn from '../../common/IconBtn';
import { Player } from 'video-react';
import "../../../../node_modules/video-react/dist/video-react.css"
import Loader from '../../common/Loader';
import { markLectureAsComplete } from '../../../services/operations/courseDetailsAPI';
import { setCompletedLectures } from '../../../slices/viewCourseSlice';

const CourseVideo = () => {


  const { courseId, sectionId, subSectionId } = useParams();
  const {
    courseEntireData,
    // completedLectures,
    // totalNoOfLectures,
    courseSectionData
  } = useSelector((state) => state.viewCourse);

  const { token } = useSelector((state) => state.auth)

  const playerRef = useRef();

  const location = useLocation();
  const navigate = useNavigate();

  const [videoData, setVideoData] = useState(null);
  const [isVideoCompleted, setIsVideoCompleted] = useState(false);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  const isFirstVideo = () => {

    const currentSectionIndex = courseSectionData.findIndex((sectionData) => sectionData._id === sectionId);


    const currentSubSectionIndex = courseSectionData[currentSectionIndex].subSection.findIndex((subSectionData) => subSectionData._id === subSectionId);
    if (currentSectionIndex === 0 && currentSubSectionIndex === 0) {
      return true;
    }
    else {
      return false;
    }
  }

  const isLastVideo = () => {
    const currentSectionIndex = courseSectionData.findIndex((sectionData) => sectionData._id === sectionId);

    const noOfSubSections = courseSectionData[currentSectionIndex].subSection.length;

    const currentSubSectionIndex = courseSectionData[currentSectionIndex].subSection.findIndex((subSectionData) => subSectionData._id === subSectionId);

    if (currentSectionIndex === courseSectionData.length - 1 && currentSubSectionIndex === noOfSubSections - 1) {
      return true;
    }
    else {
      return false;
    }


  }

  const goToNextVideo = () => {
    const currentSectionIndex = courseSectionData.findIndex((sectionData) => sectionData._id === sectionId);

    const noOfSubSections = courseSectionData[currentSectionIndex].subSection.length;

    const currentSubSectionIndex = courseSectionData[currentSectionIndex].subSection.findIndex((subSectionData) => subSectionData._id === subSectionId);

    if (currentSubSectionIndex !== noOfSubSections - 1) {

      const nextSubSectionId = courseSectionData[currentSectionIndex].subSection[currentSubSectionIndex + 1]._id;

      // go to next video
      navigate(`/view-course/${courseId}/section/${sectionId}/sub-section/${nextSubSectionId}`);

    }

    else {
      const nextSectionId = courseSectionData[currentSectionIndex + 1]._id;
      const nextSubSectionId = courseSectionData[currentSectionIndex + 1].subSection[0]._id;

      // goto next video
      navigate(`/view-course/${courseId}/section/${nextSectionId}/sub-section/${nextSubSectionId}`);



    }
    setIsVideoCompleted(false);
  }
  const gotoPrevVideo = () => {

    const currentSectionIndex = courseSectionData.findIndex((sectionData) => sectionData._id === sectionId);

    const currentSubSectionIndex = courseSectionData[currentSectionIndex].subSection.findIndex((subSectionData) => subSectionData._id === subSectionId);

    if (currentSubSectionIndex !== 0) {
      const previousSubSectionIndex = courseSectionData[currentSectionIndex].subSection[currentSubSectionIndex - 1]._id;
      // Go to precious video
      navigate(`/view-course/${courseId}/section/${sectionId}/sub-section/${previousSubSectionIndex}`);

    }

    else {
      const previousSectionId = courseSectionData[currentSectionIndex - 1]._id;
      const previousSubSectionLength = courseSectionData[currentSectionIndex - 1].subSection.length;
      const previousSubSectionId = courseSectionData[currentSectionIndex - 1].subSection[previousSubSectionLength - 1]._id;

      // Goto Previous Video

      navigate(`/view-course/${courseId}/section/${previousSectionId}/sub-section/${previousSubSectionId}`);
    }

    setIsVideoCompleted(false);


  }

  const getVideoDetails = async () => {

    setLoading(true)

    if (courseSectionData.length === 0) {
      return
    }
    if (!courseId && !sectionId && !subSectionId) {
      navigate('/dashboard/enrolled-courses');
    }

    else {
      const filteredSection = courseSectionData.filter((sectionData) => sectionData._id === sectionId);

      const filteredSubSection = filteredSection?.[0].subSection.filter((subSectionData) => subSectionData._id === subSectionId);


      setVideoData(filteredSubSection[0]);

    }
    setLoading(false);
  }

  const handleLectureCompletion = async () => {
    const result = await markLectureAsComplete({ courseId, subSectionId }, token);

    if (result) {
      // console.log(result?.data?.data?.completedVideos);
      dispatch(setCompletedLectures(result?.data?.data?.completedVideos));
      setIsVideoCompleted(false);
    }

  }

  const rewatchVideo = () => {
    if (playerRef.current) {
      playerRef.current.seek(0);
      playerRef.current.play();
      setIsVideoCompleted(false);
    }
  }

  useEffect(() => {
    getVideoDetails();
    // console.log("courseSectionData", courseSectionData);
    // eslint-disable-next-line
  }, [courseEntireData, courseSectionData, location.pathname])

  return (
    <div>
      {loading ? (
        <div className='w-full text-white  flex items-center justify-center h-full'>
          <Loader />
        </div>
      ) : (
        <div className={`text-white w-[90%] mx-auto relative  `}>
          <div className={`${isVideoCompleted ? "blur-sm" : ""}`}>
            <Player
              playsInline
              src={videoData?.videoUrl}
              ref={playerRef}
              aspectRatio="16:9"
              onEnded={() => setIsVideoCompleted(true)}
            >

              {/* <BsFillPlayFill size={25} /> */}







            </Player>
          </div>
          {
            isVideoCompleted && (
              <div className='absolute flex flex-col justify-center items-center gap-4 top-[14rem] right-[30rem] z-10'>
                <div className='space-y-2'>
                  <IconBtn customClasses={"text-lg font-bold"} text={"Mark as Completed"} onclick={handleLectureCompletion} />
                  <IconBtn customClasses={"text-lg font-bold mx-auto"} text={"Rewatch"} onclick={rewatchVideo} />
                </div>

                <div className='flex justify-center gap-2 items-center'>
                  {!isFirstVideo() &&
                    <button className='px-3 py-2 text-lg font-bold text-richblack-5  bg-richblack-600 rounded-md'
                      onClick={gotoPrevVideo}>
                      Prev
                    </button>

                  }
                  {!isLastVideo() &&
                    <button className='px-3 py-2 font-bold text-lg text-richblack-5 bg-richblack-600 rounded-md'
                      onClick={goToNextVideo}>
                      Next
                    </button>

                  }
                </div>

              </div>

            )
          }
          <div className='mt-6'>
            {/* <h1 className='text-3xl font-bold'>{videoData.title}</h1>
            <p>{videoData.description}</p> */}
          </div>

        </div>
      )}
    </div>
  )
}

export default CourseVideo