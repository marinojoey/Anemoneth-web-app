import React, { useState, useRef, useEffect } from 'react'
import './homepage.css';
import { Web3Storage } from 'web3.storage/dist/bundle.esm.min.js'

import AllPosts from '../Posts/AllPosts';
import CreatePostModal from '../Posts/CreatePostModal';

import RedeemButton from '../RedeemButton/RedeemButton';
import contractCall from '../ContractCall/ContractCall';


function Homepage( { setUser, setConn, setAddr1, setblnc, setclwnblnc, setDispAddr, connected, addr1 } ) {

  async function contractCallHandler() {
    let contractInstance = await contractCall();
    if (await contractInstance.isRegistered(addr1)) {
        setUser(true)
        let balanceOf = parseInt(await contractInstance.balanceOf(addr1), 16);
        setclwnblnc(balanceOf);
    } else console.log("Please register")
  }

  useEffect(() => {
    contractCallHandler();
    console.log("isUSer")
  }, [])

let web3s = new Web3Storage({
  token: process.env.REACT_APP_WEB3STORAGE_TOKEN
});

async function storeFiles() {
  const string = document.querySelector('.str').value;
  const file = new File([string], addr1);
  const cid = await web3s.put([file]);
  console.log('stored files with cid:', cid)
  return cid
}

async function retrieveFiles(cid) {
  const res = await web3s.get(cid)
  console.log(`Got a response! [${res.status}] ${res.statusText}`)
  if (!res.ok) {
    throw new Error(`failed to get ${cid}`)
  }
  const files = await res.files()
  const file = files[0]
  let fileText = await file.text();
  console.log(fileText)
}


  return (
    <div className='root'>
      <h1>HOMEPAGE</h1>
      <div>
        <label htmlFor='str' className='strlbl'></label>
        <input type="text" className='str' placeholder='web3.storage'></input>
        <button className='stringbtn' onClick={ storeFiles }>Post</button>
        <br/>
        <input type="text" className='cid' placeholder='Content Identifier'></input>
        <button className='retrieve' onClick={ () => retrieveFiles(document.querySelector('.cid').value) }>Retrieve</button>
      </div>
      <CreatePostModal />
      <RedeemButton connected={connected} addr1={addr1} setUser={setUser} setConn={setConn} setAddr1={setAddr1} setclwnblnc={setclwnblnc} setDispAddr={setDispAddr} />
      <AllPosts />
    </div>
  )
}

export default Homepage;
