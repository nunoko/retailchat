import React, { useState } from 'react';
import logo from './logo.svg';
import './App.css';

function App() {
  const [profile, setProfile] = useState({})
  window.liff.init({ liffId: '1653696336-xNAO55Pk' })
    .then(async () => {
      if (!window.liff.isLoggedIn()) {
        window.liff.login();
      }
    })
    .catch((err) => {
      console.log(err)
    });

  const getProfileFromLine = async () => {
    const dataInfo = await window.liff.getProfile()
    setProfile(dataInfo)
  }

  const closeWindow = () => {
    window.liff.closeWindow()
  }


  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Profile: {JSON.stringify(profile)}
        </p>
        <button
          className="App-link"
          onClick={getProfileFromLine}
        >
          Get Profile
        </button>
        <button
          className="App-link"
          onClick={closeWindow}
        >
          Close Window
        </button>
      </header>
    </div>
  );
}

export default App;
