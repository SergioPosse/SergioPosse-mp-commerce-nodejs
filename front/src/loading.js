import React, { useEffect, useRef} from 'react';
import './loading.css';

const Loading = (props) => {
    const reso = useRef(window.innerHeight);
    const back = props.back;

    useEffect(()=>{
        if(back === true){
            document.getElementById("loadingContainer").style.setProperty("--mar","-5%")
        }
        else{
            document.getElementById("loadingContainer").style.setProperty("--mar","0%") 
        }
    },[back])
   
    return (
        <div id="loadingContainer" className="loading-container">
            {reso.current<640 ? (
                <svg >
                <filter id="filtrito">
                    <feGaussianBlur in="SourceGraphic" stdDeviation="10" />
                    <feColorMatrix values="
                        1 0 0 0 0
                        0 1 0 0 0
                        0 0 1 0 0
                        0 0 0 20 -3"></feColorMatrix>	
                </filter>
            </svg>
            )
            :
            (
                <svg >
                <filter id="filtrito">
                    <feGaussianBlur in="SourceGraphic" stdDeviation="10" />
                    <feColorMatrix values="
                        1 0 0 0 0
                        0 1 0 0 0
                        0 0 1 0 0
                        0 0 0 20 -10"></feColorMatrix>	
                </filter>
            </svg>
            )
        }
            
            <section id="loader">
                <div className="loader">
                    <span style={{ "--i":1 }}></span>
                    <span style={{ "--i":2 }}></span>
                    <span style={{ "--i":3 }}></span>
                    <span style={{ "--i":4 }}></span>
                    <span style={{ "--i":5 }}></span>"
                    <span style={{ "--i":6 }}></span>
                    <span style={{ "--i":7 }}></span>
                    <span style={{ "--i":8 }}></span>
                    <span className="rotate" style={{"--j":0}}></span>
                    <span className="rotate" style={{"--j":1}}></span>
                    <span className="rotate" style={{"--j":2}}></span>
                    <span className="rotate" style={{"--j":3}}></span>
                    <span className="rotate" style={{"--j":4}}></span>
                </div>
            </section>
        </div>
    );
};

export default Loading;