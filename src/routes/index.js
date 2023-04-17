import { Route, Routes } from 'react-router-dom'

import SignIn from '../pages/SignIn'
import Register from '../pages/Register'
import Home from '../pages/dashboard'
import Profile from '../pages/Profile'

import Private from './private'


export default function RoutesApp(){
    return(
        <Routes>
            <Route path='/' element={ <SignIn/> }/>
            <Route path='/register' element={ <Register/> }/>

            <Route path='/dashboard' element={ <Private><Home/></Private> }/>
            <Route path='/profile' element={ <Private><Profile/></Private> }/>
        </Routes>
    )
}