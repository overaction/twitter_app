import { dbService } from 'myBase';
import React, { useEffect, useState } from 'react';

const Home =  () => {
  const [tweet, setTweet] = useState('');
  const [tweets, setTweets] = useState([]);

  const getTweets = async () => {
    const getTweets =  await dbService.collection("tweets").get();
    getTweets.forEach((doc) => {
      const tweetObject = {
        ...doc.data(),
        id: doc.id,
      }
      setTweets((prev) => [tweetObject, ...prev])
    })
  }
  useEffect(() => {
    getTweets();
  }, [])


  const onSubmit = async (e) => {
    e.preventDefault();
    await dbService.collection("tweets").add({
      tweet: tweet,
      createdAt: Date.now(),
    });
    setTweet('');
  }
  const onChange = (e) => {
    const {target: {value}} = e;
    setTweet(value);
  }
  console.log(tweets);
  return (
    <div>
      <form onSubmit={onSubmit}>
        <input value={tweet} onChange={onChange} type="text" placeholder="What's on your mind?" maxLength={120} />
        <input type="submit" value="Twitt" />
      </form>
      <div>
        {tweets.map(tweet => (
          <div key={tweet.id}>
            <h4>{tweet.tweet}</h4>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Home;