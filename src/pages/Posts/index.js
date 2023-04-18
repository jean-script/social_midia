import { useState, useEffect, useContext } from 'react'
import { useParams } from 'react-router-dom'

import {doc, getDoc, getDocs, addDoc, collection, query, orderBy, where, deleteDoc} from 'firebase/firestore';

import { db } from '../../services/firebaseConnection';
import Avatar from '../../assets/avatar.png'
import { FiTrash2 } from 'react-icons/fi';

import styles from './styles.module.css'

import { AuthContext } from '../../contexts/auth'
import { toast } from 'react-toastify';

const listRef = collection(db, "comments");

export default function Post(){

    const { user } = useContext(AuthContext);

    const { id } = useParams();
    const [userName, setUserName] = useState('');
    const [imageURl, setimageURl] = useState('');
    const [usuarioImg, setusuarioImg] = useState('');
    const [describe, setDescribe] = useState('');
    const [comentario, setComentario] = useState('');
    const [listaComentario, setListaComentario] = useState([]);


    useEffect(()=>{

        async function loadComentarios(){

            const q = query(listRef, orderBy("created", 'desc'), where("postId", '==', id));

            const querySnapshot = await getDocs(q);
            setListaComentario([]);
            await updateState(querySnapshot);

        }

        loadComentarios()

    },[id])

   async function updateState(querySnapshot){

    const isCollectionEmpy = querySnapshot.size === 0;

    if(!isCollectionEmpy){
        let lista = [];

        querySnapshot.forEach(doc => {
            lista.push({
                usuario: doc.data().usuario,
                comentario: doc.data().comentario,
                created:doc.data().created,
                userUrl: doc.data().userUrl,
                uid: doc.id
            })

            setListaComentario(coment => [...lista, coment]);
            
        })
    }

   }

    useEffect(()=>{

        async function loadPost(){

            const docRef = doc(db, "posts", id)
            await getDoc(docRef)
            .then((snapshot)=>{
                setUserName(snapshot.data().usuario)
                setimageURl(snapshot.data().imageURl);
                setusuarioImg(snapshot.data().usuarioImg);
                setDescribe(snapshot.data().describe)
            })
            .catch((e)=>{
                console.log(e);
            })

        }   

        loadPost()

    }, [id])

    function handleComentar(){

        if (comentario === '') {
            alert('comente algo')
            return;
        }
        
        addDoc(collection(db, "comments"), {
            created: new Date(),
            usuario: user.nome,
            comentario: comentario,
            postId: id,
            userUrl: user.avatarUrl,
        })
        .then(()=>{
            toast.success('Novo comentario adicionado')
            setComentario('');
        })
        .catch((e)=>{
            console.log(e);
            toast.error('Ops! Houve erro ao adicionar o comentario!')
        })

    }
    async function handleRemovePost(id){
        const docRef = doc(db, "comments", id);

        await deleteDoc(docRef)
        .then(()=>{
            toast.success('Poste deletado com sucesso!');
            let listaComen = listaComentario.filter(item => item.uid !== id)

            setListaComentario(listaComen);
        })
        .catch((e)=>{
            console.log(e);
            toast.error('Ops! Houve erro ao deletar!')
        })
    }

    return(
        <main className={styles.main}>
            

            <section className={styles.sessaopubli}>

                <article className={styles.publicacao}>
                    <div className={styles.infoUser}>
                        <div>
                            <div className={styles.userImgInfo}>
                                {usuarioImg ? (
                                    <img src={usuarioImg} alt='' width={40} height={40} className={styles.userImg}/>
                                ): (
                                    <img src={Avatar} alt='' width={40} height={40} className={styles.userImg}/>
                                )}
                                <h2>{userName}</h2>
                            </div>
                            
                            {/* <button className={styles.btnTrash} onClick={ ()=> handleRemovePost(post.uid)}>
                                <FiTrash2 size={25} color='#CF0E0E'/>
                            </button> */}
                            
                        </div>
                    </div>
                    <p className={styles.descricaoPubli}>
                        {describe}
                    </p>
                    {imageURl && (
                        <img src={imageURl} alt='' className={styles.imgPubli}/>
                    )}

                    
                </article>

                <article className={styles.publicacao}>
                    <h2>Adicionar comentario</h2>
                    <form className={styles.form}>
                        <textarea placeholder='Digite seu comentario' value={comentario} onChange={(e) => setComentario(e.target.value)}/>
                    </form>
                    <button className={styles.btnComentar} onClick={()=> handleComentar()}>
                        Comentar
                    </button>
                </article>

                <article className={styles.publicacao}>
                    <h2>Comentários</h2>
                    {listaComentario.length === 0 ?(
                        <>
                            Sem comentarios...
                        </>
                    ) : (
                        listaComentario.map(item =>{
                            return(
                                <>
                                    <div className={styles.infoUser}>
                                        <div>
                                            <div className={styles.userImgInfo}>
                                                { item.userUrl ? (
                                                    <img src={item.userUrl} alt='' width={40} height={40} className={styles.userImg}/>
                                                ) : (
                                                    <>
                                                        {/* <img src={Avatar} alt='' width={40} height={40} className={styles.userImg}/> */}
                                                    </>
                                                )}
                                                <h2>{item.usuario}</h2>
                                            </div>
                                            
                                                <button className={styles.btnTrash} onClick={ ()=> handleRemovePost(item.uid)}>
                                                    <FiTrash2 size={25} color='#CF0E0E'/>
                                                </button>
                                            </div>
                                    </div>
                                    <p className={styles.descricaoPubli}>
                                        {item.comentario}
                                    </p>
                                </>

                            )
                        })
                    ) }
                </article>

            </section>
           
        </main>
    )
}
