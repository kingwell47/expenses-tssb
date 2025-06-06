import React from "react";
import SignUpForm from "../components/Auth/SignUpForm";
import LoginForm from "../components/Auth/LoginForm";

const LoginPage: React.FC = () => {
  return (
    <div>
      <LoginForm />
      <br />
      <SignUpForm />
    </div>
  );
};

export default LoginPage;
