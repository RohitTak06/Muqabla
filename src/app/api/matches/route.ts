import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { successResponse, errorResponse } from '@/lib/api-response'

// GET all matches
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const eventId = searchParams.get('eventId')
    const status = searchParams.get('status')
    const teamId = searchParams.get('teamId')

    const where: any = {}
    if (eventId) where.eventId = eventId
    if (status) where.status = status
    if (teamId) {
      where.OR = [
        { homeTeamId: teamId },
        { awayTeamId: teamId }
      ]
    }

    const matches = await prisma.match.findMany({
      where,
      orderBy: { scheduledAt: 'asc' },
      include: {
        event: {
          select: {
            id: true,
            name: true,
            sport: true,
          }
        },
        homeTeam: true,
        awayTeam: true,
        referee: {
          include: {
            user: {
              select: {
                firstName: true,
                lastName: true,
              }
            }
          }
        },
        _count: {
          select: {
            scorecards: true,
            statistics: true,
          }
        }
      }
    })

    return successResponse(matches)
  } catch (error) {
    console.error('Error fetching matches:', error)
    return errorResponse('Failed to fetch matches', 500)
  }
}

// POST create new match
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      eventId,
      homeTeamId,
      awayTeamId,
      refereeId,
      venue,
      scheduledAt,
      round,
      matchNumber,
      notes,
    } = body

    if (!eventId || !homeTeamId || !awayTeamId || !venue || !scheduledAt) {
      return errorResponse('Missing required fields', 400)
    }

    if (homeTeamId === awayTeamId) {
      return errorResponse('Home team and away team cannot be the same', 400)
    }

    const match = await prisma.match.create({
      data: {
        eventId,
        homeTeamId,
        awayTeamId,
        refereeId,
        venue,
        scheduledAt: new Date(scheduledAt),
        round,
        matchNumber,
        notes,
        status: 'SCHEDULED',
      },
      include: {
        event: {
          select: {
            id: true,
            name: true,
            sport: true,
          }
        },
        homeTeam: true,
        awayTeam: true,
        referee: {
          include: {
            user: {
              select: {
                firstName: true,
                lastName: true,
              }
            }
          }
        }
      }
    })

    return successResponse(match, 'Match created successfully', 201)
  } catch (error: any) {
    console.error('Error creating match:', error)
    return errorResponse('Failed to create match', 500)
  }
}
