"use client"

import { signOut } from 'next-auth/react';

const Home = () => { 
	return (
		<div>
      <div>
        <button onClick={() => signOut({ callbackUrl: '/' })}>ログアウト</button>
      </div>
    </div>
	)
}

export default Home

