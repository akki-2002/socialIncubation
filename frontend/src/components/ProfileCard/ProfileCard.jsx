import React, { useEffect, useState } from "react";
import "./ProfileCard.css";
import Cover from "../../img/cover.png";
import Profile from "../../img/profileImg.jpg";
import { Link, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
const ProfileCard = ({ location }) => {


  const {user} = useSelector((state) => state.authReducer.authData);
  // console.log(user)
  const [userData, setUserData] = useState()
  const posts = useSelector((state) => state.postReducer.posts);
  const serverPublic = process.env.REACT_APP_PUBLIC_FOLDER;

  const { id: paramId } = useParams(); // Get id from useParams
const id = paramId || user._id; // Use paramId if it exists, otherwise use user._id


  useEffect(()=>{
    const fetchData = async ()=>{
      const response = await fetch(`http://localhost:5000/user/${id}`);
      const json = await response.json();
      if(response.ok)
      {
        setUserData(json)
        console.log("profilepage", json)
      }
    }

    fetchData()
  },[id])

  return (

    <div className="ProfileCard">
      <div className="ProfileImages">
        <img
          src={
            userData?.coverPicture
              ? serverPublic + userData?.coverPicture
              : serverPublic + "defaultCover.jpg"
          }
          alt="CoverImage"
        />
        <img
          src={
            userData?.profilePicture
              ? serverPublic + userData?.profilePicture
              : serverPublic + "defaultProfile.png"
          }
          alt="ProfileImage"
        />
      </div>
      <div className="ProfileName">
        <span>
          {userData?.firstname} {userData?.lastname}
        </span>
        <span>{userData?.worksAt ? userData?.worksAt : "Write about yourself"}</span>
      </div>

      <div className="followStatus">
        <hr />
        <div>
        
          <div className="follow">
            <span>
              {posts?.filter((post) => post.userDataId === userData?._id).length}
            </span>
            <span>Posts</span>
          </div>{" "}


          <div className="vl"></div>


          {location === "profilePage" && (
            <>
              <div className="vl"></div>
            </>
          )}
        </div>
        <hr />
      </div>

      {location === "profilePage" ? (
        ""
      ) : (
        <span>
          <Link
            to={`/profile/${userData?._id}`}
            style={{ textDecoration: "none", color: "inherit" }}
          >
            My Profile
          </Link>
        </span>
      )}
    </div>
  );
};

export default ProfileCard;
