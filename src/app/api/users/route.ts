import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { hashPassword } from '@/lib/auth'
import { successResponse, errorResponse } from '@/lib/api-response'

// GET all users
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const role = searchParams.get('role')
    const search = searchParams.get('search')

    const where: any = { isActive: true }
    if (role) where.role = role
    if (search) {
      where.OR = [
        { firstName: { contains: search, mode: 'insensitive' } },
        { lastName: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
        { username: { contains: search, mode: 'insensitive' } },
      ]
    }

    const users = await prisma.user.findMany({
      where,
      select: {
        id: true,
        email: true,
        username: true,
        firstName: true,
        lastName: true,
        phone: true,
        role: true,
        avatar: true,
        isActive: true,
        createdAt: true,
        _count: {
          select: {
            organizedEvents: true,
            teamMemberships: true,
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    })

    return successResponse(users)
  } catch (error) {
    console.error('Error fetching users:', error)
    return errorResponse('Failed to fetch users', 500)
  }
}

// POST create new user
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, username, password, firstName, lastName, phone, role, avatar } = body

    if (!email || !username || !password || !firstName || !lastName) {
      return errorResponse('Missing required fields', 400)
    }

    const hashedPassword = await hashPassword(password)

    const user = await prisma.user.create({
      data: {
        email,
        username,
        password: hashedPassword,
        firstName,
        lastName,
        phone,
        role: role || 'USER',
        avatar,
      },
      select: {
        id: true,
        email: true,
        username: true,
        firstName: true,
        lastName: true,
        phone: true,
        role: true,
        avatar: true,
        createdAt: true,
      }
    })

    return successResponse(user, 'User created successfully', 201)
  } catch (error: any) {
    console.error('Error creating user:', error)
    if (error.code === 'P2002') {
      const field = error.meta?.target?.[0]
      return errorResponse(`User with this ${field} already exists`, 409)
    }
    return errorResponse('Failed to create user', 500)
  }
}
