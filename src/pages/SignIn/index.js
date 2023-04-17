import { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import styles from './signIn.module.css'

import { AuthContext } from '../../contexts/auth';

export default function SignIn(){

    const { signIn, loadingAuth } = useContext(AuthContext);

    const [email,setEmail] = useState('');
    const [password,setPassword] = useState('');
    
    async function handleLogin(e){
        e.preventDefault();
    
        if (email !== '' && password !=='') {
    
          signIn(email,password)
    
        } else {
          alert('Preencha todos os campos!');
          return;
        }
    
      }
    return(
      <main className={styles.main}>

      <div className={styles.welcomeMessage}>
        <h1>Social Mídia</h1>
        <p>
          A Social Media ajuda você a se conectar com 
          pessoas que fazer parte da sua vida
        </p>
      </div>

      <div className={styles.welcome}>

        <h2>Faça seu login</h2>
        <form className={styles.formsLogin} onSubmit={handleLogin}>
          
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
              {loadingAuth ? "Logando..." : "Entrar"} 
            </button>

        </form>
        <div className={styles.register}>
          <Link to="/register">Criar conta</Link>
          <hr/>
        </div>

      </div>
    
    </main>
    )
}
