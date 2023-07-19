const Profile = require("../models/Profile");
const User = require("../models/User");
const { uploadImageToCloudinary } = require("../utils/imageUploader");
const Course = require("../models/Course");
// Method for updating a profile
exports.updateProfile = async (req, res) => {
	try {
		const { dateOfBirth = "", about = "", gender, contactNumber,firstName,lastName } = req.body;
		const id = req.user.id;

		// Find the profile by id
		const userDetails = await User.findById(id);
		const profile = await Profile.findById(userDetails.additionalDetails);

		// Update the profile fields
		profile.dateOfBirth = dateOfBirth;
		profile.about = about;
		profile.contactNumber = contactNumber;
		profile.gender = gender;

		// Save the updated profile
		await profile.save();

		const updatedUserDetails = await User.findByIdAndUpdate(
			{_id:id},
			{additionalDetails:profile._id,
			firstName,
			lastName}
			,{new:true})
								.populate({
									path:"additionalDetails"
								})
								.exec();

		return res.json({
			success: true,
			message: "Profile updated successfully",
			updatedUserDetails
		});
	} catch (error) {
		// console.log(error);
		return res.status(500).json({
			success: false,
			error: error.message,
		});
	}
};

exports.deleteAccount = async (req, res) => {
	try {
		// TODO: Find More on Job Schedule
		// const job = schedule.scheduleJob("10 * * * * *", function () {
		// 	console.log("The answer to life, the universe, and everything!");
		// });
		// console.log(job);
		// console.log("Printing ID: ", req.user.id);
		const id = req.user.id;

		const user = await User.findById({ _id: id });
		if (!user) {
			return res.status(404).json({
				success: false,
				message: "User not found",
			});
		}
		// Delete Assosiated Profile with the User
		await Profile.findByIdAndDelete({ _id: user.additionalDetails });
		// TODO: Unenroll User From All the Enrolled Courses
		// Now Delete User
		await User.findByIdAndDelete({ _id: id });
		res.status(200).json({
			success: true,
			message: "User deleted successfully",
		});
	} catch (error) {
		// console.log(error);
		res
			.status(500)
			.json({ success: false, message: "User Cannot be deleted successfully" });
	}
};

exports.getAllUserDetails = async (req, res) => {
	try {
		const id = req.user.id;
		const userDetails = await User.findById(id)
			.populate("additionalDetails")
			.exec();
		// console.log(userDetails);
		res.status(200).json({
			success: true,
			message: "User Data fetched successfully",
			data: userDetails,
		});
	} catch (error) {
		return res.status(500).json({
			success: false,
			message: error.message,
		});
	}
};

exports.updateDisplayPicture = async (req, res) => {
	try {
		const displayPicture = req.files.displayPicture
		const userId = req.user.id
		const image = await uploadImageToCloudinary(
			displayPicture,
			process.env.FOLDER_NAME,
			1000,
			1000
		)
		// console.log(image)
		const updatedProfile = await User.findByIdAndUpdate(
			{ _id: userId },
			{ image: image.secure_url },
			{ new: true }
		)
		res.send({
			success: true,
			message: `Image Updated successfully`,
			data: updatedProfile,
		})
	} catch (error) {
		return res.status(500).json({
			success: false,
			message: error.message,
		})
	}
};

exports.getEnrolledCourses = async (req, res) => {
	try {
		const userId = req.user.id
		const userDetails = await User.findOne({
			_id: userId,
		})
			.populate({
				path: "courses",
				populate: {
					path: "courseContent",
					populate: {
						path: "subSection"
					}
				},
			})
			.exec()
		if (!userDetails) {
			return res.status(400).json({
				success: false,
				message: `Could not find user with id: ${userDetails}`,
			})
		}
		return res.status(200).json({
			success: true,
			data: userDetails.courses,
		})
	} catch (error) {
		return res.status(500).json({
			success: false,
			message: error.message,
		})
	}
};

exports.getInstructorCourses = async (req, res) => {
	try {

		// fetch course details from instructor Id
		// console.log(req.user.id);
		const { id } = req.user
		const courseData = await Course.find({ instructor: id })
		// if no courses found return response
		if (!courseData) {
			return res.status(404).json({
				success: false,
				message: "No courses found"
			})
		}
		// if data found then iterate  map funcn on that data 
		const courseDetails = courseData.map((course) => {
			// find total students enrolled and total amount 

			const totalStudents = course.studentsEnrolled;
			const totalAmount = course.price;
			// create an object including course and above data and return it 

			const InstructorCourses = {
				totalAmount,
				totalStudents: totalStudents.length,
				course
			}

			return InstructorCourses
		})
		// return response

		return res.status(200).json({
			success: true,
			message: "Instructor courses fetched successfully",
			data: courseDetails
		})

	} catch (error) {
		// console.log("Error while fetching instructor courses", error);
		return res.status(500).json({
			success: false,
			message: "Unable to fetch instructor courses",
			error: error
		})
	}
}