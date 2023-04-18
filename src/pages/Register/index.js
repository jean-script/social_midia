import { useState, useContext } from 'react'
import { Link } from 'react-router-dom';
import styles from './register.module.css'

import { AuthContext } from '../../contexts/auth';

export default function Register(){

    const { register, loadingAuth } = useContext(AuthContext)

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');

    async function handleRegister(e){
        e.preventDefault();

        if(name !=='' && email !=='' && password !== ''){
            register(name, email, password)
            setEmail('');
            setName('');
            setPassword('');

        } else {
            toast.warn('Preencha todos os campos');
            return;
        }


    }

    return(
        <div className={styles.container}>
           
           <main className={styles.main}>

                <h1>Crie sua conta</h1>
                <form className={styles.formsLogin} onSubmit={handleRegister}>
                    <input 
                        type='text' 
                        placeholder='Seu nome'
                        value={name}
                        onChange={(e)=> setName(e.target.value)} 
                    />

                    <input 
                        type='email' 
                        placeholder='email'
                        value={email}
                        onChange={(e)=> setEmail(e.target.value)} 
                    />
                    <input 
                        type='password' 
                        placeholder='******'
                        value={password}
                        onChange={(e)=> setPassword(e.target.value)} 
                    />

                    <button type='submit' className={styles.btn}>
                        {loadingAuth ? "Cadastrando..." : "Cadastrar"}
                    </button>    
                </form>

                <div className={styles.register}>
                    <hr/>
                    <Link to="/">Já possui conta? Faça o login</Link>
                </div>

           </main>

        </div>
    )
}
