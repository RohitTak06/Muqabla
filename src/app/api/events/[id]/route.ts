import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { successResponse, errorResponse, notFoundResponse } from '@/lib/api-response'

// GET single event
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const event = await prisma.event.findUnique({
      where: { id: params.id },
      include: {
        sport: true,
        organizer: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            avatar: true,
          }
        },
        registrations: {
          include: {
            team: {
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
            }
          }
        },
        matches: {
          orderBy: { scheduledAt: 'asc' },
          include: {
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
        },
        standings: {
          orderBy: { position: 'asc' },
          include: {
            team: true
          }
        }
      }
    })

    if (!event) {
      return notFoundResponse('Event not found')
    }

    return successResponse(event)
  } catch (error) {
    console.error('Error fetching event:', error)
    return errorResponse('Failed to fetch event', 500)
  }
}

// PATCH update event
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const updateData: any = {}

    // Only update fields that are provided
    const allowedFields = [
      'name', 'description', 'venue', 'startDate', 'endDate',
      'registrationDeadline', 'maxTeams', 'minTeamsPerMatch',
      'maxTeamsPerMatch', 'entryFee', 'prizePool', 'status',
      'rules', 'banner', 'isPublic'
    ]

    for (const field of allowedFields) {
      if (body[field] !== undefined) {
        if (['startDate', 'endDate', 'registrationDeadline'].includes(field)) {
          updateData[field] = new Date(body[field])
        } else {
          updateData[field] = body[field]
        }
      }
    }

    const event = await prisma.event.update({
      where: { id: params.id },
      data: updateData,
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

    return successResponse(event, 'Event updated successfully')
  } catch (error: any) {
    console.error('Error updating event:', error)
    if (error.code === 'P2025') {
      return notFoundResponse('Event not found')
    }
    return errorResponse('Failed to update event', 500)
  }
}

// DELETE event
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.event.delete({
      where: { id: params.id },
    })

    return successResponse(null, 'Event deleted successfully')
  } catch (error: any) {
    console.error('Error deleting event:', error)
    if (error.code === 'P2025') {
      return notFoundResponse('Event not found')
    }
    return errorResponse('Failed to delete event', 500)
  }
}
