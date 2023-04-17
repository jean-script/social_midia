import { createContext, useState, useEffect } from 'react'
import { db, auth } from '../services/firebaseConnection'

import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';

import { useNavigate } from 'react-router-dom'

export const AuthContext = createContext({});

function AuthProvider({children}){

    const navigate = useNavigate();

    const [user, setUser] = useState(null);
    const [loadingAuth, setLoadingAuth] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(()=>{

        async function loadUser(){
            const storgeUser = localStorage.getItem("@SocialUser");

            if(storgeUser){
                setUser(JSON.parse(storgeUser));
                setLoading(false);
            }

            setLoading(false)

        }   

        loadUser()

    },[])

    async function signIn(email, password){
        setLoadingAuth(true);

        await signInWithEmailAndPassword(auth, email, password)
        .then(async (value)=>{

            let uid = value.user.uid;

            const docRef = doc(db, "users", uid);

            const docSnap = await getDoc(docRef)

            let data = {
                uid:uid,
                nome:docSnap.data().nome,
                email:value.user.email,
                avatarUrl:null
            }

            setUser(data);
            storgeUser(data);
            setLoadingAuth(false);
            navigate("/dashboard");

        })
        .catch((e)=>{
            console.log(e);
            setLoadingAuth(false)
        })
    }

    async function register(name, email, password){
        setLoadingAuth(true);

        await createUserWithEmailAndPassword(auth,email,password)
        .then(async (value)=>{

            let uid = value.user.uid;

            await setDoc(doc(db, "users",uid),{
               nome:name,
               avatarUrl:null 
            })
            .then(()=>{
                
                let data = {
                    uid:uid,
                    nome:name,
                    email:value.user.email,
                    avatarUrl:null
                };

                setUser(data);
                storgeUser(data);
                setLoadingAuth(false);
                navigate('/dashboard');
            })

        })
        .catch((e)=>{
            setLoadingAuth(false)
            console.log(e);
        })

    }

    function logount(){
        setUser(null);
        localStorage.removeItem("@SocialUser");
    }

    function storgeUser(data){
        localStorage.setItem("@SocialUser", JSON.stringify(data));
    }

    return(
        <AuthContext.Provider
            value={{
                signed:!!user,
                user,
                signIn,
                register,
                loadingAuth,
                loading,
                logount
            }}
        >
            {children}
        </AuthContext.Provider>

    )

}


export default AuthProvider;
