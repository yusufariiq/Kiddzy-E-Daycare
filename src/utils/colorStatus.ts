export const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return "bg-green-100 text-green-800"
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "active":
        return "bg-blue-100 text-blue-800"
      case "completed":
        return "bg-gray-100 text-gray-800"
      case "cancelled":
        return "bg-red-100 text-red-800"  
      default:
        return "bg-gray-100 text-gray-800"
    }
}

export const getRowBackgroundColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return "bg-green-50/30 hover:bg-green-50"
      case "pending":
        return "bg-yellow-50/30 hover:bg-yellow-50"
      case "active":
        return "bg-blue-50/30 hover:bg-blue-50"
      case "completed":
        return "bg-gray-50/30 hover:bg-gray-50"
      case "cancelled":
        return "bg-red-50/30 hover:bg-red-50"
      default:
        return "hover:bg-gray-50"
    }
  }