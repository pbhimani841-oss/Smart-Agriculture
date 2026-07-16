import React from 'react';
import { Link } from 'react-router-dom';
import { Sprout, Tractor, HandCoins, Store, ShieldCheck, Leaf } from 'lucide-react';

const Home = () => {
    return (
        <div className="flex flex-col min-h-screen font-sans">
            {/* Hero Section */}
            <section className="relative bg-gradient-to-r from-green-800 to-green-600 text-white py-24 mb-12 rounded-xl shadow-lg overflow-hidden mx-4 mt-6">
              {/* Subtle abstract background pattern */}
              <div className="absolute inset-0 opacity-5 pointer-events-none">
                <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                  <polygon fill="currentColor" points="0,100 100,0 100,100" />
                </svg>
              </div>

              {/* Glass‑morphism content wrapper */}
              <div className="relative z-10 container mx-auto px-6 text-center backdrop-blur-sm bg-black/30 rounded-lg py-12">
                <h1 className="text-5xl md:text-6xl font-extrabold mb-6 tracking-tight drop-shadow-md animate-fade-in-up">
                  Empowering <span className="text-green-300">Agriculture</span>
                  <br className="hidden md:block" /> Connect Directly.
                </h1>
                <p className="text-lg md:text-xl text-green-100 mb-10 max-w-2xl mx-auto leading-relaxed animate-fade-in-up delay-150">
                  A transparent, secure, and modern digital marketplace bridging the gap between local farmers and quality‑conscious customers.
                </p>
                <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-6 animate-fade-in-up delay-300">
                  <Link
                    to="/signup/farmer"
                    className="bg-green-700 hover:bg-green-800 text-white font-bold text-lg py-3 px-8 rounded-lg shadow-md hover:shadow-xl transition-all duration-300 ease-out flex items-center justify-center focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                    aria-label="Join as Farmer"
                  >
                    <Tractor className="mr-2" size={24} /> Join as Farmer
                  </Link>
                  <Link
                    to="/signup/customer"
                    className="bg-transparent border-2 border-white text-white font-bold text-lg py-3 px-8 rounded-lg shadow-md hover:bg-white/10 hover:shadow-xl transition-all duration-300 ease-out flex items-center justify-center focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                    aria-label="Join as Customer"
                  >
                    <Store className="mr-2" size={24} /> Join as Customer
                  </Link>
                </div>
              </div>
            </section>

            {/* Core Features */}
            <section className="container mx-auto px-6 py-16">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">Why Choose Our Portal?</h2>
                    <div className="w-24 h-1 bg-green-500 mx-auto rounded-full"></div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                    <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 hover-lift text-center group">
                        <div className="w-16 h-16 bg-green-50 text-[#16A34A] rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-[#16A34A] group-hover:text-white transition-colors duration-300">
                            <HandCoins size={32} />
                        </div>
                        <h3 className="text-xl font-bold text-gray-800 mb-3">Fair Market Prices</h3>
                        <p className="text-gray-600 leading-relaxed">
                            Farmers get true value for their hard work by cutting out the middlemen, while customers pay a fair price for fresh produce.
                        </p>
                    </div>

                    <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 hover-lift text-center group">
                        <div className="w-16 h-16 bg-green-50 text-[#16A34A] rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-[#16A34A] group-hover:text-white transition-colors duration-300">
                            <Leaf size={32} />
                        </div>
                        <h3 className="text-xl font-bold text-gray-800 mb-3">Fresh & Organic</h3>
                        <p className="text-gray-600 leading-relaxed">
                            Source local, organic, and farm-fresh crops directly from the fields to your dining table. Guaranteeing quality and health.
                        </p>
                    </div>

                    <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 hover-lift text-center group">
                        <div className="w-16 h-16 bg-green-50 text-[#16A34A] rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-[#16A34A] group-hover:text-white transition-colors duration-300">
                            <ShieldCheck size={32} />
                        </div>
                        <h3 className="text-xl font-bold text-gray-800 mb-3">Secure Transactions</h3>
                        <p className="text-gray-600 leading-relaxed">
                            Our platform ensures verified buyer-seller relationships and transparent communication to foster trust in every exchange.
                        </p>
                    </div>
                </div>
            </section>

            {/* How it Works Section */}
            <section className="bg-gray-50 py-20 mt-8 rounded-3xl mx-4 mb-16">
                <div className="container mx-auto px-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                        <div className="space-y-8">
                            <h2 className="text-3xl md:text-4xl font-bold text-gray-800">Cultivating a Better Future</h2>
                            <p className="text-lg text-gray-600 leading-relaxed">
                                We believe that technology can revolutionize traditional agriculture. Our portal serves as a digital bridge, empowering small and large scale farmers to showcase their agricultural yield to a broader market efficiently.
                            </p>
                            <ul className="space-y-4">
                                <li className="flex items-start">
                                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-green-500 flex items-center justify-center text-white mt-1 text-sm font-bold">✓</div>
                                    <p className="ml-3 text-gray-700">Easy registration and profile creation for farmers.</p>
                                </li>
                                <li className="flex items-start">
                                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-green-500 flex items-center justify-center text-white mt-1 text-sm font-bold">✓</div>
                                    <p className="ml-3 text-gray-700">Direct communication with no hidden fees.</p>
                                </li>
                                <li className="flex items-start">
                                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-green-500 flex items-center justify-center text-white mt-1 text-sm font-bold">✓</div>
                                    <p className="ml-3 text-gray-700">Dedicated support via our Query system.</p>
                                </li>
                            </ul>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <div className="bg-white p-6 rounded-xl shadow-sm hover-lift border-t-4 border-[#16A34A] transform lg:translate-y-8">
                                <Sprout className="text-[#16A34A] mb-4" size={40} />
                                <h4 className="font-bold text-gray-800 text-lg mb-2">Grow</h4>
                                <p className="text-gray-600 text-sm">Farmers focus on cultivating high-quality crops.</p>
                            </div>
                            <div className="bg-white p-6 rounded-xl shadow-sm hover-lift border-t-4 border-[#16A34A]">
                                <Tractor className="text-[#16A34A] mb-4" size={40} />
                                <h4 className="font-bold text-gray-800 text-lg mb-2">Connect</h4>
                                <p className="text-gray-600 text-sm">List products and meet interested direct buyers.</p>
                            </div>
                            <div className="bg-white p-6 rounded-xl shadow-sm hover-lift border-t-4 border-[#16A34A] transform lg:translate-y-8">
                                <Store className="text-[#16A34A] mb-4" size={40} />
                                <h4 className="font-bold text-gray-800 text-lg mb-2">Sell</h4>
                                <p className="text-gray-600 text-sm">Complete transactions securely and efficiently.</p>
                            </div>
                            <div className="bg-white p-6 rounded-xl shadow-sm hover-lift border-t-4 border-[#16A34A]">
                                <HandCoins className="text-[#16A34A] mb-4" size={40} />
                                <h4 className="font-bold text-gray-800 text-lg mb-2">Prosper</h4>
                                <p className="text-gray-600 text-sm">Boost economic growth for local communities.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Home;
