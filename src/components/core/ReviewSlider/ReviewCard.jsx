import React from 'react'
import ReactStars from 'react-stars';

const ReviewCard = ({ data }) => {

    const { user, rating, review, course } = data;
    const trimmedReview = review.substring(0, 30);
    return (
        <div className=' text-[14px] lg:h-[150px] lg:w-[320px] bg-richblack-800 space-y-2 px-4 py-2 flex flex-col justify-start items-start'>
            <div className='flex  gap-2 items-center'>
                <img src={user?.image ? user?.image : `https://api.dicebear.com/5.x/initials/svg?seed=${user?.firstName} ${user?.lastName}`}
                    className="h-8 w-8 rounded-full object-contain" />
                <div className='flex flex-col'>
                    <p>{`${user?user.firstName+" "+user.lastName:`User`}`}</p>
                    <p>{course.courseName?course.courseName:""}</p>
                </div>
            </div> 
            <p className='w-full'>{trimmedReview}</p>
            <div className='flex items-center gap-2 justify-start'>
                <p className='text-yellow-50'>{rating}</p>
                <ReactStars
                    count={5}
                    value={rating}
                    edit={false}
                    size={24}
                    color2={'#ffd700'} />
            </div>
        </div>
    )
}

export default ReviewCard