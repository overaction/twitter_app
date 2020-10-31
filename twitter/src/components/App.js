import React, { useEffect, useState } from 'react';
import AppRouter from 'components/Router';
import { authService } from 'myBase';

function App() {
  const [init, setInit] = useState(false);
  const [userObj, setUserObj] = useState(null);

  useEffect(() => {
    authService.onAuthStateChanged((user) => {
      console.log(user);
      if (user) {
        setUserObj({
          displayName: user.displayName,
          uid: user.uid,
          updateProfile: (args) => {
            return user.updateProfile(args);
          },
        });
      } else {
        setUserObj(null);
        setInit(false);
      }
      setInit(true);
    });
  }, []);

  const refreshUser = () => {
    const user = authService.currentUser;
    setUserObj({
      displayName: user.displayName,
      uid: user.uid,
      updateProfile: (args) => {
        return user.updateProfile(args);
      },
    });
  };

  return (
    <>
      {console.log('updated')}
      {init ? (
        <AppRouter
          refreshUser={refreshUser}
          isLoggedIn={Boolean(userObj)}
          userObj={userObj}
        />
      ) : (
        'Initializing...'
      )}
    </>
  );
}

export default App;
