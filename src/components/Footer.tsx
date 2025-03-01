'use client'
import React from 'react'
const Footer = () => {
  return (
    
    <footer className="bg-white dark:bg-black text-black dark:text-white py-6">
    <div className="container mx-auto flex flex-col md:flex-row justify-between items-center px-6">
      <p className="text-sm">&copy; {new Date().getFullYear()} X Connect. All rights reserved.</p>
      <nav className="flex space-x-4 mt-3 md:mt-0">
      </nav>
    </div>
  </footer>
  )
}

export default Footer
