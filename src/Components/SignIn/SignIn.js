import React from 'react';
import { toast, ToastContainer } from 'react-toastify';

class SignIn extends React.Component {
    constructor(props) {
        super(props);
        this.state = ({
            signInEmail: '',
            password: '',
        })
    }

    onEmailChange = (event) => {
        // console.log(event.target.value);
        this.setState({
            signInEmail: event.target.value
        })
    }

    onPasswordChange = (event) => {
        // console.log(event.target.value);
        this.setState({
            password: event.target.value
        })
    }

    onSubmitSignIn = (e) => {
        e.preventDefault();
        fetch('https://ziqing-face-recognition.onrender.com/signin', {
            method: 'post',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                email: this.state.signInEmail,
                password: this.state.password
            })
        })
        .then(resp => {
            // console.log(resp.status);
            if(resp.status === 400){
                toast.error("All fields must be filled in", {
                    position: toast.POSITION.BOTTOM_CENTER
                })
            }else if(resp.status === 401){
                toast.error("Incorrect email or password", {
                    position: toast.POSITION.BOTTOM_CENTER
                })
            }
            return resp.json()}
            )
        .then(data => {
            // console.log('data: ', data);
            if(data[0]._id){
                this.props.loadUser(data[0]);
                this.props.onRouteChange('home');
            }
        })
        .catch(err => console.log(err))
    }

    render() {
        const { onRouteChange } = this.props;
        return(
            <article className="br3 ba dark-gray b--black-10 mv4 w-100 w-60-m w-25-l mw5 shadow-5 center">
            <main className="pa4 black-80">
                <form className="measure">
                    <fieldset id="sign_up" className="ba b--transparent ph0 mh0">
                        <legend className="f2 fw6 ph0 mh0">Sign In</legend>
                        <div className="mt3">
                            <label className="db fw6 lh-copy f6" for="email-address">Email</label>
                            <input
                                onChange={this.onEmailChange}
                             className="pa2 input-reset ba bg-transparent hover-bg-black hover-white w-100" type="email" name="email-address"  id="email-address" />
                        </div>
                        <div className="mv3">
                            <label className="db fw6 lh-copy f6" for="password">Password</label>
                            <input 
                            onChange={this.onPasswordChange}
                            className="b pa2 input-reset ba bg-transparent hover-bg-black hover-white w-100" type="password" name="password"  id="password" />
                        </div>
                    </fieldset>
                    <div className="">
                        <input
                        onClick = {this.onSubmitSignIn}
                        className="b ph3 pv2 input-reset ba b--black bg-transparent grow pointer f6 dib" 
                        type="submit" value="Sign in"
                        />
                    </div>
                    <div className="lh-copy mt3">
                        <p 
                        onClick = {() => onRouteChange('register')}
                        className="f6 link dim black db pointer">Register</p>
                    </div>
                </form>
            </main>
        </article>
        );
    }
} 

export default SignIn;