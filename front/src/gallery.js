import React, { useEffect, useState } from 'react';
import './gallery.css';
import { useHistory} from 'react-router-dom';
import {useContext} from 'react';
import axios from 'axios';
import { AuthContext } from './authContext';
import Loading from './loading';

const Gallery = (props)=>{

    const { loading } = useContext(AuthContext);
    const { items } = props;
    const setBack = props.setBack;
    const history = useHistory();

    useEffect(()=>{
        window.scrollTo(0,0); 
        setBack(false);
    },[])

    const handleClickItem = async(id)=>{
        props.handleItem(id);  
        // console.log("no pagado"); 
        history.push("/paymentmethods");
    };

    const handleClickPayedItem = (id)=>{
        props.handlePayed(id);
        // console.log("pagado");
        loading[1](true);//load on

        setTimeout(()=>{
            history.push("/product/"+id);
            loading[1](false);//load off after 2000 ms
        },2000);
    };

    // useEffect(()=>{
    //     return ()=>{
    //         loading[1](true);
    //     }
    // },[]);
        
    return(
            <div style={{animation:"fadeIn 1s"}} className='gallery-container'>
                {items ? (
                    items.map((item)=>{
                        return <div className="gallery-item" key={ item.id }>
                                    {item.type==="image" ? (
                                    <div>
                                        <img alt={item.name} src={item.url_sample} /></div>) 
                                    
                                    : 
                                    (<div>
                                        <video controls>
                                            <source alt={item.name} src={item.url_sample} type="video/mp4" />
                                        </video>
                                        <span className="duration">Duración: {item.duration}</span>
                                    </div>
                                    )}
                                    <span className="quality">{item.quality}</span>
                                    <span className="name">{item.name}</span>
                                    {item.payed ? 
                                    (<button onClick={(e)=>handleClickPayedItem(e.target.value)} value={item.id} className="button-payed"><i className="fa fa-check-circle"></i> Pagado </button>)
                                    :(<button onClick={(e)=>handleClickItem(e.target.value)} value={item.id} className="button-green"> US$ {item.price} </button>
                                    )
                                    }
                            </div>
                    })          
                )
                :
                (
                    <Loading />
                )
                
                }
            </div>
        );

}
export default Gallery