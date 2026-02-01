import React, {useEffect, useState} from 'react';
import "./CSS/login.css";
import { Input, Button, useToast } from '@chakra-ui/react'
import { Navigate } from 'react-router-dom';

export const Login = () => {
    
    const [loading, updateLoading] = useState(false);
    const toast = useToast();
    const [name, updateName] = useState("");
    const [pass, updatePass] = useState("");
    const toggleLoad = () => updateLoading(!loading);
    const [redir, updateRedir] = useState(false);
    

    useEffect(() => {
        try{
            if(JSON.parse(localStorage.getItem("AUTH"))['data']['_id'].length>=10)
                updateRedir(true);
        } catch(err) {
            // Eat five star do nothing
        }
    }, []);

    const submitForm = () => {
            toggleLoad();
            const url = `http://127.0.0.1:8080/api/loginTeacher?name=${name}&pass=${pass}`;
            fetch(url)
            .then(res => res.json())
            .then(data => {
                console.log(data)
                if(data['message'] === 'Teacher not found') {
                    toast({
                        title: 'Invalid Details!',
                        description: "Either name or password is incorrect",
                        status: 'error',
                        duration: 8000,
                        isClosable: true,
                    });
                    updateLoading(false);
                }
                else {
                    localStorage.setItem("AUTH", JSON.stringify({token:data['token'], data:data['data']}));
                    updateRedir(true);
                }
            })
            .catch(err => {
                updateLoading(false);
                toast({
                    title: 'Error',
                    description: "Failed to connect to server, try after some time.",
                    status: 'error',
                    duration: 8000,
                    isClosable: true,
                })
            })
    }

    return (
        <>
            <div className="__login__container">
                <div className="__login_loginForm">
                    <div className="__login_restForm">
                        <div className="__login__title">Login</div>
                        <div className="__login__inputGroup">
                            <span style={{"fontSize":'18px', marginBottom:'10px'}}>Your name</span>
                            <Input placeholder='Name' variant="filled" size='lg' onChange={(e) => updateName(e.target.value)} />
                        </div>
                        <div className="__login__inputGroup">
                            <span style={{"fontSize":'18px', marginBottom:'10px'}}>Your password</span>
                            <Input type="password" placeholder='* * * * *' variant="filled" size='lg' onChange={(e) => updatePass(e.target.value)} />
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
                        marginTop={3}
                        onClick={submitForm}
                        isLoading={loading}
                        >
                        Login
                        </Button>
                        </div>
                    </div>
                </div>
            </div>
            {redir?<Navigate to="/home" />:null}
        </>
    )
}
