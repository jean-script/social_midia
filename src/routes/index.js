import { Route, Routes } from 'react-router-dom'

import SignIn from '../pages/SignIn'
import Register from '../pages/Register'
import Home from '../pages/dashboard'
import Profile from '../pages/Profile'
import Post from '../pages/Posts'

import Private from './private'


export default function RoutesApp(){
    return(
        <Routes>
            <Route path='/' element={ <SignIn/> }/>
            <Route path='/register' element={ <Register/> }/>

            <Route path='/dashboard' element={ <Private><Home/></Private> }/>
            <Route path='/profile/:id' element={ <Private><Profile/></Private> }/>
            <Route path='/post/:id' element={ <Post/> }/>
        </Routes>
    )
}