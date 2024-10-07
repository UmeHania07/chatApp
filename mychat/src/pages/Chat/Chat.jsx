import React, { useContext, useEffect, useState } from 'react'
import './Chat.css'
import LeftSideBar from '../../components/LeftSideBar/LeftSideBar'
import ChatBox from '../../components/ChatBox/ChatBox'
import RightSideBar from '../../components/RightSideBar/RightSideBar'
import { AppContext } from '../../context/AppContext'

const Chat = () => {
  const { userData, chatData } = useContext(AppContext)
  const [loading, setLoading] = useState(true)


  //jab dono data ajaye ga means k jab load hojaye ga toh ye loading false hojaye gi
  useEffect(() => {
    if (userData && chatData) {
      setLoading(false)

    }
  }, [userData, chatData])

  return (
    <div className='chat'>
      {
        loading
          ? <p className='loading'>Loading...💕</p>
          : <div className="chat-container">
            <LeftSideBar />
            <ChatBox />
            <RightSideBar />
          </div>
      }

    </div>
  )
}

export default Chat
