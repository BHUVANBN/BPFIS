import React from 'react'
import { Button } from '@/components/ui/button'
import { MessageCircle, Phone } from 'lucide-react'
import { cn } from '@/lib/utils'

const FloatingActionButton = ({ type = "chat", onClick, className }) => {
  const isChat = type === "chat"
  const Icon = isChat ? MessageCircle : Phone
  
  return (
    <Button
      size="icon"
      className={cn(
        "fixed bottom-6 z-50 h-14 w-14 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110",
        isChat ? "right-6 bg-green-600 hover:bg-green-700" : "right-24 bg-blue-600 hover:bg-blue-700",
        className
      )}
      onClick={onClick}
    >
      <Icon className="h-6 w-6" />
    </Button>
  )
}

const FloatingActionButtons = ({ onChatClick, onCallClick }) => {
  return (
    <>
      <FloatingActionButton type="chat" onClick={onChatClick} />
      <FloatingActionButton type="call" onClick={onCallClick} />
    </>
  )
}

export { FloatingActionButton, FloatingActionButtons }
