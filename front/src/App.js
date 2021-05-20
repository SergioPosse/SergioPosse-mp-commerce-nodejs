import './App.css';
import Nav from "./nav";
import Gallery from "./gallery";
import PaymentMethods from "./paymentMethods";
import Product from "./product";
import Success from "./success";
import Loading from './loading';
import Failure from './failure';
import Pending from './pending';
import { BrowserRouter, Switch, Route } from "react-router-dom";
import { AuthContext } from './authContext';
import React, { useState, useEffect,useRef } from 'react';
import axios from 'axios';

function App() {
  const navel = useRef();
  const [loading, setLoading ] = useState(true);
  const [payerEmail, setPayerEmail] = useState(null);
  const [items, setItems ] = useState(null);
  const [back,setBack] = useState(false);
  const [showModal,setShowModal] = useState();
  const [item,setItem] = useState({});
  const [payed,setPayed] = useState({});
  const [devid,setDevid] = useState();

  useEffect(()=>{
      const init = async ()=>{
            try{
              const result = await axios.get(
                window.apiUrl,
              );
                      let formatedDuration = result.data.map((item)=>{
                      let minutes = Math.floor(item.duration / 60);
                      let seconds = item.duration - minutes *60;
                      item.duration=minutes+":"+seconds;

                      if(localStorage.getItem('mytokens')){
                        let arr = JSON.parse(localStorage.getItem('mytokens'));
                        for (let p = 0; p < Object.keys(arr).length; p++) {
                          //ojo con el parseInt y las comparaciones
                                if(parseInt(item.id)===parseInt(arr[p].id)){
                                    const results = axios.post(window.apiUrl+"payment",{
                                    },
                                    {
                                        headers: {
                                            "Authorization": `Bearer ${arr[p].token}`
                                        }
                                    });
                                    if(results){
                                      // console.log("itemid: "+item.id+" - pagado");
                                      item.payed=true;                 
                                    }
                                }
                        }  
                      }
                      return item;

                });
              setItems(formatedDuration);
            }
            catch(err){
              console.log("error getting items list: ",err);
            }
      }
      init();   
  },[]);

  useEffect(()=>{
    return ()=>{
      // alert("me voy de app");
      setLoading(true);
    }
  },[]);

//set back button visible if we are not in root url
  useEffect(()=>{
    if(window.location.pathname === "/"){
      document.getElementById('')
      setBack(false);
    }
    else{
      setBack(true);
    }
    setTimeout(()=>{
      setLoading(false);
    },3500)
  },[]);

  //margin depending back button hidde or visible
  useEffect(()=>{
    let router = document.getElementById('router');
    if(back === false){
      router.style.marginTop = "0%";
    }
    else{
      let reso = window.innerWidth;
      if(reso < 640){
        router.style.marginTop = "10%";
      }else{
        router.style.marginTop = "6%";
      }
    }
  },[back]);


  const handlePayed = async(id)=>{
    // console.log("click payed: ",id);
    let arr = JSON.parse(localStorage.getItem('mytokens'));
    if(arr.length>0){
      for (let p = 0; p < Object.keys(arr).length; p++) {
        //ojo con el parseInt y las comparaciones
        // console.log(arr[p].id);
              if(parseInt(id)===parseInt(arr[p].id)){
                  // console.log("son igualeee");
                  for(let i=0; i<items.length; i++){
                    if (items[i].id === id){
                      setItem(items[i]);
                    }
                  }
                  await axios.post(window.apiUrl+"sendpremiumitem",{
                  },
                  {
                      headers: {
                          "Authorization": `Bearer ${arr[p].token}`
                      }
                  }).then((results)=>{
                      // console.log(results.data.item[0]);
                     setPayed({payed: true, item: results.data.item[0],email:results.data.email});
                     setPayerEmail(results.data.email);
                  })
                  // if(results){
                  //     console.log(results);
                  //   setPayed({payed: true, item: results});  
                  // }
              }
      }  
    }
    
  }

  const handleItem = (id)=>{
    // console.log("click para pagar: ",id);
      for(let i=0; i<items.length; i++){
        if (items[i].id === id){
          setItem(items[i]);
        }
      }
  }
  return (
    <AuthContext.Provider value={ { devid: [devid,setDevid], payed: [payed, setPayed],loading: [loading,setLoading],payeremail:[payerEmail,setPayerEmail] } }>
        <BrowserRouter>
          <div className="app">
          <input type="hidden" id="devid" />          
                  <div  ref={navel} className="navi">
                      <Nav back={back}/>
                  </div>                  
                  <div id="router" className="router">
                      <Switch>
                          <Route path="/failure/:id/:paymentid?" render={(props)=> loading? <Loading  back={back}/>: <Failure {...props} setBack={setBack} item={item} handleItem={handleItem}></Failure>}></Route>
                          <Route path="/pending/:id/:paymentid?" render={(props)=> loading? <Loading  back={back}/>: <Pending {...props} setBack={setBack} item={item} handleItem={handleItem}></Pending>}></Route>
                          <Route path="/success/:id/:paymentid?" render={(props)=> loading? <Loading  back={back}/>: <Success {...props} setBack={setBack} item={item} handlePayed={handlePayed}/> }></Route>
                          <Route path="/loading" render={()=> <Loading />}></Route>
                          <Route path="/paymentmethods" render={(props)=> loading? <Loading back={back}/> : <PaymentMethods {...props} item={item} back={back} setBack={setBack}/>}></Route>
                          <Route path="/product/:id" render={(props)=> loading? <Loading navel={navel.current} back={back}/> : <Product {...props} navel={navel.current} setBack={setBack}/>}></Route>
                          <Route path="/" render={(props)=> loading ? <Loading/> : <Gallery {...props} handleItem={handleItem} handlePayed={handlePayed} setBack={setBack} items={items} />}></Route>         
                      </Switch>
                  </div>     
          </div>
      </BrowserRouter>
    </AuthContext.Provider>

  );
}

export default App;
