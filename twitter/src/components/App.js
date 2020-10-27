import React, { useState } from 'react';
import AppRouter from "components/Router"
import fbase from "../myBase";

function App() {
  const [isLoggendIn, setIsLoggendIn] = useState(false);
  return (
    <>
      <AppRouter isLoggedIn={isLoggendIn} />
      <footer>&copy; {new Date().getFullYear()} Twitter</footer>
    </>
  );
}

export default App;
