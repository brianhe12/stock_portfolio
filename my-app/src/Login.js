import React, { useCallback, useContext } from "react";
import { withRouter, Redirect } from "react-router";
import app from "./base.js";
import { AuthContext } from "./Auth.js";
import { Button, Form, FormGroup, Label, Input } from 'reactstrap';
import "./App.css";
import 'bootstrap/dist/css/bootstrap.css';

const Login = ({ history }) => {
  const handleLogin = useCallback(
    async event => {
      event.preventDefault();
      const { email, password } = event.target.elements;
      try {
        await app
          .auth()
          .signInWithEmailAndPassword(email.value, password.value);
        history.push("/");
      } catch (error) {
        alert(error);
      }
    },
    [history]
  );

  const { currentUser } = useContext(AuthContext);

  if (currentUser) {
    return <Redirect to="/" />;
  }

  return (
    <FormGroup className="signup-login-form">
      <h1 className="text-center">Login</h1>
      <form onSubmit={handleLogin}>
        <Label>Email</Label>
        <Input name="email" type="email" placeholder="Email" />
        <br></br>
        <Label>Password</Label>
          <Input name="password" type="password" placeholder="Password" /><br></br>
          <button className="btn-lg btn-primary btn-block" type="submit">Login</button>
      </form>
      <br></br>
      <div className="text-center">
        <a href="/signup">Sign Up</a>
        <span className="p-2">|</span>
        <a href="/">Forgot Password</a>
      </div>
    </FormGroup>
  );
};

export default withRouter(Login);