import React from "react";
import {Link} from "react-router-dom";


export class RegisterPanel extends React.Component {
  constructor(props) {
        super(props);

        this.state = {
            email: '',
            password: '',
            password_confirm: '',
            confirm: false,
            first_name: '',
            last_name: '',
            affiliation: '',
            country: '',
            bio: '',
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
         const { username, password, password_confirm } = this.state;
         if(password === password_confirm){
           this.setState({ confirm: true });
         }
         if (username && password) {

        }
      }
    render() {
      return   <div className="col-md-6 col-md-offset-3">
                <h2>Join OpenML</h2>
                <p style={{textAlign: 'right'}}><span><span className="fa fa-exclamation-triangle" style={{color: 'red'}}></span> By joining, you agree to the <a href="https://docs.openml.org/terms/">Honor Code and Terms of Use</a></span></p>
                <form name="form" onSubmit={this.handleSubmit} >
                    <div className={'form-group' + (this.state.submit && !this.state.email ? ' has-error' : '')}>
                        <input type="email" className="form-control" name="email" value={this.state.email} onChange={this.handleInput} placeholder="Email" />
                        {this.state.submit && !this.state.email&&
                            <div className="help-block">Email field is required.</div>
                        }
                    </div>
                    <div className={'form-group' + (this.state.submit && !this.state.username ? ' has-error' : '')}>
                        <input type="text" className="form-control" name="username" value={this.state.username} onChange={this.handleInput} placeholder="Username" />
                        {this.state.submit && !this.state.username &&
                            <div className="help-block">Username field is required.</div>
                        }
                    </div>
                    <div className={'form-group' + (this.state.submit && !this.state.password ? ' has-error' : '')}>
                        <input type="password" className="form-control" name="password" value={this.state.password} onChange={this.handleInput} placeholder="Password" />
                        {this.state.submit && !this.state.password &&
                            <div className="help-block">Password field is required.</div>
                        }
                    </div>
                    <div className={'form-group' + (this.state.submit && !this.state.password_confirm ? ' has-error' : '')}>
                        <input type="password" className="form-control" name="password_confirm" value={this.state.password_confirm} onChange={this.handleInput} placeholder="Password confirm" />
                        {this.state.submit && this.state.confirm && this.state.password_confirm &&
                            <div className="help-block">Passwords do not match</div>
                        }
                        {this.state.submit && !this.state.password_confirm &&
                            <div className="help-block">Confirmation password is required.</div>
                        }
                    </div>
                    <div className={'form-group'}>
                        <input type="text" className="form-control" name="first_name" value={this.state.first_name} onChange={this.handleInput} placeholder="First name" />
                    </div>
                    <div className={'form-group' + (this.state.submit && !this.state.last_name ? ' has-error' : '')}>
                        <input type="text" className="form-control" name="password" value={this.state.last_name} onChange={this.handleInput} placeholder="Last name" />
                        {this.state.submit && !this.state.last_name &&
                            <div className="help-block">Last name field is required.</div>
                        }
                    </div>
                    <div className={'form-group'}>
                        <input type="text" className="form-control" name="affiliation" value={this.state.affiliation} onChange={this.handleInput} placeholder="Affiliation" />
                    </div>
                    <div className={'form-group'}>
                        <input type="text" className="form-control" name="country" value={this.state.country} onChange={this.handleInput} placeholder="Country" />
                    </div>
                    <div className={'form-group'}>
                        <input type="text" className="form-control" name="bio" value={this.state.bio} onChange={this.handleInput} placeholder="Bio" />
                    </div>
                    <div className="form-group">
                        <button className="btn btn-primary">Join</button>
                    </div>
                </form>
            </div>

    }
}
