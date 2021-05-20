import React from 'react';
import './BackButton.css';
import { Link } from "react-router-dom"


const BackButton = () => {
    return (
        <div className="container-backbutton">
                <button onClick={() => {window.location.href="/"}}> Volver a la tienda </button>
        </div>
    );
};

export default BackButton;