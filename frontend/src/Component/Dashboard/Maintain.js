import React, { useEffect } from 'react';
import "./CSS/main.css";
import {useState} from "react";
import {Navigate} from "react-router-dom";
import {IoMdArrowRoundBack} from "react-icons/io";
import {Divider, Spinner, Input, useToast} from "@chakra-ui/react";
import {BsSearch} from "react-icons/bs";
import {Switch} from "@chakra-ui/react";
import { Verify } from '../Multi-Use/Verify';

export const Maintain = () => {
    const t = new Date().getHours()*60 + new Date().getMinutes();
    const [studentList, updateList] = useState(false);
    const [redir, updateRedir] = useState(false);
    const [valid, updateValid] = useState("past");
    const [searchQuery, updateSearch] = useState("");
    const [colour, updateC] = useState("green");
    const toast = useToast();


    useEffect(() => {
        window.scroll(0, 0);
        checkTime();
        try {
            const url = `http://127.0.0.1:8080/api/todayReports?&token=${JSON.parse(localStorage.getItem("AUTH"))['token']}&cls=${JSON.parse(localStorage.getItem("AUTH"))['data']['cls']}&sec=${JSON.parse(localStorage.getItem("AUTH"))['data']['sec']}`;
            fetch(url)
            .then(res => res.json())
            .then(data => {
                if(data['message'] === "Success") {
                    console.log(data)
                    setTimeout(() => {
                        updateList(data['data']);
                    }, 1000);
                }
            })
            .catch(err => {
                errFunc();
            });
        } catch(err) {
            errFunc();
        }
    }, []);

    const checkTime = () => {
        if(t>=450&&t<=570) {
            updateValid("good");
        }
        else if(t>570) {
            updateValid("past")
        }
        else {
            updateValid("prev")
        }
    };

    const updateAtt = (arr) => {
        let url = `http://127.0.0.1:8080/api/maintainAtt?token=${JSON.parse(localStorage.getItem("AUTH"))['token']}&cls=${JSON.parse(localStorage.getItem("AUTH"))['data']['cls']}&sec=${JSON.parse(localStorage.getItem("AUTH"))['data']['sec']}&id=${arr['_id']}`;
        fetch(url)
        .then(res => res.json())
        .then(data => {
            if(data['message'] === 'Error!') {
                errFunc()
            }
            else if(data['message'] === 'deadline') {
                toast({
                    title: "It's over 8:30",
                    description: "You could not make attendance now.",
                    status: 'info',
                    duration: 7000,
                    isClosable: true,
                })
            }
        });
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
            <div className="__today_out" style={{display:'flex', flexDirection:'column', width:'100%', minHeight:'100vh', height:'auto', overflowX:'hidden'}}>
                <div className="__today_container">
                    <div className='__today_backBtn' onClick={() => {updateRedir(!redir)}}><IoMdArrowRoundBack /></div>
                    Maintain Attendance
                </div>
                {
                    // valid==="good"?
                    true?
                    studentList?
                    <div className="__today__details">
                            <div className="__today__search" style={{marginTop: '90px', marginBottom:'-10px'}}>
                                <Input placeholder='Search' variant="filled" size='lg' className="__today__input" onChange={(e) => updateSearch(e.target.value)} style={{boxShadow: '1px 1px 3px rgb(210, 210, 210)', position:'relative'}} />
                                <button className="__today_sBtn" style={{position:'absolute',fontSize:'18px',height:'50px', width:'50px', marginLeft:'-10px', zIndex:2, left:'calc(100% - 40px)', display:'flex', alignItems:'center', justifyContent:'center'}}><BsSearch /></button>
                            </div>
                            <div className='__today_studentsList'>
                                {
                                    studentList.map((a) => {
                                        if((a.name+a.admNo).toLowerCase().includes(searchQuery.toLowerCase())) {
                                        return <>
                                            <div className='__today_student'>
                                                <span className='__today_studentName'>{a.roll}. {a.name.length>22?a.name.split(0, 20)+"..":a.name}</span>
                                                <span className='__today_studentAdm'>Adm no. {a.admNo}</span>
                                                <div className="__today_presentIcon" style={{fontSize:'37px', right:'30px', background:'transparent'}}>
                                                    <Switch size='lg'
                                                    defaultChecked={a.att}
                                                    onChange={() => {updateAtt(a)}}
                                                    colorScheme='green'
                                                    />
                                                </div>
                                                </div>
                                            <Divider orientation="horizontal" style={{borderBottomColor:'rgb(210, 210, 210'}} />
                                                </>
                                        }
                                    })
                                }
                            </div>
                        </div>:
                        <Spinner
                        thickness='4px'
                        speed='0.7s'
                        emptyColor='gray.200'
                        color='#222'
                        size='xl'
                        />
                    :
                    <div className='__maintain_late'>
                        <img src={require("../IMG/timer.png")} className="__maintain_lateImg" alt="late image" />
                        <span className="__maintain_lateText">{valid==="prev"?"It's early, please com back at 7:30":"Today's attendance is completed, come back tomorrow"}</span>
                    </div>
                    }
            </div>
            <Verify />
            {redir?<Navigate to="/home" />:null}
        </>
    );
}
