import React from 'react'

const timeline = [
    {
        Logo: "https://res.cloudinary.com/di1qrcflg/image/upload/v1689752368/Logo1_av7m6c.svg",
        heading: "Leadership",
        Description:"Fully committed to the success company",
    },
    {
        Logo: "https://res.cloudinary.com/di1qrcflg/image/upload/v1689752368/Logo2_btejs5.svg",
        heading: "Responsibility",
        Description:"Students will always be our top priority",
    },
    {
        Logo: "https://res.cloudinary.com/di1qrcflg/image/upload/v1689752369/Logo3_oplqee.svg",
        heading: "Flexibility",
        Description:"The ability to switch is an important skills",
    },
    {
        Logo: "https://res.cloudinary.com/di1qrcflg/image/upload/v1689752369/Logo4_dlkvkx.svg",
        heading: "Solve the problem",
        Description:"Code your way to a solution",
    },
];

const TimelineSection = () => {
  return (
    <div>
      <div className='flex flex-row gap-15 items-center'>

        <div className='w-[45%] flex flex-col gap-12'>
            {
                timeline.map( (element, index) => {
                    return (
                        <div className='flex flex-row gap-6' key={index}>

                            <div className='w-[50px] h-[50px] bg-white rounded-full  flex justify-center items-center'>
                                <img src={element.Logo} alt='element logo'/>
                            </div>

                            <div>
                                <h2 className='font-semibold text-[18px]'>{element.heading}</h2>
                                <p className='text-base'>{element.Description}</p>
                            </div>

                        </div>
                    )
                } )
            }
        </div>
        <div className='relative shadow-blue-200'>

            <img  src="https://res.cloudinary.com/di1qrcflg/image/upload/v1689752098/TimelineImage_qcjwck.png"
            alt="timelineImage"
            className='shadow-white object-cover h-fit'
            />

            <div className='absolute lg:left-[50%] lg:bottom-0 lg:translate-x-[-50%] lg:translate-y-[50%]
             bg-caribbeangreen-700 flex lg:flex-row flex-col text-white uppercase py-5 gap-4 lg:gap-0
             lg:py-10'>
                <div className='flex flex-row gap-5 items-center border-r border-caribbeangreen-300 px-7'>
                    <p className='text-3xl font-bold'>10</p>
                    <p className='text-caribbeangreen-300 text-sm'>Years of Experience</p>
                </div>

                <div className='flex gap-5 items-center px-7'>
                <p className='text-3xl font-bold'>250</p>
                    <p className='text-caribbeangreen-300 text-sm'>TYpe of Courses</p>
                </div>

            </div>

        </div>

      </div>
    </div>
  )
}

export default TimelineSection
