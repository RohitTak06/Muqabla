"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Calendar, MapPin, Trophy, Users, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface Event {
  id: string
  name: string
  description: string
  venue: string
  startDate: string
  endDate: string
  status: string
  maxTeams: number
  entryFee: number
  sport: {
    name: string
  }
  organizer: {
    firstName: string
    lastName: string
  }
  _count: {
    registrations: number
    matches: number
  }
}

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState<string>("all")

  useEffect(() => {
    fetchEvents()
  }, [statusFilter])

  const fetchEvents = async () => {
    try {
      setLoading(true)
      const url = statusFilter === "all" 
        ? "/api/events" 
        : `/api/events?status=${statusFilter}`
      const response = await fetch(url)
      const data = await response.json()
      if (data.success) {
        setEvents(data.data.events)
      }
    } catch (error) {
      console.error("Error fetching events:", error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      UPCOMING: "bg-blue-500",
      REGISTRATION_OPEN: "bg-green-500",
      REGISTRATION_CLOSED: "bg-yellow-500",
      ONGOING: "bg-purple-500",
      COMPLETED: "bg-gray-500",
      CANCELLED: "bg-red-500",
    }
    return colors[status] || "bg-gray-500"
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-4xl font-bold mb-2">Sports Events</h1>
          <p className="text-zinc-600 dark:text-zinc-400">
            Browse and register for upcoming tournaments and competitions
          </p>
        </div>
        <Link href="/events/create">
          <Button size="lg">
            <Plus className="mr-2 h-5 w-5" />
            Create Event
          </Button>
        </Link>
      </div>

      {/* Filters */}
      <div className="mb-6">
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Events</SelectItem>
            <SelectItem value="UPCOMING">Upcoming</SelectItem>
            <SelectItem value="REGISTRATION_OPEN">Registration Open</SelectItem>
            <SelectItem value="ONGOING">Ongoing</SelectItem>
            <SelectItem value="COMPLETED">Completed</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Events Grid */}
      {loading ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader>
                <div className="h-6 bg-zinc-200 dark:bg-zinc-800 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-zinc-200 dark:bg-zinc-800 rounded w-1/2"></div>
              </CardHeader>
              <CardContent>
                <div className="h-20 bg-zinc-200 dark:bg-zinc-800 rounded"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : events.length === 0 ? (
        <Card className="p-12 text-center">
          <Trophy className="h-16 w-16 mx-auto mb-4 text-zinc-400" />
          <h3 className="text-xl font-semibold mb-2">No events found</h3>
          <p className="text-zinc-600 dark:text-zinc-400 mb-4">
            Be the first to create an event!
          </p>
          <Link href="/events/create">
            <Button>Create Event</Button>
          </Link>
        </Card>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((event) => (
            <Card key={event.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start mb-2">
                  <Badge className={getStatusColor(event.status)}>
                    {event.status.replace(/_/g, " ")}
                  </Badge>
                  <Badge variant="outline">{event.sport.name}</Badge>
                </div>
                <CardTitle className="text-xl">{event.name}</CardTitle>
                <CardDescription className="line-clamp-2">
                  {event.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex items-center text-sm text-zinc-600 dark:text-zinc-400">
                  <Calendar className="h-4 w-4 mr-2" />
                  {formatDate(event.startDate)} - {formatDate(event.endDate)}
                </div>
                <div className="flex items-center text-sm text-zinc-600 dark:text-zinc-400">
                  <MapPin className="h-4 w-4 mr-2" />
                  {event.venue}
                </div>
                <div className="flex items-center text-sm text-zinc-600 dark:text-zinc-400">
                  <Users className="h-4 w-4 mr-2" />
                  {event._count.registrations} / {event.maxTeams} teams
                </div>
                <div className="flex items-center text-sm font-semibold">
                  <Trophy className="h-4 w-4 mr-2" />
                  Entry Fee: ${event.entryFee}
                </div>
              </CardContent>
              <CardFooter>
                <Link href={`/events/${event.id}`} className="w-full">
                  <Button className="w-full">View Details</Button>
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
