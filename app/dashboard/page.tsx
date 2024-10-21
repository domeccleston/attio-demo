import { SignInButton, SignedIn, SignedOut, UserButton } from '@clerk/nextjs'

export default function Dashboard() {
  return (
    <div>
      <header>
          <SignedOut>
            <SignInButton />
          </SignedOut>
          <SignedIn>
            <UserButton />
          </SignedIn>
        </header>
    </div>
  )
}