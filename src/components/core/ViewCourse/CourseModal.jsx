import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { RxCross1 } from 'react-icons/rx'
import { useForm } from "react-hook-form"
import IconBtn from '../../common/IconBtn'
import { createRating } from '../../../services/operations/courseDetailsAPI'
import ReactStars from 'react-stars'


const CourseModal = ({ modalData, setModalData }) => {
    const { courseEntireData } = useSelector((state) => state.viewCourse);
    const { user } = useSelector((state) => state.profile);
    const { register, setValue, formState: { errors }, handleSubmit } = useForm();
    const { token } = useSelector((state) => state.auth)

    const ratingChanged = (newRating) => {
        setValue("courseRating", newRating);
    }

    useEffect(() => (
        setValue("courseReview", "")
        // eslint-disable-next-line
    ), []);

    useEffect(()=>(
        setValue("courseRating", 0)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    ),[])



    const handleReview = async (data) => {
        // console.log("Data", data)
        await createRating({
            courseId: courseEntireData._id,
            courseReview: data.courseReview,
            courseRating: data.courseRating
        }, token);

        setValue("courseReview", "");
        setValue("courseRating", 0);
        setModalData(false);

        // console.log("Create Rating response", response);
    };



    return (
        <div className=' text-richblack-5 flex flex-col gap-4 border-2 border-richblack-400
         justify-center items-center w-[48%]  rounded-md bg-richblack-800 mx-auto absolute -top-[36rem] right-[21rem]'>
            {/* Heading */}
            <div className='flex justify-between rounded-md items-center bg-richblack-700 p-4 w-full'>
                <h1 className='text-xl font-semibold'>Add Review</h1>
                <RxCross1 size={25} onClick={() => { setModalData(false) }} />
            </div>
            {/* Image and rating */}
            <div className='flex flex-col  justify-center items-center gap-4 '>
                <div className='flex gap-2 items-center justify-center '>
                    <div>
                        <img src={user.image} alt="User Img" className='w-[50px] aspect-square rounded-full' />
                    </div>

                    <div>
                        <p className='text-richBlack-5 font-semibold leading-2 '>{user.firstName} {user.lastName}</p>
                        <p>Posting publically</p>
                    </div>

                </div>
                <div className='ml-8'>
                    <ReactStars
                        count={5}
                        onChange={ratingChanged}
                        {...register("courseRating",{required:true})}
                        size={24}
                        color2={'#ffd700'} />
                </div>

            </div>

            <div className='w-full px-6 py-4  '>
                <form onSubmit={handleSubmit(handleReview)} className="space-y-2 ml-6">
                    <label htmlFor='courseReview' >
                        Add Your Experience <sup className='text-pink-200'>*</sup>
                    </label><br />
                    <textarea className=' w-full px-4 py-2 text-richblack-25 rounded-md bg-richblack-700' rows={5} id='courseReview' placeholder='Add Your Review' {...register("courseReview", { required: true })}></textarea>
                    {errors.courseReview && <span className='text-pink-200 text-sm'>Please Add Your Experience</span>}
                    <div className='flex gap-2 items-center justify-end'>
                        <button className='px-3 py-2 font-bold text-richblack-100 bg-richblack-600 rounded-md'
                            onClick={() => { setModalData(false) }}>
                            Cancel
                        </button>
                        <IconBtn type={"submit"} text={"Save"} />
                    </div>

                </form>
            </div>



        </div>
    )



}



export default CourseModal