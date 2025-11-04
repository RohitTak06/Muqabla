import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { successResponse, errorResponse, notFoundResponse } from '@/lib/api-response'

// GET single team
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const team = await prisma.team.findUnique({
      where: { id: params.id },
      include: {
        sport: true,
        members: {
          include: {
            user: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
                avatar: true,
                playerProfile: true,
              }
            }
          },
          orderBy: { joinedAt: 'asc' }
        },
        registrations: {
          include: {
            event: {
              select: {
                id: true,
                name: true,
                startDate: true,
                endDate: true,
                status: true,
              }
            }
          }
        },
        homeMatches: {
          take: 5,
          orderBy: { scheduledAt: 'desc' },
          include: {
            awayTeam: true,
            event: {
              select: {
                name: true,
              }
            }
          }
        },
        awayMatches: {
          take: 5,
          orderBy: { scheduledAt: 'desc' },
          include: {
            homeTeam: true,
            event: {
              select: {
                name: true,
              }
            }
          }
        }
      }
    })

    if (!team) {
      return notFoundResponse('Team not found')
    }

    return successResponse(team)
  } catch (error) {
    console.error('Error fetching team:', error)
    return errorResponse('Failed to fetch team', 500)
  }
}

// PATCH update team
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const { name, logo, description, isActive } = body

    const team = await prisma.team.update({
      where: { id: params.id },
      data: {
        ...(name && { name }),
        ...(logo !== undefined && { logo }),
        ...(description !== undefined && { description }),
        ...(isActive !== undefined && { isActive }),
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

    return successResponse(team, 'Team updated successfully')
  } catch (error: any) {
    console.error('Error updating team:', error)
    if (error.code === 'P2025') {
      return notFoundResponse('Team not found')
    }
    return errorResponse('Failed to update team', 500)
  }
}

// DELETE team
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.team.delete({
      where: { id: params.id },
    })

    return successResponse(null, 'Team deleted successfully')
  } catch (error: any) {
    console.error('Error deleting team:', error)
    if (error.code === 'P2025') {
      return notFoundResponse('Team not found')
    }
    return errorResponse('Failed to delete team', 500)
  }
}
