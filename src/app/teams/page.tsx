"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Users, Plus, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface Team {
  id: string
  name: string
  logo: string | null
  description: string | null
  sport: {
    name: string
  }
  members: Array<{
    user: {
      firstName: string
      lastName: string
      avatar: string | null
    }
  }>
  _count: {
    registrations: number
    homeMatches: number
    awayMatches: number
  }
}

export default function TeamsPage() {
  const [teams, setTeams] = useState<Team[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")

  useEffect(() => {
    fetchTeams()
  }, [])

  const fetchTeams = async () => {
    try {
      setLoading(true)
      const url = search ? `/api/teams?search=${search}` : "/api/teams"
      const response = await fetch(url)
      const data = await response.json()
      if (data.success) {
        setTeams(data.data)
      }
    } catch (error) {
      console.error("Error fetching teams:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = () => {
    fetchTeams()
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-4xl font-bold mb-2">Teams</h1>
          <p className="text-zinc-600 dark:text-zinc-400">
            Browse teams and view their rosters
          </p>
        </div>
        <Link href="/teams/create">
          <Button size="lg">
            <Plus className="mr-2 h-5 w-5" />
            Create Team
          </Button>
        </Link>
      </div>

      {/* Search */}
      <div className="mb-6 flex gap-2">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-zinc-400" />
          <Input
            placeholder="Search teams..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSearch()}
            className="pl-10"
          />
        </div>
        <Button onClick={handleSearch}>Search</Button>
      </div>

      {/* Teams Grid */}
      {loading ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader>
                <div className="h-6 bg-zinc-200 dark:bg-zinc-800 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-zinc-200 dark:bg-zinc-800 rounded w-1/2"></div>
              </CardHeader>
            </Card>
          ))}
        </div>
      ) : teams.length === 0 ? (
        <Card className="p-12 text-center">
          <Users className="h-16 w-16 mx-auto mb-4 text-zinc-400" />
          <h3 className="text-xl font-semibold mb-2">No teams found</h3>
          <p className="text-zinc-600 dark:text-zinc-400 mb-4">
            Create your first team to get started!
          </p>
          <Link href="/teams/create">
            <Button>Create Team</Button>
          </Link>
        </Card>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {teams.map((team) => (
            <Card key={team.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center gap-3 mb-2">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={team.logo || undefined} />
                    <AvatarFallback>{team.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle className="text-xl">{team.name}</CardTitle>
                    <CardDescription>{team.sport.name}</CardDescription>
                  </div>
                </div>
                {team.description && (
                  <CardDescription className="line-clamp-2 mt-2">
                    {team.description}
                  </CardDescription>
                )}
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center text-sm">
                    <Users className="h-4 w-4 mr-2 text-zinc-600" />
                    <span>{team.members.length} members</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <span className="text-zinc-600 dark:text-zinc-400">
                      {team._count.homeMatches + team._count.awayMatches} matches played
                    </span>
                  </div>
                </div>
                
                {/* Team Members Preview */}
                {team.members.length > 0 && (
                  <div className="mt-4">
                    <p className="text-sm font-medium mb-2">Members</p>
                    <div className="flex -space-x-2">
                      {team.members.slice(0, 5).map((member, idx) => (
                        <Avatar key={idx} className="h-8 w-8 border-2 border-white dark:border-zinc-900">
                          <AvatarImage src={member.user.avatar || undefined} />
                          <AvatarFallback className="text-xs">
                            {member.user.firstName[0]}{member.user.lastName[0]}
                          </AvatarFallback>
                        </Avatar>
                      ))}
                      {team.members.length > 5 && (
                        <div className="h-8 w-8 rounded-full bg-zinc-200 dark:bg-zinc-800 border-2 border-white dark:border-zinc-900 flex items-center justify-center text-xs font-medium">
                          +{team.members.length - 5}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </CardContent>
              <CardFooter>
                <Link href={`/teams/${team.id}`} className="w-full">
                  <Button className="w-full">View Team</Button>
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
