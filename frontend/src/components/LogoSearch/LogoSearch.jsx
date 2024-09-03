import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { UilSearch } from "@iconscout/react-unicons";
import Logo from "../../img/logo.png";
import "./LogoSearch.css";
import { getAllUser } from "../../api/UserRequests";
import axios from "axios";

const LogoSearch = () => {
  const [query, setQuery] = useState("");
  const [allUsers, setAllUsers] = useState([]);
  const [trendingHashtags, setTrendingHashtags] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsers = async () => {
      const { data } = await getAllUser();
      setAllUsers(data);
    };

    const fetchTrendingHashtags = async () => {
      try {
        const { data } = await axios.get('/post/trendingHashtags');
        setTrendingHashtags(data.map(hashtag => `#${hashtag._id}`));
      } catch (error) {
        console.error("Failed to fetch trending hashtags", error);
      }
    };

    fetchUsers();
    fetchTrendingHashtags();
  }, []);

  const handleSearch = async (e) => {
    const searchTerm = e.target.value;
    setQuery(searchTerm);

    if (searchTerm.startsWith("#")) {
      const filteredHashtags = trendingHashtags.filter(hashtag =>
        hashtag.toLowerCase().includes(searchTerm.toLowerCase())
      );

      setSearchResults(filteredHashtags);
    } else if (searchTerm.length > 0) {
      const filteredUsers = allUsers.filter((user) =>
        `${user.firstname} ${user.lastname}`
          .toLowerCase()
          .includes(searchTerm.toLowerCase())
      );
      setSearchResults(filteredUsers);
    } else {
      setSearchResults([]);
    }
  };

  const handleUserClick = (userId) => {
    navigate(`/profile/${userId}`);
    setQuery("");
    setSearchResults([]); // Clear results after navigation
  };

  const handleHashtagClick = (hashtag) => {
    navigate(`/hashtag/${hashtag.substring(1)}`);
    setQuery("");
    setSearchResults([]); // Clear results after navigation
  };

  return (
    <div className="LogoSearch">
      <img src={Logo} alt="logo" />
      <div className="Search">
        <input
          type="text"
          placeholder="#Explore"
          value={query}
          onChange={handleSearch}
        />
        <div className="s-icon">
          <UilSearch />
        </div>
      </div>
      {query && searchResults.length > 0 && (
        <div className="searchResults">
          {query.startsWith("#") ? (
            searchResults.map((hashtag) => (
              <div
                key={hashtag}
                className="searchResultItem"
                onClick={() => handleHashtagClick(hashtag)}
              >
                {hashtag}
              </div>
            ))
          ) : (
            searchResults.map((user) => (
              <div
                key={user._id}
                className="searchResultItem"
                onClick={() => handleUserClick(user._id)}
              >
                {user.firstname} {user.lastname}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default LogoSearch;
