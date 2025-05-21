import Image from "next/image"
import Link from "next/link"

export default function AppBanner() {
  return (
    <div className="bg-[#FE7743] py-16 text-white md:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col-reverse md:flex-row items-center gap-8">
          {/* Left side with image */}
          <div className="space-y-6">
            <h2 className="text-3xl font-bold md:text-4xl lg:text-5xl">Find Your Perfect Childcare Provider Today!</h2>
            <p className="text-lg md:text-xl">
              Thousands of trusted childcare providers are waiting for you. Download the Kiddzy app now!
            </p>

            <div className="flex flex-wrap gap-4">
              <Link
                href="#"
                className="flex items-center gap-4 rounded-lg bg-black px-4 py-3 text-white transition-transform hover:scale-105"
              >
                <Image
                    src="/playstore.svg"
                    alt="Playstore"
                    width={30}
                    height={30}
                    className="object-cover "
                />
                <div>
                  <div className="text-xs">Get it on</div>
                  <div className="text-sm font-semibold">Google Play</div>
                </div>
              </Link>
              <Link
                href="#"
                className="flex items-center gap-4 rounded-lg bg-black px-4 py-3 text-white transition-transform hover:scale-105"
              >
                <Image
                    src="/apple.svg"
                    alt="Appstore"
                    width={30}
                    height={30}
                    className="object-cover scale-125"
                />
                <div>
                  <div className="text-xs">Download on the</div>
                  <div className="text-sm font-semibold">App Store</div>
                </div>
              </Link>
            </div>
          </div>
          

          {/* Right side with content */}
          <div className="relative mx-auto overflow-hidden rounded-3xl md:mx-0">
            <Image
              src="/HP.png"
              alt="Kiddzy mobile app"
              width={1000}
              height={1100}
              className="object-cover h-80 md:h-full"
            />
          </div>
        </div>
      </div>
    </div>
  )
}