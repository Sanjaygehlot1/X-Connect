'use client'

import React from 'react';
import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { Button } from './ui/button';
import { User } from 'next-auth';
import { ModeToggle } from './theme-toggle';

function Navbar() {
  const { data: session } = useSession();
  const user : User = session?.user as User;
  return (
    <nav className="p-4 md:p-6 shadow-lg bg-white dark:bg-black text-black dark:text-white">
    <div className="container mx-auto flex flex-wrap md:flex-nowrap justify-between items-center">
      <div className="flex items-center gap-4">
        <Link
          href="/"
          className="text-2xl font-extrabold tracking-wide text-black dark:text-white hover:text-gray-900 dark:hover:text-gray-300 transition"
        >
          X Connect
        </Link>
        <ModeToggle />
      </div>
  
      <div className="flex items-center gap-4">
        {session ? (
          <div className="flex items-center space-x-4">
            <span className="hidden md:inline-block text-sm text-black dark:text-gray-300">
              Welcome, <span className="font-medium">{user?.username || user?.email}</span>
            </span>
            <Button
              onClick={() => signOut()}
              className="bg-black text-white dark:bg-white dark:text-black hover:text-white dark:hover:text-black hover:bg-gray-900 dark:hover:bg-gray-200 transition"
              variant="outline"
            >
              Logout
            </Button>
          </div>
        ) : (
          <Link href="/signin">
            <Button
              className="bg-black text-white dark:bg-white dark:text-black hover:text-white dark:hover:text-black hover:bg-gray-900 dark:hover:bg-gray-200 transition"
              variant="outline"
            >
              Login
            </Button>
          </Link>
        )}
      </div>
    </div>
  </nav>
  
  
  );
}

export default Navbar;