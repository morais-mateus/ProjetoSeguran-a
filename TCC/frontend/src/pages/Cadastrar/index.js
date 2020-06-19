import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import api from "../../services/api";

import CardCentral from '../../components/CardCentral/index';
import FormHeader from '../../components/FormHeader/index';
import Input from '../../components/Input/index';
import Button from '../../components/Button/index';
import DivAviso from '../../components/DivAviso/index';


import "./styles.css";

export default function Register() {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [cpf, setCpf] = useState("");
  const [telefone, setTelefone] = useState("");
  const [user_cuidador, setUserCuidador] = useState("");
  const [user_normal, setUserNormal] = useState("");
  let usuario_validado = false;

  const [validacaoNome, setValidacaoNome] = useState(true);
  const [validacaoEmail, setValidacaoEmail] = useState(true);
  const [validacaoCpf, setValidacaoCpf] = useState(true);
  const [validacaoTelefone, setValidacaoTelefone] = useState(true);
  const [validacaoTipo, setValidacaoTipo] = useState(true);

  const [catchSuccess, setCatchSuccess] = useState(false);
  const [catchError, setCatchError] = useState(false);

  const history = useHistory();

  async function handleRegister(e) {
    e.preventDefault();

    let valido = true;

    valido = validaNome(nome) && valido;
    valido = validaEmail(email) && valido;
    valido = validaCpf(cpf) && valido;
    valido = validaTelefone(telefone) && valido;
    valido = validaTipo(user_cuidador) && valido;

    usuario_validado = valido;

    const data = { nome, email, cpf, usuario_validado, user_cuidador, telefone };

    if(usuario_validado) {
      try {
        console.log(data);
        setCatchSuccess(false);
        const response = await api.post("user/create", data);
        setCatchSuccess(true);
        history.push("/");
      } catch (error) {
        setCatchSuccess(false);
      }
    } else {
      console.log(validacaoNome,
      validacaoEmail,
      validacaoCpf,
      validacaoTelefone,
      validacaoTipo,
      usuario_validado);

      setCatchError(true);
      setTimeout(() => {
        setCatchError(false);
      }, 4000);
    }
  }


  function validaNome(nome) {
    setValidacaoNome(!!nome.match(/[A-Z][a-z]* [A-Z][a-z]*/));
    if (nome === '') return false;
    return validacaoNome;
  }

  function validaEmail(email) {
    setValidacaoEmail(!!email.match(/[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/gi));
    if (email === '') return false;
    return validacaoEmail;
  }

  function validaCpf(cpf) {
    setValidacaoCpf(cpf);
    
    setValidacaoCpf((cpf) => {
      let rev;
      let i;
      let add;
      cpf = cpf.toString().replace(/[^\d]+/g,'');	
      if(cpf === '') return false;	
      // Elimina CPFs invalidos conhecidos	
      if (cpf.length !== 11 || 
        cpf === "00000000000" || 
        cpf === "11111111111" || 
        cpf === "22222222222" || 
        cpf === "33333333333" || 
        cpf === "44444444444" || 
        cpf === "55555555555" || 
        cpf === "66666666666" || 
        cpf === "77777777777" || 
        cpf === "88888888888" || 
        cpf === "99999999999")
          return false;		
      // Valida 1o digito	
      add = 0;	
      for (i=0; i < 9; i ++)		
        add += parseInt(cpf.charAt(i)) * (10 - i);	
        rev = 11 - (add % 11);	
        if (rev === 10 || rev === 11)		
          rev = 0;	
        if (rev !== parseInt(cpf.charAt(9)))		
          return false;		
      // Valida 2o digito	
      add = 0;	
      for (i = 0; i < 10; i ++)		
        add += parseInt(cpf.charAt(i)) * (11 - i);	
      rev = 11 - (add % 11);	
      if (rev === 10 || rev === 11)	
        rev = 0;	
      if (rev !== parseInt(cpf.charAt(10)))
        return false;		
      return true;  
    });
    if (cpf === '') return false;
    return validacaoCpf;
  }

  function validaTelefone(telefone) {
    setValidacaoTelefone(!!telefone.match(/\+\d{2}\s\(\d{2}\)\s\d{4,5}-?\d{4}/g));
    if (telefone === '') return false;
    return validacaoTelefone;
  }

  function validaTipo(userCuidador) {
    if(userCuidador === '') {
      setValidacaoTipo(false);
      return false;
    }
    setTipo(userCuidador)
    setValidacaoTipo(true);
    return true;
  }

  function setTipo(isCuidador) {
    setUserCuidador(isCuidador);
    setUserNormal(!isCuidador);
  }

  return (
    <main>
      <CardCentral>
        <form onSubmit={handleRegister} id="form">
          <FormHeader nomeArea="cadastro">
              <DivAviso.sucesso value={catchSuccess} text="Cadastrado com sucesso!"/>
              <DivAviso.erro value={catchError} text={ usuario_validado ? "Ocorreu um problema no servidor. Por favor, tente novamente mais tarde!" : "Preencha os campos corretamente antes de submeter o formuário!"}/>
          </FormHeader>

          <Input.text value={nome} validado={validacaoNome} onBlur={e => validaNome(nome)} onChange={e => setNome(e.target.value)} type="text" placeHolder="Nome Completo" id="nome" name="nome" />
          <DivAviso.validacao value={!validacaoNome && nome !== ''} text="Por favor, digite seu nome completo." />

          <Input.text value={email} validado={validacaoEmail} onBlur={e => validaEmail(email)} onChange={e => setEmail(e.target.value)} type="email" placeHolder="Email" id="email" name="email" />
          <DivAviso.validacao value={!validacaoEmail && email !== ''} text="Por favor, digite um email válido." />

          <Input.text value={cpf} validado={validacaoCpf} onBlur={e => validaCpf(cpf)} onChange={e => setCpf(e.target.value)} type="text" placeHolder="CPF" id="cpf" name="cpf" />
          <DivAviso.validacao value={!validacaoCpf && cpf !== ''} text="Por favor, digite um CPF válido." />

          <Input.text value={telefone} validado={validacaoTelefone} onBlur={e => validaTelefone(telefone)} onChange={e => setTelefone(e.target.value)} type="text" placeHolder="Telefone" id="telefone" name="telefone" />
          <DivAviso.validacao value={!validacaoTelefone && telefone !== ''} text="Por favor, digite um telefone válido no padrão +99 (99) 9999-9999." />

          <span className="desc-checkbox-tipo">Você quer se cadastrar como:</span>
          <div className="grid">
            <Input.radio id="cuidador" name="tipo" value={user_cuidador} onClick={e => validaTipo(true)} htmlFor="cuidador" text="Cuidador" />
            <Input.radio id="usuario" name="tipo" value={user_normal} onClick={e => validaTipo(false)} htmlFor="usuario" text="Usuário" />
          </div>

          <div></div>
          <div className="grid">
            <Button.secundario type="button" name="login" text="Já possui cadastro?" href={"/"}/>
            <Button.principal type="submit" name="cadastrar" text="Cadastrar"/>
          </div>
        </form>
      </CardCentral>
    </main>
  );
}
