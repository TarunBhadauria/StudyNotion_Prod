import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Outlet, useNavigate, useParams } from 'react-router-dom'
import Loader from '../components/common/Loader';
import ReviewSlider from '../components/core/ReviewSlider/ReviewSlider';
import CourseModal from '../components/core/ViewCourse/CourseModal';
import CourseVideoDetails from '../components/core/ViewCourse/CourseVideoDetails';
import { getFullDetailsOfCourse } from '../services/operations/courseDetailsAPI';
import { setCompletedLectures, setCourseSectionData, setEntireCourseData, setTotalNoOfLectures } from '../slices/viewCourseSlice';

const ViewCourse = () => {
    const [modalData, setModalData] = useState(false);
    const { token } = useSelector((state) => state.auth);
    const { courseId } = useParams();
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(false);
    const getCoursePageDetails = async () => {
        setLoading(true);
        const response = await getFullDetailsOfCourse(courseId, token);
        console.log("response", response?.courseDetails)
        const { courseDetails } = await response;
        if (courseDetails) {
            dispatch(setEntireCourseData(courseDetails));
            dispatch(setCourseSectionData(courseDetails?.courseContent));
            dispatch(setTotalNoOfLectures(courseDetails.courseContent.length));
            let lectures = 0;
            courseDetails?.courseContent?.forEach((sec) => {
                lectures += sec.subSection.length
            })
            dispatch(setTotalNoOfLectures(lectures));
        }
        setLoading(false);

    }

    useEffect(() => {
        getCoursePageDetails();
    }, []);

    return (
        <div className=" flex flex-col gap-4 w-full relative">

            <div className={`${modalData ? "blur-sm" : ""}`}>
                {loading ? (
                    <div className='w-full h-full justify-center items-center'>
                        <Loader />
                    </div>
                ) : (<div className='flex w-full gap-12'>

                    <div className='lg:w-[25%]'>
                        <CourseVideoDetails setModalData={setModalData} />
                    </div>
                    <div className='w-[100%] h-[100%]'>
                        <Outlet />
                    </div>

                </div>)}
            </div>
            <div className='relative'>
                {modalData && <CourseModal modalData={modalData} setModalData={setModalData} />}
            </div>
           
        </div>
    )
}

export default ViewCourse