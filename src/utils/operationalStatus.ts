import { OperationalStatus } from "@/lib/types/operationalStatus"

export const isCurrentlyOpen = (operatingHours: any[]): boolean => {
    const now = new Date()
    const currentDay = now.toLocaleDateString('en-US', { weekday: 'long' })
    const currentTime = now.toLocaleTimeString('en-US', { 
        hour12: false, 
        hour: '2-digit', 
        minute: '2-digit' 
    })

    const todaySchedule = operatingHours.find(
        schedule => schedule.day.toLowerCase() === currentDay.toLocaleLowerCase()
    )

    if (!todaySchedule || todaySchedule.open === "CLOSED" || todaySchedule.close === "CLOSED") {
        return false
    }

    return currentTime >= todaySchedule.open && currentTime <= todaySchedule.close
}

export const getOperationalStatus = (operatingHours: any[]): OperationalStatus => {
    const now = new Date()
    const currentDay = now.toLocaleDateString('en-US', { weekday: 'long' })
    
    const todaySchedule = operatingHours.find(
      schedule => schedule.day.toLowerCase() === currentDay.toLowerCase()
    )
  
    if (!todaySchedule || todaySchedule.open === "CLOSED") {
      const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
      const currentDayIndex = daysOfWeek.indexOf(currentDay)
      
      for (let i = 1; i <= 7; i++) {
        const nextDayIndex = (currentDayIndex + i) % 7
        const nextDay = daysOfWeek[nextDayIndex]
        const nextSchedule = operatingHours.find(
          schedule => schedule.day.toLowerCase() === nextDay.toLowerCase()
        )
        
        if (nextSchedule && nextSchedule.open !== "CLOSED") {
          return {
            isOpen: false,
            message: `Closed today • Opens ${nextDay} at ${nextSchedule.open}`,
            status: 'closed',
            nextOpeningTime: `${nextDay} at ${nextSchedule.open}`
          }
        }
      }
      
      return {
        isOpen: false,
        message: 'Currently closed',
        status: 'closed'
      }
    }
  
    const currentTime = now.toLocaleTimeString('en-US', { 
      hour12: false, 
      hour: '2-digit', 
      minute: '2-digit' 
    })
  
    const isOpen = currentTime >= todaySchedule.open && currentTime <= todaySchedule.close
  
    if (isOpen) {
      return {
        isOpen: true,
        message: `Open now • Closes at ${todaySchedule.close}`,
        status: 'open'
      }
    } else if (currentTime < todaySchedule.open) {
      return {
        isOpen: false,
        message: `Closed • Opens today at ${todaySchedule.open}`,
        status: 'closed',
        nextOpeningTime: `today at ${todaySchedule.open}`
      }
    } else {
        const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
        const currentDayIndex = daysOfWeek.indexOf(currentDay)
        
        for (let i = 1; i <= 7; i++) {
            const nextDayIndex = (currentDayIndex + i) % 7
            const nextDay = daysOfWeek[nextDayIndex]
            const nextSchedule = operatingHours.find(
            schedule => schedule.day.toLowerCase() === nextDay.toLowerCase()
            )
            
            if (nextSchedule && nextSchedule.open !== "CLOSED") {
            return {
                isOpen: false,
                message: `Closed • Opens ${nextDay} at ${nextSchedule.open}`,
                status: 'closed',
                nextOpeningTime: `${nextDay} at ${nextSchedule.open}`
            }
            }
        }
        
        return {
            isOpen: false,
            message: 'Currently closed',
            status: 'closed'
        }
    }
}