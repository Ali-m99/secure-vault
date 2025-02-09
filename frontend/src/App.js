import logo from './logo.svg';
import './App.css';
import React from 'react';

function App() {
  return (
    <div>
      <h1>Welcome to my App!</h1>
      <form method='POST' action="/user/login">
        <label for="email">Email:</label>
        <input type="text" id="email" name="email" /><br /><br />
        <label for="password">Password:</label>
        <input type="password" id="password" name="password" /><br /><br />
        <input type="submit" value="Submit" />
      </form>
    </div>
  );
}

export default App;
