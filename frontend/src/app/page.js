'use client';

import Link from "next/link"

export default function Home() {
  return (
    <div className="w-full min-h-screen bg-white">
      {/* Header Section */}
      <header className="w-[80%] fixed md:ms-32 mt-2 md:mt-4 top-0 left-0 right-0 md:right-auto z-50 rounded-none md:rounded-xl" style={{ backgroundColor: 'rgba(0, 0, 0, 0.2)' }}>
        <nav className="container mx-auto px-4 md:px-2 py-2 md:py-3 flex items-center justify-between">
          
          {/* Left Navigation */}
          <div className="flex items-center gap-2 md:gap-6 text-white">
            <img src="emeb_white.svg" className="w-20 md:w-32 transition"/>
          </div>

          {/* Center Logo */}
          <div className="text-white text-2xl font-bold me-0 lg:me-28"></div>

          {/* Right Dashboard Button */}
          <div className="flex items-center gap-2 md:gap-6 text-white">
            <a href="#" className="text-sm md:text-xl px-1 md:px-2 py-1 rounded-sm hover:bg-white hover:text-black transition hidden sm:inline-block">Home</a>
            <a href="#" className="text-sm md:text-xl px-1 md:px-2 py-1 rounded-sm hover:bg-white hover:text-black transition hidden md:inline-block">About</a>
            <a href="#" className="text-sm md:text-xl px-1 md:px-2 py-1 rounded-sm hover:bg-white hover:text-black transition hidden md:inline-block">Service</a>
            <a href="#" className="text-sm md:text-xl px-1 md:px-2 py-1 rounded-sm hover:bg-white hover:text-black transition hidden md:inline-block">Media</a>
            <Link href="/dashboard">
            <button className="text-sm md:text-xl text-white py-1 md:py-2 px-2 md:px-4 rounded hover:bg-white hover:text-black transition hover:cursor-pointer">
              Dashboard
            </button>
          </Link>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="relative w-full min-h-screen flex items-center justify-start text-white">
        {/* Background Image */}
        <div
         className="absolute inset-0 bg-cover bg-center bg-no-repeat"
         style={{
          backgroundImage: "url('/hero-bg.png')"
         }}
        >
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/30 to-transparent"></div>
      </div>

        {/* Hero Content */}
        <div className="relative z-10 mx-32 mt-32 w-600">
          <h1 className="text-5xl md:text-6xl lg:text-[108px] font-semibold text-white max-w-7xl">
            Industrial Emission Monitoring in One Platform
          </h1>
          <div className="flex mt-60 w-full">
            <div>
              <p className="text-2xl text-white max-w-5xl">
                Transform your Industrial Emission Data Into Real-Time Control, Precision Compliance, and Smarter Operations
              </p>
            </div>
            <div className="flex gap-4 ms-70">
              <button className="bg-white text-gray-500 px-8 rounded-lg font-semibold hover:bg-gray-100 transition hover:cursor-pointer">
                  Get Started
                </button>
                <button 
                  className="px-8 rounded rounded-lg font-semibold hover:opacity-90 transition text-white hover:cursor-pointer"
                  style={{ backgroundColor: 'rgba(0, 0, 0, 0.2)' }}
                >
                  Our Media
                </button>
            </div>
          </div>
        </div>
      </section>

      {/* About EMES-EBES Section */}
      <section className="w-full mt-12 md:mt-24 lg:mt-36 bg-white">
        <div className="px-4 md:px-8 lg:mx-32">
          <div className="flex flex-col md:flex-row gap-8 md:gap-12 items-center">
            {/* Left Side - Bento Grid Images */}
            <div className="flex-1 grid grid-flow-col grid-rows-3 gap-2 md:gap-4 w-full">
              <img src="/about1.png" alt="About Image 1" className="w-full h-auto md:w-100 md:h-50 object-cover rounded-sm" />
              <img src="/about2.png" alt="About Image 2" className="w-full h-auto md:w-100 md:h-50 object-cover rounded-sm" />
              <div className="w-full md:w-100 h-auto md:h-50 flex gap-2 md:gap-4">
                <img src="/about3.png" alt="About Image 3" className="w-1/2 md:w-50 h-auto md:h-25 object-cover rounded-sm" />
              <img src="/emeb_black.svg" alt="EMES-EBES Logo" className="w-1/2 md:w-50 h-auto md:h-25 object-contain" />
              </div>
              <img src="/about4.png" alt="About Image 4" className="w-full md:w-100 h-auto md:h-134 object-cover row-span-3 rounded-sm hidden md:block" />
            </div>

            {/* Right Side - Text */}
            <div className="flex-1 relative mt-4 md:-mt-20 w-full">
              <p className="text-green-600 text-lg md:text-xl lg:text-2xl font-bold">About EMES - EBES</p>
              <h2 className="text-3xl md:text-4xl lg:text-5xl text-gray-800">
                Most trusted
              </h2>
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-4 md:mb-6 text-gray-800">Carbon measurement</h2>
              <p className="text-gray-600 text-base md:text-lg lg:text-2xl text-justify leading-relaxed mb-6">
                We build a platform that helps industries track, analyze, and manage their emissions with accuracy. You access real-time data from machines, fleets, and production lines. You detect abnormal patterns early and prevent costly failures. You simplify ESG reporting with evidence taken directly from sensors. You use clear dashboards that support decisions in daily operations. Our goal is to help your company operate efficiently and meet environmental standards using practical technology that fits into your existing systems.
              </p>
              <div className="flex justify-end">
                <button className="bg-green-600 rounded-full text-white px-6 md:px-8 lg:px-12 py-2 text-sm md:text-base hover:bg-green-700 transition">
                  Read more
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* What does EBES-EMES do Section (Service) */}
      <section className="w-full bg-white mt-8 md:mt-12">
        <div className="container mx-auto px-4 md:px-8 lg:px-36">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-center mb-8 md:mb-12">
            What does <span className="text-green-600">EBES-EMES</span> do
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {/* Card 1 */}
            <div 
              className="rounded-lg p-8 flex flex-col items-center text-gray-800 min-h-128 "
              style={{ background: 'linear-gradient(to bottom, #87D270, #ffffff)' }}
            >
              <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mb-6 mt-6">
                <img src="/service1.png" alt="Service 1" className="w-10 h-10" />
              </div>
              <div className="flex-grow text-center">
                <p className="text-white text-xl md:text-2xl lg:text-3xl font-bold mb-6 md:mb-12">Industrial Emission Audit Service</p>
              </div>
              <p className="text-center text-sm md:text-base lg:text-[16px] text-green-800 mb-8 md:mb-20">Audit digital berbasis sensor untuk memverifikasi tingkat emisi gas buang (CO₂, NO₂, SO₂, PM2.5).</p>
              <button className="text-green-600 px-6 md:px-8 py-2 mb-8 md:mb-16 rounded-full text-sm md:text-base font-semibold hover:bg-gray-100 transition border border-green-600">
                Learn more
              </button>
            </div>

            {/* Card 2 */}
            <div 
              className="rounded-lg p-8 flex flex-col items-center text-gray-800 min-h-128"
              style={{ background: 'linear-gradient(to bottom, #87D270, #ffffff)' }}
            >
              <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mb-6 mt-6">
                <img src="/service2.png" alt="Service 2" className="w-10 h-10" />
              </div>
              <div className="flex-grow text-center">
                <p className="text-white text-xl md:text-2xl lg:text-3xl font-bold mb-6">Smart Fleet Emission Tracking</p>
              </div>
              <p className="text-center text-sm md:text-base lg:text-[17px] mb-12 md:mb-24 text-green-800">Layanan untuk kendaraan operasional industri (truk & alat berat)</p>
              <button className="text-green-600 mb-8 md:mb-16 px-6 md:px-8 py-2 rounded-full text-sm md:text-base font-semibold hover:bg-gray-100 transition border border-green-600">
                Learn more
              </button>
            </div>

            {/* Card 3 */}
            <div 
              className="rounded-lg p-8 flex flex-col items-center text-gray-800 min-h-128 "
              style={{ background: 'linear-gradient(to bottom, #87D270, #ffffff)' }}
            >
              <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mb-6 mt-6">
                <img src="/service3.png" alt="Service 3" className="w-10 h-10" />
              </div>
              <div className="flex-grow text-center">
                <p className="text-white text-xl md:text-2xl lg:text-3xl font-bold mb-6">Emission Data Analytics Dashboard</p>
              </div>
              <p className="text-center text-sm md:text-base lg:text-[16px] mb-12 md:mb-20 text-green-800">Layanan analisis dan visualisasi tren polusi mengoptimalkan informasi terkait carbon tracking</p>
              <button className="text-green-600 mb-8 md:mb-16 px-6 md:px-8 py-2 rounded-full text-sm md:text-base font-semibold hover:bg-gray-100 transition border border-green-600">
                Learn more
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="relative w-full h-auto min-h-64 md:h-72 mt-12 md:mt-24 lg:mt-36 py-12 md:py-0">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: 'url("count.png")',
          }}
        ></div>
        <div 
          className="absolute inset-0"
          style={{ backgroundColor: 'rgba(127, 228, 95, 0.6)' }}
        ></div>
        <div className="relative z-10 container mx-auto px-4 md:px-8 lg:px-36">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 text-center text-white pt-8 md:pt-12 lg:pt-20">
            <div>
              <div className="text-5xl md:text-6xl lg:text-8xl font-bold mb-2">100+</div>
              <div className="text-base md:text-lg lg:text-2xl">Satisfied Customers</div>
            </div>
            <div>
              <div className="text-5xl md:text-6xl lg:text-8xl font-bold mb-2">120+</div>
              <div className="text-base md:text-lg lg:text-2xl">Completed Project</div>
            </div>
            <div>
              <div className="text-5xl md:text-6xl lg:text-8xl font-bold mb-2">160+</div>
              <div className="text-base md:text-lg lg:text-2xl">Workers</div>
            </div>
          </div>
        </div>
      </section>

      {/* Solution for Companies Section */}
      <section className="w-full py-12 md:py-16 lg:py-20 bg-white mt-8 md:mt-12">
        <div className="container mx-auto px-4 md:px-8 lg:px-8">
          <div className="flex flex-col md:flex-row gap-8 md:gap-12">
            {/* Left Side - Text */}
            <div className="flex-1 relative">
              <p className="text-green-600 text-lg md:text-xl lg:text-2xl mb-2">Our Services →</p>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-green-800 mb-4 md:mb-6">
                Solution for Companies
              </h2>
              <p className="text-gray-600 leading-relaxed mb-6 text-base md:text-lg">
                Platform ini membantu perusahaan memantau emisi pabrik dan armada secara real time agar tim bisa bertindak cepat. 
              </p>
              <div className="flex justify-start">
                <button className="text-green-600 px-6 md:px-8 py-2 rounded-full text-sm md:text-base font-semibold hover:bg-gray-100 transition border border-green-600">
                  Learn more
                </button>
              </div>
            </div>

            {/* Right Side - Grid Images */}
            <div className="flex-1 grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-2 lg:gap-0">
              <div className="hidden md:block"></div>
              <div className="bg-gray-300 h-40 md:h-48 lg:h-60 w-full md:w-48 lg:w-60 flex items-end p-2 md:p-4 relative rounded"
              style={{
                backgroundImage: "url('/solution1.png')",
                backgroundSize: 'cover',
                backgroundPosition: 'center'
              }}>
                <span className="text-white text-xs md:text-sm lg:text-base font-semibold">Problem Detected</span>
              </div>
              <div className="bg-gray-300 h-40 md:h-48 lg:h-60 w-full md:w-48 lg:w-60 flex items-end p-2 md:p-4 relative rounded"
              style={{
                backgroundImage: "url('/solution2.png')",
                backgroundSize: 'cover',
                backgroundPosition: 'center'
              }}>
                <span className="text-white text-xs md:text-sm lg:text-base font-semibold">ESG STANDARD</span>
              </div>
              <div className="bg-gray-300 h-40 md:h-48 lg:h-60 w-full md:w-48 lg:w-60 flex items-end p-2 md:p-4 relative rounded"
              style={{
                backgroundImage: "url('/solution3.png')",
                backgroundSize: 'cover',
                backgroundPosition: 'center'
              }}>
                <span className="text-white text-xs md:text-sm lg:text-base font-semibold">Monitoring Real Time</span>
              </div>
              <div className="bg-gray-300 h-40 md:h-48 lg:h-60 w-full md:w-48 lg:w-60 flex items-end p-2 md:p-4 relative rounded"
              style={{
                backgroundImage: "url('/solution4.png')",
                backgroundSize: 'cover',
                backgroundPosition: 'center'
              }}>
                <span className="text-white text-xs md:text-sm lg:text-base font-semibold">Operational Efficiency</span>
              </div>
              <div className="bg-gray-300 h-40 md:h-48 lg:h-60 w-full md:w-48 lg:w-60 flex items-end p-2 md:p-4 relative rounded"
              style={{
                backgroundImage: "url('/solution5.png')",
                backgroundSize: 'cover',
                backgroundPosition: 'center'
              }}>
                <span className="text-white text-xs md:text-sm lg:text-base font-semibold">Insight for Decision</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Customers/Partners Section */}
      <section className="w-full py-12 md:py-16 lg:py-20 bg-gray-50 mt-8 md:mt-12 lg:mt-16">
        <div className="container mx-auto px-4 md:px-8 lg:px-36 py-4 md:py-8">
          <p className="text-green-600 text-lg md:text-xl lg:text-2xl mb-2 text-center">They trust us →</p>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-800 mb-8 md:mb-12 text-center">
            Our Customers are our biggest fans
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4 md:gap-6 lg:gap-8 items-center justify-items-center">
            {/* Company Logos - Placeholder boxes */}
            <img src="/partner1.png" alt="Partner 1" className="h-20 md:h-24 lg:h-32 object-contain" />
            <img src="/partner2.png" alt="Partner 2" className="h-24 md:h-28 lg:h-36 object-contain" />
            <img src="/partner3.png" alt="Partner 3" className="h-20 md:h-24 lg:h-32 object-contain" />
            <img src="/partner4.png" alt="Partner 4" className="h-20 md:h-24 lg:h-32 object-contain col-span-2 md:col-span-2 lg:col-span-2" />
            <img src="/partner5.png" alt="Partner 5" className="h-20 md:h-24 lg:h-32 object-contain md:me-0 lg:me-80 mt-4 md:mt-0 lg:mt-8" />
            <img src="/partner6.png" alt="Partner 6" className="h-20 md:h-24 lg:h-32 object-contain col-span-2 md:col-span-3 lg:col-span-3 mt-4 md:mt-6 lg:mt-8" />
          </div>
        </div>
      </section>

      {/* Footer Section */}
      <footer className="w-full bg-black text-white py-8 md:py-12 lg:py-16">
        <div className="container mx-auto px-4 md:px-8 lg:px-36">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
            {/* Left Side */}
            <div>
              <img src="/emeb_white.svg" alt="EMES-EBES Logo" className="w-32 md:w-36 lg:w-40 mb-6 md:mb-8" />
              <p className="text-gray-400 text-sm md:text-base lg:text-md mb-6 leading-relaxed">
                Platform ini membantu perusahaan mengelola emisi dengan data real time untuk operasi yang lebih efisien dan patuh regulasi.
              </p>
              <div className="flex gap-4 mt-6 md:mt-12">
                {/* Social Media Icons - Placeholder */}
                <img src="/fb.png" alt="Facebook" className="w-6 h-6 md:w-8 md:h-8 object-contain hover:opacity-70 transition cursor-pointer" />
                <img src="/ig.png" alt="Instagram" className="w-6 h-6 md:w-8 md:h-8 object-contain hover:opacity-70 transition cursor-pointer" />
                <img src="/twt.png" alt="Twitter" className="w-6 h-6 md:w-8 md:h-8 object-contain hover:opacity-70 transition cursor-pointer" />
              </div>
            </div>

            {/* Right Side - Newsletter */}
            <div>
              <h3 className="text-2xl md:text-2xl lg:text-3xl font-bold mb-2">Get in touch</h3>
              <p className="text-gray-400 mb-4 md:mb-6 text-base md:text-lg lg:text-xl">Update news about pollution & industry</p>
              <div className="flex flex-col sm:flex-row gap-2 sm:-gap-2">
                <input
                  type="email"
                  placeholder="Your email"
                  className="flex-1 px-4 py-2 md:py-3 rounded-full sm:rounded-l-full sm:rounded-r-none bg-transparent border border-white/30 text-white placeholder-gray-400 focus:outline-none focus:border-white text-sm md:text-base"
                />
                <button className="bg-green-600 text-white rounded-full sm:rounded-l-none sm:rounded-r-full px-6 md:px-8 py-2 md:py-3 hover:bg-green-700 transition text-sm md:text-base">
                  Subscribe
                </button>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
