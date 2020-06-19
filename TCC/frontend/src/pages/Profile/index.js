import React, { useState, useEffect } from "react";
import { Link, useHistory } from "react-router-dom";
import { FiPower, FiTrash2 } from "react-icons/fi";

import CardCentral from '../../components/CardCentral/index';
import FormHeader from '../../components/FormHeader/index';
import Input from '../../components/Input/index';
import Button from '../../components/Button/index';
import DivAviso from '../../components/DivAviso/index';

import UsuariosList from '../../components/UsuariosList/index';

import api from "../../services/api";

import "./styles.css";
export default function Profile() {

  const [password, setPassword] = useState("");
  const [confirmSenhaNova, setConfirmSenhaNova] = useState("");
  const [catchError, setCatchError] = useState(false);

  const history = useHistory();

  const [infoUser, setInfo] = useState([]);
  let usuario_validado = false;
  
  const [validacaoPassword, setValidacaoPassword] = useState(true);
  const [validacaoConfirmSenhaNova, setValidacaoConfirmSenhaNova] = useState(true);

  // pegando as variaveis do local storage
  const token = localStorage.getItem("token");
  const id = localStorage.getItem("id");
  const passwordexpires = localStorage.getItem("passwordexpires");

  // console.log(token);
  // console.log(id);

  useEffect(() => {
    api.post("info",{id} ).then(response => {
      setInfo(response.data);
    });
  }, [id]);

  async function handleEvent(e) {
    e.preventDefault();

    let valido = true;

    valido = validaSenha(password) && valido;
    valido = validaConfirmSenha(confirmSenhaNova) && valido;

    usuario_validado = valido;

    if(usuario_validado) {
      const credenciais = { token, password };

      try {
        setCatchError(false);

        console.log(credenciais);
        const response = await api.put("firstlogin", credenciais);

        console.log(response.data);

        history.push("/");
      } catch (error) {
        setCatchError(true);
        setTimeout(() => {
          setCatchError(false);
        }, 4000);
        //document.querySelector('#validacao').classList.remove('invisivel');
        //document.querySelector('#validacao').classList.add('visivel');
      }

    } else {
      setCatchError(true);
      setTimeout(() => {
        setCatchError(false);
      }, 4000);
    }
  }

  function validaSenha(password) {
    setPassword(password);
    validaConfirmSenha(password);
    setValidacaoPassword(!!password.match(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/));
    if (password === '') return false;
    return validacaoPassword;
  }

  function validaConfirmSenha(password) {
    setValidacaoConfirmSenhaNova(confirmSenhaNova === password);
    if (confirmSenhaNova === '') return false;
    return validacaoConfirmSenhaNova;
  }

  if(localStorage.getItem("passwordexpires") == "null") {
    return(
      <div className="profile-container">
        <header>
          <span>Bem Vindo, {infoUser.nome} </span>
      
        </header>
        <h1>Informações Pessoais</h1>
        <ul>
          <li>
            <p> Nome: {infoUser.nome}</p>
            <p> CPF: {infoUser.cpf}</p>
            <p> Email: {infoUser.email}</p>
          </li>
        </ul>
      </div>
    );
  } else {
    return (
      <main>
        <CardCentral>
          <form onSubmit={handleEvent}>
            <FormHeader nomeArea="Troca de senha">
              <DivAviso.erro value={catchError} text="Digite os campos corretamente!"/>
            </FormHeader>
            <Input.text value={password} onBlur={e => validaSenha(password)} onChange={e => setPassword(e.target.value)} type="password" placeHolder="Senha"/>
            <DivAviso.validacao value={!validacaoPassword && password !== ''} text="Sua senha deve ter no mínimo 8 caracteres, pelo menos 1 letra, 1 número e 1 caractere especial." />
            <Input.text value={confirmSenhaNova} onBlur={e => validaConfirmSenha(password)} onChange={e => setConfirmSenhaNova(e.target.value)} type="password" placeHolder="Confirma sua Senha"/>
            <DivAviso.validacao value={!validacaoConfirmSenhaNova && confirmSenhaNova !== ''} text="Você deve digitar a mesma senha digitada no campo acima." />
            <div className="grid-centralizado">
              <Button.principal type="submit" name="trocar" text="Trocar"/>
            </div> 
          </form>
        </CardCentral>
      </main>
    );
  }
}
