"use client"

import Link from "next/link"
import Image from "next/image"

export default function HomePage() {
  return (
    <div className="flex flex-col h-screen w-full font-sans">
      <div className="bg-[#000000] text-[#ff6b35] text-center py-3 px-4 text-sm">
        This is a demo version of VerveAR created for basic furniture staging. Subscribe to a plan to unlock advanced
        staging capabilities.
      </div>

      <div className="flex flex-1 w-full">
        {/* Left Side - Dark Background with Content */}
        <div className="w-1/2 bg-[#1a1a1a] flex flex-col justify-between p-12">
          <div className="flex-1 flex flex-col justify-center max-w-2xl">
            <div className="flex flex-col gap-[27px]">
              {/* Logo */}
              <div>
                <Image
                  src="/images/design-mode/VerveAR_Logo_r8eh8k.png"
                  alt="VerveAR Logo"
                  width={50}
                  height={50}
                  className="object-contain"
                />
              </div>

              <h1 className="text-[35px] leading-tight text-white">
                <span className="font-normal">Get started with VerveAR</span>
                <br />
                <span className="font-normal">You've unlocked </span>
                <span className="font-bold italic text-[#ff6b35]">10 FREE PHOTOS</span>
              </h1>
            </div>

            <div className="mt-[22px]">
              <Link href="/imagetoimage">
                <button className="bg-[#ff6b35] hover:bg-[#ff5722] text-white font-semibold rounded-lg transition-colors text-base w-[130px] h-[40px] flex items-center justify-center">
                  Get Started
                </button>
              </Link>
            </div>
          </div>

          {/* Footer Navigation */}
          <div className="flex gap-12 text-gray-400">
            <a
              href="https://vervear.com/payasyougo"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white transition-colors"
            >
              Pay as you go💰
            </a>
            <a
              href="https://www.youtube.com/watch?v=FVEUskAK2IU"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white transition-colors"
            >
              Tutorials 💻
            </a>
            <a
              href="https://vervear.com/feedback"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white transition-colors"
            >
              Feedback 📝
            </a>
            <a
              href="https://vervear.com/contact"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white transition-colors"
            >
              Contact 📞
            </a>
          </div>
        </div>

        {/* Right Side - Image */}
        <div className="w-1/2 relative">
          <Image
            src="/images/design-mode/unsplash_IH7wPsjwomc_k4v3uw.png"
            alt="Styled living room with furniture"
            fill
            className="object-cover"
            priority
          />
        </div>
      </div>
    </div>
  )
}
