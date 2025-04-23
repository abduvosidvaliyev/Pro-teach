import React from "react";

export function PaymentItem({ date, amount, status, method }) {
    return (
      <div className="flex justify-between items-center py-2 border-b border-gray-100">
        <div>
          <span className="text-sm text-gray-500">{date}</span>
          <p className="font-medium">{amount} so'm</p>
        </div>
        <div className="text-right">
          <span className={`text-sm ${status === "To'langan" ? "text-green-500" : "text-orange-500"}`}>{status}</span>
          <p className="text-sm text-gray-600">{method}</p>
        </div>
      </div>    
    );
  }