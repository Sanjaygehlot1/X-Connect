'use client'
import React from 'react';
import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { Button } from './ui/button';
import { User } from 'next-auth';
import { ModeToggle } from './theme-toggle';

function Navbar() {
  const { data: session } = useSession();
  const user: User = session?.user as User;

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

          <Link href="https://github.com/Sanjaygehlot1/X-Connect" target="_blank" rel="noopener noreferrer">
            <svg
              role="img"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              fill="currentColor"
              className="w-6 h-6 text-black dark:text-white hover:text-gray-700 dark:hover:text-gray-300 transition"
            >
              <title>GitHub</title>
              <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
            </svg>
          </Link>
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
