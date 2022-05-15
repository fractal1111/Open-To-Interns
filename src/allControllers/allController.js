const collegeModel = require("../models/collegeModel")
const internsModel = require("../models/internModel")
const mongoose = require('mongoose')




let isValid = function (value) {
    if (typeof value === 'undefined' || typeof value === 'null') return false
    if (typeof value === 'string' && value.trim().length === 0) return false
    return true
}
// create college 
const createCollege = async function (req, res) {


    try {
        let data = req.body


        if (Object.keys(data).length == 0) {
            return res
                .status(400)
                .send({ status: false, Error: "Body is empty. No input provided. Please provide input" })
        }

        let { name, fullName, logoLink } = data


        if (!isValid(name)) {
            return res
                .status(400)
                .send({ status: false, ERROR: "Name is required. Plese provide the name field and enter the correct abbreviation." })
        }

        if (!isValid(fullName)) {
            return res
                .status(400)
                .send({ status: false, ERROR: "fullName is required. Please provide the fullName field and enter the correct name of the college." })
        }
        fullName = fullName.toLowerCase()

        if (!isValid(logoLink)) {
            return res
                .status(400)
                .send({ status: false, ERROR: "logoLink is required. Please provide the logoLink field and enter logo link." })
        }

        let dupliName = await collegeModel.findOne({ name: name })

        if (dupliName) {
            return res
                .status(400)
                .send({ Status: false, ERROR: "College with this name abbreviation already exists." })
        }

        let dupliFullName = await collegeModel.findOne({ fullName: fullName })

        if (dupliFullName) {
            return res
                .status(400)
                .send({ Status: false, ERROR: "College with this full name already exists." })
        }



        let collegeCreated = await collegeModel.create(data)
        return res
            .status(201)
            .send({ status: true, msg: "College Created Successfuly. ", data: collegeCreated })
    }
    catch (error) {
        return res
            .status(500)
            .send({ status: false, ERROR: error.message })
    }


}







// create intern 
const createIntern = async function (req, res) {

    try {


        let data = req.body

        if (Object.keys(data).length == 0) {
            return res.status(400).send({ status: false, ERROR: "Bad Request. Please provide a valid Body" })
        }

        let { name, collegeName, email, mobile } = data



        if (!isValid(name)) {
            return res
                .status(400)
                .send({ Status: false, ERROR: "Please provide the name field and enter the name of the intern" })
        }

        if (!isValid(collegeName)) {
            return res
                .status(400)
                .send({ Status: false, ERROR: "Please provide the collegeName field and enter the collegeName(abbreviation)" })

        }
        collegeName = collegeName.toLowerCase()

        if (!(/^\w+([\.-]?\w+)@\w+([\. -]?\w+)(\.\w{2,3})+$/.test(email))) {
            return res
                .status(400)
                .send({ status: false, ERROR: "Please provide the email field and enter a valid email address." })
        }


        if (!(/^[6-9]\d{9}$/.test(mobile))) {
            return res
                .status(400)
                .send({ Status: false, ERROR: "Please provide the mobile field and enter a valid 10 digit mobile number" })
        }


        let dupliEmail = await internsModel.find({ email: email })
        if (dupliEmail.length > 0) {
            return res
                .status(400)
                .send({ Status: false, ERROR: "Email already exists. Please use a different email id." })
        }

        let dupliMobile = await internsModel.find({ mobile: mobile })
        if (dupliMobile.length > 0) {
            return res
                .status(400)
                .send({ Status: false, ERROR: "Mobile number already exists. Please use a different Mobile Number." })
        }


        const college = await collegeModel.findOne({ name: collegeName })

        if (college) {

            data['collegeId'] = college._id
            let createdIntern = await internsModel.create(data)
            return res
                .status(201)
                .send({ status: true, intern: createdIntern })
        }
        else {
            return res
                .status(404)
                .send({ Status: false, ERROR: "No such College Exists, Please check the abbreviation and make sure it is  correct" })
        }




    } catch (err) {
        return res
            .status(500)
            .send({ ERROR: err.message })
    }


}





const getDetails = async function (req, res) {

    try {


        let collegeName = req.query.collegeName


        if (!isValid(collegeName)) {
            return res
                .status(400)
                .send({ Status: false, ERROR: "Please provide the collegeName(abbreviation of the full name of the respected college) in query." })
        }

        collegeName = collegeName.toLowerCase()

        let requestedCollege = await collegeModel.findOne({ name: collegeName }).select({ name: 1, fullName: 1, logoLink: 1 })

        if (!requestedCollege) {
            return res
                .status(404)
                .send({ Status: false, ERROR: "No college with this abbreviation was found" })
        }

        let resCollege = requestedCollege.toObject()
        delete resCollege._id

        let availableInterns = await internsModel.find({ collegeId: requestedCollege._id }).select({ _id: 1, email: 1, mobile: 1, name: 1 })

        console.log(availableInterns)


        if (availableInterns.length > 0) {
            resCollege["Interns"] = availableInterns


            return res
                .status(200)
                .send({ Data: resCollege })
        }

        else {
            resCollege["Interns"] = "No interns are available for the respected college."

            return res
                .status(200)
                .send({ Data: resCollege })


        }
    } catch (err) {
        return res
            .status(500)
            .send({ Status: false, ERROR: err.message })
    }


}



module.exports.createCollege = createCollege;
module.exports.createIntern = createIntern;
module.exports.getDetails = getDetails;