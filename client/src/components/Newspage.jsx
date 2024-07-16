import React from 'react'
import { getNews } from '../services/articles'
import { useParams } from 'react-router-dom'
import { useQuery } from "@tanstack/react-query"

export const Newspage = ({ title }) => {
    const { newsKey } = useParams()

    const {data: news, isLoading, isError } = useQuery({
        queryKey: ["news"],
        queryFn: () => getNews()
    })

    if(isLoading) {
        return <div>Loading</div>
    }

    if(isError) {
        return <div>Errored Out</div>
    }

    const newsBlog = news != null ? news[newsKey] : []

    console.log(title);
    console.log(newsBlog);

  return (
    <div>
      Hello
    </div>
  )
}
