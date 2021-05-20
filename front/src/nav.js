import React, { useEffect } from 'react';
import './nav.css';
import { useHistory } from "react-router-dom";
import BackButton from './BackButton';


const Nav = (props)=>{

    useEffect(()=>{
      let nav = document.getElementById('nav');
      let navInfo = document.getElementById('nav-info');
      let navButton = document.getElementById('nav-button');
      if(props.back === false){
        // nav.style.height = "15%";
        navInfo.style.height = "50%";
        navButton.style.height = "0%";
      }
      else{
        // nav.style.height = "25%";
        navInfo.style.height = "50%";
        navButton.style.height = "50%";
      }
    },[props.back])

    const history = useHistory();

        return(
            <div id="nav" className="nav">
                  <div id="nav-info" className='nav-info'>
                        <div onClick={() => {window.location.href="/"}} className="logo-container">
                          <div className="col1">
                              <div className="row1">
                              <span>Agustina Carrizo</span>
                              </div>
                              <div className="row2">
                                <div className="col3">
                                <span>Diseño y fotografía</span>
                                </div>
                              </div>
                          </div>
                          <div className="col2">
                          <img className="ima" src="https://i.postimg.cc/9MVgWmjn/camera.png" alt="camera" />
                          </div>
                        </div>
                        <div className="mail"><span>agustinacarrizofotografia@gmail.com</span></div>
                  </div>
                  <div id="nav-button" className="nav-button">
                    {props.back?(
                          <BackButton />
                        ):
                        (
                          <span className="nav-button"></span>
                        )}
                  </div>
            
            </div>
            
            
        );

}
export default Nav