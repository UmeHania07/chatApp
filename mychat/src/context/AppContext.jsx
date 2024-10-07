import { doc, getDoc, onSnapshot, updateDoc } from "firebase/firestore";
import { createContext, useEffect, useState } from "react";
import { auth, db } from "../config/Firebase";
import { useNavigate } from "react-router-dom";

//createContext mai maine ye kaha h k agr user chat app mai login kre or oski avatar or name ho toh
//woh sedha chat mai ajaye agr nhi h toh profile mai ajaye or oski UID ko use krke ek doc banaya h phir getDoc kiya h data get krnr k liye

export const AppContext = createContext();

const AppContextProvider = (props) => {

    const navigate = useNavigate()

    //ismai mai uer ka data or chat ka sara data store kre gy
    const [userData, setUserData] = useState(null)
    const [chatData, setChatData] = useState(null)
    //jab bhi mai kisi user ki chat pe click kro gi toh woh mjy oski message ID  yahan sent kre ga
    const [messagesId, setMessagesId] = useState(null)
    //or user k related messages yahn store hongy
    const [messages, setMessage] = useState([])
    //or jab mai  user pe click kro gi toh oski chatdata yahn chatUser mai store hogi
    const [chatUser , setChatUser] = useState(null)



    const loadUserData = async (uid) => {
        try {
            //maine mention kiya h k user mai se sara data get kro or show kro
            //user ka sara data userData mai save hoga jo meri useState h
            const userRef = doc(db, 'users', uid)
            const userSnap = await getDoc(userRef)
            const userData = userSnap.data()
            //console.log(userData);
            setUserData(userData)
            if (userData.avatar && userData.name) {
                navigate('/chat')
            } else {
                navigate('/profile')
            }
            await updateDoc(userRef, {
                lastSeen: Date.now()
            })
            //ye user ka lastseen har ek second bad updata krega 
            setInterval(async () => {
                if (auth.chatUser) {
                    await updateDoc(userRef, {
                        lastSeen: Date.now()
                    })
                }
            }, 60000)

        } catch (error) {

        }
    }

    //jab bhi userData mai changes or update hoga toh ye useEffect excute hoga 
    useEffect(() => {
        if (userData) {
            const chatRef = doc(db, 'chats', userData.id)
            const unSub = onSnapshot(chatRef, async (res) => {
                const chatItems = res.data().chatsData
                // console.log(res.data())
                //ye tempData get kre ga chat data with user Data k sath jab ye for loop complete hojaye ga phir ye tempData run hoga
                const tempData = []
                for (const item of chatItems) {
                    const userRef = doc(db, 'users', item.rId)
                    const usersnap = await getDoc(userRef)
                    const userData = usersnap.data()
                    tempData.push({ ...item, userData })
                }
                //jab ye array tempData banne ga toh ye b.updatedAt run hoga jo hume bataein ga k knsa data
                // recent h toh hum recent chat top rakhy gy or old chat ko bottom pe 
                //yani jo object sabse recent (naya) update hua hoga, woh list mai pehle aayega.
                // a aur b tempData array ke individual objects hain.Iske baad setChatData() function ko call karke, sorted data ko update kiya ja raha hai.
                setChatData(tempData.sort((a, b) => b.updatedAt - a.updatedAt))
            })
            return () => {
                unSub()
            }
        }
    }, [userData])

    const value = {
        userData,
        setUserData,
        chatData,
        setChatData,
        loadUserData,
        messages,
        setMessage,
        messagesId,
        setMessagesId,
        chatUser,
        setChatUser
    }
    return (
        <AppContext.Provider value={value}>
            {props.children}
        </AppContext.Provider>
    )
}

export default AppContextProvider