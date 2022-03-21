const collegeModel = require("../models/collegeModel")


const internsModel = require("../models/internModel")






// create college 
const createCollege = async function (req, res) {


    try {
        let data = req.body



        const { name, fullName, logoLink } = data

        if (Object.keys(data) == 0) return res.status(400).send({ status: false, msg: "No input provided" })

        if (!name) return res.status(400).send({ status: false, msg: "name is required" })
        if (!fullName) return res.status(400).send({ status: false, msg: "fullName is required" })
        if (!logoLink) return res.status(400).send({ status: false, msg: "logoLink is required" })

        let collegeCreated = await collegeModel.create(data)
        res.status(201).send({ status: true, msg: "College Created Successfuly ", data: collegeCreated })
    } catch (error) {
        res.status(500).send({ status: false, msg: error.message })
    }


}




// create intern 
const createIntern = async function (req, res) {

    try {


        let data = req.body
        const { name, collegeName, email, mobile } = data
        console.log(collegeName)

        if (Object.keys(data) != 0) {


            if (!(name)) { return res.status(400).send({ Status: false, ERROR: "Please provide complete name of the intern  " }) }

            if (!(collegeName)) { return res.staus(400).send({ Status: false, ERROR: "Please provide the  college name abbreviation" }) }

            if (!(/^\w+([\.-]?\w+)@\w+([\. -]?\w+)(\.\w{2,3})+$/.test(email))) { return res.status(400).send({ status: false, ERROR: "Please provide a valid email" }) }
            if (!(/^\s*(?:\+?(\d{1,3}))?[-. (]*(\d{3})[-. )]*(\d{3})[-. ]*(\d{4})(?: *x(\d+))?\s*$/.test(mobile))) { return res.status(400).send({ Status: false, ERROR: "Please provide a valid 10 digit mobile number" }) }


            let dupliEmail = await internsModel.find({ email: email })
            if (dupliEmail.length > 0) { return res.status(400).send({ Status: false, ERROR: "Email already exists. Please use a different email id." }) }

            let dupliMobile = await internsModel.find({ mobile: mobile })
            if (dupliMobile.length > 0) { return res.status(400).send({ Status: false, ERROR: "Mobile number already exists. Please use a different Mobile Number." }) }


            let collegeId = await collegeModel.findOne({ name: collegeName }).select({ _id: 1 })

            if (collegeId) {
                let intern = { name: name, email: email, mobile: mobile, collegeId: collegeId._id }
                let createdIntern = await internsModel.create(intern)
                return res.status(201).send({ status: true, intern: createdIntern })
            } else { return res.status(404).send({ Status: false, ERROR: "No such College Exists, Please check the name and make sure it is the correct abbreviation of the full name of the college" }) }

        }
        else { return res.status(400).send({ status: false, ERROR: "Bad Request. Please provide a valid Body" }) }

    } catch (err) { return res.status(500).send({ ERROR: err.mesage }) }





}





const getDetails = async function (req, res) {

    try {


        let collegeName = req.query.collegeName
        if (!collegeName) { return res.status(400).send({ Status: false, ERROR: "Please provide collegeName in query" }) }

        let requestedCollege = await collegeModel.findOne({ name: collegeName })
        
        if (!requestedCollege) { return res.status(404).send({ Status: false, ERROR: "No college found" }) }

        let availableInterns = await internsModel.find({ collegeId: requestedCollege._id })
       

        let result = { name: requestedCollege.name, fullName: requestedCollege.fullName, logoLink: requestedCollege.logoLink }
        

        if (availableInterns.length > 0) {
            result["Iterests"] = availableInterns


            return res.status(200).send({ Data: result })
        }

        if (availableInterns.length == 0) {
            result["Iterests"] = "No Interns For Now"

            return res.status(200).send({ Data: result })


        }
    } catch (err) { return res.status(500).send({ Status: false, ERROR: err.message }) }






}



module.exports.createCollege = createCollege;
module.exports.createIntern = createIntern;
module.exports.getDetails = getDetails;