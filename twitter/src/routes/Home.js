import Tweet from 'components/Tweet';
import { dbService } from 'myBase';
import React, { useEffect, useState } from 'react';
import TweetFactory from 'components/TweetFactory';

const Home = ({ userObj }) => {
  const [tweets, setTweets] = useState([]);
  useEffect(() => {
    const tweetRef = dbService.collection("tweets").orderBy("createdAt","desc");
    const unsubscribe = tweetRef.onSnapshot((snapshot) => {
      const tweetArray = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setTweets(tweetArray);
      console.log('snapshot');
    });
    return () => {
      setTweets(false);
      unsubscribe();
    }
  }, []);

  return (
    <div className="container">
      <TweetFactory userObj={userObj} />
      <div style={{ marginTop: 30 }}>
        {tweets.map((tweet) => (
          <Tweet
            key={tweet.id}
            userObj={userObj}
            tweetObj={tweet}
            isOwner={tweet.creatorId === userObj.uid}
          />
        ))}
      </div>
    </div>
  );
};

export default Home;
