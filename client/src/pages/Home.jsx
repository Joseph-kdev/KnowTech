import { ArticleFeed } from '../components/Feedlist'
import { Newsfeed } from '../components/Newsfeed'
import { Nav } from '../components/Nav'
import { Footer } from '../components/Footer'


export default function Home() {


  return (
    <>
        <Nav />
        <Newsfeed />
        <ArticleFeed />
        <Footer />
    </>
  )
}
