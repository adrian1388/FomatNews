import React, { useEffect, useState } from "react";
import { Container, Title, Label } from "../../components/common";
import { articles_url, _api_key } from "../../components/common/restConfig";
import { ActivityIndicator, Image, ScrollView } from "react-native";
import { useIntl } from 'react-intl'
import { getLocale } from "../../utility/locale";
import { Categories } from "./Categories";
import Updater from "./Updater";

export async function getArticles(language = 'en', category) {

  try {
    let articles = []
    if (category) {
      articles = await fetch(`${articles_url}?language=${language}&category=${category}`, {
        headers: {
          'X-API-KEY': _api_key
        }
      });
    } else {
      articles = await fetch(`${articles_url}?language=${language}`, {
        headers: {
          'X-API-KEY': _api_key
        }
      });
    }
    let result = await articles.json();

    return result.articles;
  }
  catch (error) {
    throw error;
  }
}

export const News = () => {
  const [loading, setLoading] = useState(true)
  const [category, setCategory] = useState(null)
  const [articles, setArticles] = useState([])
  const intl = useIntl();

  useEffect(() => {
    getArticles(getLocale(), category).then(data => {
      setArticles(data)
      setLoading(false)
    })
  }, [category]);

  return (
    <>
      <Updater refetch={() => {
        setLoading(true)
        getArticles(getLocale(), category).then(data => {
          setArticles(data)
          setLoading(false)
        }); 
      }} />
      <Title>{intl.formatMessage({ id: "news" })}</Title>
      <Categories setCategory={setCategory} category={category} setLoading={setLoading} />
      <ScrollView style={{ height: '100%' }}>
        {loading && <ActivityIndicator />}
        {articles.map((a, index) => {
          if (a.description) {
            return (
              <Container
                key={index + a.title.slice(10)}
                paddings='15px'
                flex={1}
                flexDirection='row'
              >
                {a.urlToImage ? <Image source={{ uri: a.urlToImage }} style={{ width: 100, height: 100 }} /> : null}
                <Container flex={1} paddings='0 10px'>
                  <Label fontWeight='bold'>{a.title}</Label>
                  <Label>{a.description}</Label>
                </Container>
              </Container>
            )
          }
          return null
        })}
      </ScrollView>
    </>
  )
}