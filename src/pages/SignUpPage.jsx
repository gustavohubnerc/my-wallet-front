import { Link, useNavigate } from "react-router-dom";
import styled from "styled-components";
import MyWalletLogo from "../components/MyWalletLogo";
import { useState } from "react";
import axios from "axios";

export default function SignUpPage() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name || !email || !password || !confirmPassword) {
      alert("Por favor, preencha todos os campos.");
      return;
    }

    if (password !== confirmPassword) {
      alert("As senhas não coincidem.");
      return;
    }

    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL/cadastro}`, {
        name,
        email,
        password,
      });

      if (response.status === 201) {
        navigate("/");
      } else if (response.status === 409) {
        alert("Já existe um usuário com este e-mail cadastrado.");
      } else if (response.status === 422) {
        alert("Verifique os dados fornecidos e tente novamente.");
      } else {
        alert("Ocorreu um erro ao cadastrar o usuário. Tente novamente mais tarde.");
      }
    } catch (error) {
      alert("Não foi possível cadastrar o usuário. Tente novamente mais tarde.");
    }
  };

  return (
    <SignUpContainer>
      <form onSubmit={handleSubmit}>
        <MyWalletLogo />
        <input 
          data-test="name" 
          placeholder="Nome" 
          type="text" 
          value={name} 
          onChange={(e) => setName(e.target.value)}
        />
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
        <input
          data-test="conf-password"
          placeholder="Confirme a senha"
          type="password"
          autoComplete="new-password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
        <button data-test="sign-up-submit" type="submit">Cadastrar</button>
      </form>

      <Link to="/">Já tem uma conta? Entre agora!</Link>
    </SignUpContainer>
  );
}

const SignUpContainer = styled.section`
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;
