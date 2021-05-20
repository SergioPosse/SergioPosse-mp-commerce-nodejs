import React, { useEffect, useRef, useState,useContext,useMemo } from 'react';
import './paymentMethods.css';
import { AuthContext } from './authContext';
import axios from 'axios';
// import SimpleReactValidator from 'simple-react-validator';

const PaymentMethods = (props)=>{
    const { loading, devid } = useContext(AuthContext);
    const setBack = props.setBack;
    
    const [payer,setPayer] = useState({name:"",lastname:"",email:"test_user_63274575@testuser.com",tel:"",areaCode:""});
    const [address,setAddress] = useState({name:"",number:"",postalCode:""});

    useEffect(()=>{
        setTimeout(()=>{
            loading[1](false);
       },1500)

    },[]);

    useEffect(()=>{
        return ()=>{
            loading[1](true);
        }
    },[]);

    useEffect(()=>{
        setBack(true);
        window.scrollTo(0,0); 
    },[]);

        const createCheckoutButton = async()=>{
            if (!props.item.id) window.location.href="/";
            // console.log("deviceId en preference: ",window.devid);
            if(window.devid === "" || !window.devid || window.devi === null ){
                console.log("device id no encontrado");
                return;
            }
            await axios.post(window.apiUrl+"create_preference", {
                'item':{
                    'quantity': 1,
                    'name': props.item.name,
                    'description': props.item.description,
                    'price': props.item.price,
                    'itemId': props.item.id,
                    'picture_url':props.item.url_sample
                },
                'payer':{
                    'name': payer.name,
                    'surname':payer.lastname,
                    'email':payer.email,
                    'phone':{
                        'area_code': payer.areaCode,
                        'number': parseInt(payer.tel)
                    },
                    'address':{
                        'street_name':address.name,
                        'street_number':parseInt(address.number),
                        'zip_code':address.postalCode
                    }

                }
                
            },{
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'x-integrator-id':"dev_24c65fb163bf11ea96500242ac130004",
                    'X-meli-session-id': window.devid
                }
            })
            .then(function (response) {
                
                if(document.getElementById("button-checkout")){
                    let el = document.getElementById("button-checkout");
                    let parent = document.getElementById("buttons-menu");
                    parent.removeChild(el);
                    let btn = document.createElement("button"); 
                    btn.id = "button-checkout";
                    parent.appendChild(btn);
                }
                    
                   const mp = new window.MercadoPago('APP_USR-7eb0138a-189f-4bec-87d1-c0504ead5626', {
                        locale: 'es-AR'
                    });
                    const checkout = mp.checkout({
                        preference: {
                            id: response.data.body.id
                        } 
                    });  
                    checkout.render(
                        {
                            container: '#button-checkout', // Indica dónde se mostrará el botón de pago
                            label: 'Pagar Compra' // Cambia el texto del botón de pago (opcional)
                      } )                      
            })
            .catch(function (error) {
                alert("Error: "+error);
            });
        };


        const exist = (values)=>{
            let valida = true;
            values.map((val)=>{
                console.log("val:",val);
                if(val===null || val==="" || val===undefined){
                    valida = false;
                }
            })
            return valida;
        }

        useEffect(()=>{
      
                if(exist([props.item.id,payer.email,payer.name,payer.lastname,payer.tel,payer.areaCode,address.name,address.number,address.postalCode])){
                    createCheckoutButton();
                    document.getElementById("left").style.opacity=1;
                    document.getElementById("left").style.pointerEvents = "auto";
                }
                else{
                    
                    document.getElementById("left").style.opacity=0.1;
                    document.getElementById("left").style.pointerEvents = "none";
                }
            
           
        },[payer.name,payer.email,payer.lastname,payer.tel,payer.areaCode,address.name,address.number,address.postalCode])

        return(
            <div style={{animation:"fadeIn 1s"}} className="payment-container">
                 <div className="right">
                            <div className="payer-data">
                                <h3>Completa Tus Datos</h3>
                                <label>Nombre
                                <input className="round-border" name="name" onChange={(e)=>setPayer(prev=>({...prev,"name":e.target.value}))} type="text" value={payer.name}/></label>
                                <label>Apellido<input className="round-border" onChange={(e)=>setPayer(prev=>({...prev,"lastname":e.target.value}))} type="text" value={payer.lastname}/></label>
                                <label className="email">Email<input className="email round-border" onChange={(e)=>setPayer(prev=>({...prev,"email":e.target.value}))} type="text" value={payer.email}/></label>

                                <div className="tel">
                                    <label className="tel-area">Area<input pattern="[0-9]*" onChange={(e)=>setPayer(prev=>({...prev,"areaCode":e.target.value.replace(/\D/,'')}))} type="text" value={payer.areaCode}/></label>
                                    <label className="tel-number">Telefono<input pattern="[0-9]*" onChange={(e)=>setPayer(prev=>({...prev,"tel":e.target.value.replace(/\D/,'')}))} type="text" value={payer.tel}/></label>
                                </div> 
                            </div>
                            <div className="address">
                                <h3>Dirección</h3>
                                <label>Calle<input className="round-border" onChange={(e)=>setAddress(prev=>({...prev,"name":e.target.value}))} type="text" value={address.name}/></label>
                                <label>Numero<input className="round-border" pattern="[0-9]*" onChange={(e)=>setAddress(prev=>({...prev,"number":e.target.value.replace(/\D/,'')}))} type="text" value={address.number}/></label>
                                <label>Codigo Postal<input className="round-border" pattern="[0-9]*" onChange={(e)=>setAddress(prev=>({...prev,"postalCode":e.target.value.replace(/\D/,'')}))} type="text" value={address.postalCode}/></label>
                            </div>
                </div> 
                    <div id="left" className="left">
                        <section className="info">
                                <h2>Paga Con Mercado Pago</h2>
                                <img src="horizontal_logo.png" />
                                <section>Facil y rapido con la seguridad que brinda MercadoPago</section>
                        </section>
                        
                        <section id="buttons-menu" className="buttons-menu">
                            <button id="button-checkout"></button>
                        </section>  
                     </div>
                
            </div>
            
        );
        
}
export default PaymentMethods