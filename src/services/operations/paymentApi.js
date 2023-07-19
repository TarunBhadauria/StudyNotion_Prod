import { paymentEndPoints } from '../apis'
import toast from 'react-hot-toast'
import { apiConnector } from "../apiconnector"
import {resetCart} from '../../slices/cartSlice'
import rzpLogo from "../../assets/Logo/rzp_logo.png"
const {
    COURSE_PAYMENT_API,
    SEND_PAYMENT_SUCCESS_EMAIL_API,
    COURSE_VERIFY_API
} = paymentEndPoints;


const loadScript = (src) => {
    return new Promise((resolve) => {
        const script = document.createElement("script");
        script.src = src;

        script.onload = () => {
            resolve(true);
        }

        script.onerror = () => {
            resolve(false);
        }
        document.body.appendChild(script);
    })
}

export const buyCourse = async (userDetails, token, courses, navigate, dispatch) => {
    const toastId = toast.loading("loading");
    try {
        const res = await loadScript("https://checkout.razorpay.com/v1/checkout.js");

        if (!res) {
            toast.error("failed to load rasorpay sdk")
        }

        const orderResponse = await apiConnector("POST", COURSE_PAYMENT_API, { courses },
            { Authorisation: `Bearer ${token}` }
        )

        if (!orderResponse.data.success) {
            throw new Error(orderResponse.data.message);
        }

        // console.log("Order Response",orderResponse);
        
        

        const options = {
            key:"rzp_test_odoakKDeGNTzDh",
            currency: "INR",
            amount: orderResponse.data.data.amount,
            order_id: orderResponse.data.data.id,
            name: "StudyNotion",
            description: "Thanks for purchasing the course",
            image: rzpLogo,
            prefills: {
                name: `${userDetails.firstName}`,
                email: userDetails.email
            },
            handler: function(response) {
                // console.log("handler response",response);
                // send payment successful email
                sendPaymentSuccessEmail(response,orderResponse.data.data.amount,token);
                // verifypaymet 
                verifyPayment({...response,courses},token,navigate,dispatch);
            }
        }

        const paymentObject = new window.Razorpay(options);
        paymentObject.open();
        paymentObject.on("payment.failed", function(response) {
            toast.error("oops, payment failed");
            // console.log(response.error);
        })


    } catch (error) {

        // console.log("CAPTURE  PAYMENT API RESPONSE .......", error);
        toast.error("Unable  to make payment")

    }
    toast.dismiss(toastId);
}



export const verifyPayment = async (bodyData, token,navigate, dispatch) => {
    const toastId = toast.loading("Verifying Payment....");
    // dispatch(setPaymentLoading(true));

    try {

        const paymentResponse = await apiConnector("POST", COURSE_VERIFY_API, { bodyData }, {
            Authorisation: `Bearer ${token}`
        })

        // console.log("VERIFY pAYMENT API RESPONSE....", paymentResponse);
        if (!paymentResponse.data.success) {
            throw new Error(paymentResponse.data.message);
        }

        toast.success("payment Verified , You've purchased this course");
        navigate("/dashboard/enrolled-courses");
        dispatch(resetCart());
    } catch (error) {
        // console.log("VERIFY  PAYMENT API RESPONSE .......", error);
        toast.error("Unable  to verify payment")
    }

    toast.dismiss(toastId);
    // dispatch(setPaymentLoading(false));

}

export const sendPaymentSuccessEmail = async (response, amount, token) => {
    try {
        const result = await apiConnector("POST", SEND_PAYMENT_SUCCESS_EMAIL_API, {
            orderId: response.razorpay_order_id,
            paymentId: response.razorpay_order_id,
            amount
        } , {
            Authorisation: `Bearer ${token}`
        })
        // console.log("PAYMENT SUCCESSFUL EMAIL RESPONSE....", result);
        if (!result.data.success) {
            throw new Error(result.data.message);
        }
    } catch (error) {
        // console.log("PAYMENT SUCCESS EMAIL ERROR", error)
    }
}