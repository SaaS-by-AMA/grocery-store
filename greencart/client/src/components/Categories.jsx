import React from 'react'
import { categories } from '../assets/assets'
import { useAppContext } from '../context/AppContext'

const Categories = () => {
    const { navigate } = useAppContext()

    return (
        <div className='mt-16'>
            <p className='text-2xl md:text-3xl font-medium'>Categories</p>
            <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7 mt-6 gap-6'>
                {categories.map((category, index) => (
                    <div 
                        key={index} 
                        className='relative cursor-pointer py-5 px-3 gap-2 rounded-lg flex flex-col justify-center items-center transition-all duration-300 hover:shadow-lg hover:scale-[1.03]'
                        style={{ backgroundColor: category.bgColor }}
                        onClick={() => {
                            navigate(`/products/${category.path.toLowerCase()}`)
                            window.scrollTo(0, 0)
                        }}
                    >
                        <div className='flex flex-col items-center justify-center'>
                            <img 
                                src={category.image} 
                                alt={category.text} 
                                className='transition-transform duration-300 hover:scale-110 w-20 h-20 object-contain'
                            />
                            <p className='text-sm font-medium mt-2'>{category.text}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default Categories