import Modal from 'react-modal'
import {  useState } from 'react'
import { FiX } from 'react-icons/fi'

import styles from './styles.module.css';

import {  collection, addDoc } from 'firebase/firestore'
import { db, storge } from '../../services/firebaseConnection'
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { toast } from 'react-toastify';

export default function ModalForm({ isOpen, handleCloseModal, user, setPost }){

    const [textarea, setTextarea] = useState('');
    const [image, setImage] = useState(null);
    const [imageUrl, setImageUrl] = useState('');

    const customStyles = {
        content:{
            top:'50%',
            bottom:'auto',
            left:'50%',
            rigth:'auto',
            padding:'30px',
            transform:"translate(-50%, -50%)",
            backgroundColor:"#fff"
        }
    }

    async function handlePostImage(){

        const uploadRef = ref(storge, `images/posts/${image.name}`)

        const uploadTask = uploadBytes(uploadRef, image)
        .then((snapshot)=>{
            getDownloadURL(snapshot.ref).then(async (downloadURL) =>{
                let urlFoto = downloadURL;

                const docRef = addDoc(collection(db, "posts"),{
                    created: new Date(),
                    usuario: user.nome,
                    usuarioImg: user.avatarUrl,
                    describe: textarea,
                    imageURl:urlFoto,
                    emailUser: user.email,
                    userUid: user.uid
                })
                .then(()=>{
                    setImage(null);
                    setTextarea('');
                    toast.success('Postado com sucesso!')

                })
                .catch((e)=>{
                    console.log(e);
                    toast.error('Ops! Houve erro')
                })
            })
        })
    }


    async function handleSubmitPost(e){
        e.preventDefault();

        if (image === null && textarea !== '') {
           
            await addDoc(collection(db, "posts"),{
                created: new Date(),
                usuario: user.nome,
                usuarioImg: user.avatarUrl,
                describe: textarea,
                imageURl:null,
                emailUser: user.email,
                userUid: user.uid
            })
            .then(()=>{
                setTextarea('');  
                
                toast.success('Postado com sucesso!')
            })
            .catch((e)=>{
                console.log(e);
                setTextarea('');
                toast.error('Error')
            })
        } else if(textarea !== "" && image !== null){
            // post com image
            handlePostImage()
        } 

    }

    function handleFile(e){
        if(e.target.files[0]){
            const image = e.target.files[0]

            if(image.type === 'image/jpeg' || image.type === "image/png"){
                setImage(image);
                setImageUrl(URL.createObjectURL(image));
            } else {
                alert("Envie uma image jpg");
                setImage(null);
                return;
            }
        }
    }

    return(
        <Modal
            isOpen={isOpen}
            handleCloseModal={handleCloseModal}
            user={user}
            style={customStyles}
            listpost={setPost}
        >
            <div className={styles.container}>
                <div className={styles.infoUser}>
                    {user.nome}
                    <button 
                        type='button' 
                        onClick={handleCloseModal} 
                        className='react-modal-close'
                        style={{ background:'transparent', border:0 }}
                    >
                        <FiX size={25} color="#f34748"/>
                    </button>

                </div>

                <form className={styles.form} onSubmit={handleSubmitPost}>

                    <textarea 
                        placeholder='Digite sua ideia'
                        value={textarea}
                        onChange={(e) => setTextarea(e.target.value)}
                        className={styles}
                    />
                    <div className={styles.formImage}>
                        <input type='file' accept='image/*' onChange={handleFile}/>
                        {image && (
                            <img src={imageUrl} alt='imagem url' className={styles.imgPost}/>
                        )}

                    </div>
                    <button type='submit' className={styles.btnModal}>Publicar</button>
                </form>
            </div>


        </Modal>
    )
}
