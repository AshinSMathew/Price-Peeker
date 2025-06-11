"use client"

import type React from "react"

import { useState } from "react"
import { Search, ShoppingCart, ExternalLink, TrendingDown, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface ApiResponse {
  product_name: string
  amazon_url: string
  flipkart_url: string
  amazon_price: number
  flipkart_price: number
  cheaper_platform: string
  message: string | null
  error: string | null
}

export default function PriceComparison() {
  const [searchQuery, setSearchQuery] = useState("")
  const [results, setResults] = useState<ApiResponse | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!searchQuery.trim()) return

    setLoading(true)
    setError(null)
    setResults(null)

    try {
      const response = await fetch(`https://price-peek-api.vercel.app/compare/${encodeURIComponent(searchQuery)}`)
      const data: ApiResponse = await response.json()

      if (data.error) {
        setError(data.error)
      } else {
        setResults(data)
      }
    } catch (err) {
      setError("Network error. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const formatPrice = (price: number) => {
    return `₹${price.toLocaleString("en-IN")}`
  }

  const getSavings = () => {
    if (!results) return 0
    return Math.abs(results.amazon_price - results.flipkart_price)
  }

  const bestDeal = results?.cheaper_platform

  return (
    <div className="max-w-6xl mx-auto">
      {/* Search Section */}
      <Card className="mb-8 shadow-lg border-0 bg-white/80 backdrop-blur-sm">
        <CardContent className="p-6">
          <form onSubmit={handleSearch} className="flex gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                type="text"
                placeholder="Enter product details (e.g., iPhone 15 Pro Max 256GB Natural Titanium, Samsung Galaxy S24 Ultra 512GB Phantom Black, Sony WH-1000XM5 Wireless Headphones)"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 h-12 text-base border-gray-200 focus:border-emerald-500 focus:ring-emerald-500"
              />
            </div>
            <Button
              type="submit"
              disabled={loading || !searchQuery.trim()}
              className="h-12 px-8 bg-emerald-600 hover:bg-emerald-700 text-white font-medium"
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Searching...
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Search className="w-4 h-4" />
                  Compare Prices
                </div>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Error Alert */}
      {error && (
        <Alert className="mb-6 border-red-200 bg-red-50">
          <AlertCircle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-800">{error}</AlertDescription>
        </Alert>
      )}

      {/* Best Deal Banner */}
      {results && (
        <Card className="mb-6 border-emerald-200 bg-emerald-50">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-emerald-800">
              <TrendingDown className="w-5 h-5" />
              <span className="font-semibold">Best Deal:</span>
              <span>
                {results.cheaper_platform} -{" "}
                {formatPrice(results.cheaper_platform === "Amazon" ? results.amazon_price : results.flipkart_price)}
              </span>
              <Badge variant="secondary" className="bg-emerald-100 text-emerald-800">
                Save ₹{getSavings().toLocaleString("en-IN")}
              </Badge>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Results Grid */}
      {results && (
        <div className="grid md:grid-cols-2 gap-6">
          {/* Amazon Card */}
          <Card
            className={`shadow-lg hover:shadow-xl transition-shadow duration-300 ${
              results.cheaper_platform === "Amazon" ? "ring-2 ring-emerald-500 bg-emerald-50/30" : "bg-white"
            }`}
          >
            <CardHeader className="pb-4">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-lg flex items-center justify-center text-white font-bold bg-orange-500">
                    A
                  </div>
                  <div>
                    <CardTitle className="text-lg font-semibold text-gray-900">Amazon</CardTitle>
                    <Badge variant="default" className="mt-1">
                      In Stock
                    </Badge>
                  </div>
                </div>
                {results.cheaper_platform === "Amazon" && (
                  <Badge className="bg-emerald-600 text-white">Best Price</Badge>
                )}
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <div className="text-2xl font-bold text-gray-900">{formatPrice(results.amazon_price)}</div>
                  {results.cheaper_platform === "Amazon" && (
                    <Badge variant="secondary" className="bg-emerald-100 text-emerald-800">
                      Cheapest Option
                    </Badge>
                  )}
                </div>
              </div>

              <Button asChild className="w-full bg-orange-500 hover:bg-orange-600 text-white">
                <a
                  href={results.amazon_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2"
                >
                  <ShoppingCart className="w-4 h-4" />
                  View on Amazon
                  <ExternalLink className="w-4 h-4" />
                </a>
              </Button>
            </CardContent>
          </Card>

          {/* Flipkart Card */}
          <Card
            className={`shadow-lg hover:shadow-xl transition-shadow duration-300 ${
              results.cheaper_platform === "Flipkart" ? "ring-2 ring-emerald-500 bg-emerald-50/30" : "bg-white"
            }`}
          >
            <CardHeader className="pb-4">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-lg flex items-center justify-center text-white font-bold bg-blue-600">
                    F
                  </div>
                  <div>
                    <CardTitle className="text-lg font-semibold text-gray-900">Flipkart</CardTitle>
                    <Badge variant="default" className="mt-1">
                      In Stock
                    </Badge>
                  </div>
                </div>
                {results.cheaper_platform === "Flipkart" && (
                  <Badge className="bg-emerald-600 text-white">Best Price</Badge>
                )}
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <div className="text-2xl font-bold text-gray-900">{formatPrice(results.flipkart_price)}</div>
                  {results.cheaper_platform === "Flipkart" && (
                    <Badge variant="secondary" className="bg-emerald-100 text-emerald-800">
                      Cheapest Option
                    </Badge>
                  )}
                </div>
              </div>

              <Button asChild className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                <a
                  href={results.flipkart_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2"
                >
                  <ShoppingCart className="w-4 h-4" />
                  View on Flipkart
                  <ExternalLink className="w-4 h-4" />
                </a>
              </Button>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Empty State */}
      {!loading && !results && !error && (
        <Card className="text-center py-12 bg-white/80 backdrop-blur-sm">
          <CardContent>
            <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
              <Search className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Ready to find the best deals?</h3>
            <p className="text-gray-600">Enter a product name above to compare prices across Amazon and Flipkart</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
