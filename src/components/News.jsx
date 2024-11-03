import React, { useState, useEffect } from 'react';
import { Select, Typography, Row, Col, Avatar, Card } from 'antd';
import moment from 'moment';
import axios from 'axios';

import { useGetCryptosQuery } from '../services/cryptoApi';
import Loader from './Loader';

const demoImage = 'https://www.bing.com/th?id=OVFT.mpzuVZnv8dwIMRfQGPbOPC&pid=News';

const { Text, Title } = Typography;
const { Option } = Select;

const News = ({ simplified }) => {
  const [newsCategory, setNewsCategory] = useState('Cryptocurrency');
  const { data } = useGetCryptosQuery(100);
  const [cryptoNews, setCryptoNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchCryptoNews = async () => {
    const options = {
      method: 'GET',
      url: 'https://cryptocurrency-news2.p.rapidapi.com/v1/cryptodaily',
      headers: {
        'x-rapidapi-key': process.env.REACT_APP_RAPIDAPI_KEY ,
        'x-rapidapi-host': 'cryptocurrency-news2.p.rapidapi.com'
      }
    };

    try {
      const response = await axios.request(options);
      console.log("Fetched Crypto News:", response.data);
      setCryptoNews(response.data.data || []);
    } catch (error) {
      console.error(error);
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCryptoNews();
  }, [newsCategory]);

  if (loading) return <Loader />;
  if (error) return <div>Error fetching news: {error.message}</div>;

  return (
    <Row gutter={[24, 24]}>
      {cryptoNews.map((news, i) => (
        <Col xs={24} sm={12} lg={8} key={news.id || news.url || i}>
          <Card hoverable className="news-card">
            <a href={news.url} target="_blank" rel="noreferrer">
              <div className="news-image-container">
                <Title className="news-title" level={4}>{news.title}</Title>
                <img className="news-thumbnail" src={news.thumbnail || demoImage} alt={news.title} />
              </div>
              <p className="news-description">{news.description.length > 100 ? `${news.description.substring(0, 100)}...` : news.description}</p>
              <div className="provider-container">
                <div>
                  {news.provider && news.provider.length > 0 ? (
                    <>
                      <Avatar src={news.provider[0]?.image?.thumbnail?.contentUrl || demoImage} alt="" />
                      <Text className="provider-name">{news.provider[0]?.name}</Text>
                    </>
                  ) : (
                    <Text className="provider-name">Unknown Provider</Text>
                  )}
                </div>
                <Text>{moment(news.createdAt).startOf('ss').fromNow()}</Text>
              </div>
            </a>
          </Card>
        </Col>
      ))}
    </Row>
  );
};

export default News;
