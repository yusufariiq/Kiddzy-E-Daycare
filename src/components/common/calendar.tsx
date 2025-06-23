import React, { useState, useEffect } from 'react'
import { ChevronLeft, ChevronRight, Calendar, Users, Info } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface DateAvailability {
  date: string
  availableSlots: number
  totalCapacity: number
  status: 'available' | 'limited' | 'full' | 'closed'
  bookings: number
}

interface CalendarData {
  providerId: string
  dateRange: {
    start: string
    end: string
  }
  availability: DateAvailability[]
  childrenCount: number
  provider: {
    name: string
    capacity: number
  }
}

interface AvailabilityCalendarProps {
  providerId: string
  childrenCount?: number
  onChildrenCountChange?: (count: number) => void
  className?: string
}

export default function AvailableCalendar({
  providerId,
  childrenCount = 1,
  onChildrenCountChange,
  className = ''
}: AvailabilityCalendarProps) {
  const [calendarData, setCalendarData] = useState<CalendarData | null>(null)
  const [currentDate, setCurrentDate] = useState(new Date())
  const [loading, setLoading] = useState(false)
  const [hoveredDate, setHoveredDate] = useState<string | null>(null)

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ]

  const fetchAvailability = async (year: number, month: number) => {
    setLoading(true)
    try {
      const response = await fetch(
        `/api/providers/${providerId}/availability`
      )
      const result = await response.json()
      
      if (result.success) {
        setCalendarData(result.data)
      }
    } catch (error) {
      console.error('Failed to fetch availability:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAvailability(currentDate.getFullYear(), currentDate.getMonth())
  }, [providerId, currentDate, childrenCount])

  const navigateMonth = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate)
    if (direction === 'prev') {
      newDate.setMonth(newDate.getMonth() - 1)
    } else {
      newDate.setMonth(newDate.getMonth() + 1)
    }
    setCurrentDate(newDate)
  }

  const getDateAvailability = (date: string): DateAvailability | undefined => {
    const availability = calendarData?.availability.find(day => day.date === date)
    if (!availability) return undefined
  
    const yesterday = new Date()
    yesterday.setDate(yesterday.getDate() - 1)
    const yesterdayStr = yesterday.toISOString().split('T')[0]
  
    if (date < yesterdayStr) {
      return {
        ...availability,
        status: 'closed'
      }
    }
  
    return availability
  }   

  const getDateClass = (date: string, dayAvailability?: DateAvailability) => {
    const baseClass = 'h-10 w-10 rounded-lg border-2 transition-all duration-200 flex items-center justify-center text-sm font-medium'
    
    if (!dayAvailability) return `${baseClass} border-gray-200 text-gray-400`

    switch (dayAvailability.status) {
      case 'available':
        return `${baseClass} border-green-300 bg-green-50 text-green-700 hover:bg-green-100`
      case 'limited':
        return `${baseClass} border-yellow-400 bg-yellow-100 text-yellow-800 hover:bg-yellow-200`
      case 'full':
        return `${baseClass} border-red-400 bg-red-100 text-red-700`
      case 'closed':
        return `${baseClass} border-gray-300 bg-gray-100 text-gray-500`
      default:
        return `${baseClass} border-gray-200 text-gray-400`
    }
  }

  const renderCalendarGrid = () => {
    if (!calendarData) return null

    const year = currentDate.getFullYear()
    const month = currentDate.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const startDate = new Date(firstDay)
    startDate.setDate(startDate.getDate() - firstDay.getDay())

    const days = []
    const current = new Date(startDate)

    for (let i = 0; i < 42; i++) {
      const dateStr = current.toISOString().split('T')[0]
      const dayAvailability = getDateAvailability(dateStr)
      const isCurrentMonth = current.getMonth() === month
      const dayNumber = current.getDate()

      days.push(
        <div
          key={dateStr}
          className={`${getDateClass(dateStr, dayAvailability)} ${
            !isCurrentMonth ? 'opacity-30' : ''
          }`}
          onMouseEnter={() => setHoveredDate(dateStr)}
          onMouseLeave={() => setHoveredDate(null)}
        >
          {dayNumber}
        </div>
      )
      current.setDate(current.getDate() + 1)
    }

    return days
  }

  const getTooltipText = (date: string) => {
    const dayAvailability = getDateAvailability(date)
    if (!dayAvailability) return 'No data available'

    const yesterday = new Date()
    yesterday.setDate(yesterday.getDate() - 1)
    const yesterdayStr = yesterday.toISOString().split('T')[0]

    if (date < yesterdayStr) {
        return 'Past date'
    }
  
    switch (dayAvailability.status) {
      case 'available':
        return `${dayAvailability.availableSlots} of ${dayAvailability.totalCapacity} slots available`
      case 'limited':
        return `Only ${dayAvailability.availableSlots} of ${dayAvailability.totalCapacity} slots left`
      case 'full':
        return `Fully booked (${dayAvailability.totalCapacity} capacity)`
      case 'closed':
        return 'Closed'
      default:
        return ''
    }
  }
  

  return (
    <div className={`bg-white rounded-xl border border-gray-200 shadow-sm ${className}`}>
      <div className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Calendar className="h-5 w-5 text-[#FE7743]" />
            <h3 className="text-lg font-semibold text-[#273F4F]">Availability Calendar</h3>
          </div>
          
          {/* Children count selector */}
          <div className="flex items-center gap-3">
            <Users className="h-4 w-4 text-gray-500" />
            <select
              value={childrenCount}
              onChange={(e) => onChildrenCountChange?.(parseInt(e.target.value))}
              className="border border-gray-300 rounded-lg px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-[#FE7743]/20"
            >
              {[1, 2, 3, 4, 5].map(count => (
                <option key={count} value={count}>
                  {count} {count === 1 ? 'Child' : 'Children'}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Calendar Navigation */}
        <div className="flex items-center justify-between mb-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigateMonth('prev')}
            className="text-gray-600 hover:text-[#FE7743]"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          
          <h4 className="text-lg font-semibold text-[#273F4F]">
            {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
          </h4>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigateMonth('next')}
            className="text-gray-600 hover:text-[#FE7743]"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>

        {/* Days of week header */}
        <div className="grid grid-cols-7 gap-1 mb-2">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div key={day} className="h-8 flex items-center justify-center text-sm font-medium text-gray-500">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-1 mb-4 relative">
          {loading ? (
            <div className="col-span-7 flex justify-center py-8">
              <div className="animate-spin rounded-full h-6 w-6 border-2 border-[#FE7743] border-t-transparent"></div>
            </div>
          ) : (
            renderCalendarGrid()
          )}
          
          {/* Tooltip */}
          {hoveredDate && (
            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 bg-gray-800 text-white text-xs rounded px-2 py-1 whitespace-nowrap z-10 pointer-events-none">
              {getTooltipText(hoveredDate)}
            </div>
          )}
        </div>

        {/* Legend */}
        <div className="grid grid-cols-2 gap-4 mb-4 text-xs">
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded bg-green-100 border border-green-300"></div>
            <span className="text-gray-600">Available</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded bg-yellow-100 border border-yellow-400"></div>
            <span className="text-gray-600">Limited</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded bg-red-100 border border-red-400"></div>
            <span className="text-gray-600">Full</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded bg-gray-100 border border-gray-300"></div>
            <span className="text-gray-600">Closed/Past</span>
          </div>
        </div>

        {/* Info message */}
        <div className="flex items-start gap-2 text-xs text-gray-500">
          <Info className="h-3 w-3 mt-0.5 flex-shrink-0" />
          <p>
            View availability for {childrenCount} {childrenCount === 1 ? 'child' : 'children'}. 
            Hover over dates to see detailed capacity information.
            {calendarData && ` Provider capacity: ${calendarData.provider.capacity} children.`}
          </p>
        </div>
      </div>
    </div>
  )
}