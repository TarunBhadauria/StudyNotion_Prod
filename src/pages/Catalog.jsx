import React, { useEffect, useState } from 'react'
import Footer from '../components/common/Footer'
import { useParams } from 'react-router-dom'
import { apiConnector } from '../services/apiconnector';
import { categories } from '../services/apis';
import { getCatalogaPageData } from '../services/operations/pageAndComponentData';
import CourseSlider from '../components/core/Catalog/CourseSlider';
import Loader from '../components/common/Loader';
import CourseCard from '../components/core/Catalog/CourseCard';

const Catalog = () => {

    const { catalogName } = useParams();
    const [catalogPageData, setCatalogPageData] = useState(null);
    const [categoryId, setCategoryId] = useState("");
    const [isPopular, setIsPopular] = useState(false);
    const [loading, setLoading] = useState(false);

    //Fetch all categories
    useEffect(() => {
        const getCategories = async () => {
            const res = await apiConnector("GET", categories.CATEGORIES_API);
            const category_id =
                res?.data?.data?.filter((ct) => ct.name.split(" ").join("-").toLowerCase() === catalogName)[0]._id;
            setCategoryId(category_id);
        }
        getCategories();
    }, [catalogName]);

    useEffect(() => {
        const getCategoryDetails = async () => {
            setLoading(true); 
            try {
                const res = await getCatalogaPageData(categoryId);
                // console.log("PRinting res: ", res);
                setCatalogPageData(res);
            }
            catch (error) {
                // console.log(error)
            }
            setLoading(false);
        }
        if (categoryId) {
            getCategoryDetails();
        }

    }, [categoryId]);


    return (
        
        
                <div>
                    {loading?(
                        <div className=' w-full flex justify-center items-center'><Loader/></div>
                    ):(
                        <div className='text-white space-y-8'>
                            <div className='bg-richblack-800 min-h-[260px]  max-w-maxC0ntent flex flex-col items-start px-4
                        justify-center gap-4'>
                        <p className=' text-richblack-200 text-sm'>{`Home / Catalog / `}
                            <span className='text-yellow-50'>
                                {catalogPageData?.data?.selectedCategory?.name}
                            </span></p>
                        <p className='text-3xl'> {catalogPageData?.data?.selectedCategory?.name} </p>
                        <p className='text-richblack-100'> {catalogPageData?.data?.selectedCategory?.Description}</p>
                    </div>

                    <div className='space-y-16 px-4'>
                        {/* section1 */}
                        <div className='space-y-2 relative'>
                            <div className='text-3xl font-bold '>Courses to get you started</div>
                            <div className=' flex gap-x-3 py-1 z-40'>
                                <p className={`cursor-pointer ${isPopular ? "text-yellow-50 border-b-2 border-yellow-50" : ""}`}
                                    onClick={() => { setIsPopular(true) }}
                                >Most Popular</p>
                                <p className={`cursor-pointer ${!isPopular ? "text-yellow-50 border-b-2 border-yellow-50" : ""}`}
                                    onClick={() => { setIsPopular(false) }}
                                >New</p>
                            </div>
                            <div className='w-full z-10 absolute top-16 border-b-2 border-richblack-600'>
                            </div>
                            <div>
                                <CourseSlider Courses={catalogPageData?.data?.selectedCategory?.courses} />
                            </div>
                        </div>

                        {/* section2 */}
                        <div className='space-y-4'>
                            <div className='text-3xl font-bold'>Top Courses in {catalogPageData?.data?.selectedCategory?.name}</div>
                            <div>
                                <CourseSlider Courses={catalogPageData?.data?.differentCategory?.courses} />
                            </div>
                        </div>

                        {/* section3 */}
                        <div>
                            <div className='text-4xl font-bold'>Frequently Bought</div>
                            <div className='py-8'>

                                <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>

                                    {
                                        catalogPageData?.data?.mostSellingCourses?.slice(0, 4)
                                            .map((course, index) => (
                                                <CourseCard course={course} key={index} Height={"h-[400px]"} />
                                            ))
                                    }

                                </div>

                            </div>
                        </div>

                    </div>
                    <Footer />
                        </div >
                    )}
                </div >
            )
     
    
}

export default Catalog
