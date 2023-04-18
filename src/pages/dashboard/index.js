import { useState, useContext, useEffect } from 'react'
import styles from './dashboard.module.css'

import { AuthContext } from '../../contexts/auth'
import Modal from 'react-modal';
import ModalForm from '../../components/ModalForm'

import { collection, getDocs, orderBy, query, doc, deleteDoc, onSnapshot } from 'firebase/firestore'
import { db } from '../../services/firebaseConnection'
import Avatar from '../../assets/avatar.png'

import { FiTrash2 } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';

const listRef = collection(db, "posts");

export default function Home(){

    const { user } = useContext(AuthContext)
    const [posts, setPosts] = useState([]);
    const [modalvisible, setModalvisible] = useState(false);
    const [loadingPost, setLoadingPost] = useState(true);

    useEffect(()=>{
        async function loadPost(){
            const q = query(listRef, orderBy("created", 'desc'));
           
            const unsub = onSnapshot(q, (snapshot)=>{
                let lista = [];

                snapshot.forEach(doc => {
                    lista.push({
                        created:doc.data().created,
                        describe: doc.data().describe,
                        image: doc.data().imageURl,
                        usuario: doc.data().usuario,
                        usuarioImg: doc.data().usuarioImg,
                        uid:doc.id,
                        userUid: doc.data().userUid
                    })
                });

                setPosts(lista);
                setLoadingPost(false)

            })

        }

        loadPost()
    },[])

    // useEffect(()=>{

    //     async function loadPosts(){

    //         const q = query(listRef, orderBy("created", 'desc'));
            
    //         const querySnapshot = await getDocs(q);
    //         setPosts([])
    //         await updateState(querySnapshot);
           
    //     }

    //     loadPosts();

    // },[])

    // async function updateState(querySnapshot){
    //     const isCollectionEmpy = querySnapshot.size === 0;

    //     if (!isCollectionEmpy) {
    //         let lista = [];
    //         querySnapshot.forEach(doc => {
    //             lista.push({
    //                 created:doc.data().created,
    //                 describe: doc.data().describe,
    //                 image: doc.data().imageURl,
    //                 usuario: doc.data().usuario,
    //                 usuarioImg: doc.data().usuarioImg,
    //                 uid:doc.id,
    //                 userUid: doc.data().userUid
    //             })
    //         });

    //         setPosts(posts => [...posts, ...lista]);
    //         setLoadingPost(false)

    //     }

    // }
    
    function handleOpenModal(){
        setModalvisible(true);
    }

    function handleCloseModal(){
        setModalvisible(false);
    }

    async function handleRemovePost(id){
        const docRef = doc(db, "posts", id);

        await deleteDoc(docRef)
        .then(()=>{
            toast.success('Poste deletado com sucesso!')
            let listaposts = posts.filter(item => item.uid !== id)

            setPosts(listaposts);
        })
        .catch((e)=>{
            console.log(e);
            toast.warn('Ops! Houve erro ao deletar!');
        })

    }

    Modal.setAppElement("#root");
    return(
        <main className={styles.main}>
           <div className={styles.container}>

                <section className={styles.sessaopubli}>

                    <div className={styles.newPublicacao}>
                        <button type="button" onClick={()=> handleOpenModal()} className={styles.btnNewPublic}>O que você quer compartilhar?</button>
                    </div>

                    {posts.length === 0 ?(
                        <>
                            <p>Sem posts no momento</p><br/> Clique em `O que você quer compartilhar?` para postar algo
                        </>
                    ): (
                        <>
                            {loadingPost ? (
                                <>
                                    Buscando post...
                                </>
                            ) : (
                                <>
                                    {posts.map((post, index)=>{
                                        return(
                                            <article className={styles.publicacao} key={index}>
                                                <div className={styles.infoUser}>
                                                    <div>
                                                        <div className={styles.userImgInfo}>
                                                            {post.usuarioImg ? (
                                                                <img src={post.usuarioImg} alt='' width={40} height={40} className={styles.userImg}/>

                                                            ): (
                                                                <img src={Avatar} alt='' width={40} height={40} className={styles.userImg}/>
                                                            )}
                                                            <Link to={`/post/${post.uid}`}>
                                                                <h2>{post.usuario}</h2>
                                                            </Link>
                                                        </div>
                                                        {post.userUid === user.uid &&(
                                                            <button className={styles.btnTrash} onClick={ ()=> handleRemovePost(post.uid)}>
                                                                <FiTrash2 size={25} color='#CF0E0E'/>
                                                            </button>
                                                        )}

                                                    </div>
                                                </div>
                                                <p className={styles.descricaoPubli}>
                                                    {post.describe}
                                                </p>
                                                {post.image && (
                                                    <img src={post.image} alt='' className={styles.imgPubli}/>
                                                )}
                                            </article>
                                        )
                                    })}
                                </>
                            )}
                        </>
                    )}

                    
                </section>

           </div>

           { modalvisible &&(
            <ModalForm
                isOpen={modalvisible}
                handleCloseModal={handleCloseModal}
                user={user}
                listpost={setPosts}
            />
           )}

        </main>
    )
}
