import Link from "next/link";
import { Trophy, Calendar, Users, Award } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-50 to-white dark:from-zinc-950 dark:to-zinc-900">
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center space-y-6">
          <h1 className="text-6xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Muqabla
          </h1>
          <p className="text-2xl text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto">
            Your Ultimate Sports Management Platform
          </p>
          <p className="text-lg text-zinc-500 dark:text-zinc-500 max-w-xl mx-auto">
            Organize tournaments, manage teams, track matches, and celebrate victories all in one place.
          </p>
          <div className="flex gap-4 justify-center pt-4">
            <Link href="/events">
              <Button size="lg" className="text-lg">
                <Trophy className="mr-2 h-5 w-5" />
                Browse Events
              </Button>
            </Link>
            <Link href="/events/create">
              <Button size="lg" variant="outline" className="text-lg">
                <Calendar className="mr-2 h-5 w-5" />
                Create Event
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center mb-12">Why Choose Muqabla?</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader>
              <Trophy className="h-10 w-10 text-blue-600 mb-2" />
              <CardTitle>Event Management</CardTitle>
              <CardDescription>
                Create and manage sports events with ease. Set up tournaments, leagues, and competitions.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <Users className="h-10 w-10 text-green-600 mb-2" />
              <CardTitle>Team Organization</CardTitle>
              <CardDescription>
                Build and manage teams, track player statistics, and organize team rosters effortlessly.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <Calendar className="h-10 w-10 text-purple-600 mb-2" />
              <CardTitle>Match Scheduling</CardTitle>
              <CardDescription>
                Schedule matches, assign referees, and keep everyone updated with real-time notifications.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <Award className="h-10 w-10 text-orange-600 mb-2" />
              <CardTitle>Live Scoring</CardTitle>
              <CardDescription>
                Track live scores, maintain standings, and generate comprehensive match statistics.
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </section>

      {/* Quick Links Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-12 text-white text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-lg mb-8 opacity-90">
            Join thousands of sports enthusiasts managing their events with Muqabla
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link href="/sports">
              <Button size="lg" variant="secondary">
                View Sports
              </Button>
            </Link>
            <Link href="/teams">
              <Button size="lg" variant="secondary">
                Browse Teams
              </Button>
            </Link>
            <Link href="/matches">
              <Button size="lg" variant="secondary">
                Live Matches
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
