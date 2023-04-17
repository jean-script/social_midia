import { useContext } from 'react'
import { AuthContext } from '../contexts/auth'
import { Navigate } from 'react-router-dom'

export default function Private({children}){
    
    const { signed, loading } = useContext(AuthContext);

    if(loading){
        return(
            <>
                Carregando...
            </>
        )
    }

    if(!signed){
        return <Navigate to="/" />
    }

    return children;

}
