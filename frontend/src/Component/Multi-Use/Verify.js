import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';

export const Verify = () => {

    

    const [a, updateA] = useState(false);

    useEffect(() => {
        // verifyToken();
        try {
        var b = JSON.parse(localStorage.getItem("AUTH"));
        if(b.data.role!=="teacher" || !b['data']['_id'].length>10) {
            localStorage.clear();
            updateA(true);
        }
    } catch(err) {
        window.localStorage.clear();
        updateA(true);
    }
    }, []);

    // const verifyToken = () => {
    //     let url = `http://127.0.0.1:8080/api/verifyToken?token=${JSON.parse(localStorage.getItem("AUTH")).token}&role=teacher&id=${JSON.parse(localStorage.getItem("AUTH")).data._id}`;
    //     // fetch code..
        
    // }

    return (
        <>
            {a?<Navigate to='/' />:null}
        </>
    )
}
