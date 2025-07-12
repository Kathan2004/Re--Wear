"use client"

import { useState } from "react"
import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { resetToSampleData, debugData } from "@/lib/database"
import { Settings, RefreshCw, Database, Users, Package, ArrowUpDown } from "lucide-react"

export default function AdminPage() {
  const { user } = useAuth()
  const { toast } = useToast()
  const [isResetting, setIsResetting] = useState(false)

  const handleResetData = async () => {
    if (!confirm("Are you sure you want to reset all data to sample data? This will clear all current data.")) {
      return
    }

    setIsResetting(true)
    try {
      resetToSampleData()
      toast({
        title: "Data Reset Complete",
        description: "All data has been reset to sample data.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to reset data. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsResetting(false)
    }
  }

  const handleDebugData = () => {
    debugData()
    toast({
      title: "Debug Info",
      description: "Check the browser console for data information.",
    })
  }

  if (!user || user.role !== "admin") {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h1>
          <p className="text-gray-600 mb-6">You need admin privileges to access this page.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Panel</h1>
          <p className="text-gray-600">Manage application data and settings</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Data Management */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Database className="h-5 w-5 mr-2" />
                Data Management
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-gray-600">
                Reset all data to sample data. This will clear all current data and restore the initial sample data.
              </p>
              <div className="flex space-x-2">
                <Button 
                  onClick={handleResetData} 
                  disabled={isResetting}
                  variant="destructive"
                >
                  <RefreshCw className={`h-4 w-4 mr-2 ${isResetting ? 'animate-spin' : ''}`} />
                  {isResetting ? "Resetting..." : "Reset to Sample Data"}
                </Button>
                <Button onClick={handleDebugData} variant="outline">
                  Debug Data
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* System Info */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Settings className="h-5 w-5 mr-2" />
                System Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="font-medium text-gray-900">Storage Type</p>
                  <p className="text-gray-600">localStorage</p>
                </div>
                <div>
                  <p className="font-medium text-gray-900">Environment</p>
                  <p className="text-gray-600">Development</p>
                </div>
                <div>
                  <p className="font-medium text-gray-900">Admin User</p>
                  <p className="text-gray-600">{user.full_name}</p>
                </div>
                <div>
                  <p className="font-medium text-gray-900">User Points</p>
                  <p className="text-gray-600">{user.points}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Users className="h-5 w-5 mr-2" />
                Sample Data Overview
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex items-center">
                  <Users className="h-4 w-4 mr-2 text-blue-500" />
                  <div>
                    <p className="font-medium">Users</p>
                    <p className="text-gray-600">5 sample users</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <Package className="h-4 w-4 mr-2 text-green-500" />
                  <div>
                    <p className="font-medium">Items</p>
                    <p className="text-gray-600">6 sample items</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <ArrowUpDown className="h-4 w-4 mr-2 text-purple-500" />
                  <div>
                    <p className="font-medium">Swap Requests</p>
                    <p className="text-gray-600">5 sample requests</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <Settings className="h-4 w-4 mr-2 text-orange-500" />
                  <div>
                    <p className="font-medium">Categories</p>
                    <p className="text-gray-600">6 categories</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Instructions */}
          <Card>
            <CardHeader>
              <CardTitle>Instructions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div>
                <p className="font-medium text-gray-900">Reset Data</p>
                <p className="text-gray-600">Use this to restore all sample data if the app seems empty or broken.</p>
              </div>
              <div>
                <p className="font-medium text-gray-900">Debug Data</p>
                <p className="text-gray-600">Check browser console to see current data counts and structure.</p>
              </div>
              <div>
                <p className="font-medium text-gray-900">Sample Users</p>
                <p className="text-gray-600">Login with any of the sample users to test different scenarios.</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
} 