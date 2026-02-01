const express = require("express");
const ns = require("node-schedule");
const mongoose = require("mongoose");
const app = express();
require('dotenv').config();
const cors = require("cors");
const jwt = require("jsonwebtoken");
var bodyParser = require('body-parser')
const fetch = require("cross-fetch");
const Schema = require('./Schema.js');
const bcrypt = require("bcryptjs");

const DB = "mongodb+srv://snips:test@cluster0.hscsw.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
const jwtKey = process.env.JWT;
app.use(cors({
    origin: '*'
}));
app.use(bodyParser.urlencoded({
    limit: '10mb',
    parameterLimit: 100000,
    extended: false 
}));

app.use(bodyParser.json({
    limit: '10mb'
}));
const port = process.env.PORT || 8080;

mongoose.connect(DB).then(() => {
	console.log("CONNECTED TO DB");
}).catch(err => console.log(err));


const Teacher = new mongoose.model("KDIteachersdata", Schema.teacherSchema);
const Student = new mongoose.model("KDIstudentdata", Schema.studentSchema);
const Admin = new mongoose.model("KDIadmindata", Schema.adminSchema);


app.get("/createAdmin", async(req, res) => {
	let name = req.query.name;
	let pass = req.query.pass;
	let scName = req.query.scName;
	let phone = req.query.phone;
	let date = new Date().getTime();
	let scId = scName.substring(0, scName.length/2).replace(" ", "")+date%10000;
	try{
		var newStd = new Admin({
			name,cls,sec,phone, pass, scId, img

		});
		var result = await newStd.save();
		res.json({
			msg:"student added",
			data:result
		});
	} catch(err){
		res.json({
			msg:"error",
			err
		});
	}
});


app.get('/api/createTeacher', async(req, res) => {
	var token = req.body.token;
	var name = req.body.name;
	var phone = req.body.phone;
	var cls = req.body.cls;
	var img = req.body.img;
	var pass = req.body.pass;
	var scId = req.body.scId;
	var sec = req.body.sec;
	try{
                var data = jwt.verify(token, jwtKey);
		if(data.role=="teacher"){
			var te = await Student.find({pass : pass});
			if(te.length==1) {
				res.json({
					msg : 'exist',
				})
		} else {
			var newStd = new Student({
			    name,cls,sec,phone, pass, scId, img

		    });
		    var result = await newStd.save();
		    res.json({
		    	msg:"student added",
		    	data:result
		    });
		}
	        }
		
		
	}catch(err){
		res.json({
			msg:"error",
			err
		});
	}
});


app.get("/api/loginTeacher", async(req,res) => {
	var name = req.query.name;
	var pass = req.query.pass;
	var scId = req.query.scId;
	try{
		var data = await Teacher.find({name, pass});
		if(data.length>0){
			if(true){
				console.log(data);
				var d = {
					name : data[0]['name'],
					cls : data[0]['cls'],
					sec : data[0]['section'],
					scId : scId,
					role: "teacher",
					_id : data[0]['_id']
				};
				var token = jwt.sign(d, jwtKey);
				res.json({
					message:"Success",
					token:token,
					data : d
				});
			}else{
				res.json({
					message:"Teacher not found"
				});
			}
		}else{
			res.json({
				message:"Teacher not found"
			});
		}
	}catch(err){
		console.log(err);
		res.json({
			msg:"Teacher not found",
			err
		});
	}
	
});

app.post("/api/addStudent", async(req,res) => {
	var token = req.body.token;
	var name = req.body.name;
	var admNo = req.body.admNo;
	var cls = req.body.cls;
	var img = req.body.img;
	var scId = req.query.scId;
	var sec = req.body.sec;
	var gender = req.body.gender;
	var phone1 = req.body.phone1;
	var roll = req.body.roll;
	try{
                var data = jwt.verify(token, jwtKey);
		if(data.role=="teacher"){
			var te = await Student.find({admNo : admNo});
			if(te.length==1) {
				res.json({
					msg : 'exist',
				})
		} else {
			var newStd = new Student({
			    name,admNo,cls,sec,phone1, scId, gender, roll, img

		    });
		    var result = await newStd.save();
		    res.json({
		    	msg:"student added",
		    	data:result
		    });
		}
	        }
		
		
	}catch(err){
		res.json({
			msg:"error",
			err
		});
	}
});



app.get("/api/todayReports", async(req, res) => {
	var date = new Date().getDate();
	var month = new Date().getMonth()<3?new Date().getMonth()+9:new Date().getMonth()-3;
	var cls = req.query.cls;
	var token = req.query.token;
	var sec = req.query.sec;
	var avg = 0;
	var arr = [];
	var a = 0;
	var mp=0, m=0,c1=0;
	var gp=0, g = 0,c2=0;
	try {
		let data = await Student.find({cls : cls, sec : sec});
		for(let i = 0;i<data.length;i++) {
			arr.push({
				name : data[i]['name'],
				admNo : data[i]['admNo'],
				_id : data[i]['_id'],
				att : data[i]['attendance'][month][date-1],
				roll : data[i]['roll']
			});
			data[i]['attendance'][month][date-1]?avg++:null;
			if(data[i]['gender']=="m") {
				m++;
				data[i]['attendance'][month][date-1]?mp++:null;
				c1++;
			}
			else {
				g++;
				data[i]['attendance'][month][date-1]?gp++:null;
				c2++;
			}
			a++;
		}
		avg = (avg/data.length).toFixed(1);
		console.log(mp, gp);
		gp = (gp/g)*100;
		mp = (mp/m)*100;
		avg*=100;
		arr.sort((a, b) => {
			return a.roll - b.roll;
		});
		res.json({
			message: 'Success',
			data: arr,
			strength: data.length,
			presentPer : avg,
			m: m,
			g : g,
			mp  :mp.toFixed(1), 
			c1:c1,
			c2:c2,
			gp : gp.toFixed(1),
			absentPer : 100 - avg,
			present : (avg/100)*data.length,
			absent : data.length - (avg/100)*data.length,
		});
	} catch(err) {
		res.json({
			msg:"error",
			err
		});
	}
});





app.get("/api/maintainAtt", async(req, res) => {
	var token = req.query.token;
	sec = req.query.sec;
	var cls = req.query.cls;
	var date = new Date().getDate();
	var month = new Date().getMonth()<3?new Date().getMonth()+9:new Date().getMonth()-3;
	var id = req.query.id;
	var hour = new Date().getHours();
	hour*=60;
	hour+=new Date().getMinutes();
	// if(hour>=500&&hour<=570) {
		if(true) {
		try {

			let data = await Student.find({_id : id});
			if(data.length!=1) {
				res.json({
					message : 'notstudent'
				});
			}
			else {
				data = data[0];
				data['attendance'][month][date-1] = !data['attendance'][month][date-1];
				const result = await Student.updateOne({_id : id}, {
					$set:{
						name : data['name'],
						cls : data['cls'],
						sec: data['sec'],
						admNo : data['roll'],
						gender: data['gender'],
						attendance : data['attendance']
					}
				});
				res.json({
					message: 'success'
				})
			}

		} catch(err) {
			console.log(err)
			res.json({
				message: "Error!"
			});
		}
	} else {
		res.json({
			message:"deadline"
		});
	}
});


const getMonthPer = async(arr, month) => {
	var avg = 0;
	var eachAvg = 0;
	var eachArr = [];
	var c = 0;
	console.log("Month = "+month)
	var check = new Date().getMonth()<3?new Date().getMonth()+9:new Date().getMonth()-3;
	if(check==month) {
		for(var i = 0;i<arr.length;i++) {
			eachArr = arr[i];
			for(var j = 0;j<new Date().getDate(); j++) {
				c++;
				eachAvg+= eachArr['att'][j]?1:0;
			}
			eachAvg = (eachAvg/c)*100;
			avg = avg+eachAvg;
			eachAvg=0;
			c = 0;
		}
		avg = (avg/arr.length)
		return avg;
	}
	else {
		for(var i = 0;i<arr.length;i++) {
			eachArr = arr[i];
			for(var j = 0;j<eachArr['att'].length; j++) {
				eachAvg+= eachArr['att'][j]?1:0;
			}
			eachAvg = (eachAvg/eachArr['att'].length)*100;
			avg = avg+eachAvg;
			eachAvg=0;
		}
		avg = (avg/arr.length)
		return avg;
	}
}


const getDayPer = async(arr, month, day) => {
	var avg = 0;
	for(var i = 0;i<arr.length;i++) {
		var per = arr[i]['att'];
		avg = avg+(per?1:0);
	}
	avg = (avg/arr.length)*100;
	console.log(avg)
	return avg;
}


app.get("/api/getOverallReports", async(req, res) => {
	var month = req.query.month;
	var date = req.query.date;
	var token = req.query.token;
	var cls = req.query.cls;
	var sec = req.query.sec;
	var arr = [];
    const monthNames = ["April","May","June","July","August","September","October","November","December","January","February","March"];
	month = monthNames.indexOf(month);
	try {
		
		if(date=="0") {
			var data = await Student.find({cls:cls, sec:sec});
			for(let i = 0;i<data.length;i++) {
				arr.push({
					name : data[0]['name'],
					admNo : data[0]['admNo'],
					_id : data[0]['_id'],
					att : data[0]['attendance'][month]
				});
			}
			var per = await getMonthPer(arr, month);
			res.json({
				message: 'Success',
				data :{present : per.toFixed(1),
				absent : (100-per).toFixed(1)}
			});
		}
		else {
			var avg = 0;
			var arr = [];
			var a = 0;
			let data = await Student.find({cls : cls, sec : sec});
			for(let i = 0;i<data.length;i++) {
				arr.push({
					name : data[i]['name'],
					admNo : data[i]['admNo'],
					_id : data[i]['_id'],
					att : data[i]['attendance'][month][date-1],
					roll : data[i]['roll']
				});
			}
			var per = await getDayPer(arr, month, date);
			arr.sort((a, b) => {
				return a.roll - b.roll;
			});
			res.json({
				message: 'Success',
				data :{
					present : per,
					absent : 100-per,
					list : arr
				}
			});
	}
}
	 catch(err) {
		console.log(err)
		res.json({
			msg:"error",
			err
		});
	}
});


const calcThis = async(arr, month, bool) => {
	let a = arr[month];
	let avg = 0;
	var ii = 0;
	if(bool) {
		for(var i = 0;i<new Date().getDate();i++) {
			avg = avg + (a[i]?1:0);
			ii++;
		}
		avg = (avg/ii)*100;
		return avg;
	}
	else {
		for(var i = 0;i<a.length;i++) {
			avg = avg + (a[i]?1:0);
			ii++;
		}
		avg = (avg/ii)*100;
		return avg;
	}
};


const convertToDate = async(arr, month) => {
	let arr2 = [];
	console.log(arr)
	for(var i = 0; i<new Date().getDate(); i++) {
		arr2.push({
			date : `${i+1}/${month}/2022`,
			att : arr[i]
		});
	}
	return arr2;
};


app.get("/api/getProf", async(req, res) => {
	var token = req.query.token;
	var id = req.query.id;
	var month = new Date().getMonth()<3?new Date().getMonth()+9:new Date().getMonth()-3;
	var month2 = month==0?11:month-1;
	try {
		let st = await Student.find({_id:id});
		if(st.length==1) {
		st = st[0];
		let thisMonth = await calcThis(st['attendance'], month, true);
		let prevMonth = await calcThis(st['attendance'], month2, false);
		let arr = st['attendance'][month];
		arr = await convertToDate(arr, `${new Date().getMonth()+1}`.length==1?`0${new Date().getMonth()+1}`:`${new Date().getMonth()+1}`);
		res.json({
			message: 'Success',
			thisMonth : thisMonth.toFixed(1),
			prevMonth : prevMonth.toFixed(1),
			info : {
				name : st['name'],
				img : st['img'],
				admNo: st['admNo'],
				list : arr
			}
		});
	}
	} catch(err) {
		console.log(err);
		res.json({
			message:'err'
		})
	}
});


app.get("/api/getStudents", async(req, res) => {
	var cls = req.query.cls;
	var token = req.query.token;
	var sec = req.query.sec;
	try {
		var data = jwt.verify(token, jwtKey);
		let st = await Student.find({cls:cls, sec:sec});
		st.sort((a, b) => {
			return a.roll - b.roll;
		});
		res.json({
			message:'Sucess',
			data:st
		});
	} catch(err) {
		console.log(err)
		res.json({
			message:'err'
		});
	}
});

app.get("/api/deleteStudent", async(req, res) => {
	var id = req.query.id;
	var token = req.query.token;
	try {
		var data = jwt.verify(token, jwtKey);
		let st = await Student.deleteOne({_id:id});
		console.log(st);
		res.json({
			message:'Sucess',
		});
	} catch(err) {
		console.log(err)
		res.json({
			message:'err'
		});
	}
});



// SMS JOB

ns.scheduleJob({hour: 10, minute: 0}, function(){
	sendSMS();
});


const getSMSList = async() => {
	let st = await Student.find({});
	var month = new Date().getMonth()<3?new Date().getMonth()+9:new Date().getMonth()-3;
	let arr = [];
	for(var i = 0;i<st.length;i++) {
		if(!(st[i]['attendance'][month][new Date().getDate()-1])) {
			arr.push({
				name : st[i]['name'],
				phone : st[i]['phone1'],
				admNo : st[i]['admNo']
			});
		}
	}
	return arr;
}


const sendSMS = async() => {
	let arr = await getSMSList();
	let l = arr.length;
	let i = 0;
	console.log(arr);
	var ID = setInterval(() => {
		try {
			let name = arr[i]['name'];
			let admNo = arr[i]['admNo'];
			let number = arr[i]['phone'];
			let message = `St. Paul's School\nYour ward ${name} is absent today ${new Date().getDate()}/${new Date().getMonth()+1}/${new Date().getFullYear()}.`;
			let url = `https://my.zitasms.com/services/send.php?key=7e38ab973b29aa3eda2590e5f217de76d84f042f&number=${number}&message=${message}&devices=%5B%221929%7C0%22%2C%221929%7C1%22%5D&type=sms&prioritize=0`;
			fetch(url)
			.then(res => res.json())
			.then(data => console.log(data));
			i++;
		} catch(err) {
			console.log(err);
			clearInterval(ID);
		}
	}, 12000);
}



app.listen(port, () => {
	console.log(`Server running on port ${port}`);
});

// Teacher.find({}, (err, user) => {
// 	user.forEach(async(e) => {
// 		let a = await Teacher.deleteOne({_id : e['_id']});
// 		console.log(a);
// 	})
// })

// Student.find({admNo : '13072'}, (err, msg) => console.log(msg));