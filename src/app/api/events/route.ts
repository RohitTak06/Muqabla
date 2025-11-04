import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { successResponse, errorResponse } from '@/lib/api-response'

// GET all events
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const sportId = searchParams.get('sportId')
    const status = searchParams.get('status')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const skip = (page - 1) * limit

    const where: any = {}
    if (sportId) where.sportId = sportId
    if (status) where.status = status

    const [events, total] = await Promise.all([
      prisma.event.findMany({
        where,
        skip,
        take: limit,
        orderBy: { startDate: 'desc' },
        include: {
          sport: true,
          organizer: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
            }
          },
          _count: {
            select: {
              registrations: true,
              matches: true,
            }
          }
        }
      }),
      prisma.event.count({ where })
    ])

    return successResponse({
      events,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    })
  } catch (error) {
    console.error('Error fetching events:', error)
    return errorResponse('Failed to fetch events', 500)
  }
}

// POST create new event
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      name,
      description,
      sportId,
      organizerId,
      venue,
      startDate,
      endDate,
      registrationDeadline,
      maxTeams,
      minTeamsPerMatch,
      maxTeamsPerMatch,
      entryFee,
      prizePool,
      rules,
      banner,
      isPublic,
    } = body

    // Validation
    if (!name || !sportId || !organizerId || !venue || !startDate || !endDate || !registrationDeadline || !maxTeams) {
      return errorResponse('Missing required fields', 400)
    }

    const event = await prisma.event.create({
      data: {
        name,
        description,
        sportId,
        organizerId,
        venue,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        registrationDeadline: new Date(registrationDeadline),
        maxTeams,
        minTeamsPerMatch: minTeamsPerMatch || 2,
        maxTeamsPerMatch: maxTeamsPerMatch || 2,
        entryFee: entryFee || 0,
        prizePool,
        rules,
        banner,
        isPublic: isPublic !== undefined ? isPublic : true,
        status: 'REGISTRATION_OPEN',
      },
      include: {
        sport: true,
        organizer: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          }
        }
      }
    })

    return successResponse(event, 'Event created successfully', 201)
  } catch (error: any) {
    console.error('Error creating event:', error)
    return errorResponse('Failed to create event', 500)
  }
}
