import styled from "styled-components"
import { useNavigate, useParams } from "react-router-dom";
import UserContext from "../contexts/UserContext";
import { useContext, useState } from "react";
import axios from "axios";

export default function TransactionsPage() {
  const navigate = useNavigate();

  const { tipo } = useParams();

  const { token } = useContext(UserContext);

  const [transaction, setTransaction] = useState({
    value: "",
    description: "",
  })

  const handleTransaction = (e) => setTransaction({...transaction, [e.target.name]: e.target.value})

  const handleSubmit =  async(e) => {
    e.preventDefault();
    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/nova-transacao/${tipo}`, transaction, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      navigate("/home")
    } catch (error) {
      alert(error.response.data)
    }
  }

  return (
    <TransactionsContainer>
      <h1>Nova {(tipo === "entrada") ? "entrada" : "saida"}</h1>
      <form onSubmit={handleSubmit}>
        <input
         data-test="registry-amount-input"
         required    
         placeholder="Valor"
         name="value"
         type="number"
         value={transaction.value}
         onChange={handleTransaction}
        />
        <input
         data-test="registry-name-input"
         required
         placeholder="Descrição"
         name="description"
         type="text"
         value={transaction.description}
         onChange={handleTransaction}
        />
        <button data-test="registry-save">Salvar {(tipo === "entrada") ? "entrada" : "saida"}</button>
      </form>
    </TransactionsContainer>
  )
}

const TransactionsContainer = styled.main`
  height: calc(100vh - 50px);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;

  h1 {
    align-self: flex-start;
    margin-bottom: 40px;
  }
`
