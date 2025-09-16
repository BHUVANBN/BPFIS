import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ArrowRight } from 'lucide-react'
import { cn } from '@/lib/utils'

const FeatureCard = ({ 
  icon: Icon, 
  title, 
  description, 
  buttonText = "Learn More",
  onClick,
  className,
  variant = "default"
}) => {
  return (
    <Card className={cn(
      "group cursor-pointer transition-all duration-300 hover:shadow-xl hover:-translate-y-1",
      variant === "highlighted" && "border-green-200 bg-green-50",
      className
    )}>
      <CardHeader className="text-center pb-4">
        <div className="mx-auto mb-4 p-3 bg-green-100 rounded-full w-fit group-hover:bg-green-200 transition-colors">
          <Icon className="h-8 w-8 text-green-600" />
        </div>
        <CardTitle className="text-xl font-semibold text-gray-900">{title}</CardTitle>
      </CardHeader>
      <CardContent className="text-center">
        <CardDescription className="text-gray-600 mb-6 leading-relaxed">
          {description}
        </CardDescription>
        <Button 
          variant="outline" 
          className="group-hover:bg-green-600 group-hover:text-white group-hover:border-green-600 transition-all"
          onClick={onClick}
        >
          {buttonText}
          <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
        </Button>
      </CardContent>
    </Card>
  )
}

export default FeatureCard
