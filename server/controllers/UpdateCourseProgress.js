const CourseProgress = require("../models/CourseProgress");

exports.updateCourseProgress = async (req, res) => {

    try {
        const { courseId, subSectionId } = req.body;
        const userId = req.user.id;
        // console.log("req user",req.user)
        // if subSection not found return response
        if (!subSectionId) {
            return res.status(404).json({
                success: false,
                message: "CourseId Not Found"
            })
        }
        // check if course progress exists for that course 
        const courseProgress = await CourseProgress.findOne(
            {
                courseID: courseId,
                userID: userId
            }
        )
        // console.log("courseProgress", courseProgress)
        // if not found then return response
        if (!courseProgress) {
            return res.status(400).json({
                success: false,
                message: "Course Progress not found"
            })
        }
        // else push the subSection Id inside completedVideos and save
        else {
            if (courseProgress.completedVideos.includes(subSectionId)) {
                return res.status(409).json({
                    success: false,
                    message: "Course is already Updated"
                })
            }
            else {

                const updatedProgress = await CourseProgress.findOneAndUpdate({
                    courseID: courseId,
                    userID: userId
                }
                    , {
                        $push: {
                            completedVideos: subSectionId
                        }
                    },
                    { new: true }
                )
                // return response
                return res.status(200).json({
                    success: true,
                    data: updatedProgress,
                    message: "Course Progress updated SuccessFully"
                })
            }
        }
    } catch (error) {
        // console.log(error);
        return res.status(500).json({
            success: false,
            message: "Unable to update Course Progress",
            error: error
        })
    }


}