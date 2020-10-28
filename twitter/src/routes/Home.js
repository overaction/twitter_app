import React, { useState } from 'react';

const Home =  () => {
  const [tweet, setTweet] = useState('');
  const onSubmit = (e) => {
    e.preventDefault();
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