import { NextRequest, NextResponse } from 'next/server'
import { BookingRepository } from '@/lib/repositories/booking.repository'
import { ProviderRepository } from '@/lib/repositories/provider.repostiroy'
import connectDB from '@/config/db'

type Context = {
  params: { id: string }
}

export async function GET(
  request: NextRequest,
  context: Context,
) {
  try {
    await connectDB()

    const { id } = await context.params
    const searchParams = request.nextUrl.searchParams
    const year = parseInt(searchParams.get('year') || new Date().getFullYear().toString())
    const month = parseInt(searchParams.get('month') || new Date().getMonth().toString())
    const childrenCount = parseInt(searchParams.get('childrenCount') || '1')
    
    // Validate parameters
    if (isNaN(year) || isNaN(month) || month < 0 || month > 11) {
      return NextResponse.json(
        { error: 'Invalid year or month parameter' },
        { status: 400 }
      )
    }

    const bookingRepository = new BookingRepository()
    const providerRepository = new ProviderRepository()
    
    // Get provider details
    const provider = await providerRepository.findById(id)
    if (!provider || !provider.availability || !provider.isActive) {
      return NextResponse.json(
        { error: 'Provider not available' },
        { status: 400 }
      )
    }

    // Get monthly availability
    const calendarData = await bookingRepository.getMonthlyAvailability(
      id,
      year,
      month,
      provider.capacity,
      provider.operatingHours
    )

    // Adjust availability based on children count
    const adjustedAvailability = calendarData.availability.map(day => ({
      ...day,
      availableForRequest: day.status !== 'closed' && day.availableSlots >= childrenCount,
      insufficientCapacity: day.status !== 'closed' && day.availableSlots < childrenCount && day.availableSlots > 0
    }))

    return NextResponse.json({
      success: true,
      data: {
        ...calendarData,
        availability: adjustedAvailability,
        childrenCount,
        provider: {
          name: provider.name,
          capacity: provider.capacity
        }
      }
    })
    
  } catch (error) {
    console.error('Calendar availability error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch calendar availability' },
      { status: 500 }
    )
  }
}

// For checking specific date range availability
export async function POST(
  request: NextRequest,
  context: Context
) {
  try {
    await connectDB()

    const { id } = await context.params
    const { startDate, endDate, childrenCount = 1 } = await request.json()
    
    if (!startDate || !endDate) {
      return NextResponse.json(
        { error: 'Start date and end date are required' },
        { status: 400 }
      )
    }

    const bookingRepository = new BookingRepository()
    const providerRepository = new ProviderRepository()
    
    // Get provider details
    const provider = await providerRepository.findById(id)
    if (!provider || !provider.availability || !provider.isActive) {
      return NextResponse.json(
        { error: 'Provider not available' },
        { status: 400 }
      )
    }

    // Check availability for the date range
    const availabilityCheck = await bookingRepository.checkMultipleChildrenAvailability(
      id,
      new Date(startDate),
      new Date(endDate),
      childrenCount,
      provider.capacity,
      provider.operatingHours
    )

    // Get detailed availability for each date
    const detailedAvailability = await bookingRepository.getDateRangeAvailability(
      id,
      new Date(startDate),
      new Date(endDate),
      provider.capacity,
      provider.operatingHours
    )

    return NextResponse.json({
      success: true,
      data: {
        available: availabilityCheck.available,
        unavailableDates: availabilityCheck.unavailableDates,
        reason: availabilityCheck.reason,
        dailyAvailability: detailedAvailability,
        childrenCount,
        dateRange: {
          start: startDate,
          end: endDate
        }
      }
    })
    
  } catch (error) {
    console.error('Date range availability error:', error)
    return NextResponse.json(
      { error: 'Failed to check date range availability' },
      { status: 500 }
    )
  }
}