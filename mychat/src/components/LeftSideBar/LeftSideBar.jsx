import React, { useContext, useState } from 'react'
import './LeftSideBar.css'
import assets from '../../assets/assets'
import { useNavigate } from 'react-router-dom'
import { arrayUnion, collection, doc, getDocs, query, serverTimestamp, setDoc, updateDoc, where } from 'firebase/firestore'
import { db } from '../../config/Firebase'
import { AppContext } from '../../context/AppContext'
import { toast } from 'react-toastify'

const LeftSideBar = () => {

  const navigate = useNavigate()
  const { userData, chatData , chatUser , setChatUser , setMessagesId , messagesId } = useContext(AppContext)
  // mai jab bhi user ko search kro gi toh woh yahan store hojaye ga or shoSearch true hojaye ga
  const [user, setUser] = useState(null)
  const [showSearch, setShowSearch] = useState(false)



  const inputHandler = async (e) => {
    try {
      const input = e.target.value;
      if (input) {
        setShowSearch(true)
        const userRef = collection(db, 'users');
        //jahan username nazar aye db mai or value same ho toh ose target kre yani input variable run ho
        const q = query(userRef, where("username", "==", input.toLowerCase()))
        const querySnap = await getDocs(q)
        //querySnapshot.empty check karta hai ke QuerySnapshot mein koi document hai ya nahi.
        //Agar koi documents nahi hain (yaani query se data nahi mila), toh naturally empty ki value true hogi, kyun ke query snapshot khaali hai.
        //Agar documents maujood hain (yaani query se data mila), toh empty ki value false hogi.

        //"na to value barabar hai aur na hi type. ismai ye horaha h k agr user apna name search kre ga toh kuch bhi show nhi hoga ismai user
        //user ki id or baki sab ki id user ki id se na value match hogi or na type toh ye uer search bar mai show nhi hoga"
        if (!querySnap.empty && querySnap.docs[0].data().id !== userData.id) {
          //docs[0] ka matlab h k ek aray h ek docs h 0 1 2 hota h array mai is liye 0 array 
          //likha h maine 0 likha h its means k ab zero se query chaly gi or user ko search kre gi phir or oska data show kre gi 


          // console.log(querySnap.docs[0].data())


          //agr user pehly se add hoga mere pass toh woh show nhi hoga otherwise user exist nhi hoga toh show hojaye ga or agr
          // mai isko bhi add krlo gi toh wohbhi show nhi hoga 
          let userExist = false
          chatData.map((user) => {
            if (user.rId === querySnap.docs[0].data().id) {

            }
          })
          //agr use exist nhi h toh ye if run hoga
          if (!userExist) {
            //setUser User k ander querySnap.docs[0].data() ko set krdega
            setUser(querySnap.docs[0].data())
          }
        } else {
          setUser(null)
        }

      } else {
        setShowSearch(false)
      }

    } catch (error) {

    }

  }


  //user jab apne koi search kiye user ki chat pe click kre ga toh woh oski chat pe ajaye ga
  const addChat = async () => {
    const messagesRef = collection(db, 'messages')
    const chatsRef = collection(db, 'chats')
    try {
      const newMessageRef = doc(messagesRef)
      await setDoc(newMessageRef, {
        createAt: serverTimestamp(),
        //users ki chat yahan messages mai store hogi
        messages: []
      })

      //jab bhi do user k beech connection bane ga to ye function run hoga
      //ye do user ki conversation mujy apne database mai show hogi aiman or saifee ki 
      // time and kis user ne kis user se conversation ki h 
      await updateDoc(doc(chatsRef, user.id), {
        chatsData: arrayUnion({
          messageId: newMessageRef.id,
          lastMessage: "",
          //rId means reciver Id ye wo user ki ID h jis pe maine click kiya h
          rId: userData.id,
          updateAt: Date.now(),
          messageSeen: true,
          email: userData.email


        })
      })

      await updateDoc(doc(chatsRef, userData.id), {
        chatsData: arrayUnion({
          messageId: newMessageRef.id,
          lastMessage: "",
          rId: user.id,
          updateAt: Date.now(),
          messageSeen: true,
          email: user.email
        })
      })

    } catch (error) {
      toast.error(error.message)
      console.error(error)
    }
  }

  //jab user ki chat pe click kiya jaye ga toh oski chatData show hojaye ga
  const setChat = async (item) => {

    // console.log(item)

   setMessagesId(item.id)
   setChatUser(item)

  }

  return (
    <div className='ls'>
      <div className="ls-top">
        <div className="ls-nav">
          <img src={assets.logo} alt="" className='logo' />
          <div className="menu">
            <img src={assets.menu_icon} alt="" />
            <div className="sub-menu">
              {/* Arrow function lagane se ye tabhi run hota hai jab click hota hai.
              navigate('/profile'): Ye function call hai jo user ko /profile route par le jaata hai jab click hota hai. 
               function tabhi call ho jaata hai jab component render hota hai, aur click hone ka wait nahi karta. Is wajah se 
               ye tumhe automatically us route pe nahi le jata jab tum button ya kisi element pe click karte ho*/}
              <p onClick={() => navigate('/profile')}>Edit Profile</p>
              <hr />
              <p>Logout</p>
            </div>
          </div>
        </div>
        <div className="ls-search">
          <img src={assets.search_icon} alt="" />
          <input onChange={inputHandler} type="text" placeholder='Search here' />
        </div>
      </div>
      <div className="ls-list">
        {/* Yeh ek array banata hai jismein 12 elements hain Is array ke saare elements ko khaali strings se fill kar raha hai */}
        {
          showSearch && user
            ? <div onClick={addChat} className="friends add user">
              <img src={user.avatar} alt="" />
              <p>{user.name}</p>

            </div>
            //agr chat mai data ho toh map chaly 
            : chatData?.map((item, index) => (
              <div onClick={() => setChat(item)} key={index} className="friends">
                <img src={item.userData.avatar} alt="" />
                <div>
                  {/* agr mai chaho toh emoji bhi laga lo */}
                  <p>{item.userData.name}</p>
                  <span>{item.lastMessage}</span>
                </div>
              </div>
            ))

        }

      </div>
    </div>
  )
}

export default LeftSideBar
