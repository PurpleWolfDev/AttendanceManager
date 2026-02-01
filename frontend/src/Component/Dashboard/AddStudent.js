import {useContext, useEffect, useState} from 'react';
import { ImCross } from 'react-icons/im';
import { GlobalVars } from '../../App';
import axios from 'axios';
import {Input, Select, Button, useToast, Spinner} from "@chakra-ui/react";
import img1 from "../IMG/images.png";
import "./CSS/add.css";

export const AddStudent = () => {

    const {toggleForm} = useContext(GlobalVars);
    const [name, updateName] = useState("");
    const [phone, updatePhone] = useState("");
    const toast = useToast();
    const [imgUrl, updateUrl] = useState("");
    const [roll, updateRoll] = useState("");
    const [admNo, updateAdm] = useState("");
    const [load, updateLoad] = useState(false);
    const {toggleTest} = useContext(GlobalVars);
    const [gender, updateGender] = useState("");

    const submitForm = () => {
        if(name.length>2&&admNo.length===5&&roll.length>0&&phone.length>=10) {
            try {
                updateLoad(false)
                const url = `http://127.0.0.1:8080/api/addStudent`;
                let d = {
                    name : name,
                    phone1 : phone,
                    gender:gender,
                    admNo:admNo,
                    roll:roll,
                    img:imgUrl,
                    cls:JSON.parse(localStorage.getItem("AUTH"))['data']['cls'],
                    token : JSON.parse(localStorage.getItem("AUTH"))['token'],
                    sec : JSON.parse(localStorage.getItem("AUTH"))['data']['sec']
                };

                axios.post(url, d)
                .then(data => {
                    console.log(data['data'])
                    updateLoad(true);
                    toggleTest();
                    if(data['data']['msg']==="student added") {
                        toast({
                            title: 'Success',
                            description: "Student successfully added to database.",
                            status: 'success',
                            duration: 7000,
                            isClosable: true,
                        })
                        updateAdm("");
                        updateName("");
                        updatePhone("");
                        updateRoll("");
                        updateUrl("");
                        toggleTest();

                    }
                    else if(data['data']['msg']==='exist') {
                        toast({
                            title: 'Failed',
                            description: "Student with given admission number exist!.",
                            status: 'warning',
                            duration: 7000,
                            isClosable: true,
                        })
                    }
                });
            } catch(err) {
                updateLoad(true);
                errFunc();
            }
        }
        else {
            toast({
                title: 'Invalid Input!',
                description: "Please fill up the form correctly",
                status: 'warning',
                duration: 7000,
                isClosable: true,
            });
        }
    };

    useEffect(() => {
        updateLoad(true);
        window.scroll(0, 0);
    }, []);


    const errFunc = () => {
        toast({
            title: 'Error!',
            description: "Some internal error occured! Try after some time",
            status: 'error',
            duration: 7000,
            isClosable: true,
        })
    };


    const convertToFiles = (e) => {
        updateLoad(false);
        try {
            const fi = e[0];
            var f = new FileReader();
            f.readAsDataURL(fi);
            f.onload = (e) => {
                updateUrl(e.target.result);
                console.log(e)
                updateLoad(true);
            }
    } catch(err) {
        toast({
            title: 'Error!',
            description: "Some internal error occured! Try after some time",
            status: 'error',
            duration: 7000,
            isClosable: true,
        })
        // convertToFiles(e);
        console.log(err)
    }
    }
    
    return (
        <>
            <div className="__prof_container">
                <div className="__today_container">
                        <div className='__prof_cross' onClick={() => {toggleForm()}}><ImCross /></div>
                        Add Student
                </div>
                {load?<div className="__add_inputContainer">
                    <div className="__login__inputGroup" style={{display:'flex', alignItems:'center', justifyContent:'center',height:'110px'}}>
                        <img src={imgUrl===""?img1:imgUrl} style={{width:'110px', background:'white', height:'110px', borderRadius:'50%', border:'1px solid rgb(220, 220, 220)', objectFit:'cover'}} alt="Profile Img" />
                    </div>
                    <div className="__login__inputGroup __add_Igroup">
                        <span style={{"fontSize":'18px', marginBottom:'10px'}}>Name</span>
                        <Input type="text" placeholder='Name' value={name} variant="filled" size='lg' onChange={(e) => updateName(e.target.value)} />
                    </div>
                    <div className="__login__inputGroup">
                        <span style={{"fontSize":'18px', marginBottom:'10px'}}>Admission No.</span>
                        <Input type="text" placeholder='Admission no.' value={admNo} variant="filled" size='lg' onChange={(e) => updateAdm(e.target.value)} />
                    </div>
                    <div className="__login__inputGroup">
                        <span style={{"fontSize":'18px', marginBottom:'10px'}}>Roll No.</span>
                        <Input type="text" placeholder='Roll no.' value={roll} variant="filled" size='lg' onChange={(e) => updateRoll(e.target.value)} />
                    </div>
                    
                    <div className="__login__inputGroup">
                        <span style={{"fontSize":'18px', marginBottom:'10px'}}>Gender</span>
                        <Select className="__overall_select" variant='filled' size="lg" value={gender} onChange={(e) => {updateGender(e.target.value);}} placeholder={'Select Gender'}>
                        <option value="m">Male</option>
                        <option value="f">Female</option>
                    </Select>                    </div>
                    <div className="__login__inputGroup">
                        <span style={{"fontSize":'18px', marginBottom:'10px'}}>Phone no.</span>
                        <Input type="text" placeholder='Phone no.' value={phone} variant="filled" size='lg' onChange={(e) => updatePhone(e.target.value)} />
                    </div>
                    <div className="__login__inputGroup" style={{height:'65px'}}>
                        <label for="file" className="__add_photo">{(imgUrl==="")?"Choose Image":"Choose Another Image"}</label>
                        <input type="file" accept='*/image' id="file" placeholder='Phone no.' style={{display:'none'}} variant="filled" size='lg' onChange={(e) => {console.log("Files Uploading");convertToFiles(e.target.files)}} />
                    </div>
                    <div className="__login__inputGroup">
                    <Button
                        background={'rgb(20, 20, 20)'}
                        color={'#fff'}
                        _hover={{ bg : 'rgb(20, 20, 20)'}}
                        _active={{ bg : '#222', opacity : .8}}
                        _focus={{ bg : '#222', opacity : .8}}
                        height={50}
                        fontSize={20}
                        width={'100%'}
                        marginTop={4}
                        onClick={() => {submitForm()}}
                        >
                        Add Student
                        </Button>
                    </div>
                </div>
                :
                <div style={{width:'100%', height:'100vh', display:'flex', alignItems:'center', justifyContent:'center'}}>
                <Spinner
                thickness='4px'
                speed='0.7s'
                emptyColor='gray.200'
                color='#222'
                size='xl'
                />
            </div>}
            </div>
        </>
    );
}
