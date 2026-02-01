import {useContext, useEffect, useState} from 'react';
import "./CSS/over.css";
import {IoMdArrowRoundBack} from "react-icons/io";
import { Navigate } from 'react-router-dom';
import { Spinner, Select, Divider, useToast } from '@chakra-ui/react';
import {ImCross} from "react-icons/im";
import {TiTick} from "react-icons/ti";
import { GlobalVars } from '../../App';
import { Prof } from './Prof';
import { Verify } from '../Multi-Use/Verify';

export const Overview = () => {

    const [redir, updateRedir] = useState(false);
    const [currentMonth, updateMonth] = useState("August");
    const month = ["January","February","March","April","May","June","July","August","September","October","November","December"];
    const [load, updateLoad] = useState(false);
    const [data, updateData] = useState([]);
    const thisMonth = month[new Date().getMonth()];
    const toast = useToast();
    const [currentDate, updateDate] = useState(0);
    const [sId, updateId] = useState("");
    const [list, updateList] = useState([]);
    const {toggleProf} = useContext(GlobalVars);
    const [days, updateDays] = useState([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31]);

    const {prof} = useContext(GlobalVars);

    useEffect(() => {
        initializeApp();
    }, []);


    const initializeApp = () => {
        try {
            const url = `http://127.0.0.1:8080/api/getOverallReports?token=${JSON.parse(localStorage.getItem("AUTH"))['token']}&cls=${JSON.parse(localStorage.getItem("AUTH"))['data']['cls']}&sec=${JSON.parse(localStorage.getItem("AUTH"))['data']['sec']}&month=${currentMonth}&date=${currentDate}`;
            fetch(url)
            .then(res => res.json())
            .then(data => {
                if(data['message'] === "Success") {
                    setTimeout(() => {
                        data['list']&&updateList(data['list']);
                        updateData(data['data']);
                    }, 1000);
                }
            })
            .catch(err => {
                errFunc();
            });
        } catch(err) {
            errFunc();
        }
        loadApp();
    }


    const loadApp = () => {
        setTimeout(() => {
            updateLoad(true);
        }, 1000);
    }

    const errFunc = () => {
        toast({
            title: 'Error!',
            description: "Some internal error occured! Try after some time",
            status: 'error',
            duration: 7000,
            isClosable: true,
        })
    };

    const sendReq1 = (m) => {
        updateLoad(false);
        try {
            const url = `http://127.0.0.1:8080/api/getOverallReports?token=${JSON.parse(localStorage.getItem("AUTH"))['token']}&cls=${JSON.parse(localStorage.getItem("AUTH"))['data']['cls']}&sec=${JSON.parse(localStorage.getItem("AUTH"))['data']['sec']}&month=${m}&date=${currentDate}`;
            fetch(url)
            .then(res => res.json())
            .then(data => {
                if(data['message'] === "Success") {
                    setTimeout(() => {
                        updateData(data['data']);
                        data['list']&&updateList(data['list']);
                        updateLoad(true);
                    }, 1000);
                }
            })
            .catch(err => {
                updateLoad(true)
                errFunc();
            });
        } catch(err) {
            updateLoad(true)
            errFunc();
        }
    }
    const sendReq2 = (d) => {
        updateLoad(false);
        try {
            const url = `http://127.0.0.1:8080/api/getOverallReports?token=${JSON.parse(localStorage.getItem("AUTH"))['token']}&cls=${JSON.parse(localStorage.getItem("AUTH"))['data']['cls']}&sec=${JSON.parse(localStorage.getItem("AUTH"))['data']['sec']}&month=${currentMonth}&date=${d}`;
            fetch(url)
            .then(res => res.json())
            .then(data => {
                if(data['message'] === "Success") {
                    setTimeout(() => {
                        updateData(data['data']);
                        updateLoad(true);
                        data['data']['list']&&updateList(data['data']['list']);
                    }, 1000);
                }
            })
            .catch(err => {
                updateLoad(true)
                errFunc();
            });
        } catch(err) {
            updateLoad(true)
            errFunc();
        }
    }


    return (
        <>
            <div className="__today_out" style={{display:'flex', flexDirection:'column', width:'100%', minHeight:'100vh', height:'auto'}}>
                <div className="__today_container">
                    <div className='__today_backBtn' onClick={() => {updateRedir(!redir)}}><IoMdArrowRoundBack /></div>
                    Overall Reports
                </div>
                <div className="__overall_container">
                    {
                        load?
                        <>
                            <div className="__overall_selectContainer">
                                <Select className="__overall_select" variant='filled' size="lg" value={currentMonth} onChange={(e) => {updateMonth(e.target.value);console.log(e.target.value);sendReq1(e.target.value)}} placeholder={'Select Month (Default : August)'}>
                                    {month.map((e) => {
                                        return <option className="__overall_val" key={e} value={e}>{e}</option>;
                                    })}
                                </Select>
                                <Select className="__overall_select" variant='filled' size="lg" value={currentDate} onChange={(e) => {updateDate(e.target.value);console.log(e.target.value);sendReq2(e.target.value)}} placeholder='Select Date'>
                                    {(currentMonth==="January"||currentMonth=="March"||currentMonth==="May"||currentMonth==="July"||currentMonth==="August"||currentMonth==="October"||currentMonth==="December")?
                                        currentMonth===thisMonth?
                                        days.map((e) => {
                                            if(e<=new Date().getDate()) {
                                            return <option className="__overall_val" key={e} value={e}>{e}</option>;
                                            }
                                        }):
                                        days.map((e) => {
                                            return <option className="__overall_val" key={e} value={e}>{e}</option>;
                                        })
                                        :(currentMonth==="February")?
                                        days.map((e) => {
                                            if(e<=28)
                                                return <option className="__overall_val" key={e} value={e}>{e}</option>;
                                        }):days.map((e) => {
                                            if(e<=30)
                                                return <option className="__overall_val" key={e} value={e}>{e}</option>;
                                        })
                                    }
                                </Select>
                            </div>
                            <div className="__overall_report">
                                <div className="__overall_reportHead">Reports</div>
                                <div className="__overall_reportText">Present : <b>{data.present}%</b></div>
                                <div className="__overall_reportText">Absent : <b>{data.absent}%</b></div>
                            </div>
                            {
                            
                            !prof?<div className="__overall_detailed">
                                <div className="__overall_reportHead" style={{fontSize:'28px', paddingTop: '40px'}}>Detailed Overview</div>
                                <br />
                                {
                                    !(currentDate===0)?
                                    list.map((e) => {
                                        return <>
                                        <div className='__today_student __overall_clickEffect' onClick={() => {updateId(e._id);toggleProf();}}>
                                            <span className='__today_studentName'>{e.roll}. {e.name.length>22?e.name.split(0, 20)+"..":e.name}</span>
                                            <span className='__today_studentAdm'>Adm no. {e.admNo}</span>
                                            {e.att?<div className="__today_presentIcon __today_green" style={{fontSize:'37px', right:'10px'}}><TiTick /></div>:<div style={{fontSize:'23px', right:'10px'}} className="__today_presentIcon __today_red"><ImCross /></div>}
                                            </div>
                                        <Divider orientation="horizontal" style={{borderBottomColor:'rgb(210, 210, 210'}} />
                                            </>
                                    })
                                    :
                                    <div style={{width:'100%', aspectRatio:1, display:'flex', justifyContent:'center', alignItems:'center', flexDirection:'column'}}>
                                        <img src={require('../IMG/ch.jpg')} style={{width:'90%', aspectRatio:1}} alt="Please select a date" />
                                    </div>
                                }
                                <br />
                                <br />
                            </div>:null
                            }
                        </>
                        :
                        <div style={{width:'100%', height:'100vh', display:'flex', alignItems:'center', justifyContent:'center'}}>
                            <Spinner
                            thickness='4px'
                            speed='0.7s'
                            emptyColor='gray.200'
                            color='#222'
                            size='xl'
                            />
                        </div>
                    }
                </div>
            </div>
            <Verify />
            {redir?<Navigate to="/home" />:null}
            {prof?<Prof id={sId} />:null}
        </>
    );
}
