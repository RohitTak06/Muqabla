import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { successResponse, errorResponse } from '@/lib/api-response'

// GET all teams
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const sportId = searchParams.get('sportId')
    const search = searchParams.get('search')

    const where: any = { isActive: true }
    if (sportId) where.sportId = sportId
    if (search) {
      where.name = {
        contains: search,
        mode: 'insensitive'
      }
    }

    const teams = await prisma.team.findMany({
      where,
      orderBy: { name: 'asc' },
      include: {
        sport: true,
        members: {
          include: {
            user: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                avatar: true,
              }
            }
          }
        },
        _count: {
          select: {
            registrations: true,
            homeMatches: true,
            awayMatches: true,
          }
        }
      }
    })

    return successResponse(teams)
  } catch (error) {
    console.error('Error fetching teams:', error)
    return errorResponse('Failed to fetch teams', 500)
  }
}

// POST create new team
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, sportId, logo, description, members } = body

    if (!name || !sportId) {
      return errorResponse('Team name and sport are required', 400)
    }

    const team = await prisma.team.create({
      data: {
        name,
        sportId,
        logo,
        description,
        members: members ? {
          create: members.map((member: any) => ({
            userId: member.userId,
            role: member.role || 'PLAYER',
            jerseyNumber: member.jerseyNumber,
            position: member.position,
          }))
        } : undefined
      },
      include: {
        sport: true,
        members: {
          include: {
            user: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                avatar: true,
              }
            }
          }
        }
      }
    })

    return successResponse(team, 'Team created successfully', 201)
  } catch (error: any) {
    console.error('Error creating team:', error)
    return errorResponse('Failed to create team', 500)
  }
}
