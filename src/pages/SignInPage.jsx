import React, { useState } from "react";
import styled from "styled-components";
import { Link, useNavigate } from "react-router-dom";
import MyWalletLogo from "../components/MyWalletLogo";
import axios from "axios";

export default function SignInPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleSignIn = (e) => {
    e.preventDefault();

    if (!email || !password) {
      alert("Please enter your email and password.");
      return;
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      alert("Please enter a valid email address.");
      return;
    }

    axios
      .post(import.meta.env.VITE_API_URL, {
        email: email,
        password: password,
      })
      .then((response) => {
        if (response.status === 200) {
          navigate("/home");
        } else if (response.status === 404) {
          alert("E-mail não encontrado. Cadastre-se primeiro.");
        } else if (response.status === 401) {
          alert("Senha incorreta. Tente novamente.");
        } else {
          alert("Ocorreu um erro ao tentar fazer login. Tente novamente mais tarde.");
        }
      })
      .catch((error) => {
        alert("Ocorreu um erro ao tentar fazer login. Tente novamente mais tarde.");
      });
  };

  return (
    <SignInContainer>
      <form onSubmit={handleSignIn}>
        <MyWalletLogo />
        <input
          placeholder="E-mail"
          type="email"
          value={email}
          onChange={handleEmailChange}
        />
        <input
          placeholder="Senha"
          type="password"
          autoComplete="new-password"
          value={password}
          onChange={handlePasswordChange}
        />
        <button type="submit">Entrar</button>
      </form>
      <Link to="/cadastro">Primeira vez? Cadastre-se!</Link>
    </SignInContainer>
  );
}

const SignInContainer = styled.section`
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;