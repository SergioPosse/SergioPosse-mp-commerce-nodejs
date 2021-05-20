import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import './pending.css';
import { useHistory} from 'react-router-dom';

const Pending = (props) => {
    const history = useHistory();
    const itemId = useRef(props.match.params.id);
    const [payeremail,setPayeremail] = useState();
    const [payer,setPayer] = useState();
    const [item,setItem] = useState();
    const [status,setStatus] = useState();
    const setBack = props.setBack;
    const getQueryVariable = (variable)=>{
        var query = window.location.search.substring(1);
        var vars = query.split("&");
            for (var i=0;i<vars.length;i++) {
                    var pair = vars[i].split("=");
                    if(pair[0] == variable){return pair[1];}
            }
        return(false);  
    }

    const getPayment = async(paymentId)=>{
        await axios.post(window.apiUrl+"mpinfo", {
            'paymentId': paymentId || props.match.params.paymentid
        },{
            headers: { 
            }
        })
        .then(function (response) {
            // console.table(response)
            props.handleItem(itemId.current);
            console.log("id:",itemId);
            setPayeremail(response.data.payer.email);
            setPayer(response.data.additional_info.payer);
            setItem(response.data.additional_info.items[0]); 
            setStatus(response.data.status);     
        })
        .catch(function (error) {
            console.log("Error getting mp payment info: ",error);
        });  
    }
    useEffect(()=>{
        setBack(true);
    },[]);

    useEffect(async()=>{
        const status = getQueryVariable("status");
        const paymentId = getQueryVariable("payment_id");
        console.log("payment id: ",paymentId);
        await getPayment(paymentId);
    },[]);
    useEffect(()=>{
        return((()=>{
            console.log("item en props:",props.item);
        }))
    },[props.item])

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
                {status? (<span className="pending-status">{status.toUpperCase()}</span>):(null)}
                <h3>Gracias por su compra</h3>
                {props.item? (
                    props.item.type==="image"?(<img className="product-img" alt="img producto" src={props.item.url_sample}/>)
                    :(<video controls className="product-img" alt="video producto" src={props.item.url_sample}/>)
                )
                :
                null}
                
            </div>
            
        </div>
        )
        :
        (
            <span>Cargando información de su pago...</span>
        )}
    </div>
    );
};

export default Pending;