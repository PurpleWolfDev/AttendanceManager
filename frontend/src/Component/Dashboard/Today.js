import React, { useEffect, useState } from 'react';
import "./CSS/today.css";
import {IoMdArrowRoundBack} from "react-icons/io";
import { Tabs,Tab, TabList, TabPanels, TabPanel } from '@chakra-ui/tabs';
import { useToast, Spinner, Input, Divider } from '@chakra-ui/react';
import {BsSearch} from "react-icons/bs";
import {TiTick} from "react-icons/ti";
import {ImCross} from "react-icons/im";
import { Navigate } from 'react-router-dom';
import { Verify } from '../Multi-Use/Verify';

export const Today = () => {

    const [todayData, updateData] = useState(false);
    const [redir, updateRedir] = useState(false);
    const [focusOn, updateF] = useState(false);
    const [searchQuery, updateSearch] = useState("");
    const [studentList, updateList] = useState([]);
    const toast = useToast();


    useEffect(() => {
        fetchDetails();
    }, []);

    const fetchDetails = () => {
        try {
            const url = `http://127.0.0.1:8080/api/todayReports?&token=${JSON.parse(localStorage.getItem("AUTH"))['token']}&cls=${JSON.parse(localStorage.getItem("AUTH"))['data']['cls']}&sec=${JSON.parse(localStorage.getItem("AUTH"))['data']['sec']}`;
            fetch(url)
            .then(res => res.json())
            .then(data => {
                if(data['message'] === "Success") {
                    console.log(data)
                    setTimeout(() => {
                        updateData({
                            strength : data['strength'],
                            present : data['present'],
                            absent : data['absent'],
                            girls : data['g'],
                            boys : data['m'],
                            girlsPresent : data['gp'],
                            boysPresent : data['mp'],
                            strengthPer : data['presentPer'],
                            c1:data['c1'],
                            c2:data['c2']
                        });
                        updateList(data['data'])
                    }, 1000);
                }
            })
            .catch(err => {
                errFunc();
            });
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
        
            <div className="__today_out" style={{display:'flex', flexDirection:'column', width:'100%', minHeight:'100vh', height:'auto'}}>
            <div className="__today_container">
                <div className='__today_backBtn' onClick={() => {updateRedir(!redir)}}><IoMdArrowRoundBack /></div>
                Today's Report
            </div>
            <div className="__today_restContainer">
            <Tabs isFitted>
                <TabList style={{display:'flex', justifyContent:'center', background:'#fff'}} size="lg">
                    <Tab fontSize={18}>Overview</Tab>
                    <Tab fontSize={18}>Details</Tab>
                </TabList>

                <TabPanels>
                    <TabPanel>
                        <div className="__today_overView">
                    {
            todayData?<>
                            <div className="__today_totalPresent">
                                <span className="__today_presentHead">Total Present</span>
                                <span className='__today_presentData'>{todayData.present}/{todayData.strength} ({((todayData.present/todayData.strength)*100).toFixed(1)}%)</span>
                            </div>
                            <div className="__today_totalPresent">
                                <span className="__today_presentHead">Boys Report</span>
                                <span className='__today_presentData'>{todayData.c1}/{todayData.boys} ({todayData.boysPresent}%)</span>
                            </div>
                            <div className="__today_totalPresent">
                                <span className="__today_presentHead">Girls Report</span>
                                <span className='__today_presentData'>{todayData.c2}/{todayData.girls} ({todayData.girlsPresent||0}%)</span>
                            </div>
                            </>:<Spinner
                                thickness='4px'
                                speed='0.7s'
                                emptyColor='gray.200'
                                color='#222'
                                size='xl'
                                />}
                        </div>
                        
                    </TabPanel>
                    <TabPanel>
                        <div className="__today__details">
                            <div className="__today__search">
                                <Input placeholder='Search' variant="filled" size='lg' className="__today__input" onChange={(e) => updateSearch(e.target.value)} style={{boxShadow: '1px 1px 3px rgb(210, 210, 210)', position:'relative'}} />
                                <button className="__today_sBtn" style={{position:'absolute',fontSize:'18px',height:'50px', width:'50px', marginLeft:'-10px', zIndex:2, left:'calc(100% - 40px)', display:'flex', alignItems:'center', justifyContent:'center'}}><BsSearch /></button>
                            </div>
                            <div className='__today_studentsList'>
                                {
                                    studentList.map((e) => {
                                        if((e.name+e.admNo).toLowerCase().includes(searchQuery.toLowerCase())) {
                                        return <>
                                        <div className='__today_student'>
                                            <span className='__today_studentName'>{e.roll}. {e.name.length>22?e.name.split(0, 20)+"..":e.name}</span>
                                            <span className='__today_studentAdm'>Adm no. {e.admNo}</span>
                                            {e.att?<div className="__today_presentIcon __today_green" style={{fontSize:'37px'}}><TiTick /></div>:<div style={{fontSize:'23px'}} className="__today_presentIcon __today_red"><ImCross /></div>}
                                            </div>
                                        <Divider orientation="horizontal" style={{borderBottomColor:'rgb(210, 210, 210'}} />
                                            </>
                                        }
                                    })
                                }
                            </div>
                        </div>
                    </TabPanel>
                </TabPanels>
            </Tabs>
            <Verify />
            </div>
            </div>
            {redir?<Navigate to="/home" />:null}
        </>
    );
}
