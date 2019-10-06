// Not sure if this is still somehow useful. Leaving it here just in case.
// Not being used right now.

import React from 'react';

const AuthContext = React.createContext();

class AuthProvider extends React.Component {

  constructor() {
    super()
    this.state = { isAuth: false }
    this.login = this.login.bind(this)
    this.logout = this.logout.bind(this)

  }
  login() {
    setTimeout(() => this.setState({ isAuth: true }), 1000)
  }
  logout() {
    this.setState({ isAuth: false })
  }

     render(){
       return(
        <AuthContext.Provider
        value={{ isAuth: this.state.isAuth,
          login: this.login,
          logout: this.logout }}>
        {this.props.children}
        </AuthContext.Provider>
         )
     }
}

const AuthConsumer = AuthContext.Consumer

export { AuthProvider, AuthConsumer}
