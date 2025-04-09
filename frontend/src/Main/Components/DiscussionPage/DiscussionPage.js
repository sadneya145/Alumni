import React, {useState, useEffect} from 'react';
import './DiscussionPage.css';
import {useNavigate} from 'react-router-dom';
import Header from '../../Header/Header';
import Footer from '../../Footer/Footer';

const DiscussionPage = () => {
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [newPost, setNewPost] = useState('');
  const [posts, setPosts] = useState([
    {
      id: 1,
      title: 'Best way to start learning Full Stack Development?',
      author: 'Alice Johnson',
      time: '5 mins ago',
      content: 'Should I start with frontend or backend first?',
      replies: [],
    },
    {
      id: 2,
      title: 'Debugging Node.js performance issues',
      author: 'Michael Smith',
      time: '30 mins ago',
      content: 'How do I track down performance bottlenecks in my Express app?',
      replies: [],
    },
  ]);

  const [replyText, setReplyText] = useState('');
  const [activePost, setActivePost] = useState(null);

  useEffect(() => {
    const storedName = localStorage.getItem('email');
    if (storedName) setName(storedName);
  }, []);

  const handleNewPost = () => {
    if (!newPost.trim()) return;

    const postObj = {
      id: Date.now(),
      title: newPost.slice(0, 50),
      author: name || 'Anonymous',
      time: 'Just now',
      content: newPost,
      replies: [],
    };

    setPosts([postObj, ...posts]);
    setNewPost('');
  };

  const handleReplySubmit = postId => {
    if (!replyText.trim()) return;

    setPosts(prev =>
      prev.map(post =>
        post.id === postId
          ? {...post, replies: [...post.replies, replyText]}
          : post
      )
    );

    setReplyText('');
    setActivePost(null);
  };

  return (
    <>
      <Header />
      <div className="forum-container">
        <h2 className="discussion-header">
          Community Discussions – Share & Learn Together
        </h2>

        {/* New Post Box */}
        <div className="new-post">
          <textarea
            placeholder="What's your doubt or question?"
            value={newPost}
            onChange={e => setNewPost(e.target.value)}
            rows={3}
          />
          <div className="post-btn-wrapper">
            <button onClick={handleNewPost}>Post</button>
          </div>
        </div>

        {/* Posts Feed */}
        <div className="forum-posts">
          {posts.map(post => (
            <div key={post.id} className="discussion-card">
              <div className="post-header">
                <img
                  src={`https://api.dicebear.com/7.x/initials/svg?seed=${post.author}`}
                  alt="User"
                  className="post-user-img"
                />
                <div>
                  <p className="post-author">{post.author}</p>
                  <p className="post-time">{post.time}</p>
                </div>
                {/* <div className="dots">⋮</div> */}
              </div>

              <div className="post-body">
                <h3>{post.title}</h3>
                <p>{post.content}</p>
              </div>

              <div className="post-actions">
                <button>👍 Like</button>
                <button>💬 Comment</button>
              </div>

              {/* Reply Box */}
              <div className="comment-box">
                <div className="avatar small">U</div>
                <input
                  type="text"
                  value={activePost === post.id ? replyText : ''}
                  onChange={e => {
                    setReplyText(e.target.value);
                    setActivePost(post.id);
                  }}
                  placeholder="Write your reply..."
                />
                <button onClick={() => handleReplySubmit(post.id)}>
                  Reply
                </button>
              </div>

              {/* Replies */}
              {post.replies.length > 0 && (
                <div className="replies">
                  {post.replies.map((reply, index) => (
                    <div key={index} className="reply">
                      <div className="avatar small">U</div>
                      <p className="reply-text">{reply}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default DiscussionPage;
