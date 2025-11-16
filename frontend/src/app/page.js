'use client';

import Link from "next/link"

export default function Home() {
  return (
    <div className="w-full min-h-screen bg-white">
      {/* Header Section */}
      <header className="w-412 fixed ms-32 mt-4 top-0 left-0 z-50 rounded-xl" style={{ backgroundColor: 'rgba(0, 0, 0, 0.2)' }}>
        <nav className="container mx-auto px-2 py-3 flex items-center justify-between">
          
          {/* Left Navigation */}
          <div className="flex items-center gap-6 text-white">
            <a href="#" className="text-xl px-2 py-1 rounded-sm hover:bg-white hover:text-black transition">Home</a>
            <a href="#" className="text-xl px-2 py-1 rounded-sm hover:bg-white hover:text-black transition">About</a>
            <a href="#" className="text-xl px-2 py-1 rounded-sm hover:bg-white hover:text-black transition">Service</a>
            <a href="#" className="text-xl px-2 py-1 rounded-sm hover:bg-white hover:text-black transition">Media</a>
          </div>

          {/* Center Logo */}
          <div className="text-white text-2xl font-bold me-28">EMES-EBES</div>

          {/* Right Dashboard Button */}
          <Link href="/dashboard">
            <button className="text-xl text-white py-2 px-4 rounded hover:bg-white hover:text-black transition hover:cursor-pointer">
              Dashboard
            </button>
          </Link>
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
        <div className="absolute inset-0 bg-gradient-to-r from-green-600/30 to-transparent"></div>
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
      <section className="w-full mt-36 bg-white">
        <div className="mx-32">
          <div className="flex flex-col md:flex-row gap-12 items-center">
            {/* Left Side - Bento Grid Images */}
            <div className="flex-1 grid grid-flow-col grid-rows-3 gap-4">
              <div className="w-100 h-50 bg-cover"
                    style={{
                      backgroundImage: "url('/about1.png')"
                    }}
              ></div>
              <div className="w-100 h-50 bg-cover"
                    style={{
                      backgroundImage: "url('/about2.png')"
                    }}
              ></div>
              <div className="w-100 h-50 flex gap-4 ">
                <div className="w-50 h-25 bg-cover"
                    style={{
                      backgroundImage: "url('/about3.png')"
                    }}
              ></div>
              <div className="w-50 h-25"
                    
              >LOGO</div>
              </div>
              <div className="w-100 h-133  row-span-3"
                    style={{
                      backgroundImage: "url('/about4.png')"
                    }}
              ></div>
            </div>

            {/* Right Side - Text */}
            <div className="flex-1 relative -mt-20">
              <p className="text-green-600 text-2xl font-bold">About EMES - EBES</p>
              <h2 className="text-5xl text-gray-800">
                Most trusted
              </h2>
              <br></br>
              <h2 className="text-4xl font-bold -mt-4 mb-6">Carbon measurement</h2>
              <p className="text-gray-600 text-2xl text-justify leading-relaxed mb-6">
                We build a platform that helps industries track, analyze, and manage their emissions with accuracy. You access real-time data from machines, fleets, and production lines. You detect abnormal patterns early and prevent costly failures. You simplify ESG reporting with evidence taken directly from sensors. You use clear dashboards that support decisions in daily operations. Our goal is to help your company operate efficiently and meet environmental standards using practical technology that fits into your existing systems.
              </p>
              <div className="flex justify-end">
                <button className="bg-green-600 rounded-full text-white px-12 py-2 rounded hover:bg-green-700 transition">
                  Read more
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* What does EBES-EMES do Section (Service) */}
      <section className="w-full bg-white mt-12">
        <div className="container mx-auto px-36">
          <h2 className="text-5xl font-bold text-center mb-12">
            What does <span className="text-green-600">EBES-EMES</span> do
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {/* Card 1 */}
            <div 
              className="rounded-lg p-8 flex flex-col items-center text-gray-800 min-h-128 border-2 border-gray-300"
              style={{ background: 'linear-gradient(to bottom, #87D270, #ffffff)' }}
            >
              <div className="w-20 h-20 bg-green-800 rounded-full flex items-center justify-center mb-6">
                <div 
                  className="w-10 h-10"
                  style={{
                    backgroundImage: "url('/co2.png')",
                    backgroundSize: "contain",
                    backgroundRepeat: "no-repeat",
                    backgroundPosition: "center"
                  }}
                ></div>
              </div>
              <div className="flex-grow text-center">
                <p className="text-green-800 text-3xl font-bold mb-6">Industrial Emission Audit Service</p>
              </div>
              <p className="text-center text-lg mb-36 text-green-800">Audit digital berbasis sensor untuk memverifikasi tingkat emisi gas buang (CO₂, NO₂, SO₂, PM2.5).</p>
              <button className="text-green-600 px-8 py-2 rounded-full font-semibold hover:bg-gray-100 transition border border-green-600">
                Learn more
              </button>
            </div>

            {/* Card 2 */}
            <div 
              className="rounded-lg p-8 flex flex-col items-center text-gray-800 min-h-128 border-2 border-gray-300"
              style={{ background: 'linear-gradient(to bottom, #87D270, #ffffff)' }}
            >
              <div className="w-20 h-20 bg-green-800 rounded-full flex items-center justify-center mb-6">
                <div 
                  className="w-10 h-10"
                  style={{
                    backgroundImage: "url('/truck.png')",
                    backgroundSize: "contain",
                    backgroundRepeat: "no-repeat",
                    backgroundPosition: "center"
                  }}
                ></div>
              </div>
              <div className="flex-grow text-center">
                <p className="text-green-800 text-3xl font-bold mb-6">Smart Fleet Emission Tracking</p>
              </div>
              <p className="text-center text-lg mb-36 text-green-800">Layanan untuk kendaraan operasional industri (truk & alat berat)</p>
              <button className="text-green-600 px-8 py-2 rounded-full font-semibold hover:bg-gray-100 transition border border-green-600">
                Learn more
              </button>
            </div>

            {/* Card 3 */}
            <div 
              className="rounded-lg p-8 flex flex-col items-center text-gray-800 min-h-128 border-2 border-gray-300"
              style={{ background: 'linear-gradient(to bottom, #87D270, #ffffff)' }}
            >
              <div className="w-20 h-20 bg-green-800 rounded-full flex items-center justify-center mb-6">
                <div 
                  className="w-10 h-10"
                  style={{
                    backgroundImage: "url('/dashboard.png')",
                    backgroundSize: "contain",
                    backgroundRepeat: "no-repeat",
                    backgroundPosition: "center"
                  }}
                ></div>
              </div>
              <div className="flex-grow text-center">
                <p className="text-green-800 text-3xl font-bold mb-6">Emission Data Analytics Dashboard</p>
              </div>
              <p className="text-center text-lg mb-36 text-green-800">Layanan analisis dan visualisasi tren polusi untuk membantu perusahaan mengoptimalkan informasi terkait carbon tracking</p>
              <button className="text-green-600 px-8 py-2 rounded-full font-semibold hover:bg-gray-100 transition border border-green-600">
                Learn more
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="relative w-full h-72 mt-36">
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
        <div className="relative z-10 container mx-auto px-36">
          <div className="grid md:grid-cols-3 gap-8 text-center text-white pt-20">
            <div>
              <div className="text-8xl font-bold mb-2">100+</div>
              <div className="text-2xl">Satisfied Customers</div>
            </div>
            <div>
              <div className="text-8xl font-bold mb-2">120+</div>
              <div className="text-2xl">Completed Project</div>
            </div>
            <div>
              <div className="text-8xl font-bold mb-2">160+</div>
              <div className="text-2xl">Workers</div>
            </div>
          </div>
        </div>
      </section>

      {/* Solution for Companies Section */}
      <section className="w-full py-20 bg-white mt-32">
        <div className="container mx-auto px-36">
          <div className="flex flex-col md:flex-row gap-12">
            {/* Left Side - Text */}
            <div className="flex-1 relative">
              <p className="text-green-600 text-2xl mb-2">Our Services →</p>
              <h2 className="text-5xl font-bold text-green-800 mb-6">
                Solution for Companies
              </h2>
              <p className="text-gray-600 leading-relaxed mb-6 text-lg">
                Platform ini membantu perusahaan memantau emisi pabrik dan armada secara real time agar tim bisa bertindak cepat. 
              </p>
              <div className="flex justify-start">
                <button className="text-green-600 px-8 py-2 rounded-full font-semibold hover:bg-gray-100 transition border border-green-600">
                  Learn more
                </button>
              </div>
            </div>

            {/* Right Side - Grid Images */}
            <div className="flex-1 grid grid-cols-3">
              <div></div>
              <div className="bg-gray-300 h-48 flex items-end p-4 relative"
              style={{
                backgroundImage: "url('/solution1.png')"
              }}>
                <span className="text-white font-semibold">Problem Detected</span>
              </div>
              <div className="bg-gray-300 h-48 flex items-end p-4 relative"
              style={{
                backgroundImage: "url('/solution2.png')"
              }}>
                <span className="text-white font-semibold">ESG STANDARD</span>
              </div>
              <div className="bg-gray-300 h-48 flex items-end p-4 relative"
              style={{
                backgroundImage: "url('/solution3.png')"
              }}>
                <span className="text-white font-semibold">Monitoring Real Time</span>
              </div>
              <div className="bg-gray-300 h-48 flex items-end p-4 relative"
              style={{
                backgroundImage: "url('/solution4.png')"
              }}>
                <span className="text-white font-semibold">Operational Efficiency</span>
              </div>
              <div className="bg-gray-300 h-48 flex items-end p-4 relative"
              style={{
                backgroundImage: "url('/solution5.png')"
              }}>
                <span className="text-white font-semibold">Insight for Decision</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Customers/Partners Section */}
      <section className="w-full py-20 bg-gray-50 mt-16">
        <div className="container mx-auto px-36">
          <p className="text-green-600 text-2xl mb-2 text-center">They trust us →</p>
          <h2 className="text-5xl font-bold text-gray-800 mb-12 text-center">
            Our Customers are our biggest fans
          </h2>
          <div className="grid grid-cols-3 md:grid-cols-4 gap-8 items-center justify-items-center">
            {/* Company Logos - Placeholder boxes */}
            <div className="bg-white p-6 rounded shadow-md w-full h-24 flex items-center justify-center text-gray-600 font-semibold">
              Microsoft
            </div>
            <div className="bg-white p-6 rounded shadow-md w-full h-24 flex items-center justify-center text-gray-600 font-semibold">
              P&G
            </div>
            <div className="bg-white p-6 rounded shadow-md w-full h-24 flex items-center justify-center text-gray-600 font-semibold text-sm">
              S&P Global
            </div>
            <div className="bg-white p-6 rounded shadow-md w-full h-24 flex items-center justify-center text-gray-600 font-semibold">
              FWD
            </div>
            <div className="bg-white p-6 rounded shadow-md w-full h-24 flex items-center justify-center text-gray-600 font-semibold">
              Grab
            </div>
            <div className="bg-white p-6 rounded shadow-md w-full h-24 flex items-center justify-center text-gray-600 font-semibold">
              HP
            </div>
            <div className="bg-white p-6 rounded shadow-md w-full h-24 flex items-center justify-center text-gray-600 font-semibold">
              KENTECH
            </div>
            <div className="bg-white p-6 rounded shadow-md w-full h-24 flex items-center justify-center text-gray-600 font-semibold text-xs">
              Etihad Airways
            </div>
            <div className="bg-white p-6 rounded shadow-md w-full h-24 flex items-center justify-center text-gray-600 font-semibold">
              Infosys
            </div>
            <div className="bg-white p-6 rounded shadow-md w-full h-24 flex items-center justify-center text-gray-600 font-semibold">
              Bacardi
            </div>
            <div className="bg-white p-6 rounded shadow-md w-full h-24 flex items-center justify-center text-gray-600 font-semibold text-xs">
              JPMorgan
            </div>
            <div className="bg-white p-6 rounded shadow-md w-full h-24 flex items-center justify-center text-gray-600 font-semibold">
              Partner
            </div>
          </div>
        </div>
      </section>

      {/* Footer Section */}
      <footer className="w-full bg-black text-white py-16">
        <div className="container mx-auto px-36">
          <div className="grid md:grid-cols-2 gap-12">
            {/* Left Side */}
            <div>
              <div className="text-4xl font-bold mb-4">Logo</div>
              <p className="text-gray-400 text-xl mb-6 leading-relaxed">
                Platform ini membantu perusahaan mengelola emisi dengan data real time untuk operasi yang lebih efisien dan patuh regulasi.
              </p>
              <div className="flex gap-4 mt-12">
                {/* Social Media Icons - Placeholder */}
                <div className="w-10 h-10  rounded flex items-center justify-center hover:bg-gray-700 transition cursor-pointer" 
                style={{
                  backgroundImage: "url('/fb.png')",
                  backgroundSize: "contain",
                  backgroundRepeat: "no-repeat",
                  backgroundPosition: "center"
                }}>
                </div>
                <div className="w-10 h-10  rounded flex items-center justify-center hover:bg-gray-700 transition cursor-pointer"
                style={{
                  backgroundImage: "url('/ig.png')",
                  backgroundSize: "contain",
                  backgroundRepeat: "no-repeat",
                  backgroundPosition: "center"
                }}>
                </div>
                <div className="w-10 h-10 rounded flex items-center justify-center hover:bg-gray-700 transition cursor-pointer"
                style={{
                  backgroundImage: "url('/twt.png')",
                  backgroundSize: "contain",
                  backgroundRepeat: "no-repeat",
                  backgroundPosition: "center"
                }}>
                </div>
              </div>
            </div>

            {/* Right Side - Newsletter */}
            <div>
              <h3 className="text-3xl font-bold mb-2">Get in touch</h3>
              <p className="text-gray-400 mb-6 text-xl">Update news about pollution & industry</p>
              <div className="flex -gap-2">
                <input
                  type="email"
                  placeholder="Your email"
                  className="flex-1 px-4 py-3 rounded-l-xl bg-transparent border border-white/30 text-white placeholder-gray-400 focus:outline-none focus:border-white"
                />
                <button className="bg-green-600 text-white rounded-r-xl px-8 py-3 hover:bg-green-700 transition">
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
