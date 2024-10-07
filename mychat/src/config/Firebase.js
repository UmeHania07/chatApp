
import { initializeApp } from "firebase/app";
import { createUserWithEmailAndPassword, getAuth, signInWithEmailAndPassword, signOut } from "firebase/auth"
import { getFirestore, setDoc, doc } from "firebase/firestore"
import { toast } from "react-toastify";

const firebaseConfig = {
    apiKey: "AIzaSyC1B39c2mVvk8kDbgVXtcH0dwlWGaws7LA",
    authDomain: "chat-app-9121f.firebaseapp.com",
    projectId: "chat-app-9121f",
    storageBucket: "chat-app-9121f.appspot.com",
    messagingSenderId: "1048667137961",
    appId: "1:1048667137961:web:ab82579d1db3d1646a46b8"
};

// Initialize Firebase
//auth allow to the user login and registered kre ga email or password or database mai user ki sari information hongi related to the chat and store mai pictures ho gi
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app)

const signup = async (username, email, password) => {
    try {
        //instence of auth in createUserWithEmailAndPassword
        //jab bhi user new account banaye ga to ye two collection bane gi pehli user collection and second chats info about user and friends
        const res = await createUserWithEmailAndPassword(auth, email, password);
        const user = res.user
        await setDoc(doc(db, "users", user.uid), {
            //ye user,UID unique Id create krta h
            id: user.uid,
            username: username.toLowerCase(),
            email,
            name: "",
            avatar: "",
            bio: "hey , there i am using chat app",
            lastSeen: Date.now()
        })
        await setDoc(doc(db, "chats", user.uid), {
            chatsData: [],

        })
    } catch (error) {
        console.error(error)
        //this is for eror msg
        toast.error(error.code.split('/')[1].split('-').join(" "))
    }
}

const logIn = async (email, password) => {
    try {
        await signInWithEmailAndPassword(auth, email, password)
    } catch (error) {
        console.error(error)
        //this is for eror msg
        toast.error(error.code.split('/')[1].split('-').join(" "))
    }
}

const logout = async () => {
    try {
        await signOut(auth)
    } catch (error) {
        console.error(error)
        //this is for eror msg
        toast.error(error.code.split('/')[1].split('-').join(" "))
    }

}

export {
    signup,
    logIn,
    logout,
    auth,
    db

}