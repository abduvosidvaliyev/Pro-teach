"use client"

import React from "react"
import { Users, MessageSquare, History, StickyNote } from "lucide-react"

export function Tabs({ activeTab, setActiveTab }) {
  return (
    <div className="border-b">
      <nav className="flex  gap-8">
        <button
          onClick={() => setActiveTab("groups")}
          className={`flex items-center gap-2 px-4 py-2 cursor-pointer ${
            activeTab === "groups" ? "text-[#6366F1] border-b-2 border-primary" : "text-gray-500 hover:text-gray-700"
          }`}
        >
          <Users className="h-5 w-5" />
          <span>GURUHLAR</span>
        </button>
        <button
          onClick={() => setActiveTab("notes")}
          className={`flex items-center gap-2 px-4 py-2 cursor-pointer ${
            activeTab === "notes" ? "text-[#6366F1] border-b-2 border-primary" : "text-gray-500 hover:text-gray-700"
          }`}
        >
          <StickyNote className="h-5 w-5" />
          <span>IZOH VA ESLATMALAR</span>
        </button>
        <button
          onClick={() => setActiveTab("sms")}
          className={`flex items-center gap-2 px-4 py-2 cursor-pointer ${
            activeTab === "sms" ? "text-[#6366F1] border-b-2 border-primary" : "text-gray-500 hover:text-gray-700"
          }`}
        >
          <MessageSquare className="h-5 w-5" />
          <span>SMS</span>
        </button>
        <button
          onClick={() => setActiveTab("history")}
          className={`flex items-center gap-2 px-4 py-2 cursor-pointer ${
            activeTab === "history" ? "text-[#6366F1] border-b-2 border-primary" : "text-gray-500 hover:text-gray-700"
          }`}
        >
          <History className="h-5 w-5" />
          <span>O'QUVCHI TARIXI</span>
        </button>
      </nav>
    </div>
  )
}