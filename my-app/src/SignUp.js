import React, { useCallback } from "react";
import { withRouter } from "react-router";
import app from "./base";
import { Button, Form, FormGroup, Label, Input } from 'reactstrap';
import "./App.css";
import 'bootstrap/dist/css/bootstrap.css';
import myPng from './images/profile_picture.png'

const SignUp = ({ history }) => {
  const handleSignUp = useCallback(async event => {
    event.preventDefault();
    const { email, password } = event.target.elements;
    try {
      await app
        .auth()
        .createUserWithEmailAndPassword(email.value, password.value);
      history.push("/");
    } catch (error) {
      alert(error);
    }
  }, [history]);

  return (
    <div>
      <center><img src={myPng} alt="Valiant" width={300} height={300}></img></center>
      <FormGroup className="signup-login-form">
      <form onSubmit={handleSignUp}>
        <Label>Email</Label>
        <Input name="email" type="email" placeholder="Email" />
        <br></br>
        <Label>Password</Label>
          <Input name="password" type="password" placeholder="Password" /><br></br>
          <Button color="primary" className="btn-lg btn-block" type="submit">Sign Up</Button>
      </form>
      <br></br>
      <div className="text-center">
        <a href="/login">Login</a>
        <span className="p-2">|</span>
        <a href="/">Forgot Password</a>
      </div>
      </FormGroup>
    </div>
  );
};

export default withRouter(SignUp);