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

export const searches = {
    types: ['data','task','flow','run','study','user'],
    icons: {
      data: 'fa fa-sm fa-database',
      task: 'fa fa-sm fa-trophy',
      flow: 'fa fa-sm fa-cogs',
      run:  'fa fa-sm fa-star',
      study:'fa fa-sm fa-flask',
      user: 'fa fa-sm fa-user'
    },
    names: {
      data: 'Datasets',
      task: 'Tasks',
      flow: 'Flows',
      run:  'Runs',
      study:'Studies',
      user: 'People'
    },
    colors: {
      data: 'green',
      task: 'yellow',
      flow: 'blue',
      run:  'red',
      study:'purple',
      user: 'lightblue'
    }
}
const SearchContext = React.createContext(searches)

export { AuthProvider, AuthConsumer, SearchContext}
