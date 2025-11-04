import { NextResponse } from 'next/server'

export function successResponse<T>(data: T, message = 'Success', status = 200) {
  return NextResponse.json(
    {
      success: true,
      message,
      data,
    },
    { status }
  )
}

export function errorResponse(message: string, status = 400, errors?: any) {
  return NextResponse.json(
    {
      success: false,
      message,
      errors,
    },
    { status }
  )
}

export function validationError(errors: any) {
  return errorResponse('Validation failed', 422, errors)
}

export function unauthorizedResponse(message = 'Unauthorized') {
  return errorResponse(message, 401)
}

export function notFoundResponse(message = 'Resource not found') {
  return errorResponse(message, 404)
}
