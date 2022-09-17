const collegeModel = require('../models/collegeModel')
const regEx = /^[a-zA-Z ]*$/;
const regExLogoLink =  /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-/]))?/


const isValidation = function (value) {
    if (typeof value == 'undefined' || value == null) return false
    if (typeof value == "string" && value.trim().length == 0) return false
    return true
}

const createCollegeData = async function (req, res) {
    try {
        let collegeData = req.body
        if (Object.keys(collegeData).length === 0) {
            return res.status(400).send({ status: false, message: "data should be present in body" })
        }
        let { name, fullName, logoLink } = collegeData        
        if (!name) return res.status(400).send({ status: false, message: "please enter name" })
        if (!isValidation(name)) return res.status(400).send({ status: false, msg: "please enter valid name"})
     
        if (!regEx.test(name)) {
            return res.status(400).send({ status: false, message: "please use only alphabet in name" })
        }
        const findnm = await collegeModel.findOne({ name: name })
        if (findnm) {
            return res.status(400).send({ status: false, message: "name is already present" })
        }
        if (!fullName) return res.status(400).send({ status: false, message: "fullName is required" })

        if (!isValidation(fullName)) return res.status(400).send({ status: false, message: "fullname should be valid" })
        if (!regEx.test(fullName)) {
            return res.status(400).send({ status: false, message: "fullname must be in alphabet" })
        }
        
        
        if (!logoLink) return res.status(400).send({ status: false, message: "logolink must be present" })
        if (!regExLogoLink.test(logoLink)) {
            return res.status(400).send({ status: false, message: "logoLink is invalid" })
        }
        let createCollegeData = await collegeModel.create(collegeData)
        let newData ={ name: createCollegeData.name, fullName: createCollegeData.fullName, logoLink: createCollegeData.logoLink, isDeleted: createCollegeData.isDeleted}
        return res.status(201).send({ status: true, msg: "college data  created successfully", data: newData })
    }
    catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }
}

module.exports.colleges = createCollegeData