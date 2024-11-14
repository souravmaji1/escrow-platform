'use client'

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowRight, CheckCircle, Lock, RefreshCcw, ShieldCheck, Star, ArrowDownToLine, Zap, Globe, Coins, Users, Code, PieChart, ChevronRight } from "lucide-react"
import Link from "next/link"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useState, useEffect } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { Roboto_Slab, Poppins, Merriweather } from 'next/font/google'
import Image from "next/image"

const robotoSlab = Roboto_Slab({
  subsets: ['latin'],
  display: 'swap',
})

const poppins = Poppins({
  weight: ['400', '600', '700'],
  subsets: ['latin'],
  display: 'swap',
})

const merriweather = Merriweather({
  weight: ['300', '400', '700'],
  subsets: ['latin'],
  display: 'swap',
})


const data = [
  { name: 'Jan', value: 400 },
  { name: 'Feb', value: 300 },
  { name: 'Mar', value: 600 },
  { name: 'Apr', value: 800 },
  { name: 'May', value: 1500 },
  { name: 'Jun', value: 2000 },
];

export default function Web3EscrowLanding() {
  const [scrollY, setScrollY] = useState(0)
  const [activeTab, setActiveTab] = useState("overview")

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY)
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <div className="flex flex-col min-h-screen bg-black text-green-400">
      <header className="px-4 lg:px-6 h-20 flex items-center fixed w-full z-50 bg-black/95 backdrop-blur supports-[backdrop-filter]:bg-black/60 border-b border-green-900">
      <Link className="flex items-center justify-center" href="/">
          <Image
            src="/logo.png"
            alt="EasyTransact Logo"
            width={32}
            height={32}
            className="mr-2"
          />
          <span className={`font-bold text-xl bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-green-600 ${poppins.className}`}>EasyTransact</span>
        </Link>
        <nav className="ml-auto flex gap-4 sm:gap-6">
          {["How It Works", "Features", "Testimonials", "Pricing", "FAQ"].map((item) => (
            <Link key={item} className="text-sm font-medium hover:text-green-500 transition-colors relative group" href={`#${item.toLowerCase().replace(/\s+/g, '-')}`}>
              {item}
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-green-500 transition-all group-hover:w-full"></span>
            </Link>
          ))}
        </nav>
        <Button className="ml-4 bg-green-600 text-black hover:bg-green-500 transition-all duration-300" size="sm">
          Get Started
        </Button>
      </header>
      <ScrollArea className="flex-grow pt-20">
        <main className="flex-1">
          <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 overflow-hidden relative">
            <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:50px_50px]" style={{ backgroundImage: 'radial-gradient(circle, #22c55e 1px, transparent 1px)' }}></div>
            <div className="container px-4 md:px-6 relative">
              <div className="flex flex-col items-center space-y-4 text-center">
                <div className="space-y-2 max-w-3xl mx-auto">
                  <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl/none animate-fade-up bg-clip-text text-transparent bg-gradient-to-r from-green-400 via-green-500 to-green-600">
                    Secure. Decentralized. Escrow.
                  </h1>
                  <p className="mx-auto max-w-[700px] text-green-300 md:text-xl lg:text-2xl animate-fade-up animation-delay-1">
                    Experience the future of trustless transactions with blockchain-powered smart contracts.
                  </p>
                </div>
                <div className="space-x-4   animate-fade-up animation-delay-2">
                  <Link href='/escrow'>
                    <Button className="bg-green-600 text-black hover:bg-green-500 transition-all duration-300 transform hover:scale-105" size="lg">
                      Launch App
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                  <Button variant="outline" size="lg" className="border-green-500 text-green-400 hover:bg-green-900/30 transition-all duration-300 transform hover:scale-105">
                    Watch Demo
                    <ArrowDownToLine className="ml-2 h-4 w-4" />
                  </Button>
                </div>


             


              </div>
            </div>
            <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-black to-transparent"></div>
          </section>
          
          <section id="how-it-works" className="w-full py-12 md:py-24 lg:py-32 relative overflow-hidden bg-green-900/10">
            <div className="container px-4 md:px-6 relative z-10">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-center mb-12 animate-fade-up text-green-400">
                How EasyTransact Works
              </h2>
              <div className="grid gap-6 lg:grid-cols-3 lg:gap-12">
                {[
                  { icon: Lock, title: "Lock Assets", description: "Securely lock agreed amount into our audited smart contract." },
                  { icon: RefreshCcw, title: "Fulfill Agreement", description: "Complete the deal with confidence, funds held securely." },
                  { icon: CheckCircle, title: "Instant Execution", description: "Smart contract automatically releases funds upon approval." }
                ].map((item, index) => (
                  <Card key={index} className="relative overflow-hidden group bg-black/50 backdrop-blur-sm hover:shadow-xl transition-all duration-300 transform hover:scale-105 animate-fade-up border-green-900" style={{animationDelay: `${index * 150}ms`}}>
                    <CardContent className="flex flex-col items-center space-y-4 p-6">
                      <div className="absolute inset-0 bg-gradient-to-br from-green-900/20 to-green-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      <item.icon className="h-12 w-12 text-green-500 group-hover:animate-bounce" />
                      <h3 className="text-xl font-bold text-green-400">{item.title}</h3>
                      <p className="text-center text-green-300">{item.description}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
            <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:60px_60px]" ></div>
          </section>
          
          <section id="features" className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-br from-green-900 to-black text-green-100 relative overflow-hidden">
            <div className="container px-4 md:px-6 relative z-10">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-center mb-12 animate-fade-up text-green-300">
                Why EasyTransact Leads the Way
              </h2>
              <Tabs defaultValue="overview" className="w-full" onValueChange={setActiveTab}>
                <TabsList className="grid w-full grid-cols-4 bg-green-950 rounded-lg p-1">
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="security">Security</TabsTrigger>
                  <TabsTrigger value="scalability">Scalability</TabsTrigger>
                  <TabsTrigger value="integration">Integration</TabsTrigger>
                </TabsList>
                <TabsContent value="overview" className="mt-6">
                  <div className="grid gap-6 lg:grid-cols-2 lg:gap-12">
                    {[
                      { icon: ShieldCheck, title: "Unbreakable Security", description: "Military-grade encryption and multi-sig technology safeguard your assets." },
                      { icon: Zap, title: "Lightning-Fast Execution", description: "Experience near-instant transactions with our optimized smart contracts." },
                      { icon: Globe, title: "Global Accessibility", description: "Conduct secure transactions with anyone, anywhere in the world, 24/7." },
                      { icon: Coins, title: "Multi-Chain Support", description: "Seamlessly operate across major blockchain networks for maximum flexibility." }
                    ].map((item, index) => (
                      <div key={index} className="flex items-start space-x-4 bg-green-950 p-6 rounded-lg transition-all duration-300 hover:shadow-lg hover:bg-green-900 animate-fade-up" style={{animationDelay: `${index * 150}ms`}}>
                        <item.icon className="h-8 w-8 text-green-400 shrink-0" />
                        <div>
                          <h3 className="text-xl font-bold mb-2 text-green-300">{item.title}</h3>
                          <p className="text-green-200">{item.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </TabsContent>
                <TabsContent value="security" className="mt-6">
                  <Card className="bg-green-950 border-green-800">
                    <CardContent className="p-6">
                      <h3 className="text-2xl font-bold mb-4 text-green-300">Enterprise-Grade Security</h3>
                      <ul className="space-y-2">
                        <li className="flex items-center"><CheckCircle className="h-5 w-5 mr-2 text-green-500" /> Multi-signature wallets</li>
                        <li className="flex items-center"><CheckCircle className="h-5 w-5 mr-2 text-green-500" /> Regular security audits</li>
                        <li className="flex items-center"><CheckCircle className="h-5 w-5 mr-2 text-green-500" /> Hardware Security Modules (HSMs)</li>
                        <li className="flex items-center"><CheckCircle className="h-5 w-5 mr-2 text-green-500" /> 24/7 monitoring and incident response</li>
                      </ul>
                    </CardContent>
                  </Card>
                </TabsContent>
                <TabsContent value="scalability" className="mt-6">
                  <Card className="bg-green-950 border-green-800">
                    <CardContent className="p-6">
                      <h3 className="text-2xl font-bold mb-4 text-green-300">Built for Scale</h3>
                      <p className="mb-4">Our infrastructure is designed to handle millions of transactions per second, ensuring your escrow services never slow down.</p>
                      <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={data}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#22543d" />
                          <XAxis dataKey="name" stroke="#4ade80" />
                          <YAxis stroke="#4ade80" />
                          <Tooltip contentStyle={{ backgroundColor: '#064e3b', border: 'none' }} />
                          <Line type="monotone" dataKey="value" stroke="#22c55e" strokeWidth={2} />
                        </LineChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>
                </TabsContent>
                <TabsContent value="integration" className="mt-6">
                  <Card className="bg-green-950 border-green-800">
                    <CardContent className="p-6">
                      <h3 className="text-2xl font-bold mb-4 text-green-300">Seamless Integration</h3>
                      <p className="mb-4">Integrate EasyTransact into your existing systems with our comprehensive API and SDK.</p>
                      <div className="bg-black rounded-lg p-4">
                        <code className="text-green-400">
                          {`import EasyTransact from 'crypto-escrow-sdk';

const escrow = new EasyTransact({
  apiKey: 'YOUR_API_KEY',
  network: 'ethereum'
});

const transaction = await escrow.createTransaction({
  amount: '1.5 ETH',
  seller: '0x...',
  buyer: '0x...'
});`}
                        </code>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
            <div className="absolute inset-0 bg-grid-white/[0.05] bg-[size:40px_40px]" style={{ backgroundImage: 'radial-gradient(circle, #22c55e 1px, transparent 1px)', transform: `translateY(${scrollY * -0.1}px)` }}></div>
          </section>
          
          <section id="testimonials" className="w-full py-12 md:py-24 lg:py-32 relative overflow-hidden bg-green-900/10">
            <div className="container px-4 md:px-6 relative z-10">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-center mb-12 animate-fade-up text-green-400">
                Trusted by Industry Leaders
              </h2>
              <div className="grid gap-6 lg:grid-cols-3 lg:gap-12">
                {[
                  { quote: "EasyTransact has transformed how we handle high-value NFT trades. It's the gold standard for security in Web3.", author: "CryptoWhale.eth", role: "NFT Marketplace Founder", avatar: "/api/placeholder/40" },
                  { quote: "As a DeFi architect, I'm impressed by the elegant smart contract design. It's a cornerstone for trustless finance.", author: "0xDev.eth", role: "Lead Blockchain Developer, DeFi Protocol", avatar: "/api/placeholder/40" },
                  { quote: "The cross-chain capabilities are a game-changer. We've used it for international business deals with total peace of mind.", author: "GlobalTrader", role: "CEO, Crypto Exchange", avatar: "/api/placeholder/40" }
                ].map((item, index) => (
                  <Card key={index} className="bg-black/50 backdrop-blur supports-[backdrop-filter]:bg-black/30 hover:shadow-xl transition-all duration-300 group animate-fade-up border-green-900" style={{animationDelay: `${index * 150}ms`}}>
                    <CardContent className="flex flex-col items-center space-y-4 p-6">
                      <div className="flex items-center space-x-4">
                     
                        <div>
                          <p className="font-semibold text-green-400">{item.author}</p>
                          <p className="text-sm text-green-500">{item.role}</p>
                        </div>
                      </div>
                      <Star className="h-8 w-8 text-yellow-500 group-hover:animate-spin" />
                      <p className="text-center italic text-green-300">{item.quote}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
            <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:30px_30px]" style={{ backgroundImage: 'radial-gradient(circle, #22c55e 1px, transparent 1px)', transform: `translateY(${scrollY * 0.05}px)` }}></div>
          </section>
          
          <section id="pricing" className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-br from-black to-green-900 text-green-100 relative overflow-hidden">
            <div className="container px-4 md:px-6 relative z-10">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-center mb-12 animate-fade-up text-green-300">
                Transparent Pricing for Every Need
              </h2>
              <div className="grid gap-6 lg:grid-cols-3 lg:gap-12">
                {[
                  { title: "Starter", price: "$99/month", features: ["Up to 100 transactions", "Basic API access", "Email support", "Multi-sig wallets"] },
                  { title: "Pro", price: "$299/month", features: ["Unlimited transactions", "Full API access", "24/7 phone support", "Custom smart contracts", "Priority execution"] },
                  { title: "Enterprise", price: "Custom", features: ["Tailored solutions", "Dedicated account manager", "Custom integrations", "On-chain analytics", "Compliance assistance"] }
                ].map((plan, index) => (
                  <Card key={index} className={`relative overflow-hidden group animate-fade-up ${index === 1 ? 'bg-green-800 border-green-600' : 'bg-black/50 border-green-900'}`} style={{animationDelay: `${index * 150}ms`}}>
                    <CardContent className="flex flex-col items-center space-y-4 p-6">
                      <h3 className="text-2xl font-bold text-green-400">{plan.title}</h3>
                      <p className="text-3xl font-bold text-green-300">{plan.price}</p>
                      <ul className="space-y-2 text-left w-full">
                        {plan.features.map((feature, i) => (
                          <li key={i} className="flex items-center">
                            <CheckCircle className="h-5 w-5 mr-2 text-green-500" />
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>
                      <Button className={`w-full ${index === 1 ? 'bg-green-600 hover:bg-green-500' : 'bg-green-700 hover:bg-green-600'} text-black transition-all duration-300`}>
                        Choose Plan
                      </Button>
                    </CardContent>
                    {index === 1 && <div className="absolute top-0 right-0 bg-green-600 text-black px-2 py-1 text-sm font-bold">Most Popular</div>}
                  </Card>
                ))}
              </div>
            </div>
          </section>

          <section id="faq" className="w-full py-12 md:py-24 lg:py-32 bg-green-900/10 relative overflow-hidden">
            <div className="container px-4 md:px-6 relative z-10">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-center mb-12 animate-fade-up text-green-400">
                Frequently Asked Questions
              </h2>
              <div className="grid gap-6 lg:grid-cols-2 lg:gap-12">
                {[
                  { question: "How does EasyTransact ensure security?", answer: "We use military-grade encryption, multi-sig wallets, and regular security audits to ensure the highest level of protection for your assets." },
                  { question: "Which blockchains do you support?", answer: "We currently support Ethereum, Binance Smart Chain, Polygon, and Solana, with more chains coming soon." },
                  { question: "How quickly are transactions processed?", answer: "Most transactions are processed within seconds, depending on the blockchain's current load." },
                  { question: "Can I integrate EasyTransact into my own platform?", answer: "Yes, we offer a comprehensive API and SDK for seamless integration into your existing systems." }
                ].map((item, index) => (
                  <Card key={index} className="bg-black/50 backdrop-blur supports-[backdrop-filter]:bg-black/30 hover:shadow-xl transition-all duration-300 group animate-fade-up border-green-900" style={{animationDelay: `${index * 150}ms`}}>
                    <CardContent className="p-6">
                      <h3 className="text-xl font-bold mb-2 text-green-400">{item.question}</h3>
                      <p className="text-green-300">{item.answer}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </section>
          
          <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-br from-green-900 to-green-700 text-black relative overflow-hidden">
            <div className="container px-4 md:px-6 relative z-10">
              <div className="flex flex-col items-center space-y-4 text-center">
                <div className="space-y-2">
                  <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl animate-fade-up text-green-100">
                    Ready to Revolutionize Your Crypto Transactions?
                  </h2>
                  <p className="mx-auto max-w-[700px] md:text-xl animate-fade-up animation-delay-1 text-green-200">
                    Join thousands of crypto enthusiasts and businesses who trust EasyTransact for secure, decentralized transactions.
                  </p>
                </div>
                <Button className="bg-black text-green-400 hover:bg-green-950 transition-all duration-300 transform hover:scale-105 animate-fade-up animation-delay-2" size="lg">
                  Get Started Now
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>
            <div className="absolute inset-0 bg-grid-white/[0.05] bg-[size:20px_20px]" ></div>
          </section>
        </main>
      </ScrollArea>
      <footer className="w-full py-6 bg-black/80 backdrop-blur supports-[backdrop-filter]:bg-black/60 border-t border-green-900">
        <div className="container px-4 md:px-6 flex flex-col md:flex-row justify-between items-center">
          <div className="flex flex-col items-center md:items-start">
            <Link className="flex items-center justify-center" href="/">
              <ShieldCheck className="h-6 w-6 mr-2 text-green-500" />
              <span className="font-bold text-lg bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-green-600">EasyTransact</span>
            </Link>
            <p className="mt-2 text-sm text-green-500">© 2024 EasyTransact. All rights reserved.</p>
          </div>
          <nav className="flex flex-wrap justify-center md:justify-end gap-4 sm:gap-6 mt-4 md:mt-0">
            <Link className="text-sm hover:text-green-400 transition-colors text-green-500" href="#">Terms</Link>
            <Link className="text-sm hover:text-green-400 transition-colors text-green-500" href="#">Privacy</Link>
            <Link className="text-sm hover:text-green-400 transition-colors text-green-500" href="#">Docs</Link>
            <Link className="text-sm hover:text-green-400 transition-colors text-green-500" href="#">Blog</Link>
            <Link className="text-sm hover:text-green-400 transition-colors text-green-500" href="#">Careers</Link>
          </nav>
        </div>
      </footer>
    </div>
  )
}