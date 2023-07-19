import toast from "react-hot-toast";
import { apiConnector } from "../apiconnector";
import { ratingsEndpoints } from "../apis";

const { REVIEWS_DETAILS_API } = ratingsEndpoints;

export const getAllRatings  = async()=>{

    try{
        const response = await apiConnector("GET",REVIEWS_DETAILS_API);
        if(!response.data.success){
            throw new Error(response?.data?.message);
        }
        // console.log("GET ALL RATINGS RESPONSE......",response);
        return response;
    }catch(error){
        // console.log("GET ALL RATING ERROR......",error);
        toast.error("Unable to get reviews");
    }


}