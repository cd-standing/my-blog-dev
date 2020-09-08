import React, { useState, useEffect } from 'react';
import ArticlesList from '../components/ArticlesList';
import CommentsList from '../components/CommentsList'
import UpvotesSection from '../components/UpvotesSection';
import AddCommentForm from '../components/AddCommentForm'
import NotFoundPage from '../pages/NotFoundPage';
import articleContent from './article-content';

const ArticlePage = ({ match }) => {
  const name = match.params.name;
  const article = articleContent.find(article => article.name === name);

  /*
  This uses the new Hook syntax 'useState for React to store a state in memory
  as opposed to creating a class and storing everything in there.
  Define articleInfo which is populated by sending a request to the server.
  Then setArticleInfo to change the value of articleInfo.
  Argument passed to useState is the initial value passed to articleInfo.
  Default values are set for useState for all of the expected properties for
  the article info.
  */
  const [articleInfo, setArticleInfo] = useState({ upvotes: 0, comments: [] });

  /*
  useEffect is another Hook. This runs any function passed to is after the 
  render is committed to the screen.
  */
  useEffect(() => {
    /*
    This is an asychronous function that fetches info from the server.
    */
    const fetchData = async () => {
      /* 
      'result' will hold the result of the fetch. The 'name' passed in will
      correspond to the name of the article to fetch info about.
       */
      const result = await fetch(`/api/articles/${name}`);
      /* Turn the result into a body of JSON content. */
      const body = await result.json();
      /* Sets the state of setArticleInfo with the body response from the server */
      console.log(body);
      setArticleInfo(body);
    }
    fetchData();
  }, [name]);

  if (!article) return <NotFoundPage />

  const otherArticles = articleContent.filter(article => article.name !== name);

  return (
    <>
      <h1>{article.title}</h1>
      <UpvotesSection 
      articleName={name} 
      upvotes={articleInfo.upvotes}
      setArticleInfo={setArticleInfo}/>
      {article.content.map((paragraph, key) => (
        <p key={key}>{paragraph}</p>
      ))}
      <h3>Other articles:</h3>
      <CommentsList comments={articleInfo.comments} />
      <AddCommentForm articleName={name} setArticleInfo={setArticleInfo}/>
      <ArticlesList articles={otherArticles} />
    </>
  );

};

export default ArticlePage;