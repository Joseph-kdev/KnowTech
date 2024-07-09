import React from 'react'
import { useQuery } from "@tanstack/react-query"
import { getArticles } from './services/articles'
import { Feedlist } from './components/Feedlist'


export default function Home() {
  const {data: articles, isLoading, isError} = useQuery({
    queryKey: ["articles"],
    queryFn: () => getArticles()
  })

  if(isLoading) {
    return <div>Loading</div>
  }

  if(isError) {
    return <div>Errored out</div>
  }

  const byteArticles = articles.bytebytego ? articles.bytebytego : []
  const logRocket = articles.logRocket ? articles.logRocket : []
  const codingHorror = articles.codingHorror ? articles.codingHorror : []

  const byte = "Bytebytego"
  const logrocket = "Logrocket"
  const codinghorror = "Coding Horror"
 
  return (
    <>
        <h1 className='text-center font-mono text-3xl py-4'>
          My Feed
        </h1> 
        <Feedlist articles = {byteArticles} blogTitle={byte}/>
        <Feedlist articles={logRocket} blogTitle={logrocket}/>
        <Feedlist articles={codingHorror} blogTitle={codinghorror} />
    </>
  )
}
