import Tweet from 'components/Tweet';
import { authService, dbService } from 'myBase';
import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';

const Profile = ({ userObj, refreshUser }) => {
  const [profileTweets, setProfileTweets] = useState([]);
  const [seeTweet, setSeeTweet] = useState(false);
  const history = useHistory();
  const [newDisplayName, setNewDisplayName] = useState(userObj.displayName);
  const onLogOutClick = () => {
    authService.signOut();
    history.push('/');
  };
  useEffect(() => {
    const data = dbService
      .collection('tweets')
      .where('creatorId', '==', userObj.uid)
      .orderBy('createdAt', 'desc');
    const unsubscribe = data.onSnapshot((snap) => {
      const tweetArray = snap.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setProfileTweets(tweetArray);
      console.log(`profile snapshot`);
    });
    return () => unsubscribe();
  }, [userObj.uid]);

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

  const onViewClick = (e) => {
    setSeeTweet((prev) => !prev)
  }

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
        <input
          style={{ marginTop: 10 }}
          className="formBtn"
          type="submit"
          value="Update Profile"
        />
      </form>
      <span className="formBtn cancelBtn logOut" onClick={onLogOutClick}>
        Log Out
      </span>
      <span onClick={onViewClick} className="formBtn myTweets">View My Tweets</span>
      {profileTweets.length > 0 && seeTweet ? (
        
          <div className="profileTweets">
            {console.log(profileTweets)}
            {profileTweets.map((tweet) => (
              <Tweet
                key={tweet.id}
                userObj={userObj}
                tweetObj={tweet}
                isOwner={tweet.creatorId === userObj.uid}
              />
            ))}
          </div>
        
      ) : (
        <> </>
      )}
    </div>
  );
};

export default Profile;
