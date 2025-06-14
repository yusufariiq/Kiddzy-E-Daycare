"use client"

import { useState, useEffect } from "react"
import { X, Clock, ArrowRight} from "lucide-react"
import { Button } from "../ui/button"

interface ClosedFacilityModalProps {
    isOpen: boolean
    onClose: () => void
    providerName: string
    operationalStatus: {
      message: string
      nextOpeningTime?: string
    }
    onRedirect: () => void
}

export default function CLosedFacilityModal ({
    isOpen, 
    onClose, 
    providerName, 
    operationalStatus,
    onRedirect
}: ClosedFacilityModalProps){
    const [countdown, setCountdown] = useState(10)

    useEffect(() => {
        if (!isOpen) return

        const timer = setInterval(() => {
        setCountdown((prev) => {
            if (prev <= 1) {
            clearInterval(timer)
            onRedirect()
            return 0
            }
            return prev - 1
        })
        }, 1000)

        return () => clearInterval(timer)
    }, [isOpen, onRedirect])

    if (!isOpen) return null

    return (
        <div className="min-h-full fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl max-w-md w-full p-6 relative">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
                >
                    <X className="h-5 w-5" />
                </button>

                <div className="text-center">
                    <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
                        <Clock className="h-8 w-8 text-red-600" />
                    </div>

                    <h2 className="text-xl font-bold text-gray-900 mb-2">
                        Facility Currently Closed
                    </h2>

                    <p className="text-gray-600 mb-1">
                        <strong>{providerName}</strong> is currently closed.
                    </p>

                    <p className="text-sm text-gray-500 mb-6">
                        {operationalStatus.message}
                    </p>

                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                        <p className="text-sm text-yellow-800">
                        <strong>Note:</strong> Bookings can only be made during operational hours. 
                        {operationalStatus.nextOpeningTime && 
                            ` Please try again when we open ${operationalStatus.nextOpeningTime}.`
                        }
                        </p>
                    </div>

                    <div className="space-y-3">
                        <Button
                            onClick={onRedirect}
                            className="w-full bg-[#FE7743] hover:bg-[#e56a3a] text-white flex items-center justify-center gap-2"
                        >
                            Return to Provider Page
                            <ArrowRight className="h-4 w-4" />
                        </Button>

                        <p className="text-xs text-gray-400">
                            Redirecting automatically in {countdown} seconds...
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}
