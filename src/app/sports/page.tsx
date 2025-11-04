"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Trophy, Users, Calendar } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

interface Sport {
  id: string
  name: string
  description: string | null
  icon: string | null
  _count: {
    events: number
    teams: number
  }
}

export default function SportsPage() {
  const [sports, setSports] = useState<Sport[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchSports()
  }, [])

  const fetchSports = async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/sports")
      const data = await response.json()
      if (data.success) {
        setSports(data.data)
      }
    } catch (error) {
      console.error("Error fetching sports:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Sports</h1>
        <p className="text-zinc-600 dark:text-zinc-400">
          Explore different sports and their events
        </p>
      </div>

      {loading ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader>
                <div className="h-6 bg-zinc-200 dark:bg-zinc-800 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-zinc-200 dark:bg-zinc-800 rounded w-1/2"></div>
              </CardHeader>
            </Card>
          ))}
        </div>
      ) : sports.length === 0 ? (
        <Card className="p-12 text-center">
          <Trophy className="h-16 w-16 mx-auto mb-4 text-zinc-400" />
          <h3 className="text-xl font-semibold mb-2">No sports available</h3>
          <p className="text-zinc-600 dark:text-zinc-400">
            Sports will be added soon!
          </p>
        </Card>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {sports.map((sport) => (
            <Card key={sport.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center gap-3 mb-2">
                  {sport.icon ? (
                    <div className="text-4xl">{sport.icon}</div>
                  ) : (
                    <Trophy className="h-10 w-10 text-blue-600" />
                  )}
                  <div>
                    <CardTitle className="text-xl">{sport.name}</CardTitle>
                  </div>
                </div>
                {sport.description && (
                  <CardDescription className="line-clamp-2">
                    {sport.description}
                  </CardDescription>
                )}
              </CardHeader>
              <CardContent>
                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-sm">
                    <Calendar className="h-4 w-4 mr-2 text-zinc-600" />
                    <span>{sport._count.events} events</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <Users className="h-4 w-4 mr-2 text-zinc-600" />
                    <span>{sport._count.teams} teams</span>
                  </div>
                </div>
                <Link href={`/events?sportId=${sport.id}`}>
                  <Button className="w-full" variant="outline">
                    View Events
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
