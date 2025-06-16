"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Smartphone, Building, CreditCard } from "lucide-react"
import LoadingSpinner from "../ui/loading-spinner"

interface PaymentData {
  paymentMethod: string
  totalAmount: number
}

interface PaymentStepProps {
  onSubmit: (data: PaymentData) => void
  provider: any
  childData: any
  bookingData: any
  isProcessing?: boolean
}

export default function PaymentStep({ onSubmit, provider, childData, bookingData, isProcessing }: PaymentStepProps) {
  const [paymentMethod, setPaymentMethod] = useState("e_wallet")

  const calculateDays = () => {
    const diffTime = Math.abs(bookingData.endDate.getTime() - bookingData.startDate.getTime())
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1
  }

  const totalAmount = calculateDays() * bookingData.childrenCount * provider.price

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!isProcessing) {
      onSubmit({
        paymentMethod,
        totalAmount,
      })
    }
  }

  const paymentMethods = [
    {
      id: "e_wallet",
      name: "E-Wallet",
      icon: Smartphone,
      description: "GoPay, OVO, DANA",
    },
    {
      id: "bank_transfer",
      name: "Bank Transfer",
      icon: Building,
      description: "Direct bank transfer",
    },
    {
      id: "debit_card",
      name: "Debit Card",
      icon: CreditCard,
      description: "Direct Debit Card",
    },
  ]

  return (
    <div className="space-y-6">
      {/* Order Summary */}
      <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
        <h3 className="text-xl font-bold text-[#273F4F] mb-4">Order Summary</h3>
        <div className="space-y-3">
          <div className="flex justify-between">
            <span>Provider:</span>
            <span className="font-medium">{provider.name}</span>
          </div>
          <div className="flex justify-between">
            <span>Primary Child:</span>
            <span className="font-medium">
              {Array.isArray(childData) ? childData[0]?.fullname : childData?.fullname}
            </span>
          </div>
          <div className="flex justify-between">
            <span>Duration:</span>
            <span>
              {calculateDays()} day{calculateDays() > 1 ? "s" : ""}
            </span>
          </div>
          <div className="flex justify-between">
            <span>Children Count:</span>
            <span>{bookingData.childrenCount}</span>
          </div>
          <div className="flex justify-between">
            <span>Rate per child per day:</span>
            <span>Rp {provider.price.toLocaleString("id-ID")}</span>
          </div>
          <div className="border-t pt-3">
            <div className="flex justify-between text-xl font-bold">
              <span>Total:</span>
              <span className="text-[#FE7743]">Rp {totalAmount.toLocaleString("id-ID")}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Payment Method */}
      <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
        <h3 className="text-xl font-bold text-[#273F4F] mb-4">Payment Method</h3>

        <RadioGroup 
          value={paymentMethod} 
          onValueChange={setPaymentMethod} 
          className="space-y-3"
        >
          {paymentMethods.map((method) => {
            const Icon = method.icon
            return (
              <div 
                key={method.id} 
                className={`flex items-center space-x-3 p-4 rounded-lg hover:bg-gray-50 ${
                  isProcessing ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                <RadioGroupItem value={method.id} id={method.id} />
                <Icon className="h-5 w-5 text-[#FE7743]" />
                <div className="flex-1">
                  <Label htmlFor={method.id} className="font-medium cursor-pointer">
                    {method.name}
                  </Label>
                  <p className="text-sm text-gray-600">{method.description}</p>
                </div>
              </div>
            )
          })}
        </RadioGroup>

        <form onSubmit={handleSubmit} className="mt-6">
          <Button
            type="submit"
            disabled={isProcessing}
            className="w-full bg-[#FE7743] hover:bg-[#e56a3a] text-white py-6 rounded-xl text-lg font-semibold"
          >
            {isProcessing ? 
              (
                <div className="flex justify-center items-center gap-2">
                  <LoadingSpinner/>
                  <p>Processing Payment...</p>
                </div>
              ) 
            : `Pay Rp ${totalAmount.toLocaleString("id-ID")}`}
          </Button>
        </form>
      </div>
    </div>
  )
}