import PriceComparison from "@/components/price-comparison"

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Price<span className="text-emerald-600">Peek</span>
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Compare prices across Amazon and Flipkart to find the best deals on your favorite products
          </p>
        </div>
        <PriceComparison />
      </div>
    </main>
  )
}
