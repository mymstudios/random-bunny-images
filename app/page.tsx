'use client'

import { useState, useCallback } from 'react'
import Image from 'next/image'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { ExternalLink } from 'lucide-react'

export default function BunnyGenerator() {
  const [imageUrl, setImageUrl] = useState<string | null>(null)
  const [photographerName, setPhotographerName] = useState<string | null>(null)
  const [photographerUrl, setPhotographerUrl] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchBunnyImage = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    try {
      const response = await fetch(
        `https://api.unsplash.com/photos/random?query=bunny&client_id=${process.env.NEXT_PUBLIC_UNSPLASH_ACCESS_KEY}`
      )
      if (!response.ok) {
        throw new Error('Failed to fetch bunny image')
      }
      const data = await response.json()
      setImageUrl(data.urls.regular)
      setPhotographerName(data.user.name)
      setPhotographerUrl(data.user.links.html)
    } catch (err) {
      setError('Error fetching bunny image. Please try again.')
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }, [])

  return (
    <Card className="w-full mx-auto">
      <CardContent className="flex flex-col items-center p-8 space-y-6">
        <h1 className="text-4xl font-bold mb-4">Random Bunny Image Generator</h1>
        <Button onClick={fetchBunnyImage} disabled={isLoading}>
          {isLoading ? 'Generating...' : 'Generate Bunny Image'}
        </Button>
        {error && <p className="text-red-500">{error}</p>}
        {imageUrl && (
          <div className="relative w-4xl">
            <Image
              src={imageUrl}
              alt="Random bunny"
              width={100}
              height={100}
              sizes="100vw"
              style={{ width: '100%', height: 'auto' }}
              className="rounded-md"
            />
          </div>
        )}
      </CardContent>
      {imageUrl && photographerName && photographerUrl && (
        <CardFooter className="text-sm text-center text-gray-500">
          Photo by{' '}
          <a
            href={photographerUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-blue-600 hover:underline"
          >
            {photographerName}
          </a>{' '}
          on{' '}
          <a
            href="https://unsplash.com"
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-blue-600 hover:underline flex items-center"
          >
            Unsplash
            <ExternalLink className="inline-block w-3 h-3 ml-1" />
          </a>
        </CardFooter>
      )}
    </Card>
  )
}