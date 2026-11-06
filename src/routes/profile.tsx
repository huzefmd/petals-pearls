import { createFileRoute, redirect } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/integrations/supabase/client'
import { SiteLayout } from '@/components/site/SiteLayout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Package, Clock, CheckCircle2 } from 'lucide-react'

export const Route = createFileRoute('/profile')({
  beforeLoad: async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      throw redirect({ to: '/login' })
    }
  },
  component: ProfilePage,
})

function ProfilePage() {
  const { data: orders, isLoading } = useQuery({
    queryKey: ['my-orders'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error("Not authenticated")

      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (error) throw error
      return data || []
    },
    refetchInterval: 10000, // Auto-refresh every 10 seconds to show status updates from Admin
  })

  if (isLoading) {
    return (
      <SiteLayout>
        <div className="flex h-screen items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </SiteLayout>
    )
  }

  return (
    <SiteLayout>
      <div className="container mx-auto p-6 max-w-4xl space-y-8">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold tracking-tight font-serif text-primary">My Account</h1>
          <p className="text-muted-foreground">Track your orders and gift history.</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Your Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Order ID</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Total</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {orders?.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center py-10 text-muted-foreground">
                        You haven't placed any orders yet.
                      </TableCell>
                    </TableRow>
                  )}
                  {orders?.map((order) => (
                    <TableRow key={order.id}>
                      <TableCell className="font-mono text-xs">#{order.id.slice(0, 8)}</TableCell>
                      <TableCell>{new Date(order.created_at).toLocaleDateString()}</TableCell>
                      <TableCell>${order.total_amount}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {order.status === 'Delivered' && <CheckCircle2 className="h-3 w-3 text-green-500" />}
                          {order.status === 'New' && <Clock className="h-3 w-3 text-orange-500" />}
                          <Badge variant={
                            order.status === 'Delivered' ? 'default' :
                            order.status === 'Cancelled' ? 'destructive' : 'secondary'
                          }>
                            {order.status}
                          </Badge>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </SiteLayout>
  )
}
