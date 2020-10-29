import Tweet from 'components/Tweet';
import { dbService } from 'myBase';
import React, { useEffect, useState } from 'react';

const Home = ({ userObj }) => {
  const [tweet, setTweet] = useState('');
  const [tweets, setTweets] = useState([]);
  const [file, setFile] = useState('');

  useEffect(() => {
    dbService.collection('tweets').onSnapshot((snapshot) => {
      const tweetArray = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setTweets(tweetArray);
      console.log('snapshot');
    });
  }, []);

  const onSubmit = async (e) => {
    e.preventDefault();
    await dbService.collection('tweets').add({
      text: tweet,
      createdAt: Date.now(),
      createrId: userObj.uid,
    });
    setTweet('');
  };
  const onChange = (e) => {
    const {
      target: { value },
    } = e;
    setTweet(value);
  };
  const onFileChange = (e) => {
    const {
      target: { files },
    } = e;
    const theFile = files[0];
    const reader = new FileReader();
    reader.readAsDataURL(theFile);
    reader.onload = (e) => {
      console.log(e);
      const {
        currentTarget: { result },
      } = e;
      setFile(result);
    };
  };
  const onClearFile = () => setFile(null);
  return (
    <div>
      <form onSubmit={onSubmit}>
        <input
          value={tweet}
          onChange={onChange}
          type="text"
          placeholder="What's on your mind?"
          maxLength={120}
        />
        <input onChange={onFileChange} type="file" accept="image/*" />
        <input type="submit" value="Twitt" />
        {file && (
          <div>
            <img src={file} width="50px" height="50px" />
            <button onClick={onClearFile}>Clear</button>
          </div>
        )}
      </form>
      <div>
        {tweets.map((tweet) => (
          <Tweet
            key={tweet.id}
            tweetObj={tweet}
            isOwner={tweet.createrId === userObj.uid}
          />
        ))}
      </div>
      {console.log('message update')}
    </div>
  );
};

export default Home;
