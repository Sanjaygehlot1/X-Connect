'use client'
import React from 'react'
import { signOut, signIn } from 'next-auth/react'
function page() {
  return (
    <div>
     <button className='bg-red-600 p-2 m-3 ' onClick={()=>signIn()}>
      Sign In
     </button>
    </div>
  )
}

export default page
