import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import './success.css';
import { useHistory} from 'react-router-dom';

function Success(props) {
    const history = useHistory();
    const itemId = useRef(props.match.params.id);
    // console.log("item id en success:",itemId.current);
    const [payeremail,setPayeremail] = useState();
    const [payer,setPayer] = useState();
    const [item,setItem] = useState();
    const[status,setStatus] = useState();
    const setBack = props.setBack;
    console.log(props.item);

    const getQueryVariable = (variable)=>{
        var query = window.location.search.substring(1);
        var vars = query.split("&");
            for (var i=0;i<vars.length;i++) {
                    var pair = vars[i].split("=");
                    if(pair[0] == variable){return pair[1];}
            }
        return(false);  
    }
    useEffect(()=>{
        setBack(true);
    },[]);

    const getJwt = async(id,email) => {
        const data = await axios.post(window.apiUrl+"jwt",{
            'itemId': id,
            'email':email
        });
        // console.log(data.data.token);
        return data.data.token;
    };

    //===========NOW SET PAYMENT IN BACKEND==============================
    // const setPayment = async(email)=>{
    //             let date = "2021-03-07";
    //             await axios.post(window.apiUrl+"createpayment", {
    //                 "email": email,
    //                 "itemId": item.id,
    //                 "date": date,
    //                 "token": item.token
    //             },{
    //                 headers: { 
    //                 }
    //             })
    //             .then((res)=>{
    //                 console.log("Payment created: ",res);
    //                 history.push('/product/'+value2[0].id);
    //             })
    //             .catch((err)=>{
    //                 console.error("Error creating payment: ",err);
    //             });
    // };

    const getPayment = async(paymentId)=>{
        await axios.post(window.apiUrl+"mpinfo", {
            'paymentId': paymentId || props.match.params.paymentid
        },{
            headers: { 
            }
        })
        .then(function (response) {
            console.table(response)
            setPayeremail(response.data.payer.email);
            setPayer(response.data.additional_info.payer);
            setItem(response.data.additional_info.items[0]);
            setStatus(response.data.status);
            if(!props.match.params.paymentid){
                console.log("paymentid no encontrado en getpayment")
                getJwt(itemId.current,response.data.payer.email)
                .then((res)=>{
                // console.log(res);
                    storageToken(res);
                })  
            }        
        })
        .catch(function (error) {
            console.log("Error getting mp payment info: ",error);
        });  
    }

    useEffect(async()=>{
        const paymentId = getQueryVariable("payment_id");
        console.log("payment id: ",paymentId);
        await getPayment(paymentId);

    },[]);

    const storageToken = (token)=>{
        let paymentid = getQueryVariable("payment_id");
            if(localStorage.getItem('mytokens')){
                let isRepeated = false;
                let arr = JSON.parse(localStorage.getItem('mytokens'));

                if(Object.keys(arr).length>0){
                    for (let p = 0; p < Object.keys(arr).length; p++) {
                        if(parseInt(arr[p].id) === parseInt(itemId.current)){
                            isRepeated = true;
                            // console.log("repetido");
                            arr[p].token = token;
                            break;
                        }
                    }  
                }      
                //entra aca solo porq no soluciono el === del for is repeated
                if(isRepeated === false){
                    console.log("push token nuevo");

                    arr.push({"id":itemId.current,"token":token,"paymentid":paymentid});
                    localStorage.setItem('mytokens', JSON.stringify(arr));
                }
                else{
                    console.log("actualizar token repetido");

                    localStorage.setItem('mytokens', JSON.stringify(arr));
                }
            }
            else{
                //no existe mytokens 
                console.log("no hay tokens definidos");
                localStorage.setItem('mytokens',JSON.stringify([{"id":itemId.current,"token":token, "paymentid":paymentid}]));
            }
            props.handlePayed(itemId.current)
            setTimeout(()=>{
                // history.push("/product/"+itemId.current);
            },2000);

    }
               




    return (
        <div className="mp-container">
            {(payer && item) ? 
            (<div className="payment-info">
                <div className="panel-left">
                    <label>Nombre pagador:<span>{payer.first_name}</span></label><br></br>
                    <label>Apellido pagador:<span>{payer.last_name  }</span></label><br></br>
                    <label>Email pagador:<span>{payeremail}</span></label><br></br>
                    <label>Telefono pagador: <span>{`(${payer.phone.area_code}) ${payer.phone.number}`}</span></label><br></br>
                    <label>Calle: <span>{payer.address.street_name}</span></label><br></br>
                    <label>Numero Calle: <span>{payer.address.street_number}</span></label><br></br>
                    <label>Código Postal: <span>{payer.address.zip_code}</span></label><br></br>
                </div>
                <div className="panel-right">
                    <h4>Producto comprado</h4><br></br>
                    <label>Nombre:<span>{item.title}</span></label><br></br>
                    <label>Descripción:<span>{item.description}</span></label><br></br>
                    <label>Precio Unitario:<span>${item.unit_price}</span></label><br></br>
                    <label>Cantidad:<span>{item.quantity}</span></label><br></br>
                    <label>Id:<span>{item.id}</span></label><br></br>
                    
                </div>
                <div className="image-container">
                    {status? (<h3 className="succ-status">{status.toUpperCase()}</h3>):(null)}
                    <h3>Gracias por su compra</h3>
                    {props.item.type==="image"?(<img className="product-img" alt="img producto" src={props.item.url_sample}/>)
                    :(<video controls className="product-img" alt="img producto" src={props.item.url_sample}/>)}
                    <button onClick={()=>history.push("/product/"+itemId.current)}>Ver Producto</button>

                </div>
                
            </div>
            )
            :
            (
                <span>Cargando información de su pago...</span>
            )}
        </div>
    );
}

export default Success;