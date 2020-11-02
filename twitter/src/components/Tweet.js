import { dbService, storageService } from 'myBase';
import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faPencilAlt } from '@fortawesome/free-solid-svg-icons';
import { v4 as uuidv4 } from 'uuid';

let reader = new FileReader();

const Tweet = ({ tweetObj, userObj, isOwner }) => {
  const [editing, setEditing] = useState(false);
  const [newTweet, setNewTweet] = useState(tweetObj.text);
  const [fileUrl, setFileUrl] = useState(tweetObj.fileUrl);

  const onDeleteClick = async () => {
    const ok = window.confirm('Are you sure you want to delete this tweet?');
    if (ok) {
      // tweet 삭제
      await dbService.doc(`tweets/${tweetObj.id}`).delete();
      // file이 있다면 file 삭제
      if (fileUrl) {
        await storageService.refFromURL(fileUrl).delete();
      }
    }
  };
  const toggleEditing = () => setEditing((prev) => !prev);

  const onSubmit = async (e) => {
    e.preventDefault();
    let downloadUrl = '';
    if (fileUrl !== '') {
      const fileRef = storageService.ref().child(`${userObj.uid}/${uuidv4()}`);
      const response = await fileRef.putString(fileUrl, 'data_url');
      downloadUrl = await response.ref.getDownloadURL();
      setFileUrl(downloadUrl);
      await dbService.doc(`tweets/${tweetObj.id}`).update({ fileUrl: downloadUrl });
    }
    await dbService.doc(`tweets/${tweetObj.id}`).update({ text: newTweet });
    setEditing(false);
  };

  const onTweetChange = (e) => {
    setNewTweet(e.target.value);
  };
  const onImgClick = (e) => {
    window.open(e.target.src, '_blank');
  };
  const onFileChange = async (e) => {
    e.preventDefault();
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
      setFileUrl(result);
    };
    e.target.value = '';
  };
  return (
    <div className="tweet">
      {editing ? (
        <>
          <form onSubmit={onSubmit} className="container tweetEdit">
            <input
              type="text"
              placeholder="Edit your tweet"
              value={newTweet}
              required
              autoFocus
              onChange={onTweetChange}
              className="formInput"
            />
            <div className="editFile">
              <label htmlFor="tweet__editFile" className="editFile__label">
                {fileUrl ? <span>new photo</span> : <span>Add Photo</span>}
              </label>
              <input onChange={onFileChange} id="tweet__editFile" type="file" accept="image/*" />
              {fileUrl && (
                <img className="tweetImg" src={fileUrl} alt="img" />
              )}
            </div>
            <input type="submit" value="Update tweet" className="formBtn" />
          </form>
          <span onClick={toggleEditing} className="formBtn cancelBtn">
            Cancel
          </span>
        </>
      ) : (
        <>
          <h4>{tweetObj.text}</h4>
          {fileUrl && (
            <img
              className="tweetImg"
              src={fileUrl}
              alt="img"
              onClick={onImgClick}
            />
          )}
          {isOwner && (
            <div className="tweet__actions">
              <span onClick={onDeleteClick}>
                <FontAwesomeIcon icon={faTrash} />
              </span>
              <span onClick={toggleEditing}>
                <FontAwesomeIcon icon={faPencilAlt} />
              </span>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Tweet;
