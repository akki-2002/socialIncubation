import React, { useState } from 'react'
import PostSide from '../../components/PostSide/PostSide'
import ProfileSide from '../../components/profileSide/ProfileSide'
import RightSide from '../../components/RightSide/RightSide'
import './Home.css'

const Home = () => {
  const [hashId, setHashId] = useState('')
  const handleHashId = (passedId)=>{
    setHashId(passedId)
  }
  return (
    <div className="Home">
        <ProfileSide />
        <PostSide hashId={hashId}/>
        <RightSide handleHashId={handleHashId}/>
    </div>
  )
}

export default Home;
