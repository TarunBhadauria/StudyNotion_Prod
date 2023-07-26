import React from 'react'
import HighlightText from './HighlightText'
import know_your_progress  from "../../../assets/Images/Know_your_progress.png"
import compare_with_others from "../../../assets/Images/Compare_with_others.png"
import plan_your_lesson from "../../../assets/Images/Plan_your_lessons.png"
import CTAButton from "../HomePage/Button"

const LearningLanguageSection = () => {
  return (
    <div className='mt-[130px] mb-32'>
      <div className='flex flex-col gap-5 items-center'>

            <div className='text-4xl font-semibold text-center'>
                Your Swiss Knife for
                <HighlightText text={" learning any language"} />
            </div>

            <div className='text-center text-richblack-600 mx-auto text-base font-medium w-[70%]'>
            Using spin making learning multiple languages easy. with 20+ languages realistic voice-over, progress tracking, custom schedule and more.
            </div>

            <div className='flex lg:flex-row flex-col items-center justify-center mt-5'>
                <img 
                    src = "https://res.cloudinary.com/di1qrcflg/image/upload/v1689752056/Know_your_progress_htwqry.svg"
                    alt = "KNowYourProgressImage"
                    className='object-contain -mr-32 '
                />
                <img 
                    src = "https://res.cloudinary.com/di1qrcflg/image/upload/v1689752046/Compare_with_others_lfsgjl.svg"
                    alt = "KNowYourProgressImage"
                    className='object-contain'
                />
                <img 
                    src = "https://res.cloudinary.com/di1qrcflg/image/upload/v1689752054/Plan_your_lessons_ephsnn.png"
                    alt = "KNowYourProgressImage"
                    className='object-contain -ml-36'
                />
            </div>

            <div className='w-fit'>
                <CTAButton active={true} linkto={"/signup"}>
                    <div>
                        Learn more
                    </div>
                </CTAButton>
            </div>

      </div>
    </div>
  )
}

export default LearningLanguageSection
