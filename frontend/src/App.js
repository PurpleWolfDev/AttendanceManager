import { ChakraProvider } from '@chakra-ui/react'
import { createContext, useEffect, useState } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Login } from './Component/Login/Login';
import "./App.css";
import { Home } from './Component/Dashboard/Home';
import { Today } from './Component/Dashboard/Today';
import { Maintain } from './Component/Dashboard/Maintain';
import { Overview } from './Component/Dashboard/Overview';
import { MyClass } from './Component/Dashboard/MyClass';

export const GlobalVars = createContext();

function App() {

    const [prof, updateProf] = useState(false);
    const [test, updateTest] = useState(false);
    const [openForm, updateForm] = useState(false);

    const toggleProf = () => updateProf(!prof);
    const toggleTest = () => updateTest(!test);
    const toggleForm = () => updateForm(!openForm);

    const disableRightClick = () => {
        document.addEventListener('contextmenu', (e) => {
            e.preventDefault();
        });
    }

    useEffect(() => {
      disableRightClick();
    }, []);

    

    return (
        <>
            <ChakraProvider>
                <GlobalVars.Provider value={{prof, toggleProf, openForm, toggleForm, test, toggleTest}}>
                    <div style={{'maxWidth':'500px', 'width':'100%', 'display':'flex', 'alignItems':'center', 'justifyContent':'center', position:'absolute', left:'50%', transform:'translate(-50%, 0%)'}}>
                      <BrowserRouter>
                        <Routes>
                          <Route path='/' element={<Login />} />
                          <Route path='/home' element={<Home />} />
                          <Route path="/today" element={<Today />} />
                          <Route path='/maintain' element={<Maintain />} />
                          <Route path='/overview' element={<Overview />} /> 
                          <Route path="/yourclass" element={<MyClass />} />
                        </Routes>
                      </BrowserRouter>
                    </div>

                </GlobalVars.Provider>
            </ChakraProvider>
        </>
    );
}

export default App;
