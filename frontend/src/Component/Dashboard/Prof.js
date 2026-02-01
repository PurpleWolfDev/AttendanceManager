import React, { useContext, useEffect, useState } from 'react';
import { ImCross } from 'react-icons/im';
import {GlobalVars} from "../../App.js";
import { TiTick } from 'react-icons/ti';
import { Divider, Input, Spinner, useToast } from '@chakra-ui/react';
import img1 from "../IMG/images.png";
import "./CSS/prof.css";

export const Prof = (props) => {

    const {toggleProf} = useContext(GlobalVars);
    const [data, updateData] = useState({});
    const [load, updateLoad] = useState(false);
    const toast = useToast();

    useEffect(() => {
        initializeApp();
    }, []);

    const initializeApp = () => {
        try {
            const url = `http://127.0.0.1:8080/api/getProf?token=${JSON.parse(localStorage.getItem("AUTH"))['token']}&id=${props.id}`;
            console.log(url);
            fetch(url)
            .then(res => res.json())
            .then(data => {
                updateData(data);
                setTimeout(() => {updateLoad(true)}, 500);
            })
            .catch(err => errFunc());
        } catch(err) {
            errFunc();
        }
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

    return (
        <>
            <div className="__prof_container">
                <div className="__today_container">
                        <div className='__prof_cross' onClick={() => {toggleProf()}}><ImCross /></div>
                        Profile
                </div>
                {
                    load?
                    <>
                    <div className="__prof_profileH">
                        {console.log(data.info.img)}
                        <img src={data.info.img===""?img1:data.info.img} style={{width:'110px', background:'white', height:'110px', borderRadius:'50%', border:'1px solid rgb(220, 220, 220)', objectFit:'cover'}} alt="Profile Img" className="__prof_img"/>
                    </div>
                    <Divider orientation="horizontal" style={{borderBottomColor:'rgb(210, 210, 210'}} />
                    <div className="__prof_basicInfo">
                        <div style={{height:'80px', width: '95%', display:'flex', flexDirection:'column', margin: '5px'}}>
                            <span className="__prof__name">Name</span>
                            <Input value={data.info.name} style={{fontWeight:500, fontSize:'18px', borderColor:'rgb(200, 200, 200)', width:'100%', paddingLeft:'15px'}} />
                        </div>
                        <div style={{height:'80px', width: '95%', display:'flex', flexDirection:'column', margin: '5px'}}>
                            <span className="__prof__name">Admission No.</span>
                            <Input value={data.info.admNo} style={{fontWeight:500, fontSize:'18px', borderColor:'rgb(200, 200, 200)', width:'100%', paddingLeft:'15px'}} />
                        </div>
                        <div style={{height:'80px', width: '95%', display:'flex', flexDirection:'column', margin: '5px'}}>
                            <span className="__prof__name">Attendance percentage last month</span>
                            <Input value={data.prevMonth} style={{fontWeight:500, fontSize:'18px', borderColor:'rgb(200, 200, 200)', width:'100%', paddingLeft:'15px'}} />
                        </div>
                        <div style={{height:'80px', width: '95%', display:'flex', flexDirection:'column', margin: '5px'}}>
                            <span className="__prof__name">Attendance percentage this month</span>
                            <Input value={data.thisMonth} style={{fontWeight:500, fontSize:'18px', borderColor:'rgb(200, 200, 200)', width:'100%', paddingLeft:'15px'}} />
                        </div>
                    </div><br />
                    <Divider orientation="horizontal" style={{borderBottomColor:'rgb(210, 210, 210'}} />
                    <div className="__prof_detailedContainer">
                        <div className="prof_detailsHead">This month</div>
                        <br />
                        {
                            data.info.list.map((e) => {
                                return <>
                                <div  className='__today_student __overall_clickEffect'>
                                    <span className='__today_studentName'>{e.date}</span>
                                    {e.att?<div className="__today_presentIcon __today_green" style={{fontSize:'37px', right:'10px'}}><TiTick /></div>:<div style={{fontSize:'23px', right:'10px'}} className="__today_presentIcon __today_red"><ImCross /></div>}
                                    </div>
                                <Divider orientation="horizontal" style={{borderBottomColor:'rgb(210, 210, 210'}} />
                                    </>
                            })
                        }
                    </div>
            </>:<div style={{width:'100%', height:'100vh', display:'flex', alignItems:'center', justifyContent:'center'}}>
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
        </>
    );;
}
