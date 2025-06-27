"use client"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowRight, Glasses, Sparkles } from "lucide-react"
import Link from "next/link"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#FFFFFF] flex items-center justify-center p-4">
      <div className="max-w-4xl mx-auto text-center">
        <div className="mb-8">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-4">
            VerveAR <span className="text-orange-500">Demos</span>
          </h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Glasses Demo A */}
          <Card className="hover:shadow-lg transition-shadow duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-lg mb-4 mx-auto">
                <Glasses className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Glasses Demo A</h3>
              <Link href="/glassesdemoa">
                <Button className="w-full">
                  View Demo
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Glasses Demo B */}
          <Card className="hover:shadow-lg transition-shadow duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-center w-12 h-12 bg-green-100 rounded-lg mb-4 mx-auto">
                <Glasses className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Glasses Demo B</h3>
              <Link href="/glassesdemob">
                <Button className="w-full bg-transparent" variant="outline">
                  View Demo
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Glasses Demo C */}
          <Card className="hover:shadow-lg transition-shadow duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-center w-12 h-12 bg-purple-100 rounded-lg mb-4 mx-auto">
                <Glasses className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Glasses Demo C</h3>
              <Link href="/glassesdemoc">
                <Button className="w-full bg-transparent" variant="outline">
                  View Demo
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Single Glasses Demo B */}
          <Card className="hover:shadow-lg transition-shadow duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-center w-12 h-12 bg-orange-100 rounded-lg mb-4 mx-auto">
                <Glasses className="w-6 h-6 text-orange-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Single Product Demo</h3>
              <Link href="/singleglassesdemob">
                <Button className="w-full bg-transparent" variant="outline">
                  View Demo
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Webpage Demo */}
          <Card className="hover:shadow-lg transition-shadow duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-center w-12 h-12 bg-yellow-100 rounded-lg mb-4 mx-auto">
                <Sparkles className="w-6 h-6 text-yellow-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Webpage Demo</h3>
              <Link href="/webdemo">
                <Button className="w-full bg-transparent" variant="outline">
                  View Demo
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
