import React from 'react'
import IconBtn from '../../common/IconBtn'
import { BiDevices } from 'react-icons/bi'
import { AiOutlineClockCircle } from 'react-icons/ai'
import { HiCursorClick } from 'react-icons/hi'
import { TbFileCertificate } from 'react-icons/tb'
import copy from 'copy-to-clipboard';
import { useLocation, useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { addToCart } from '../../../slices/cartSlice'

const CourseCard = ({ image, price, handlePayment, course, user, courseId }) => {
    const location = useLocation();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    // console.log("User",user);
    return (
        <div className='lg:w-[384px] rounded-md bg-richblack-700 absolute right-24 top-24'>
            <img src={image} className='w-full rounded-t-md' />
            <div className='flex flex-col gap-4 itams-start p-6'>
                <h1 className='text-3xl font-semibold'>Rs. {price}</h1>
                {false ? (
                    <div>
                        <button className='px-3 py-4   bg-yellow-50 text-richblack-900 rounded-md  font-semiBold' onClick={() => {
                            navigate(
                                `/dashboard/enrolled-courses`
                            )
                        }}>
                            Go to Course
                        </button>
                    </div>
                ) : (
                    <div className='flex  flex-col space-y-4 w-full'>
                        <button className='px-3 py-4   bg-yellow-50 text-richblack-900 rounded-md  font-semiBold' onClick={() => { dispatch(addToCart(course)) }}>
                            Add to Cart
                        </button>
                        <button onClick={handlePayment}
                            className='px-3 py-4 bg-richblack-800 text-richBlack-25 rounded-md  font-semiBold'>
                            Buy  Now
                        </button>
                    </div>
                )}
                <div className='space-y-2'>
                    <p className='font-semiBold text-xl'>This Course Includes:  </p>
                    <ul className='flex flex-col  gap-2'>
                        <li className='flex gap-2 text-caribbeangreen-100 font-medium'>
                            <AiOutlineClockCircle size={25} />
                            8 hours on-demand video
                        </li>
                        <li className='flex gap-2 text-caribbeangreen-100 font-medium'>
                            <HiCursorClick size={25} />
                            Full Lifetime access
                        </li>
                        <li className='flex gap-2 text-caribbeangreen-100 font-medium'>
                            <BiDevices size={25} />
                            Access on Mobile and Desktop
                        </li>
                        <li className='flex gap-2 text-caribbeangreen-100 font-medium'>
                            <TbFileCertificate size={25} />
                            Certificate of completion
                        </li>
                    </ul>
                </div>
                <div className='mt-4 text-lg cursor-pointer'>
                    <p className='text-yellow-100 font-semiBold text-center ' onClick={() => { copy(location.pathname) }}>Share</p>
                </div>
            </div>

        </div>
    )
}

export default CourseCard