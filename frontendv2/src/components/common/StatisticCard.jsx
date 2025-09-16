import React from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { TrendingUp, TrendingDown } from 'lucide-react'
import { cn } from '@/lib/utils'

const StatisticCard = ({ 
  title, 
  value, 
  subtitle, 
  trend, 
  trendValue, 
  icon: Icon,
  className 
}) => {
  const isPositiveTrend = trend === 'up'
  
  return (
    <Card className={cn("overflow-hidden", className)}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
            <p className="text-3xl font-bold text-gray-900 mb-1">{value}</p>
            {subtitle && (
              <p className="text-sm text-gray-500">{subtitle}</p>
            )}
            {trend && trendValue && (
              <div className="flex items-center mt-2">
                {isPositiveTrend ? (
                  <TrendingUp className="h-4 w-4 text-green-600 mr-1" />
                ) : (
                  <TrendingDown className="h-4 w-4 text-red-600 mr-1" />
                )}
                <span className={cn(
                  "text-sm font-medium",
                  isPositiveTrend ? "text-green-600" : "text-red-600"
                )}>
                  {trendValue}
                </span>
                <span className="text-sm text-gray-500 ml-1">vs last month</span>
              </div>
            )}
          </div>
          {Icon && (
            <div className="p-3 bg-green-100 rounded-full">
              <Icon className="h-6 w-6 text-green-600" />
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

export default StatisticCard
