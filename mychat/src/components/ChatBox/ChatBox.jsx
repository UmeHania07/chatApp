import React, { useContext, useEffect, useState } from 'react'
import './ChatBox.css'
import assets from '../../assets/assets'
import { AppContext } from '../../context/AppContext'
import { onSnapshot, doc, updateDoc, arrayUnion, getDoc } from 'firebase/firestore'
import { db } from '../../config/Firebase'
import { toast } from 'react-toastify'


const ChatBox = () => {

  const { userData, messagesId, chatUser, messages, setMessage } = useContext(AppContext)

  const [input, setInput] = useState("")

  useEffect(() => {
    if (messagesId) {
      const unsub = onSnapshot(doc(db, 'messages', messagesId), (res) => {
        setMessage(res.data().messages.reverse())
        // console.log(res.data().messages.reverse())
      })
      //yeh ensure karta hai ke jab bhi tumhara component screen se hataya jaye
      //ya update ho, toh yeh unsub function chalke sab kuch theek se close kar de.

      //Jab tum return mai jama(5, 3) ko call karoge, toh yeh 5 aur 3 ko jod kar 8 wapas karega.
      // Function ke andar jo bhi return ke baad hota hai, wo jawab ya result hota hai
      //is mai jo ek dafa return run hojaye toh woh khatam hone k bad wapis return hojata hay
      return () => {
        unsub()
      }
    }
  }, [messagesId])

  //jab bhi kisi bhi user pe click kiya jaye ga toh iski chatUser or messageID yahn store hogi


  const sentMessage = async () => {
    try {
      if (input && messagesId) {
        await updateDoc(doc(db, 'messages', messagesId), {
          messages: arrayUnion({
            sId: userData.id,
            text: input,
            createAt: new Date()
          })
        })
        const userIDs = [chatUser.rId, userData.id]

        userIDs.forEach(async (id) => {
          const userChatRef = doc(db, 'chats', id)
          const userChatsSnapshot = await getDoc(userChatRef)

          if (userChatsSnapshot.exists()) {
            const userChatData = userChatsSnapshot.data()
            const chatIndex = userChatData.chatsData.findIndex((c) => c.messagesId === messagesId)
            userChatData.chatsData[chatIndex].lastMessage = input.slice(0, 30)
            userChatData.chatsData[chatIndex].updateAt = Date.now()
            if (userChatData.chatsData[chatIndex].rId === userData.id) {
              userChatData.chatsData[chatIndex].messageSeen = false
            }
            //yahan maine is k zariye ye sab apne database mai save kiya h 
            await updateDoc(userChatRef, {
              chatsData: userChatData.chatsData
            })
          }


        })

      }
    } catch (error) {
      toast.error(error.message)
      console.error(error.code)

    }
    setInput("");

  }



  return chatUser ? (
    <div className='chat-box'>
      <div className="chat-user">
        <img src={chatUser.userData.avatar} alt="" />
        <p>{chatUser.userData.name} <img className='dot' src={assets.green_dot} alt="" /></p>
        <img src={assets.help_icon} className="help" alt="" />
      </div>

      <div className="chat-msg">
        {messages.map((msg, index) => (
          <div key={index} className={msg.sId === userData.id ? 's-msg' : 'r-msg'}>
            <p className="msg">{msg.text}</p>
            <div>
              <img src={msg.sId === userData.id ? userData.avatar : chatUser.userData.avatar} alt="" />
              <p>2:30 PM</p>
            </div>
          </div>
        ))}
      </div>

      <div className='chat-input'>
        {/* accept='image/png, image/jpeg': Yeh attribute specify karta hai ke user sirf PNG (.png) aur JPEG (.jpeg) format wali images select kar sakta hai. Iska mtlab yeh hai ke input box mein sirf yeh do types ke image files dikhai denge.

hidden: Yeh attribute is input element ko web page pe se chhupa deta hai. User directly is input box ko nahi dekh sakta, lekin aap JavaScript se isko trigger kar sakte hain, jese ke kisi button click se */}
        <input onChange={(e) => setInput(e.target.value)} value={input} type="text" placeholder='Type a message' />
        <input type="file" id='image' accept='image/png , image/jpeg' hidden />
        {/* label mai jo image ki class di h woh actuall mai id ki image h */}
        <label htmlFor='image'>
          <img src={assets.gallery_icon} alt="" />
        </label>
        <img onClick={sentMessage} src={assets.send_button} alt="" />

      </div>
    </div>
  )
    :
    <div className="chat-welcome">
      <img src={assets.logo_icon} alt="" />
      <p>Chat anytime, anywhere</p>
    </div>
}

export default ChatBox
