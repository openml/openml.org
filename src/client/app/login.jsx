import React from "react";
import {Link} from "react-router-dom";
import { AuthConsumer } from './context.jsx'


export class LoginPanel extends React.Component {
  constructor(props) {
        super(props);
        this.state = {
            username: '',
            password: '',
            submit: false // checks if the user tried to submit without filling all inputs
        };

      this.handleInput = this.handleInput.bind(this);
      this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleInput(e) {
     const { name, value } = e.target;
     this.setState({ [name]: value });
     }

 handleSubmit(e) {
     e.preventDefault();
     this.setState({ submit: true });
     const { username, password } = this.state;
     const { dispatch } = this.props;
     if (username && password) {

    }
  }
    render() {
      return <header>
        <AuthConsumer>
           {({ isAuth, login, logout }) => (
             <div>
               {isAuth ? (
                 <ul>
                   <Link className="btn btn-primary" to="/userprofile">
                     User Profile
                   </Link>
                   <button className="btn btn-primary"onClick={logout}>
                     Logout
                   </button>
                 </ul>
               ) : (
                        <div className="col-md-6 col-md-offset-3">
                                 <h2>Sign in</h2>
                                 <form name="form" onSubmit={this.handleSubmit} >
                                     <div className={'form-group' + (this.state.submit && !this.state.username ? ' has-error' : '')}>
                                         <label htmlFor="username">Username</label>
                                         <input type="text" className="form-control" name="username" value={this.state.username} onChange={this.handleInput} />
                                         {this.state.submit && !this.state.username &&
                                             <div className="help-block">Username field should be filled</div>
                                         }
                                     </div>
                                     <div className={'form-group' + (this.state.submit && !this.state.password ? ' has-error' : '')}>
                                         <label htmlFor="password">Password</label>
                                         <input type="password" className="form-control" name="password" value={this.state.password} onChange={this.handleInput} />
                                         {this.state.submit && !this.state.password &&
                                             <div className="help-block">Password field should be filled</div>
                                         }
                                     </div>
                                     <div className="form-group">
                                         <button onClick={login} className="btn btn-primary">Sign in</button>
                                         <Link to="/register" className="btn btn-primary">No account? Join OpenML</Link>
                                     </div>
                                 </form>
                             </div>
               )}
             </div>
           )}
         </AuthConsumer>
          </header>




    }
}
