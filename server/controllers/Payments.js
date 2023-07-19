const {instance} = require("../config/razorpay");
const Course = require("../models/Course");
const User = require("../models/User");
const mailSender = require("../utils/mailSender");
const {courseEnrollmentEmail} = require("../mail/templates/courseEnrollmentEmail");
const {paymentSuccessEmail} = require("../mail/templates/paymentSuccessEmail");
const { default: mongoose } = require("mongoose");
const crypto  = require('crypto');
const CourseProgress = require("../models/CourseProgress");


// For Multiple Payment 


exports.capturePayment = async(req,res) =>{

    // fetch course Id from req body 
    const {courses} = req.body;
    
    // fetch user id from req user
    const {userId} = req.user;   
    // create a for of loop for storing total amount of all courses
    let totalAmount = 0;

    for(const courseId of courses){
        let course;
        try{
             course = await Course.findById({_id:courseId});
             if(!course){
                return res.status(401).json({success:false,message:"Course Not Found"});
             }
            // if user already erolled in the course return response
            const uId  = new mongoose.Types.ObjectId(userId);
            if(course.studentsEnrolled.includes(uId)){
                return res.status(402).json({success:false,message:"User already enrolled in the course"});
            }

            totalAmount += course.price;
            // console.log("total AMount",totalAmount)
        } catch(error){
            // console.log("ERROR WHILE GETTILNG AMOUNT",error);
            return res.status(500).json({success:false,message:error.message});
        }
    }
    // create options for creating order
    const options = {
        amount : totalAmount*100,
        currency:"INR",
        receipt: Math.random(Date.now()).toString()
    }
    // create order using instance

    try{
        const paymentResponse = await instance.orders.create(options);
        // console.log("Payment Response",paymentResponse)

        return res.status(200).json({
            success:true,
            message:"order initiated successfully",
            data:paymentResponse
        })

    } catch(error){
        // console.log("ERROR WHILE  CREATING ORDER",error);
        return res.status(500).json({success:false,message:"Could not initiate order"});
    }
 
}

const enrollStudent = async(courses,userId,res)=>{

    for(const courseId of courses){
       try{
           const enrolledCourse = await Course.findByIdAndUpdate({_id:courseId},
               {$push:{studentsEnrolled:userId}},
               {new:true});
           
           if(!enrolledCourse){
               return(res.status(500).json({success:false,message:"course not found"}))
           }

           const createdProgress = await CourseProgress.create({
            courseID:courseId,
            userID:userId,
            completedVideos:[]
           });

        //    console.log("createdProgress",createdProgress);

           const enrolledUser = await User.findByIdAndUpdate(
               {_id:userId},
               {$push:{
                courses:courseId,
                courseProgress:createdProgress._id  
                }},
               {new:true}
                )  
        //    console.log("enrolledUser",enrolledUser);


           const mailResponse = await mailSender(enrolledUser,`Enrolled successfully for ${enrolledCourse.courseName}`,
           courseEnrollmentEmail(enrolledCourse.courseName,(`${enrolledUser.firstName} ${enrolledUser.lastName}`))) ;  
        }catch(error){
        //    console.log("Error while enrolling student ....",error);
           return res.staus(500).json({success:false,message:"Unable to enroll student in the course"})
       }
   }

    




}


exports.verifyPayment = async(req,res) =>{

        try{
            //   fetch orderid , signature , payment id from req body 
        const {razorpay_order_id,razorpay_payment_id,razorpay_signature,courses} = req.body.bodyData;
        // fetch user id from req user
        const userId = req.user.id ;
        // console.log(req.user);

        // validation
        if(!razorpay_order_id||!razorpay_payment_id||!razorpay_signature){
            return res.status(404).json({
                success:false,
                message:"All fields are mandatory"})
        }
        if(!userId){
            return res.status(404).json({
                success:false,
                message:"User not found"
            })
        }
        // create signature 
        const body = razorpay_order_id + "|" + razorpay_payment_id;
        // compare that signature with rasorpay signature
        const expectedSignature = crypto.createHmac("sha256",process.env.RAZORPAY_SECRET).
        update(body.toString()).
        digest("hex");
        // if it matches return success response
        if(expectedSignature===razorpay_signature){

            // enroll student into the course
            await enrollStudent(courses,userId,res);
            return res.status(200).json({
                success:true,
                message:"payment verified"
            })
            }
        }catch(error){
            // console.log("Payment verification error ",error);
            return res.status(500).json({
                success:false,
                message:"Unable to verify payment",
                error:error
            })
        }

}



exports.sendPaymentSuccessEmail = async(req,res)=>{
    try{
        const{orderId,paymentId,amount}  = req.body;
        // console.log("REQ  User AT SENDMAIL",req.user);
        const userId = req.user.id;
    
        if(!orderId||!paymentId||!amount||!userId){
            return res.status(404).json({success:false,message:"All fields are mandatory"});
        }

        const enrolledStudent = await User.findById(userId);

        const userDetails = await User.findById({_id:userId});

        const mailResponse = await mailSender(userDetails.email,`Payment successfull`,
        paymentSuccessEmail(userDetails.name,amount/100,orderId,paymentId));

        // console.log("Payment mail response",mailResponse)

        return res.status(200).json({
            success:true,
            message:"Payment verified successfully"
        });

    }catch(error){
        // console.log("Error while verifying payment ....",error);
       return res.staus(500).json({success:false,message:"Unable to verify payment"})
    }
}

//capture the payment and initiate the Razorpay order
// exports.capturePayment = async (req, res) => {
//     //get courseId and UserID
//     const {course_id} = req.body;
//     const userId = req.user.id;
//     //validation
//     //valid courseID
//     if(!course_id) {
//         return res.json({
//             success:false,
//             message:'Please provide valid course ID',
//         })
//     };
//     //valid courseDetail
//     let course;
//     try{
//         course = await Course.findById(course_id);
//         if(!course) {
//             return res.json({
//                 success:false,
//                 message:'Could not find the course',
//             });
//         }

//         //user already pay for the same course
//         const uid = new mongoose.Types.ObjectId(userId);
//         if(course.studentsEnrolled.includes(uid)) {
//             return res.status(200).json({
//                 success:false,
//                 message:'Student is already enrolled',
//             });
//         }
//     }
//     catch(error) {
//         console.error(error);
//         return res.status(500).json({
//             success:false,
//             message:error.message,
//         });
//     }
    
//     //order create
//     const amount = course.price;
//     const currency = "INR";

//     const options = {
//         amount: amount * 100,
//         currency,
//         receipt: Math.random(Date.now()).toString(),
//         notes:{
//             courseId: course_id,
//             userId,
//         }
//     };

//     try{
//         //initiate the payment using razorpay
//         const paymentResponse = await instance.orders.create(options);
//         console.log(paymentResponse);
//         //return response
//         return res.status(200).json({
//             success:true,
//             courseName:course.courseName,
//             courseDescription:course.courseDescription,
//             thumbnail: course.thumbnail,
//             orderId: paymentResponse.id,
//             currency:paymentResponse.currency,
//             amount:paymentResponse.amount,
//         });
//     }
//     catch(error) {
//         console.log(error);
//         res.json({
//             success:false,
//             message:"Could not initiate order",
//         });
//     }
    
// };

// //verify Signature of Razorpay and Server

// exports.verifySignature = async (req, res) => {
//     const webhookSecret = "12345678";

//     const signature = req.headers["x-razorpay-signature"];

//     const shasum =  crypto.createHmac("sha256", webhookSecret);
//     shasum.update(JSON.stringify(req.body));
//     const digest = shasum.digest("hex");

//     if(signature === digest) {
//         console.log("Payment is Authorised");

//         const {courseId, userId} = req.body.payload.payment.entity.notes;

//         try{
//                 //fulfil the action

//                 //find the course and enroll the student in it
//                 const enrolledCourse = await Course.findOneAndUpdate(
//                                                 {_id: courseId},
//                                                 {$push:{studentsEnrolled: userId}},
//                                                 {new:true},
//                 );

//                 if(!enrolledCourse) {
//                     return res.status(500).json({
//                         success:false,
//                         message:'Course not Found',
//                     });
//                 }

//                 console.log(enrolledCourse);

//                 //find the student andadd the course to their list enrolled courses me 
//                 const enrolledStudent = await User.findOneAndUpdate(
//                                                 {_id:userId},
//                                                 {$push:{courses:courseId}},
//                                                 {new:true},
//                 );

//                 console.log(enrolledStudent);

//                 //mail send krdo confirmation wala 
//                 const emailResponse = await mailSender(
//                                         enrolledStudent.email,
//                                         "Congratulations from CodeHelp",
//                                         "Congratulations, you are onboarded into new CodeHelp Course",
//                 );

//                 console.log(emailResponse);
//                 return res.status(200).json({
//                     success:true,
//                     message:"Signature Verified and COurse Added",
//                 });


//         }       
//         catch(error) {
//             console.log(error);
//             return res.status(500).json({
//                 success:false,
//                 message:error.message,
//             });
//         }
//     }
//     else {
//         return res.status(400).json({
//             success:false,
//             message:'Invalid request',
//         });
//     }


// };