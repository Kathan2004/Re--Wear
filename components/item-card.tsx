import Image from "next/image"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import type { Item } from "@/lib/database"
import { Star, Coins } from "lucide-react"

interface ItemCardProps {
  item: Item
}

export function ItemCard({ item }: ItemCardProps) {
  return (
    <Link href={`/items/${item.id}`}>
      <Card className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer">
        <div className="aspect-square relative">
          <Image src={item.image_url || "/placeholder.svg"} alt={item.title} fill className="object-cover" />
          {item.featured && (
            <Badge className="absolute top-2 left-2 bg-yellow-500 hover:bg-yellow-600">
              <Star className="h-3 w-3 mr-1" />
              Featured
            </Badge>
          )}
          <Badge className="absolute top-2 right-2 bg-green-600 hover:bg-green-700">
            <Coins className="h-3 w-3 mr-1" />
            {item.points_required}
          </Badge>
        </div>

        <CardContent className="p-4">
          <h3 className="font-semibold text-lg mb-2 hover:text-green-600 transition-colors line-clamp-1">
            {item.title}
          </h3>

          <div className="flex items-center justify-between mb-2">
            <Badge variant="outline">{item.condition}</Badge>
            <span className="text-sm text-gray-600">Size {item.size}</span>
          </div>

          <p className="text-gray-600 text-sm mb-3 line-clamp-2">{item.description}</p>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Avatar className="h-6 w-6">
                <AvatarImage src={item.user?.avatar_url || "/placeholder.svg"} alt={item.user?.full_name} />
                <AvatarFallback className="text-xs">{item.user?.full_name?.charAt(0)}</AvatarFallback>
              </Avatar>
              <span className="text-sm text-gray-600">{item.user?.full_name}</span>
            </div>

            <div className="flex flex-wrap gap-1">
              {item.tags.slice(0, 2).map((tag) => (
                <Badge key={tag} variant="secondary" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
