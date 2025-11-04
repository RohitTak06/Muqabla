import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { successResponse, errorResponse, notFoundResponse } from '@/lib/api-response'

// GET single sport
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const sport = await prisma.sport.findUnique({
      where: { id: params.id },
      include: {
        events: {
          take: 10,
          orderBy: { startDate: 'desc' }
        },
        teams: {
          take: 10,
          orderBy: { name: 'asc' }
        }
      }
    })

    if (!sport) {
      return notFoundResponse('Sport not found')
    }

    return successResponse(sport)
  } catch (error) {
    console.error('Error fetching sport:', error)
    return errorResponse('Failed to fetch sport', 500)
  }
}

// PATCH update sport
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const { name, description, icon, isActive } = body

    const sport = await prisma.sport.update({
      where: { id: params.id },
      data: {
        ...(name && { name }),
        ...(description !== undefined && { description }),
        ...(icon !== undefined && { icon }),
        ...(isActive !== undefined && { isActive }),
      },
    })

    return successResponse(sport, 'Sport updated successfully')
  } catch (error: any) {
    console.error('Error updating sport:', error)
    if (error.code === 'P2025') {
      return notFoundResponse('Sport not found')
    }
    return errorResponse('Failed to update sport', 500)
  }
}

// DELETE sport
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.sport.delete({
      where: { id: params.id },
    })

    return successResponse(null, 'Sport deleted successfully')
  } catch (error: any) {
    console.error('Error deleting sport:', error)
    if (error.code === 'P2025') {
      return notFoundResponse('Sport not found')
    }
    return errorResponse('Failed to delete sport', 500)
  }
}
