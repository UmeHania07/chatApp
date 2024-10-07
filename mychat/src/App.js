import React, { useContext, useEffect } from 'react'
import { Route, Routes, useNavigate } from 'react-router-dom'
import Login from './pages/Login/Login'
import Chat from './pages/Chat/Chat'
import ProfileUpdate from './pages/ProfileUpdate/ProfileUpdate'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { onAuthStateChanged } from 'firebase/auth'
import { auth } from './config/Firebase'
import { AppContext } from './context/AppContext'


//impotant things
//Render: Component ya HTML ko browser mein dikhana.
// Run: Function ya code ka execute hona.

const App = () => {

  const navigate = useNavigate();
    const {loadUserData}  = useContext(AppContext)


  useEffect(() => {
    //jab login ya logout hoga toh ye function run hoga
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        navigate('/chat')
        // console.log(user)
        await loadUserData(user.uid)
      } else {
        navigate('/')
      }
    })
  }, [])
  return (
    <>
      <ToastContainer />
      <Routes>

        <Route path='/' element={<Login />} />
        <Route path='/chat' element={<Chat />} />
        <Route path='/profile' element={<ProfileUpdate />} />


      </Routes>
    </>
  )
}

export default App
