import {useContext, useEffect, useState} from 'react';
import "./CSS/myclass.css";
import {IoMdArrowRoundBack} from "react-icons/io";
import { Navigate } from 'react-router-dom';
import { useToast, Divider, Input, Spinner, Button } from '@chakra-ui/react';
import { BsSearch } from 'react-icons/bs';
import {AiFillDelete} from "react-icons/ai";
import {Prof} from "./Prof.js";
import { GlobalVars } from '../../App';
import {AiFillEye} from "react-icons/ai";
import { AddStudent } from './AddStudent';

export const MyClass = () => {
    
    const [redir, updateRedir] = useState(false);
    const [searchQuery, updateSearch] = useState("");
    const [load, updateLoad] = useState(false);
    const {prof} = useContext(GlobalVars);
    const {toggleProf} = useContext(GlobalVars);
    const {test} = useContext(GlobalVars);
    const [sId, updateId] = useState("");
    const [data, updateData] = useState([]);
    const toast = useToast();
    const {openForm} = useContext(GlobalVars);
    const {toggleForm} = useContext(GlobalVars);

    useEffect(() => {
        window.scroll(0, 0);
        initialize();
    }, [test]);

    const initialize = () => {
        updateLoad(false);
        try {
            const url = `http://127.0.0.1:8080/api/getStudents?token=${JSON.parse(localStorage.getItem("AUTH"))['token']}&cls=${JSON.parse(localStorage.getItem("AUTH"))['data']['cls']}&sec=${JSON.parse(localStorage.getItem("AUTH"))['data']['sec']}`;
            fetch(url)
            .then(res => res.json())
            .then(data => {
                if(data['message']==="Sucess") {
                    updateData(data['data']);
                    updateLoad(true);
                }
                else errFunc();
            })
            .catch(err => errFunc())
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

    const deleteSt = (id) => {
        updateLoad(false);
        try {
            const url = `http://127.0.0.1:8080/api/deleteStudent?token=${JSON.parse(localStorage.getItem("AUTH"))['token']}&id=${id}`;
            fetch(url)
            .then(res => res.json())
            .then(data => {
                console.log(data);
                if(data['message'] === 'Sucess') {
                    initialize();
                    setTimeout(() => {updateLoad(true)}, 200);
                }
                else {
                    errFunc();
                    setTimeout(() => {updateLoad(true)}, 200);
                }
            })
            .catch(err =>{
                setTimeout(() => {updateLoad(true)}, 200);
                
                errFunc();});
        } catch(err) {
            setTimeout(() => {updateLoad(true)}, 200);
            errFunc();
        }
    }
    return (
        <>
            <div className="__today_out" style={{display:'flex', flexDirection:'column', width:'100%', minHeight:'100vh', height:'auto'}}>
                <div className="__today_container">
                    <div className='__today_backBtn' onClick={() => {updateRedir(!redir)}}><IoMdArrowRoundBack /></div>
                    Your Class
                </div>
               {load? <div className="__class_container">
                <div className="__class_addSt">
                <Button
                        background={'rgb(20, 20, 20)'}
                        color={'#fff'}
                        _hover={{ bg : 'rgb(20, 20, 20)'}}
                        _active={{ bg : '#222', opacity : .8}}
                        _focus={{ bg : '#222', opacity : .8}}
                        height={50}
                        fontSize={20}
                        width={'90%'}
                        marginTop={3}
                        onClick={() => {toggleForm()}}
                        >
                        Add Student
                        </Button>
                </div>
                <div className="__today__search" style={{marginTop: '90px', marginBottom:'-10px'}}>
                                <Input placeholder='Search' variant="filled" size='lg' className="__today__input" onChange={(e) => updateSearch(e.target.value)} style={{boxShadow: '1px 1px 3px rgb(210, 210, 210)', position:'relative'}} />
                                <button className="__today_sBtn" style={{position:'absolute',fontSize:'18px',height:'50px', width:'50px', marginLeft:'-10px', zIndex:2, left:'calc(100% - 40px)', display:'flex', alignItems:'center', justifyContent:'center'}}><BsSearch /></button>
                            </div>
                            {
                                !(openForm||prof)?
                                <>
                                <div className='__today_studentsList' style={{userSelect:'none'}}>
                                {
                                    data.map((a) => {
                                        if((a.name+a.admNo).toLowerCase().includes(searchQuery.toLowerCase())) {
                                        return <>
                                            <div className='__today_student' key={a._id}>
                                                <span className='__today_studentName'>{a.roll}. {a.name.length>22?a.name.split(0, 20)+"..":a.name}</span>
                                                <span className='__today_studentAdm'>Adm no. {a.admNo}</span>
                                                <div className="__today_presentIcon __overall_clickEffect" onClick={() => {deleteSt(a._id)}} style={{fontSize:'27px', height:'40px', height:'50px', right:'10px', background:'red', color:'white'}}>
                                                    <AiFillDelete />
                                                </div>
                                                <div className="__today_presentIcon __overall_clickEffect" onClick={() => {updateId(a._id);toggleProf()}} style={{fontSize:'27px',height:'50px', right:'70px', background:'rgb(240, 240, 240)'}}>
                                                    <AiFillEye />
                                                </div>
                                                </div>
                                            <Divider orientation="horizontal" style={{borderBottomColor:'rgb(210, 210, 210'}} />
                                                </>
                                        }
                                    })
                                }
                            </div>
                            </>
                            :null}
                <br /><br /></div>:
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
            {redir?<Navigate to='/home' />:null}
            {prof?<Prof id={sId} />:null}
            {openForm?<AddStudent />:null}
        </>
    );
}
