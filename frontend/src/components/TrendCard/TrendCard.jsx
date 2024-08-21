import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './TrendCard.css'

const TrendCard = () => {
  const [hashtags, setHashtags] = useState([]);

  useEffect(() => {
    const fetchHashtags = async () => {
      try {
        const response = await axios.get('/post/trendingHashtags');


        console.log(response.data); // Add this line to log the data
        setHashtags(response.data);
      } catch (error) {
        console.error("Failed to fetch trending hashtags", error);
      }
    };
  
    fetchHashtags();
  }, []);

  return (
    <div className="TrendCard">
      <h3>Trends for you</h3>
      {hashtags.length === 0 ? (
        <div>No trending hashtags found</div>
      ) : (
        hashtags.map((hashtag) => (
          <div className="trend" key={hashtag._id}>
            <span>#{hashtag._id}</span>
            <span>{hashtag.shares} shares</span>
          </div>
        ))
      )}
    </div>
  );
  
};

export default TrendCard;
