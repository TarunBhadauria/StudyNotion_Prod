import React, { useState } from 'react'
import { Swiper, SwiperSlide } from "swiper/react"
import "swiper/css"
import "swiper/css/free-mode"
import "swiper/css/pagination"
import { Autoplay, FreeMode, Navigation, Pagination } from 'swiper'
import { useEffect } from 'react'
import { getAllRatings } from '../../../services/operations/RatingsApi'
import ReviewCard from './ReviewCard'

const ReviewSlider = () => {

    const [reviews, setReviews] = useState([]);

    const fetchAllReviews = async () => {
        const { data } = await getAllRatings();
        if (data) {
            // console.log(data?.data);
            setReviews(data?.data);
        }
    }

    useEffect(() => {
        fetchAllReviews();
    }, [])

    return (
        <div className='w-full mx-auto my-12'>
            <Swiper
                slidesPerView={4}
                loop={true}
                spaceBetween={200}
                pagination={true}
                modules={[Autoplay, Pagination, Navigation]}
                className="mySwiper"
                autoplay={{
                    delay: 2500,
                }}
            >

                
                    {reviews.map((review) => (
                        <SwiperSlide key={review._id} >
                            <div className='w-full '>
                                <ReviewCard data={review} />
                            </div>
                        </SwiperSlide>
                    ))}

            </Swiper>
        </div>
    )
}

export default ReviewSlider