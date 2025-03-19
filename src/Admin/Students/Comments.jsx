import { Plus } from "lucide-react"
import { Button } from "../../components/ui/button"
import { Card } from "../../components/ui/card"

const comments = [
  {
    id: 1,
    text: "Iyi haa",
    timestamp: "2025-01-28 22:58",
  },
  {
    id: 2,
    text: "Darsga kech qolindi",
    timestamp: "2025-01-28 22:57",
  },
  {
    id: 3,
    text: "Ha qo'shildida",
    timestamp: "2025-01-25 12:46",
  },
]

export function Comments() {
  return (
    <div className="p-6">
      <div className="flex justify-end mb-6">
        <Button className="bg-[#6366F1] hover:bg-[#5558DD] text-white gap-2">
          <Plus className="h-5 w-5" />
          YANGI ESLATMA
        </Button>
      </div>
      <div className="space-y-4 w-[440px]">
        {comments.map((comment) => (
          <Card key={comment.id} className="p-4 relative">
            <div className="flex gap-3">
              <div className="w-2 h-2 rounded-full bg-green-500 mt-2" />
              <div className="space-y-1">
                <p className="text-base">{comment.text}</p>
                <p className="text-sm text-gray-500">{comment.timestamp}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}

