const collegeModel = require("../models/collegeModel")
const internsModel = require("../models/internModel")
const mongoose = require('mongoose')


const isValidObjectId = function (objectId) {
    return mongoose.Types.ObjectId.isValid(objectId)
}



// create college 
const createCollege = async function (req, res) {


    try {
        let data = req.body



        const { name, fullName, logoLink } = data

        if (Object.keys(data) == 0) return res.status(400).send({ status: false, Error: "Body is empty. No input provided. Please provide input" })

        if (!name) { return res.status(400).send({ status: false, ERROR: "Name is required. Plese provide the name field and enter the correct abbreviation." }) }
        if (!fullName) { return res.status(400).send({ status: false, ERROR: "fullName is required. Please provide the fullName field and enter the correct name of the college." }) }
        if (!logoLink) { return res.status(400).send({ status: false, ERROR: "logoLink is required. Please provide the logoLink field and enter logo link." }) }

        let dupliName = await collegeModel.find({ name: name })
        if (dupliName.length > 0) { return res.status(400).send({ Status: false, ERROR: "College with this name abbreviation already exists." }) }

        let dupliFullName = await collegeModel.find({ fullName: fullName })
        if (dupliFullName.length > 0) { return res.status(400).send({ Status: false, ERROR: "College with this full name already exists." }) }



        let collegeCreated = await collegeModel.create(data)
        res.status(201).send({ status: true, msg: "College Created Successfuly. ", data: collegeCreated })
    } catch (error) {
        res.status(500).send({ status: false, ERROR: error.message })
    }


}







// create intern 
const createIntern = async function (req, res) {

    try {


        let data = req.body
        const { name, collegeId, email, mobile } = data


        if (Object.keys(data) != 0) {

            if (!(name)) { return res.status(400).send({ Status: false, ERROR: "Please provide the name field and enter the complete name of the intern." }) }
            if (!isValidObjectId(collegeId)) { return res.status(400).send({ Status: false, ERROR: "Please provide the collegeId field and enter the correct College Id ." }) }

            if (!(/^\w+([\.-]?\w+)@\w+([\. -]?\w+)(\.\w{2,3})+$/.test(email))) { return res.status(400).send({ status: false, ERROR: "Please provide the email field and enter a valid email address." }) }
            if (!(/^\s*(?:\+?(\d{1,3}))?[-. (]*(\d{3})[-. )]*(\d{3})[-. ]*(\d{4})(?: *x(\d+))?\s*$/.test(mobile))) { return res.status(400).send({ Status: false, ERROR: "Please provide the mobile field and enter a valid 10 digit mobile number" }) }


            let dupliEmail = await internsModel.find({ email: email })
            if (dupliEmail.length > 0) { return res.status(400).send({ Status: false, ERROR: "Email already exists. Please use a different email id." }) }

            let dupliMobile = await internsModel.find({ mobile: mobile })
            if (dupliMobile.length > 0) { return res.status(400).send({ Status: false, ERROR: "Mobile number already exists. Please use a different Mobile Number." }) }


            const college = await collegeModel.findOne({ _id: collegeId })

            if (college) {
                let intern = { name: name, email: email, mobile: mobile, collegeId: collegeId }
                let createdIntern = await internsModel.create(intern)
                return res.status(201).send({ status: true, intern: createdIntern })
            } else { return res.status(404).send({ Status: false, ERROR: "No such College Exists, Please check the id and make sure it is the correct id of the college" }) }

        }
        else { return res.status(400).send({ status: false, ERROR: "Bad Request. Please provide a valid Body" }) }

    } catch (err) { return res.status(500).send({ ERROR: err.message }) }





}





const getDetails = async function (req, res) {

    try {


        let collegeName = req.query.collegeName
        if (!collegeName) { return res.status(400).send({ Status: false, ERROR: "Please provide the collegeName(abbreviation of the full name of the respected college) in query." }) }

        let requestedCollege = await collegeModel.findOne({ name: collegeName })

        if (!requestedCollege) { return res.status(404).send({ Status: false, ERROR: "No college with this abbreviation was found" }) }

        let availableInterns = await internsModel.find({ collegeId: requestedCollege._id }).select({_id:1,email:1,mobile:1,name:1})


        let result = { name: requestedCollege.name, fullName: requestedCollege.fullName, logoLink: requestedCollege.logoLink }


        if (availableInterns.length > 0) {
            result["Iterests"] = availableInterns


            return res.status(200).send({ Data: result })
        }

        if (availableInterns.length == 0) {
            result["Iterests"] = "No interns are available for the respected college."

            return res.status(200).send({ Data: result })


        }
    } catch (err) { return res.status(500).send({ Status: false, ERROR: err.message }) }






}



module.exports.createCollege = createCollege;
module.exports.createIntern = createIntern;
module.exports.getDetails = getDetails;