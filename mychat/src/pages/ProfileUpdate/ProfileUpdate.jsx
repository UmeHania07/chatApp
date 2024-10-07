import React, { useContext, useEffect, useState } from 'react'
import './ProfileUpdate.css'
import assets from '../../assets/assets'
import { onAuthStateChanged } from 'firebase/auth'
import { auth, db } from '../../config/Firebase'
import { collectionGroup, doc, getDoc, updateDoc } from 'firebase/firestore'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import upload from '../../lib/Upload'
import { AppContext } from '../../context/AppContext'

const ProfileUpdate = () => {

  const [image, setImage] = useState(false)
  const [name, setName] = useState("")
  const [bio, setBio] = useState("")
  const [uid, setUID] = useState("")
  const [prevImg, setPreImg] = useState("")
  const { setUserData } = useContext(AppContext)


  const navigate = useNavigate()


  //this function for name and avatar
  const profileUpdate = async (e) => {
    e.preventDefault()
    try {
      //agr koi image nhi h or user ne koi image bhi nhi lagai toh ye error show hoga
      if (!prevImg && !image) {
        toast.error("Upload Profile Picture")
      }
      const docRef = doc(db, 'users', uid)
      if (image) {
        //upload ye woh function hy jo maine lib mai banaya h
        const imgURL = await upload(image)
        setPreImg(imgURL)
        await updateDoc(docRef, {
          //jab user sab detail save krega toh ye functon run hoga
          avatar: imgURL,
          bio: bio,
          name: name
        })
      } else {
        await updateDoc(docRef, {
          bio: bio,
          name: name
        })
      }
      const snap = await getDoc(docRef)
      setUserData(snap.data())
      navigate('/chat')

    } catch (error) {
      console.error(error)
      toast.error(error.message)
    }
  }


  //if user login and authenticate in the web page then this code will be excute
  useEffect(() => {
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUID(user.uid)
        const docRef = doc(db, "users", user.uid)
        const docSnap = await getDoc(docRef)
        if (docSnap.data().name) {
          setName(docSnap.data().name)
        }
        if (docSnap.data().bio) {
          setBio(docSnap.data().bio)
        }
        if (docSnap.data().avatar) {
          setPreImg(docSnap.data().avatar)
        }
        //then logOut this code will be excute
      } else {
        navigate("/")
      }
    })
  }, [])

  return (
    <div className='Profile'>
      <div className="profile-container">
        <form onSubmit={profileUpdate}>
          <h3>Profile Details</h3>
          {/* maine ye jo label pe avatar likha h wohi maine id de h k mai jab bhi is image pe click kro toh mujy file mai images show ho */}
          <label htmlFor="avatar">
            {/* files[0] ka matlab hai pehla file jo user ne select kiya. Agar multiple files select karne ka option ho, to yeh sirf pehla file utha raha hai. */}
            <input onClick={(e) => setImage(e.target.files[0])} type="file" id="avatar" accept='.png, .jpg ,.jpng, ' hidden />
            <img src={image ? URL.createObjectURL(image) : prevImg ? prevImg : assets.avatar_icon} alt="" />
            Upload Profile Image
          </label>
          <input onChange={(e) => setName(e.target.value)} value={name} type="text" placeholder='Your name' required />
          <textarea onChange={(e) => setBio(e.target.value)} value={bio} placeholder='write profile bio' required></textarea>
          <button type='submit'>Save</button>
        </form>
        {/* agr image ho toh logo icon pe bhi wohi image ajaye */}
        <img className='profile-pic' src={image ? URL.createObjectURL(image) : prevImg ? prevImg : assets.logo_icon} alt="" />

      </div>

    </div>
  )
}

export default ProfileUpdate
