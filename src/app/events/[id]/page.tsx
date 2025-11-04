"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import { Calendar, MapPin, Trophy, Users, Clock, DollarSign, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

export default function EventDetailPage() {
  const params = useParams()
  const [event, setEvent] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (params.id) {
      fetchEvent()
    }
  }, [params.id])

  const fetchEvent = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/events/${params.id}`)
      const data = await response.json()
      if (data.success) {
        setEvent(data.data)
      }
    } catch (error) {
      console.error("Error fetching event:", error)
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    })
  }

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-zinc-200 dark:bg-zinc-800 rounded w-1/4"></div>
          <div className="h-64 bg-zinc-200 dark:bg-zinc-800 rounded"></div>
        </div>
      </div>
    )
  }

  if (!event) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-2xl font-bold mb-4">Event not found</h1>
        <Link href="/events">
          <Button>Back to Events</Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Link href="/events">
        <Button variant="ghost" className="mb-4">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Events
        </Button>
      </Link>

      {/* Event Header */}
      <div className="mb-8">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h1 className="text-4xl font-bold mb-2">{event.name}</h1>
            <p className="text-zinc-600 dark:text-zinc-400">
              Organized by {event.organizer.firstName} {event.organizer.lastName}
            </p>
          </div>
          <Badge className="text-lg px-4 py-2">{event.status.replace(/_/g, " ")}</Badge>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center">
                <Trophy className="h-8 w-8 text-blue-600 mr-3" />
                <div>
                  <p className="text-sm text-zinc-600 dark:text-zinc-400">Sport</p>
                  <p className="text-lg font-semibold">{event.sport.name}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center">
                <Calendar className="h-8 w-8 text-green-600 mr-3" />
                <div>
                  <p className="text-sm text-zinc-600 dark:text-zinc-400">Duration</p>
                  <p className="text-lg font-semibold">
                    {formatDate(event.startDate)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center">
                <Users className="h-8 w-8 text-purple-600 mr-3" />
                <div>
                  <p className="text-sm text-zinc-600 dark:text-zinc-400">Teams</p>
                  <p className="text-lg font-semibold">
                    {event.registrations.length} / {event.maxTeams}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center">
                <DollarSign className="h-8 w-8 text-orange-600 mr-3" />
                <div>
                  <p className="text-sm text-zinc-600 dark:text-zinc-400">Entry Fee</p>
                  <p className="text-lg font-semibold">${event.entryFee}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Event Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center">
              <MapPin className="h-5 w-5 mr-3 text-zinc-600" />
              <span>{event.venue}</span>
            </div>
            <div className="flex items-center">
              <Clock className="h-5 w-5 mr-3 text-zinc-600" />
              <span>Registration Deadline: {formatDate(event.registrationDeadline)}</span>
            </div>
            {event.description && (
              <div className="pt-4">
                <h3 className="font-semibold mb-2">Description</h3>
                <p className="text-zinc-600 dark:text-zinc-400">{event.description}</p>
              </div>
            )}
            {event.rules && (
              <div className="pt-4">
                <h3 className="font-semibold mb-2">Rules</h3>
                <p className="text-zinc-600 dark:text-zinc-400 whitespace-pre-line">{event.rules}</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="teams" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="teams">Registered Teams</TabsTrigger>
          <TabsTrigger value="matches">Matches</TabsTrigger>
          <TabsTrigger value="standings">Standings</TabsTrigger>
        </TabsList>

        <TabsContent value="teams">
          <Card>
            <CardHeader>
              <CardTitle>Registered Teams ({event.registrations.length})</CardTitle>
            </CardHeader>
            <CardContent>
              {event.registrations.length === 0 ? (
                <p className="text-center py-8 text-zinc-600 dark:text-zinc-400">
                  No teams registered yet
                </p>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Team Name</TableHead>
                      <TableHead>Members</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Registered</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {event.registrations.map((reg: any) => (
                      <TableRow key={reg.id}>
                        <TableCell className="font-medium">{reg.team.name}</TableCell>
                        <TableCell>{reg.team.members.length}</TableCell>
                        <TableCell>
                          <Badge variant={reg.status === "APPROVED" ? "default" : "secondary"}>
                            {reg.status}
                          </Badge>
                        </TableCell>
                        <TableCell>{formatDate(reg.registeredAt)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="matches">
          <Card>
            <CardHeader>
              <CardTitle>Matches ({event.matches.length})</CardTitle>
            </CardHeader>
            <CardContent>
              {event.matches.length === 0 ? (
                <p className="text-center py-8 text-zinc-600 dark:text-zinc-400">
                  No matches scheduled yet
                </p>
              ) : (
                <div className="space-y-4">
                  {event.matches.map((match: any) => (
                    <Card key={match.id}>
                      <CardContent className="pt-6">
                        <div className="flex justify-between items-center">
                          <div className="flex-1">
                            <p className="font-semibold">{match.homeTeam.name}</p>
                            <p className="text-sm text-zinc-600 dark:text-zinc-400">Home</p>
                          </div>
                          <div className="text-center px-4">
                            <p className="text-2xl font-bold">
                              {match.homeScore} - {match.awayScore}
                            </p>
                            <Badge variant="outline">{match.status}</Badge>
                          </div>
                          <div className="flex-1 text-right">
                            <p className="font-semibold">{match.awayTeam.name}</p>
                            <p className="text-sm text-zinc-600 dark:text-zinc-400">Away</p>
                          </div>
                        </div>
                        <div className="mt-4 text-sm text-zinc-600 dark:text-zinc-400 text-center">
                          <p>{formatDateTime(match.scheduledAt)} • {match.venue}</p>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="standings">
          <Card>
            <CardHeader>
              <CardTitle>Standings</CardTitle>
            </CardHeader>
            <CardContent>
              {event.standings.length === 0 ? (
                <p className="text-center py-8 text-zinc-600 dark:text-zinc-400">
                  Standings will be available once matches begin
                </p>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-12">Pos</TableHead>
                      <TableHead>Team</TableHead>
                      <TableHead className="text-center">P</TableHead>
                      <TableHead className="text-center">W</TableHead>
                      <TableHead className="text-center">D</TableHead>
                      <TableHead className="text-center">L</TableHead>
                      <TableHead className="text-center">GF</TableHead>
                      <TableHead className="text-center">GA</TableHead>
                      <TableHead className="text-center">GD</TableHead>
                      <TableHead className="text-center">Pts</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {event.standings.map((standing: any) => (
                      <TableRow key={standing.id}>
                        <TableCell className="font-bold">{standing.position}</TableCell>
                        <TableCell className="font-medium">{standing.team.name}</TableCell>
                        <TableCell className="text-center">{standing.played}</TableCell>
                        <TableCell className="text-center">{standing.won}</TableCell>
                        <TableCell className="text-center">{standing.drawn}</TableCell>
                        <TableCell className="text-center">{standing.lost}</TableCell>
                        <TableCell className="text-center">{standing.goalsFor}</TableCell>
                        <TableCell className="text-center">{standing.goalsAgainst}</TableCell>
                        <TableCell className="text-center">{standing.goalDifference}</TableCell>
                        <TableCell className="text-center font-bold">{standing.points}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
