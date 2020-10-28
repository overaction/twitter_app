import React, { useState } from 'react';
import AppRouter from "components/Router"
import {authService} from "myBase";

function App() {
  const [isLoggendIn, setIsLoggendIn] = useState(authService.currentUser);
  return (
    <>
      <AppRouter isLoggedIn={isLoggendIn} />
      <footer>&copy; {new Date().getFullYear()} Twitter</footer>
    </>
  );
}

export default App;
