import { dbService, storageService } from 'myBase';
import React, { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faTimes } from '@fortawesome/free-solid-svg-icons';

let reader = new FileReader();
const TweetFactory = ({ userObj }) => {
  const [tweet, setTweet] = useState('');
  const [file, setFile] = useState('');

  const onSubmit = async (e) => {
    e.preventDefault();
    if (tweet === '') return;
    let fileUrl = '';
    if (file !== '') {
      const fileRef = storageService.ref().child(`${userObj.uid}/${uuidv4()}`);
      const response = await fileRef.putString(file, 'data_url');
      fileUrl = await response.ref.getDownloadURL();
    }
    const newTweet = {
      text: tweet,
      createdAt: Date.now(),
      creatorId: userObj.uid,
      fileUrl,
    };
    await dbService.collection('tweets').add(newTweet);
    setTweet('');
    setFile('');
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
    if (theFile) {
      reader.readAsDataURL(theFile);
    }
    reader.onload = (e) => {
      const {
        currentTarget: { result },
      } = e;
      setFile(result);
    };
    e.target.value = '';
  };

  const onClearFile = () => {
    setFile('');
  }
  return (
    <form onSubmit={onSubmit} className="factoryForm">
      <div className="factoryInput__container">
        <input
          className="factoryInput__input"
          value={tweet}
          onChange={onChange}
          type="text"
          placeholder="What's on your mind?"
          maxLength={120}
        />
        <input type="submit" value="&rarr;" className="factoryInput__arrow" />
      </div>
      <label htmlFor="attach-file" className="factoryInput__label">
        <span>Add photos</span>
        <FontAwesomeIcon icon={faPlus} />
      </label>
      <input
        id="attach-file"
        type="file"
        accept="image/*"
        onChange={onFileChange}
        style={{
          opacity: 0,
        }}
      />
      {file && (
        <div className="factoryForm__attachment">
          <img src={file} alt="img"/>
          <div className="factoryForm__clear" onClick={onClearFile}>
            <span>Remove</span>
            <FontAwesomeIcon icon={faTimes} />
          </div>
        </div>
      )}
    </form>
  );
};

export default TweetFactory;
