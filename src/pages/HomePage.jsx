import styled from "styled-components"
import { BiExit } from "react-icons/bi"
import { AiOutlineMinusCircle, AiOutlinePlusCircle } from "react-icons/ai"
import { useState, useContext, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import axios from "axios"
import UserContext from "../contexts/UserContext"

export default function HomePage() {
  const navigate = useNavigate();
  const [userTransactions , setUserTransactions] = useState([]);
  const [balance, setBalance] = useState(0);

  const { name } = useContext(UserContext);
  
  useEffect(() => {
    const getTransactions = async () => {
      const data = localStorage.getItem("data");
      if (!data) {
        navigate("/");
      } else {
        const { token } = JSON.parse(data);

        try {
          const response = await axios.get(`${import.meta.env.VITE_API_URL}/home`, {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });
          setUserTransactions(response.data.reverse());
          console.log(userTransactions)
        }
        catch (error) {
          alert(error.response.data)
        }
      }
    }
    getTransactions();
  }, [navigate]);

  useEffect(() => {
    let calcBalance = 0;
    userTransactions.forEach((transaction) => {
      const transactionValue = parseFloat(transaction.value); 
      if (transaction.tipo === "entrada") {
        calcBalance += transactionValue;
      } else {
        calcBalance -= transactionValue;
      }
    });
    setBalance(calcBalance);
  }, [userTransactions]);

  const handleLogout = () => {
    localStorage.removeItem("data");
    navigate("/");
  }

    const handleDelete = (id) => {
      const user = localStorage.getItem("data");
      if (!user) {
        navigate("/");
      } else {
        const { token } = JSON.parse(user);
  
        const confirmation = window.confirm("Tem certeza que deseja excluir esse registro?");
  
        if (confirmation) {
          axios.delete(`${import.meta.env.VITE_API_URL}/home/${id}`, {
            headers: {
              Authorization: `Bearer ${token}`
            }
          })
          .then(() => {
            const refreshTransactions = userTransactions.filter((transaction) => transaction._id !== id)
            setUserTransactions(refreshTransactions);
          })
          .catch((error) => {
            console.log(error)
          })
        }
      }
    }

  return (
    <HomeContainer>
      <Header>
        <h1 data-test="user-name">Olá, {name}</h1>
        <BiExit data-test="logout" onClick={handleLogout}/>
      </Header>

      <TransactionsContainer>
        {userTransactions.length === 0 ? (
            <p>Não há registros de entrada ou saída</p>
        ) : (
          <ul>
          {userTransactions.map((transaction) => (
            <ListItemContainer key={transaction._id}>
              <div>
                <span>{transaction.date}</span>
                <strong data-test="registry-name">{transaction.description}</strong>
              </div>
              <Value data-test="registry-amount" color={transaction.tipo === "entrada" ? "positivo" : "negativo"}>
                {Number(transaction.value).toFixed(2).replace('.',',')}
              </Value>
              <DeleteButton data-test="registry-delete" onClick={() => handleDelete(transaction._id)}>
                X
              </DeleteButton>
            </ListItemContainer>  
            
          ))}  
        </ul>
        )} 
        
        <article>
          <strong>Saldo</strong>
          <Value data-test="total-amount" color={balance >= 0 ? "positivo" : "negativo"}>
            {Number(balance).toFixed(2).replace('.',',')}
          </Value>
        </article>
      </TransactionsContainer>


      <ButtonsContainer>
        <button data-test="new-income" onClick={() => navigate("/nova-transacao/entrada")}>
            <AiOutlinePlusCircle />
            <p>Nova <br /> entrada</p>
        </button>
        <button data-test="new-expense" onClick={() => navigate("/nova-transacao/saida")}>
            <AiOutlineMinusCircle />
            <p>Nova <br />saída</p>
        </button>
      </ButtonsContainer>
    </HomeContainer>
  )
}

const HomeContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: calc(100vh - 50px);
`
const Header = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 2px 5px 2px;
  margin-bottom: 15px;
  font-size: 26px;
  color: white;
`
const TransactionsContainer = styled.article`
  flex-grow: 1;
  background-color: #fff;
  color: #000;
  border-radius: 5px;
  padding: 16px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  article {
    display: flex;
    justify-content: space-between;   
    strong {
      font-weight: 700;
      text-transform: uppercase;
    }
  }
`
const ButtonsContainer = styled.section`
  margin-top: 15px;
  margin-bottom: 0;
  display: flex;
  gap: 15px;
  
  button {
    width: 50%;
    height: 115px;
    font-size: 22px;
    text-align: left;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    p {
      font-size: 18px;
    }
  }
`
const Value = styled.div`
  font-size: 16px;
  text-align: right;
  color: ${(props) => (props.color === "positivo" ? "green" : "red")};
`
const ListItemContainer = styled.li`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
  color: #000000;
  margin-right: 10px;
  div span {
    color: #c6c6c6;
    margin-right: 10px;
  }
`

const DeleteButton = styled.button`
  color: #C6C6C6;
  font-size: 10px;
  width: 30px;
  display: flex;
  justify-content: center;
  align-items: center;
`