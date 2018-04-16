import React, { Component } from 'react'
import { Redirect } from 'react-router-dom'
import { auth } from './base'

class Login extends Component {
  constructor(props) {
    super(props)

    this.email = null
    this.passwd = null

    this.state = {
      isLoggedIn: false,
      error: false,
      isLogging: false
    }

    this.handleLogin = this.handleLogin.bind(this)
  }
  handleLogin() {
    console.log('login', this.email.value, this.passwd.value)
    this.setState({ 
      isLogging: true,
      error: false
    })
    auth
      .signInWithEmailAndPassword(this.email.value, this.passwd.value)
      .then((user) => {
        console.log(user)
        this.setState({
          isLoggedIn: true
        })
      })
      .catch(error => {
        console.log(error)
        this.setState({
          error: true,
          isLogging: false
        })
      })
  }
  render(){
    if (this.state.isLoggedIn) {
      return <Redirect to='/admin' />
    }
    return(
      <div>
        <input type='email' ref={ref => this.email = ref} />
        <input type='passwd' ref={ref => this.passwd = ref} />
        {this.state.error && <p>E-mail e/ou senha inválidos.</p> }
        <button disabled={this.state.isLogging} onClick={this.handleLogin}>
          Entrar
        </button>
      </div>
    )
  }
}
export default Login
