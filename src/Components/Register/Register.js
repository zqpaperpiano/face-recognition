import userEvent from '@testing-library/user-event';
import React from 'react';
import { toast, ToastContainer } from 'react-toastify';

class Register extends React.Component {

    constructor(props) {
        super(props);
        this.state = ({
            registerEmail: '',
            registerName: '',
            registerPassword: '',
        })

    }

    onNameChange = (event) => {
        this.setState({
            registerName: event.target.value,
        })
    }

    onEmailChange = (event) => {
        this.setState({
            registerEmail: event.target.value,
        })
    }

    onPasswordChange = (event) => {
        this.setState({
            registerPassword: event.target.value,
        })
    }

    onSubmitRegistration = (e) => {
        e.preventDefault();
        if(this.validateInput()){
            fetch('https://ziqing-face-recognition.onrender.com/register', {
            method: 'post',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                name: this.state.registerName,
                email: this.state.registerEmail,
                password: this.state.registerPassword
            })
        })
        .then(resp => resp.json())
        .then(user => {
            if(user._id){
                this.props.loadUser(user);
                this.props.onRouteChange('home');
        }
    })
        .catch(err => console.log(err))
        }
        
    }

    validateInput= () => {
        if(this.state.password === "" || this.state.registerEmail === "" || this.state.registerName === ""){
            toast.error("Please fill in all fields", {
                position: toast.POSITION.BOTTOM_CENTER
            })
            return false;
        }

        for( var char of this.state.registerName){
            if(char === " "){
                toast.error("Please do not have any spaces in your username!", {
                    position: toast.POSITION.BOTTOM_CENTER
                })
                return false;
            }
        }


        if(!/\S+@\S+\.\S+/.test(this.state.registerEmail)){
            toast.error("Please enter a valid email", {
                position: toast.POSITION.BOTTOM_CENTER
            })
            return false;
        }

        return true;
    }
    
    render(){
        return(
            <article className="br3 ba dark-gray b--black-10 mv4 w-100 w-60-m w-25-l mw5 shadow-5 center">
                <main className="pa4 black-80">
                    <form className="measure">
                        <fieldset id="sign_up" className="ba b--transparent ph0 mh0">
                            <legend className="f2 fw6 ph0 mh0">Register</legend>
                            <div className="mt3">
                                <label className="db fw6 lh-copy f6" for="email-address">Email</label>
                                <input 
                                onChange={this.onEmailChange}
                                className="pa2 input-reset ba bg-transparent hover-bg-black hover-white w-100" type="email" name="email-address"  id="email-address" />
                            </div>
                            <div className="mt3">
                                <label className="db fw6 lh-copy f6" for="email-address">Username</label>
                                <input
                                onChange={this.onNameChange}
                                 className="pa2 input-reset ba bg-transparent hover-bg-black hover-white w-100" type="text" />
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
                            className="b ph3 pv2 input-reset ba b--black bg-transparent grow pointer f6 dib" 
                            type="submit" value="Register"
                            onClick={this.onSubmitRegistration}
                            />
                        </div>
                    </form>
                </main>
            </article>
        );
    }      
}

export default Register;