import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { successResponse, errorResponse } from '@/lib/api-response'

// GET all sports
export async function GET() {
  try {
    const sports = await prisma.sport.findMany({
      where: { isActive: true },
      orderBy: { name: 'asc' },
      include: {
        _count: {
          select: { events: true, teams: true }
        }
      }
    })

    return successResponse(sports)
  } catch (error) {
    console.error('Error fetching sports:', error)
    return errorResponse('Failed to fetch sports', 500)
  }
}

// POST create new sport
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, description, icon } = body

    if (!name) {
      return errorResponse('Sport name is required', 400)
    }

    const sport = await prisma.sport.create({
      data: {
        name,
        description,
        icon,
      },
    })

    return successResponse(sport, 'Sport created successfully', 201)
  } catch (error: any) {
    console.error('Error creating sport:', error)
    if (error.code === 'P2002') {
      return errorResponse('Sport with this name already exists', 409)
    }
    return errorResponse('Failed to create sport', 500)
  }
}
