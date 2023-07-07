import React, { useState, useContext } from "react";
import styled from "styled-components";
import { Link, useNavigate } from "react-router-dom";
import MyWalletLogo from "../components/MyWalletLogo";
import axios from "axios";
import UserContext from "../contexts/UserContext";

export default function SignInPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { setToken } = useContext(UserContext);
  const { setName } = useContext(UserContext);

  const handleSignIn = (e) => {
    e.preventDefault();

    if (!email || !password) {
      alert("Por favor, preencha todos os campos.");
      return;
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      alert("Por favor, preencha um e-mail válido.");
      return;
    }

    axios
      .post(import.meta.env.VITE_API_URL, {
        email: email,
        password: password,
      })
      .then((response) => {
        if (response.status === 200) {
          console.log(response.data.token);
          setToken(response.data.token);
          setName(response.data.name);
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
          data-test="email"
          placeholder="E-mail"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          data-test="password"
          placeholder="Senha"
          type="password"
          autoComplete="new-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button data-test="sign-in-submit" type="submit">Entrar</button>
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