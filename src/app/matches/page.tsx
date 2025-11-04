"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Trophy, Calendar, MapPin, Clock } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface Match {
  id: string
  homeTeam: {
    name: string
    logo: string | null
  }
  awayTeam: {
    name: string
    logo: string | null
  }
  homeScore: number
  awayScore: number
  status: string
  scheduledAt: string
  venue: string
  event: {
    name: string
    sport: {
      name: string
    }
  }
}

export default function MatchesPage() {
  const [matches, setMatches] = useState<Match[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<string>("all")

  useEffect(() => {
    fetchMatches()
  }, [filter])

  const fetchMatches = async () => {
    try {
      setLoading(true)
      const url = filter === "all" ? "/api/matches" : `/api/matches?status=${filter}`
      const response = await fetch(url)
      const data = await response.json()
      if (data.success) {
        setMatches(data.data)
      }
    } catch (error) {
      console.error("Error fetching matches:", error)
    } finally {
      setLoading(false)
    }
  }

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      SCHEDULED: "bg-blue-500",
      LIVE: "bg-green-500 animate-pulse",
      COMPLETED: "bg-gray-500",
      POSTPONED: "bg-yellow-500",
      CANCELLED: "bg-red-500",
    }
    return colors[status] || "bg-gray-500"
  }

  const renderMatches = (matchList: Match[]) => {
    if (matchList.length === 0) {
      return (
        <div className="text-center py-12">
          <Trophy className="h-16 w-16 mx-auto mb-4 text-zinc-400" />
          <p className="text-zinc-600 dark:text-zinc-400">No matches found</p>
        </div>
      )
    }

    return (
      <div className="space-y-4">
        {matchList.map((match) => (
          <Link key={match.id} href={`/matches/${match.id}`}>
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader>
                <div className="flex justify-between items-center mb-2">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">{match.event.sport.name}</Badge>
                    <span className="text-sm text-zinc-600 dark:text-zinc-400">
                      {match.event.name}
                    </span>
                  </div>
                  <Badge className={getStatusColor(match.status)}>
                    {match.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-4 items-center mb-4">
                  {/* Home Team */}
                  <div className="text-right">
                    <p className="font-semibold text-lg">{match.homeTeam.name}</p>
                    <p className="text-sm text-zinc-600 dark:text-zinc-400">Home</p>
                  </div>

                  {/* Score */}
                  <div className="text-center">
                    <div className="text-3xl font-bold">
                      {match.homeScore} - {match.awayScore}
                    </div>
                  </div>

                  {/* Away Team */}
                  <div className="text-left">
                    <p className="font-semibold text-lg">{match.awayTeam.name}</p>
                    <p className="text-sm text-zinc-600 dark:text-zinc-400">Away</p>
                  </div>
                </div>

                <div className="flex justify-center gap-4 text-sm text-zinc-600 dark:text-zinc-400">
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-1" />
                    {formatDateTime(match.scheduledAt)}
                  </div>
                  <div className="flex items-center">
                    <MapPin className="h-4 w-4 mr-1" />
                    {match.venue}
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Matches</h1>
        <p className="text-zinc-600 dark:text-zinc-400">
          View live and upcoming matches
        </p>
      </div>

      <Tabs value={filter} onValueChange={setFilter} className="w-full">
        <TabsList className="grid w-full grid-cols-4 mb-6">
          <TabsTrigger value="all">All Matches</TabsTrigger>
          <TabsTrigger value="LIVE">Live</TabsTrigger>
          <TabsTrigger value="SCHEDULED">Upcoming</TabsTrigger>
          <TabsTrigger value="COMPLETED">Completed</TabsTrigger>
        </TabsList>

        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="animate-pulse">
                <CardContent className="pt-6">
                  <div className="h-24 bg-zinc-200 dark:bg-zinc-800 rounded"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <>
            <TabsContent value="all">{renderMatches(matches)}</TabsContent>
            <TabsContent value="LIVE">
              {renderMatches(matches.filter((m) => m.status === "LIVE"))}
            </TabsContent>
            <TabsContent value="SCHEDULED">
              {renderMatches(matches.filter((m) => m.status === "SCHEDULED"))}
            </TabsContent>
            <TabsContent value="COMPLETED">
              {renderMatches(matches.filter((m) => m.status === "COMPLETED"))}
            </TabsContent>
          </>
        )}
      </Tabs>
    </div>
  )
}
