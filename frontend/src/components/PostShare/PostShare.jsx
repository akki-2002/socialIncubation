import React, { useState, useRef } from "react";
import "./PostShare.css";
import { UilScenery, UilPlayCircle, UilLink, UilTimes } from "@iconscout/react-unicons";
import { useDispatch, useSelector } from "react-redux";
import { uploadImage, uploadPost } from "../../actions/UploadAction";

const PostShare = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.authReducer.authData);
  const loading = useSelector((state) => state.postReducer.uploading);
  const [image, setImage] = useState(null);
  const [hashtags, setHashtags] = useState([]);
  const [hashtagText, setHashtagText] = useState("");
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [selectedLink, setSelectedLink] = useState("");
  const [customLink, setCustomLink] = useState("");
  const desc = useRef();
  const serverPublic = process.env.REACT_APP_PUBLIC_FOLDER;

  const onImageChange = (event) => {
    if (event.target.files && event.target.files[0]) {
      let img = event.target.files[0];
      setImage(img);
    }
  };

  const imageRef = useRef();

  const handleUpload = async (e) => {
    e.preventDefault();

    const newPost = {
      userId: user._id,
      name: `${user.firstname} ${user.lastname}`,
      desc: `${desc.current.value} ${customLink ? customLink : ""}`,
      hashtags: hashtags,
    };

    if (image) {
      const data = new FormData();
      const fileName = Date.now() + image.name;
      data.append("name", fileName);
      data.append("file", image);
      newPost.image = fileName;
      try {
        dispatch(uploadImage(data));
      } catch (err) {
        console.log(err);
      }
    }
    dispatch(uploadPost(newPost));
    resetShare();
  };

  const resetShare = () => {
    setImage(null);
    desc.current.value = "";
    setHashtags([]);
    setHashtagText("");
    setDropdownVisible(false);
    setSelectedLink("");
    setCustomLink("");
  };

  const handleHashtagsChange = (e) => {
    const text = e.target.value;
    const tags = text.split(',').map(tag => tag.trim()).filter(tag => tag);
    setHashtags(tags);
    setHashtagText(text);
  };

  const insertLink = (link) => {
    setSelectedLink(link);
    setCustomLink(link);
    setDropdownVisible(false);
  };

  return (
    <div className="PostShare">
      <img
        src={
          user.profilePicture
            ? serverPublic + user.profilePicture
            : serverPublic + "defaultProfile.png"
        }
        alt="Profile"
      />
      <div>
        <input
          type="text"
          placeholder="What's happening?"
          required
          ref={desc}
        />
        <input
          type="text"
          placeholder="Add hashtags (comma separated)"
          onChange={handleHashtagsChange}
          value={hashtagText}
        />
        <div className="hashtagsList">
          {hashtags.map((hashtag, index) => (
            <span key={index} className="hashtag">#{hashtag}</span>
          ))}
        </div>

        <div className="postOptions">
          <div
            className="option"
            style={{ color: "var(--photo)" }}
            onClick={() => imageRef.current.click()}
          >
            <UilScenery />
            Photo
          </div>
          <div className="option" style={{ color: "var(--video)" }}>
            <UilPlayCircle />
            Video
          </div>

          <div
            className="option"
            style={{ color: "var(--link)" }}
            onClick={() => setDropdownVisible(!dropdownVisible)}
          >
            <UilLink />
            Link
          </div>

          <button
            className="button ps-button"
            onClick={handleUpload}
            disabled={loading}
          >
            {loading ? "Uploading" : "Share"}
          </button>

          {dropdownVisible && (
            <div className="dropdown">
              <div onClick={() => insertLink("https://www.whatsapp.com")}>
                <UilLink /> WhatsApp
              </div>
              <div onClick={() => insertLink("https://www.facebook.com")}>
                <UilLink /> Facebook
              </div>
              <div onClick={() => insertLink("https://www.linkedin.com")}>
                <UilLink /> LinkedIn
              </div>
              <div onClick={() => insertLink("https://www.twitter.com")}>
                <UilLink /> Twitter
              </div>
              <div onClick={() => insertLink("https://www.yourwebsite.com")}>
                <UilLink /> Your Website
              </div>
            </div>
          )}

          <div style={{ display: "none" }}>
            <input type="file" ref={imageRef} onChange={onImageChange} />
          </div>
        </div>

        {selectedLink && (
          <input
            type="text"
            className="customLinkInput"
            value={customLink}
            onChange={(e) => setCustomLink(e.target.value)}
            placeholder="Enter your custom link"
          />
        )}

        {image && (
          <div className="previewImage">
            <UilTimes onClick={() => setImage(null)} />
            <img src={URL.createObjectURL(image)} alt="preview" />
          </div>
        )}
      </div>
    </div>
  );
};

export default PostShare;
