import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import axios from 'axios';
import bcryptjs from 'bcryptjs';
import jose from 'node-jose';
import encrypt from './Encryption'


class App extends Component {

  constructor() {
    super()
    this.state = {
      mail: "",
      password: "",

    }
  }

  onMailChange = (e) => {
    e.preventDefault()
    let mail = e.target.value
    this.setState({
      ...this.state,
      mail
    })
  }

  onPasswordChange = (e) => {
    e.preventDefault()
    let password = e.target.value
    this.setState({
      ...this.state,
      password
    })
  }

  onSubmit = async (e) => {
    e.preventDefault()
    const keystore = jose.JWK.createKeyStore();
    const privateKey = await keystore.generate('RSA', 2048, { kid: 'example-2' })
    const publicKey = await privateKey.toJSON()
    let { mail, password } = this.state
    password = await bcryptjs.hash(this.state.password, 10)
    console.log(password)
    axios.post('http://localhost:8080/users/login', { mail, password, publicKey })
      .then(async (res) => {
        const encryptedKey = res.data
        var decryptedKey = await encrypt.generateDecryption(privateKey, encryptedKey)
        decryptedKey = decryptedKey.plaintext
        var decodedDecryptedKey = String.fromCharCode(...decryptedKey.toJSON().data)
        decodedDecryptedKey = JSON.parse(decodedDecryptedKey)
        const privateSigning = await keystore.generate('RSA', 2048, { kid: 'example-4' })
        const publicSigning = await privateSigning.toJSON()
        const signedToken = await encrypt.generateSigning(privateSigning, JSON.stringify({ mail, password }))
        const encryptedToken = await encrypt.generateEncryption(decodedDecryptedKey, signedToken)
        axios.post('http://localhost:8080/users/validation', { publicSigning, encryptedToken })
          .then(async (res) => {
            console.log(res)
          })

      })
  }


  render() {
    return (
      <div className="App">

        <form action="" onSubmit={this.onSubmit} >
          <input type="text" onChange={this.onMailChange} value={this.state.mail} />
          <input type="text" onChange={this.onPasswordChange} value={this.state.password} />
          <input type="submit" />
        </form>
      </div>
    );
  }
}

export default App;
