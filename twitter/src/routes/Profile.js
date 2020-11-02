import { authService, dbService } from 'myBase';
import React, { useCallback, useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';

const Profile = ({ userObj, refreshUser }) => {
  const history = useHistory();
  const [newDisplayName, setNewDisplayName] = useState(userObj.displayName);
  const onLogOutClick = () => {
    authService.signOut();
    history.push('/');
  };
  const getMyTweets = useCallback(async () => {
      await dbService
      .collection('tweets')
      .where('creatorId', '==', userObj.uid)
      .orderBy('createdAt', 'desc')
      .get();
  },[userObj.uid]);

  useEffect(() => {
    getMyTweets();
  }, [getMyTweets]);

  const onSubmit = async (e) => {
    e.preventDefault();
    if (userObj.displayName !== newDisplayName) {
      await userObj.updateProfile({
        displayName: newDisplayName,
      });
    }
    refreshUser();
  };
  const onChange = (e) => {
    setNewDisplayName(e.target.value);
  };

  return (
    <div className="container">
      <form className="profileForm" onSubmit={onSubmit}>
        <input
          className="formInput"
          autoFocus
          onChange={onChange}
          value={newDisplayName}
          type="text"
          placeholder="Display name"
        />
        <input style={{marginTop: 10,}} className="formBtn" type="submit" value="Update Profile" />
      </form>
      <span className="formBtn cancelBtn logOut" onClick={onLogOutClick}>
        Log Out
      </span>
    </div>
  );
};

export default Profile;
