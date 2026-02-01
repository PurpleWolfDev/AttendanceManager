const mongoose = require("mongoose");

const adminSchema = new mongoose.Schema({
    name : String,
    pass : String,
    createdOn : String,
    phone : String,
    scName : String,
    scId : String,
});


const teacherSchema = new mongoose.Schema({
	name:{
		type: String,
		required: true
	},
    scId : String,
	pass:{
		type: String,
		required: true
	},
	phone:{
		type: Number,
		required: true
	},
	cls:{
		type: Number,
		required: true
	},
	section:{
		type: String,
		required: true
	}
});

const studentSchema = new mongoose.Schema({
    name: String,
    admNo : String,
    cls : String,
    sec : String,
    phone1: String,
    scId : String,
    gender : String,
    roll : String,
    img : {
        type:String,
        default:""
    },
    attendance: {
        type: Array,
        default: [
            [true, true, true, true, true, true, true, true, true, true,true, true, true, true, true, true, true, true, true, true,true, true, true, true, true, true, true, true, true, true],
            [true, true, true, true, true, true, true, true, true, true,true, true, true, true, true, true, true, true, true, true,true, true, true, true, true, true, true, true, true, true, true],
            [true, true, true, true, true, true, true, true, true, true,true, true, true, true, true, true, true, true, true, true,true, true, true, true, true, true, true, true, true, true],
            [true, true, true, true, true, true, true, true, true, true,true, true, true, true, true, true, true, true, true, true,true, true, true, true, true, true, true, true, true, true, true],
            [true, true, true, true, true, true, true, true, true, true,true, true, true, true, true, true, true, true, true, true,true, true, true, true, true, true, true, true, true, true, true],
            [true, true, true, true, true, true, true, true, true, true,true, true, true, true, true, true, true, true, true, true,true, true, true, true, true, true, true, true, true, true],
            [true, true, true, true, true, true, true, true, true, true,true, true, true, true, true, true, true, true, true, true,true, true, true, true, true, true, true, true, true, true, true],
            [true, true, true, true, true, true, true, true, true, true,true, true, true, true, true, true, true, true, true, true,true, true, true, true, true, true, true, true, true, true],
            [true, true, true, true, true, true, true, true, true, true,true, true, true, true, true, true, true, true, true, true,true, true, true, true, true, true, true, true, true, true, true],
            [true, true, true, true, true, true, true, true, true, true,true, true, true, true, true, true, true, true, true, true,true, true, true, true, true, true, true, true, true, true, true],
            [true, true, true, true, true, true, true, true, true, true,true, true, true, true, true, true, true, true, true, true,true, true, true, true, true, true, true, true],
            [true, true, true, true, true, true, true, true, true, true,true, true, true, true, true, true, true, true, true, true,true, true, true, true, true, true, true, true, true, true, true],
        ]
    },
});



module.exports = {
    teacherSchema,
    adminSchema,
    studentSchema,
};