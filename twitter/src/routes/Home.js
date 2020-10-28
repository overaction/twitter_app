import { dbService } from 'myBase';
import React, { useState } from 'react';

const Home =  () => {
  const [tweet, setTweet] = useState('');
  const onSubmit = async (e) => {
    e.preventDefault();
    await dbService.collection("tweets").set({
      tweet: tweet,
      createdAt: Date.now(),
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
    </div>
  )
}

export default Home;