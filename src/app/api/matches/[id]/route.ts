import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { successResponse, errorResponse, notFoundResponse } from '@/lib/api-response'

// GET single match
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const match = await prisma.match.findUnique({
      where: { id: params.id },
      include: {
        event: {
          include: {
            sport: true,
          }
        },
        homeTeam: {
          include: {
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
        },
        awayTeam: {
          include: {
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
        },
        referee: {
          include: {
            user: {
              select: {
                firstName: true,
                lastName: true,
                avatar: true,
              }
            }
          }
        },
        scorecards: {
          orderBy: { timestamp: 'asc' },
          include: {
            user: {
              select: {
                firstName: true,
                lastName: true,
              }
            }
          }
        },
        statistics: {
          include: {
            player: {
              include: {
                user: {
                  select: {
                    firstName: true,
                    lastName: true,
                    avatar: true,
                  }
                }
              }
            }
          }
        }
      }
    })

    if (!match) {
      return notFoundResponse('Match not found')
    }

    return successResponse(match)
  } catch (error) {
    console.error('Error fetching match:', error)
    return errorResponse('Failed to fetch match', 500)
  }
}

// PATCH update match
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const updateData: any = {}

    const allowedFields = [
      'venue', 'scheduledAt', 'startedAt', 'endedAt', 'status',
      'homeScore', 'awayScore', 'round', 'matchNumber', 'notes', 'refereeId'
    ]

    for (const field of allowedFields) {
      if (body[field] !== undefined) {
        if (['scheduledAt', 'startedAt', 'endedAt'].includes(field) && body[field]) {
          updateData[field] = new Date(body[field])
        } else {
          updateData[field] = body[field]
        }
      }
    }

    const match = await prisma.match.update({
      where: { id: params.id },
      data: updateData,
      include: {
        event: true,
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

    return successResponse(match, 'Match updated successfully')
  } catch (error: any) {
    console.error('Error updating match:', error)
    if (error.code === 'P2025') {
      return notFoundResponse('Match not found')
    }
    return errorResponse('Failed to update match', 500)
  }
}

// DELETE match
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.match.delete({
      where: { id: params.id },
    })

    return successResponse(null, 'Match deleted successfully')
  } catch (error: any) {
    console.error('Error deleting match:', error)
    if (error.code === 'P2025') {
      return notFoundResponse('Match not found')
    }
    return errorResponse('Failed to delete match', 500)
  }
}
