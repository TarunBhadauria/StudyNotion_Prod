import React, { useEffect, useState } from 'react'
import RatingStars from '../../common/RatingStars'
import GetAvgRating from '../../../utils/avgRating';
import { Link } from 'react-router-dom';

const CourseCard = ({course, Height}) => {


    const [avgReviewCount, setAvgReviewCount] = useState(0);

    useEffect(()=> {
        const count = GetAvgRating(course.ratingAndReviews);
        setAvgReviewCount(count);
    },[course])


    
  return (
    <div className='space-y-4'>
        <Link to={`/courses/${course._id}`}>
            <div className='space-y-2'>
                <div>
                    <img 
                        src={course?.thumbnail}
                        alt='course thumbnail'
                        className={`${Height} w-full rounded-xl object-cover`}
                    />
                </div>
                <div className='space-y-2'>
                    <p className='text-xl capitalize'>{course?.courseName}</p>
                    <p className='text-lg text-richblack-600'>{course?.instructor?.firstName} {course?.instructor?.lastName} </p>
                    <div className='flex gap-x-3'>
                        <span className='text-yellow-25'>{avgReviewCount || 0}</span>
                        <RatingStars Review_Count={avgReviewCount} />
                        <span className='text-richblack-400'>{course?.ratingAndReviews?.length} Ratings</span>
                    </div>
                    <p className='text-xl'>Rs. {course?.price}</p>
                </div>
            </div>
        </Link>

      
    </div>
  )
}

export default CourseCard
