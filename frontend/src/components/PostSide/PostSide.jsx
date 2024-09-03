import React from 'react'
import Posts from '../Posts/Posts'
import PostShare from '../PostShare/PostShare'
import './PostSide.css'
const PostSide = ({hashId}) => {
  return (
   <div className="PostSide">
       <PostShare/>
       <Posts hashId={hashId}/>
   </div>
  )
}

export default PostSide