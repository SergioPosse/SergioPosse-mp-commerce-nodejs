import React, { useEffect, useState,useRef, useContext} from 'react';
import './product.css';
import axios from 'axios';
import { AuthContext } from './authContext';
import { useHistory} from 'react-router-dom';

//NOTE: dont use setState at least to be necessary the setState method
//dont use everything in useEffect 
//use a function "init" for manage async request to axios

const Product = (props)=>{
        const navel = props.navel;
        const [element,setElement] = useState("");
        const [error, setError] = useState(<div className="no-auth-message"><h2>Espere por favor...</h2></div>);
        const {payed,loading,payeremail} = useContext(AuthContext);
        const [paymentid,setPaymentid] = useState();
        const setBack = props.setBack;
        const id = props.match.params.id;
        const history = useHistory();


    //el usuario puede ingresar mediante la redireccion de /success como es normal o 
    //forzadamente si modifica la url el mismo por eso se evaluan las 2 alternativas para chequear el id si esta pagado y tiene un token valido
    //que le corresponda

    //DRY DRY DRY DRY optimizar
        const checkNoPayed = async()=>{
            if(!payed[0].item){
                        let arr = JSON.parse(localStorage.getItem('mytokens'));
                        if(arr.length>0){
                        for (let p = 0; p < Object.keys(arr).length; p++) {
                                if(parseInt(id)===parseInt(arr[p].id)){
                                    await axios.post(window.apiUrl+"sendpremiumitem",{
                                    },
                                    {
                                        headers: {
                                            "Authorization": `Bearer ${arr[p].token}`
                                        }
                                    }).then((results)=>{
                                        // console.log(results.data.item[0]);
                                        setPaymentid(arr[p].paymentid)
                                        loading[1](false);
                                        console.log("paymentid de token anal:",arr[p].paymentid);
                                        payed[1]({paymentid: arr[p].paymentid,payed: true, item: results.data.item[0],email: results.data.email});
                                        payeremail[1](results.data.email);
                                    })
                                }
                        }  
                    }

                }
        }
        useEffect(()=>{
            window.scrollTo(0,0); 
            setBack(true);
            checkNoPayed();
        },[])

        useEffect(()=>{
            if(payed[0].payed){
                if(payed[0].item.type==="image"){
                    setElement(<img id="videoFrame" onClick={()=>handleClickImage()} className="video-frame" alt={payed[0].item.name} src={`${payed[0].item.url}`} />);
                }
                else{
                    setElement(<video id="videoFrame" onClick={()=>handleClickImage()} className="video-frame" alt={payed[0].item.name} controls src={`${payed[0].item.url}`} type="video/mp4"></video>);
                };
            }
            else{
                setError(<div className="no-auth-message"><h2>No tiene acceso a este id</h2></div>);
            };
        },[payed[0]])


        const handleClick = ()=>{
            document.getElementById('download').click();
        };

        const handleClickImage = ()=>{
                let image = document.getElementById('videoFrame');
                    if (image.style.position === "absolute"){
                        navel.style.position = "fixed";
                        navel.style.display = "flex";
                        image.style.position = "static";
                        image.style.width = "60%";
                        image.style.height = "auto";
                        image.style.zIndex = "99";
                        image.style.objectFit = "contain";
                        let reso = window.innerWidth;
                        if(reso < 640){
                            image.style.width = "100%";
                        }else{
                            image.style.width = "60%";
                        }
                    }
                    else{
                        navel.style.position = "static";
                        navel.style.display = "none";
                        image.style.display = "inline-block";
                        image.style.position = "absolute";
                        image.style.overflow = "scroll";
                        image.style.width = "100vw";
                        image.style.height = "auto";
                        image.style.top = "-50%";
                        image.style.left = "0";
                        image.style.zIndex = "99999999999";
                        image.style.objectFit = "contain";
                    }
        };

        const handleSendLink = async()=>{
            let email = payeremail[0];
            let option = window.confirm("Enviar link de descarga a :"+email+" ?.");
            if (option == true){
                const results = await axios.post(window.apiUrl+"sendemail", {
                        "email": email,
                        "link": payed[0].item.url       
                    });
                    if(results==="error"){
                        alert("Error email");
                    }
                    else{
                        alert("Link de descarga enviado con exito a: "+email);
                    }
            }
            else{
                return
            }
        };

 
            const handleDetail = ()=>{
                    let arr = JSON.parse(localStorage.getItem('mytokens'));
                    if(arr.length>0){
                        for (let p = 0; p < Object.keys(arr).length; p++) {
                                if(parseInt(id)===parseInt(arr[p].id)){
                                    history.push("/success/"+id+"/"+arr[p].paymentid);
                                }
                        }
                    }     
            }


       

        return(
            <div style={{animation:"fadeIn 1s"}} className='product-container'>
                {payed[0].item ? (
                    <div className="product-container">
                        <a href={payed[0].item.url} download id="download" hidden>hiden download</a>

                        <p className="atention"><span style={{fontWeight: "800"}}>!Atencion! </span><span className="descargue" onClick={ handleClick }>descargue</span> su video o <span className="envie" onClick={ handleSendLink }>envie el link</span> a su EMAIL ({payeremail[0]}) 
                        antes de cerrar esta ventana o volver a la tienda. <span className="envie" onClick={ handleDetail }>Detalle De Pago</span></p>
                        
                        <h3>Gracias por comprar el producto: </h3><span className="name-product">{payed[0].item.name}</span>
                        { element }
                        {/* <img id="videoFrame" onClick={()=>handleClickImage()} className="video-frame" alt="imgprueba" src="/10.jpg" /> */}
  
                    </div>
                    
                    )
                :
                (error?
                    (
                        <div>{error}</div>
                    )
                    :(
                        <div>{error}</div>
                    )
                
                )
            }
            </div>
        );

}
export default Product