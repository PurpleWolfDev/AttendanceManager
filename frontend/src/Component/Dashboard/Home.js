import React, { useEffect, useState } from 'react';
import {Spinner} from "@chakra-ui/react";
import "./CSS/home.css";
import img1 from "../IMG/att.jpg";
import img4 from "../IMG/classroom_1.png";
import {Verify} from "../Multi-Use/Verify.js";
import img2 from "../IMG/icons8-attendance-64.png";
import img3 from "../IMG/lecture.png";
import { Navigate } from 'react-router-dom';

export const Home = () => {

    const [userData, updateData] = useState(false);
    const [maintain, updateMain] = useState(false);
    const [today, updateToday] = useState(false);
    const [over, updateO] = useState(false);
    const [cl, updateCl] = useState(false);


    useEffect(() => {
        window.scroll(0, 0);
        setTimeout(() => {
            try {
            updateData({
                name :JSON.parse(localStorage.getItem("AUTH"))['data']['name'],
                class:JSON.parse(localStorage.getItem("AUTH"))['data']['cls'],
                section: JSON.parse(localStorage.getItem("AUTH"))['data']['sec'],
                phone : JSON.parse(localStorage.getItem("AUTH"))['data']['phone'],
            });
        } catch(err) {

        }
        }, 1000);
    }, []);

    

    return (
        <>
            <div className='__home_container'>
                {
                userData?
                <div className="__home_restBody">
                    <div className="__home_welcomeMessage"><span style={{fontSize: '35px', fontWeight: 600}}>Dashboard</span>Welcome, {userData.name}</div>
                    <div className="__home_restIcons">
                        <div className="__home_icons" onClick={() => updateMain(!maintain)}>
                            <img className="__home_iconImg" src={img1} alt="attendance" />
                            <span style={{marginTop: '5px'}}>Maitain Attendance</span>
                        </div>
                        <div className="__home_icons" onClick={() => updateToday(!today)}>
                            <img className="__home_iconImg" src={img2} alt="attendance" />
                            <span style={{marginTop: '5px'}}>Today's Report</span>
                        </div>
                        <div className="__home_icons">
                            <img className="__home_iconImg" src={img3} alt="attendance" onClick={() => updateO(!over)} />
                            <span style={{marginTop: '5px'}}>Overall Reports</span>
                        </div>
                        <div className="__home_icons" onClick={() => updateCl(!cl)}>
                            <img className="__home_iconImg2" src={img4} alt="attendance" />
                            <span style={{marginTop: '10px'}}>Your Class</span>
                        </div>
                    </div>
                </div>
                :
                <div style={{height:'100vh', width:'100%', display:'flex', justifyContent:'center', alignItems:'center'}}>
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
            <Verify />
            {today?<Navigate to="/today" />:null}
            {over?<Navigate to="/overview" />:null}
            {maintain?<Navigate to="/maintain" />:null}
            {cl?<Navigate to='/yourclass' />:null}
        </>
    )
}
