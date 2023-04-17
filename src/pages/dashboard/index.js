import { useState, useContext, useEffect } from 'react'
import styles from './dashboard.module.css'

import { AuthContext } from '../../contexts/auth'
import Modal from 'react-modal';

import { collection, getDocs, orderBy, startAfter, query } from 'firebase/firestore'
import { db } from '../../services/firebaseConnection'
import ModalForm from '../../components/ModalForm'

const listRef = collection(db, "posts");

export default function Home(){

    const { user } = useContext(AuthContext)
    const [posts, setPosts] = useState([]);
    const [modalvisible, setModalvisible] = useState(false);
    const [loadingPost, setLoadingPost] = useState(true);

    useEffect(()=>{

        async function loadPosts(){

            const q = query(listRef, orderBy("created", 'desc'));
            
            const querySnapshot = await getDocs(q);
            setPosts([])
            await updateState(querySnapshot);

        }

        loadPosts();

    },[])

    async function updateState(querySnapshot){
        const isCollectionEmpy = querySnapshot.size === 0;

        if (!isCollectionEmpy) {
            let lista = [];
            querySnapshot.forEach(doc => {
                lista.push({
                    created:doc.data().created,
                    describe: doc.data().describe,
                    image: doc.data().imageURl,
                    usuario: doc.data().usuario
                })
            });

            setPosts(posts => [...posts, ...lista]);
            setLoadingPost(false)

            console.log(lista);
        }

    }
    
    function handleOpenModal(){
        setModalvisible(true);
    }

    function handleCloseModal(){
        setModalvisible(false);
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
                                                        <h2>{post.usuario}</h2>
                                                        <span></span>
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
            />
           )}

        </main>
    )
}
