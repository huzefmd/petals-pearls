import { createFileRoute, redirect, useNavigate } from '@tanstack/react-router'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/integrations/supabase/client'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger
} from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { toast } from 'sonner'
import { Package, ShoppingCart, AlertTriangle, CheckCircle2, Clock, LogOut } from 'lucide-react'

function AdminDashboard() {
  const queryClient = useQueryClient()
  const navigate = useNavigate()

  const { data: products, isLoading: loadingProducts } = useQuery({
    queryKey: ['admin-products'],
    queryFn: async () => {
      const { data, error } = await supabase.from('products').select('*').order('name')
      if (error) throw error
      return data || []
    }
  })

  const { data: orders, isLoading: loadingOrders } = useQuery({
    queryKey: ['admin-orders'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('orders')
        .select('*, profiles(full_name)')
        .order('created_at', { ascending: false })
      if (error) throw error
      return data || []
    }
  })

  const updateStockMutation = useMutation({
    mutationFn: async ({ id, stock }: { id: string; stock: number }) => {
      const { error } = await supabase
        .from('products')
        .update({ stock_quantity: stock })
        .eq('id', id)
      if (error) throw error
      return { id, stock }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-products'] })
      toast.success("Stock updated successfully")
    },
    onError: (error: any) => {
      toast.error(`Update failed: ${error.message}`)
    }
  })

  const updateOrderStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const { error } = await supabase
        .from('orders')
        .update({ status })
        .eq('id', id)
      if (error) throw error
      return { id, status }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-orders'] })
      toast.success("Order status updated")
    },
    onError: (error: any) => {
      toast.error(`Update failed: ${error.message}`)
    }
  })

  async function handleLogout() {
    await supabase.auth.signOut()
    localStorage.removeItem('demo_admin_session')
    toast.success("Logged out successfully")
    navigate({ to: '/login' })
  }

  const totalOrders = orders?.length || 0
  const pendingOrders = orders?.filter(o => o.status === 'New').length || 0
  const lowStockItems = products?.filter(p => p.stock_quantity < 5).length || 0

  if (loadingProducts || loadingOrders) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6 space-y-8">
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold tracking-tight">Admin Command Center</h1>
          <p className="text-muted-foreground">Manage your petals, pearls, and orders from one place.</p>
        </div>
        <Button variant="ghost" onClick={handleLogout} className="flex items-center gap-2 text-red-500 hover:text-red-600 hover:bg-red-50">
          <LogOut className="size-4" /> Logout
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalOrders}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Requests</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-500">{pendingOrders}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Low Stock Items</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-500">{lowStockItems}</div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="orders" className="space-y-4">
        <TabsList>
          <TabsTrigger value="orders">Orders</TabsTrigger>
          <TabsTrigger value="inventory">Inventory</TabsTrigger>
        </TabsList>

        <TabsContent value="orders" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Customer Orders</CardTitle>
              <CardDescription>Update status and manage delivery requests.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Customer</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Delivery Date</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {orders?.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center py-10 text-muted-foreground">
                          No orders found.
                        </TableCell>
                      </TableRow>
                    )}
                    {orders?.map((order) => (
                      <TableRow key={order.id}>
                        <TableCell className="font-medium">
                          {order.profiles?.full_name || 'Guest'}
                        </TableCell>
                        <TableCell>${order.total_amount}</TableCell>
                        <TableCell>{order.delivery_date}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {order.status === 'Delivered' && <CheckCircle2 className="h-3 w-3 text-green-500" />}
                            {order.status === 'New' && <Clock className="h-3 w-3 text-orange-500" />}
                            <span className="text-sm">{order.status}</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <Select
                            defaultValue={order.status}
                            onValueChange={(value) => updateOrderStatusMutation.mutate({ id: order.id, status: value })}
                          >
                            <SelectTrigger className="w-[140px] ml-auto">
                              <SelectValue placeholder="Status" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="New">New</SelectItem>
                              <SelectItem value="Contacted">Contacted</SelectItem>
                              <SelectItem value="Confirmed">Confirmed</SelectItem>
                              <SelectItem value="Preparing">Preparing</SelectItem>
                              <SelectItem value="Ready">Ready</SelectItem>
                              <SelectItem value="Delivered">Delivered</SelectItem>
                              <SelectItem value="Cancelled">Cancelled</SelectItem>
                            </SelectContent>
                          </Select>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="inventory" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Product Inventory</CardTitle>
              <CardDescription>Adjust stock levels for your bouquets and gifts.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Product Name</TableHead>
                      <TableHead>Current Stock</TableHead>
                      <TableHead className="text-right">Update Stock</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {products?.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={3} className="text-center py-10 text-muted-foreground">
                          No products found.
                        </TableCell>
                      </TableRow>
                    )}
                    {products?.map((product) => (
                      <TableRow key={product.id}>
                        <TableCell className="font-medium">{product.name}</TableCell>
                        <TableCell>
                          <span className={`font-bold ${product.stock_quantity < 5 ? 'text-red-500' : 'text-foreground'}`}>
                            {product.stock_quantity} units
                          </span>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Input
                              type="number"
                              className="w-20 h-8"
                              defaultValue={product.stock_quantity}
                              id={`stock-${product.id}`}
                            />
                            <Button
                              size="sm"
                              className="h-8"
                              onClick={() => {
                                const input = document.getElementById(`stock-${product.id}`) as HTMLInputElement
                                updateStockMutation.mutate({
                                  id: product.id,
                                  stock: parseInt(input.value) || 0
                                })
                              }}
                            >
                              Save
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

export const Route = createFileRoute('/admin')({
  beforeLoad: async () => {
    const isAdminSession = localStorage.getItem('demo_admin_session') === 'true';
    if (isAdminSession) return;

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      throw redirect({ to: '/login' })
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    if (profile?.role !== 'admin') {
      toast.error("Access denied. Admins only.")
      throw redirect({ to: '/' })
    }
  },
  component: AdminDashboard,
})
