
import { SignUp } from "@clerk/nextjs"
import { Bricolage_Grotesque } from 'next/font/google'
import { Space_Mono } from 'next/font/google'

const fontBodyBold = Space_Mono({
  subsets: ['latin'],
  display: 'swap',
  weight: '700',
  variable: '--font-body',
})

const fontBold = Bricolage_Grotesque({
  subsets: ['latin'],
  display: 'swap',
  weight: '700',
  variable: '--font-heading',
})

const fontBody = Space_Mono({
  subsets: ['latin'],
  display: 'swap',
  weight: '400',
  variable: '--font-body',
})
export default function Component() {
  return (
    <div className="flex flex-col md:flex-row min-h-screen">
      <div
        className="flex flex-col justify-center w-full md:w-1/2 bg-cover bg-center p-8 md:p-12 lg:p-16"
        style={{ backgroundImage: "url('/path-to-your-image.jpg')" }}
      >
        <img src="/logoone.png" height={100} width={100} alt="Logo"  />
        <h1 className={`text-3xl font-bold md:text-4xl lg:text-5xl ${fontBodyBold.className}`}>
          Welcome to DressMeUp 
        </h1>
        <p className={`mt-4 text-base md:text-lg lg:text-xl ${fontBody.className}`}>
        Try on costumes and dresses instantly without changing clothes. Our platform uses cutting-edge technology to let you visualize yourself in various outfits.
        </p>
      </div>
      <div className="flex items-center justify-center w-full md:w-1/2 p-8 md:p-12 lg:p-16">
        <SignUp />
      </div>
    </div>
  )
}

