const internModel = require("../models/internModel")
const collegeModel = require("../models/collegeModel")
const regEx = /^[a-zA-Z ]*$/;
const regexNumber = /^(\+91[\-\s]?)?[0]?(91)?[789]\d{9}$/
const regexMail = /[a-z0-9]+@[a-z]+\.[a-z]{2,3}/;

const Valid = function (value) {
  if (typeof value == 'undefined' || value == null) return false
  if (typeof value == "string" && value.trim().length == 0) return false
  return true
}



const createInternData = async function (req, res) {
  try {
    let data = req.body
    if (Object.keys(data).length === 0){
        return res.status(400).send({status: false, message: "Body should not leave empty"})
    }
    let {name, email, mobile, collegeName} = data
//name
    if (!name) return res.status(400).send({status: false, message: "name is required" })
    if (!Valid(name)) return res.status(400).send({status: false, message: "name is invalid" })
    if (!regEx.test(name)) return res.status(400).send({status: false, message: "name must be in alphabets" })
    let findName = await internModel.findOne({name: name})
    if (findName) return res.status(400).send({ status: false, message: "name has already registered" })

//mobile
    if (!mobile) return res.status(400).send({status: false, message: "mobile is required" })
    if (!regexNumber.test(mobile)) return res.status(400).send({ status: false, message: "mobile  number not more than 10 digit" })
    let findNumber = await internModel.findOne({mobile: mobile})
    if (findNumber) return res.status(400).send({status: false, message: " mobile is already registered"})

//email    
    if (!email) return res.status(400).send({status: false, message: "email is required"})
    if (!regexMail.test(email)) return res.status(400).send({ status: false, message: " not a valid email"})    
    let findEmail = await internModel.findOne({email: email})
    if (findEmail) return res.status(400).send({ status: false, message: "email is already registered"})

//collegeId
    if (!Valid(collegeName)) return res.status(400).send({ tatus: false, message: "not a valid collegename"})
    let findId = await collegeModel.findOne({name: collegeName})
    if (findId == null) return res.status(404).send({ status: false, message: "no college found by this name"})
    let collegeId = findId._id
    if (!collegeId) return res.status(404).send({status: false, message: "college does not exist"})

    let create = {name, email, mobile, collegeId}
    let intern = await internModel.create(create)
    let internsData = { isDeleted: intern.isDeleated, name: intern.name, email: intern.email, mobile: intern.mobile, collegeId }
    return res.status(201).send({ status: true, info: "sucessfully created intern data", data: internsData })

} catch (error) {
    return res.status(500).send({status: false, message: error.message})
}
}



const getCollegeDetails = async function (req, res) {
  try {
    let collegeName = req.query.collegeName

    if (!collegeName) return res.status(400).send({status: false, message: "collegeName is requried"});

    const collegeDetails = await collegeModel.findOne({name: collegeName})

    let { name,  fullName, logoLink}= collegeDetails 

    if (!collegeDetails) return res.status(404).send({ status: false, message: "College doesn't exist" })
    
    let interns = await internModel.find({collegeId: collegeDetails._id}).select({name:1, email:1, mobile:1 })

    let data = {name, fullName, logoLink, interns}

    res.status(200).send({ status: true, data: data })
} catch (error) {
    return res.status(500).send({ status: false, msg: error.message })

}
}



module.exports.intern = createInternData
module.exports.getCollegeDetails = getCollegeDetails