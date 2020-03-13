import React, { useCallback } from "react";
import { withRouter } from "react-router";
import app from "./base";
import { Button, Form, FormGroup, Label, Input } from 'reactstrap';
import "./App.css";
import 'bootstrap/dist/css/bootstrap.css';

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
    <FormGroup className="signup-login-form">
      <h1 className="text-center">Sign Up</h1>
      <form onSubmit={handleSignUp}>
        <Label>Email</Label>
        <Input name="email" type="email" placeholder="Email" />
        <br></br>
        <Label>Password</Label>
          <Input name="password" type="password" placeholder="Password" /><br></br>
          <button className="btn-lg btn-primary btn-block" type="submit">Sign Up</button>
      </form>
      <br></br>
      <div className="text-center">
        <a href="/login">Login</a>
        <span className="p-2">|</span>
        <a href="/">Forgot Password</a>
      </div>
    </FormGroup>
  );
};

export default withRouter(SignUp);