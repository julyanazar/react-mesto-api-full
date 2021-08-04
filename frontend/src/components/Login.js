import React from 'react';

function Login({ authorization }) {
  const [valueEmail, setValueEmail] = React.useState('');
  const [valuePassword, setValuePassword] = React.useState('');

  function handleChangeEmail(e) {
    setValueEmail(e.target.value);
  }

  function handleChangePassword(e) {
    setValuePassword(e.target.value);
  }

  function handleSubmit(e) {
    e.preventDefault()
    const email = valueEmail;
    const password = valuePassword;

    authorization(email, password);
  }

  return (
    <section className="login">
      <h1 className="login__title">Вход</h1>
      <form onSubmit={handleSubmit} className="login__form">

        <input
          value={valueEmail}
          type="email"
          className="login__input"
          placeholder="Email"
          onChange={handleChangeEmail} />
        <input
          value={valuePassword}
          type="password"
          className="login__input"
          placeholder="Пароль"
          onChange={handleChangePassword} />

        <button className="login__submit">Войти</button>
      </form>
    </section>
  );
}

export default Login;