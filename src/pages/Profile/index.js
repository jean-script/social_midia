import { useContext, useState, useEffect } from 'react'
import { AuthContext } from '../../contexts/auth'
import { Link, useParams } from 'react-router-dom'
import styles from './styles.module.css'

import Avatar from '../../assets/avatar.png'
import Img from '../../assets/imgFundo.jpg'
import { onSnapshot ,doc, updateDoc, getDocs, query, collection, orderBy, where, deleteDoc } from 'firebase/firestore'
import { db, storge } from '../../services/firebaseConnection'
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage'

import { FiTrash2 } from 'react-icons/fi';
import { toast } from 'react-toastify'

import Modal from 'react-modal';
import ModalForm from '../../components/ModalForm'

const listRef = collection(db, "posts");

export default function Profile(){
    const [modalvisible, setModalvisible] = useState(false);

    const { user, setUser, storgeUser } = useContext(AuthContext);
    const [nome, setNome] = useState(user && user.nome);
    const [email, setEmail] = useState(user && user.email);
    const [imageAvatar, setImageAvatar] = useState(null);
    const [posts, setPosts] = useState([]);
    const [avatarUrl, setAvatarUrl] = useState(user && user.avatarUrl);
    const [sobre, setSobre] = useState(user && user.sobre);

    const [PanerAvatar, setPanerAvatar] = useState(null);
    const [PanerUrl, setPanerUrl] = useState(user && user.PanerUrl);

    useEffect(()=>{
        async function loadPost(){
            const q = query(listRef, orderBy("created", 'desc'),where("userUid", '==', user.uid));
           
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

            })

        }

        loadPost()
    },[])
    

    // useEffect(()=>{

    //     async function loadPosts(){

    //         const q = query(listRef, orderBy("created", 'desc'), where("userUid", '==', user.uid));
            
    //         const querySnapshot = await getDocs(q);
    //         setPosts([]);
    //         await updateState(querySnapshot);

    //     }

    //     loadPosts();

    // },[user.uid])

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
    //                 uid: doc.id
    //             })
    //         });

    //         setPosts(posts => [...posts, ...lista]);

    //     }

    // }

    function handleFile(e){
        if(e.target.files[0]){
            const image = e.target.files[0];

            if(image.type === 'image/jpeg' || image.type ==='image/png'){
                setImageAvatar(image);
                setAvatarUrl(URL.createObjectURL(image))
            } else {
                setImageAvatar(null);
                return;
            }
        }
    }

    async function handleSubmit(e){
        e.preventDefault();


        if(imageAvatar === null && PanerAvatar === null && nome !== '' && sobre !==''){
            const docRef = doc(db,"users", user.uid);

            await updateDoc(docRef,{
                nome:nome,
                sobre:sobre
            })
            .then(()=>{
                let data ={
                    ...user,
                    nome:nome,
                    sobre:sobre,
                }

                setUser(data);
                storgeUser(data);
                toast.success("Atualizado com sucesso!");
                
            })
            .catch((e)=>{
                console.log(e);
            })
        } else if(imageAvatar !== null && nome !=='' && sobre !== ''){
            uploadImg();
        } else if(PanerAvatar !== null && nome !=='' && sobre !== '' && imageAvatar === null) {
            updatePaner()
        }

    }

    async function updatePaner(){
        const currentUid = user.uid;
        const uploadRef = ref(storge, `paner/${currentUid}/${PanerAvatar.name}`);

        const uploadTaks = uploadBytes(uploadRef, PanerAvatar)
        .then((snapShot)=>{

            getDownloadURL(snapShot.ref).then(async (downLoadURL)=>{
                let urlFoto = downLoadURL;

                const docRef = doc(db, "users", user.uid)
                await updateDoc(docRef,{
                    PanerUrl:urlFoto,
                    nome:nome,
                    sobre:sobre
                })
                .then(()=>{
                    let data = {
                        ...user,
                        nome:nome,
                        PanerUrl:urlFoto,
                        sobre:sobre,
                    }

                    setUser(data);
                    storgeUser(data);
                    console.log(data);
                    toast.success("Atualizado com sucesso!");
                })

            })

        })
    }

    async function uploadImg(){
        const currentUid = user.uid;

        const uploadRef = ref(storge, `images/${currentUid}/${imageAvatar.name}`);

        const uploadTaks = uploadBytes(uploadRef,imageAvatar)
        .then((snapShot)=>{

            getDownloadURL(snapShot.ref).then(async (downLoadURL)=>{
                let urlFoto = downLoadURL;

                const docRef = doc(db, "users", user.uid)
                await updateDoc(docRef,{
                    avatarUrl:urlFoto,
                    nome:nome,
                    sobre:sobre
                })
                .then(()=>{
                    let data = {
                        ...user,
                        nome:nome,
                        avatarUrl:urlFoto,
                        sobre:sobre,
                    }

                    setUser(data);
                    storgeUser(data);
                    console.log(data);
                    toast.success("Atualizado com sucesso!");
                })

            })

        })

    }

    async function handleRemovePost(id){
        const docRef = doc(db, "posts", id);

        await deleteDoc(docRef)
        .then(()=>{
            toast.success('poste deletado com sucesso!');
            let listaposts = posts.filter(item => item.uid !== id)

            setPosts(listaposts);
        })
        .catch((e)=>{
            console.log(e);
            toast.error('Ops! erro ao deletar')
        })

    }

    function handlePanerFile(e){
        if(e.target.files[0]){
            const image = e.target.files[0];
    
            if(image.type === 'image/jpeg' || image.type ==='image/png'){
                setPanerAvatar(image);
                setPanerUrl(URL.createObjectURL(image))
            } else {
                setPanerAvatar(null);
                return;
            }
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
     
                <section className={styles.containerPerfilInfo}>
                    <form onSubmit={handleSubmit}>
                        <div className={styles.containerPerfil}>
                            <div>
                                <label>
                                    <input type='file' accept='image/*' className={styles.inputImg} onChange={handlePanerFile}/>
                                    {PanerUrl === null ? (
                                        <img src={Img} alt='' className={styles.paner}/>
                                    ): (
                                        <img src={PanerUrl} alt='' className={styles.paner}/>
                                    )}
                                </label>

                            </div>
                            <div>
                                <label>
                                    <input type='file' accept='image/*' className={styles.inputImg} onChange={handleFile}/>
                                    { avatarUrl === null ?(
                                        <img src={Avatar} alt='' className={styles.imgPerfil}/>
                                    ) : (
                                        <img src={avatarUrl} alt="foto de perfil" className={styles.imgPerfil} />
                                    )}
                                    
                                </label>
                            </div>
                        </div>

                        <div className={styles.perfilInfo}>
                            <input type='text' value={nome} onChange={(e)=> setNome(e.target.value)}/>
                            <input type='email' value={email} disabled/>
                            <label>Sobre: </label><br/>
                            <textarea className={styles.inputSobre} placeholder='Conte mais sobre você' value={sobre} onChange={(e)=> setSobre(e.target.value)}/>
                        </div>
                        
                        <button type='submit' className={styles.btnAtualizar}>Atualizar</button>
                    </form>

                </section>
                <section className={styles.sessaopubli}>

                    <h2 className={styles.meusPosts}>Meus Posts</h2>

                    <div className={styles.newPublicacao}>
                        <button type="button" onClick={()=> handleOpenModal()} className={styles.btnNewPublic}>O que você quer compartilhar?</button>
                    </div>

                    {posts.length === 0 ? (
                        <>
                            Sem posts no momento...
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
                                                
                                                <button className={styles.btnTrash} onClick={ ()=> handleRemovePost(post.uid)}>
                                                    <FiTrash2 size={25} color='#CF0E0E'/>
                                                </button>
                                                
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

                </section>

                { modalvisible &&(
                    <ModalForm
                        isOpen={modalvisible}
                        handleCloseModal={handleCloseModal}
                        user={user}
                        listpost={setPosts}
                    />
                )}


            </div>
        </main>
    )
}
