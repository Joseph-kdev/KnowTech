import { useQuery } from '@tanstack/react-query'
import React from 'react'
import { getNews } from '../services/articles'

export const Newsfeed = () => {
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

    console.log(JSON.stringify(news))

  return (
    <div>
        The news is here
    </div>
  )
}
