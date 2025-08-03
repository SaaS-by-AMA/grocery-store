import React from 'react'
import MainBanner from '../components/MainBanner'
import Categories from '../components/Categories'
import BestSeller from '../components/BestSeller'
import BottomBanner from '../components/BottomBanner'
import NewsLetter from '../components/NewsLetter'
import FramerHeroCarousel from '../components/FramerHeroCarousel'
import PromoBar from '../components/PromoBar'

const Home = () => {
  return (
    <div className='mt-10'>
      <PromoBar />
      <Categories />
      <BestSeller />
      <BottomBanner/>
    </div>
  )
}

export default Home
