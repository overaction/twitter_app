import { dbService } from 'myBase';
import React, { useEffect, useState } from 'react';

const Home =  ({userObj}) => {
  const [tweet, setTweet] = useState('');
  const [tweets, setTweets] = useState([]);

  useEffect(() => {
    dbService.collection("tweets").onSnapshot(snapshot => {
      const tweetArray = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      setTweets(tweetArray);
    })
  }, []);


  const onSubmit = async (e) => {
    e.preventDefault();
    await dbService.collection("tweets").add({
      text: tweet,
      createdAt: Date.now(),
      createrId: userObj.uid,
    });
    setTweet('');
  }
  const onChange = (e) => {
    const {target: {value}} = e;
    setTweet(value);
  }
  return (
    <div>
      <form onSubmit={onSubmit}>
        <input value={tweet} onChange={onChange} type="text" placeholder="What's on your mind?" maxLength={120} />
        <input type="submit" value="Twitt" />
      </form>
      <div>
        {tweets.map(tweet => (
          <div key={tweet.id}>
            <h4>{tweet.text}</h4>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Home;