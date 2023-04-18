import { useContext } from 'react'
import { AuthContext } from '../../contexts/auth'
import styles from './styles.module.css'
import { Link } from 'react-router-dom'


export default function Header(){

    const { signed, logount, user } = useContext(AuthContext)

    return(
        <header className={styles.header}>
            <Link to={!signed ? "/": "/dashboard"}>
                <h1>Social Mídia</h1>
            </Link>

            {signed && (
                <div className={styles.infoUser}>
                    <Link to={`/profile/${user.uid}`} className={styles.userProfile}>
                        {user.nome}
                    </Link>
                    <button type='button' className={styles.btnGoogle} onClick={()=> logount()}>
                        Sair
                    </button>
                </div>
            )}
            
        </header>
    )
}
