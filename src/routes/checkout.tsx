import { createFileRoute, redirect, useNavigate } from '@tanstack/react-router'
import { useForm } from 'react-hook-form'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/integrations/supabase/client'
import { useCart } from '@/hooks/use-cart'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { toast } from 'sonner'
import { ShoppingBag, MapPin, Calendar, MessageSquare } from 'lucide-react'
import { useEffect } from 'react'

type CheckoutForm = {
  address: string
  date: string
  notes: string
}

export const Route = createFileRoute('/checkout')({
  beforeLoad: async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      throw redirect({ to: '/login' })
    }
  },
  component: CheckoutPage,
})

function CheckoutPage() {
  const { items, getTotal, clearCart } = useCart()
  const queryClient = useQueryClient()
  const navigate = useNavigate()
  const { register, handleSubmit, setValue, formState: { errors } } = useForm<CheckoutForm>({
    defaultValues: {
      address: '',
      date: new Date().toISOString().split('T')[0],
      notes: '',
    }
  })

  useEffect(() => {
    async function verifyAuth() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        toast.error("Please login to place an order")
        navigate({ to: '/login' })
      }
    }
    verifyAuth()
  }, [navigate])

  const orderMutation = useMutation({
    mutationFn: async (formData: CheckoutForm) => {
      const { data: { user } } = await supabase.auth.getUser()

      if (!user) {
        throw new Error("Authentication required. Please login first.")
      }

      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert({
          user_id: user.id,
          total_amount: getTotal(),
          delivery_address: formData.address,
          delivery_date: formData.date,
          customer_notes: formData.notes,
          status: 'New'
        })
        .select()
        .single()

      if (orderError) throw orderError

      const orderItems = items.map(item => ({
        order_id: order.id,
        product_id: item.id,
        quantity: item.quantity,
        unit_price: item.price
      }))

      const { error: itemsError } = await supabase.from('order_items').insert(orderItems)
      if (itemsError) throw itemsError

      for (const item of items) {
        const { data: product } = await supabase
          .from('products')
          .select('stock_quantity')
          .eq('id', item.id)
          .single()

        if (product) {
          await supabase
            .from('products')
            .update({ stock_quantity: (product.stock_quantity || 0) - item.quantity })
            .eq('id', item.id)
        }
      }

      return order
    },
    onSuccess: () => {
      clearCart()
      queryClient.invalidateQueries({ queryKey: ['admin-orders'] })
      queryClient.invalidateQueries({ queryKey: ['admin-products'] })
      toast.success("Order placed successfully! We'll contact you soon.")
    },
    onError: (error: any) => {
      toast.error(`Order failed: ${error.message}`)
    }
  })

  const onSubmit = (data: CheckoutForm) => {
    orderMutation.mutate(data)
  }

  if (items.length === 0) {
    return (
      <div className="flex h-[80vh] flex-col items-center justify-center text-center p-4">
        <ShoppingBag className="h-12 w-12 text-muted-foreground mb-4" />
        <h2 className="text-2xl font-bold">Your cart is empty</h2>
        <p className="text-muted-foreground mb-6">Looks like you haven't added any blooms yet.</p>
        <Button onClick={() => window.location.href = '/shop'}>Go to Shop</Button>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6 max-w-5xl grid gap-8 md:grid-cols-2">
      <div className="space-y-6">
        <div className="flex items-center gap-2 mb-2">
          <ShoppingBag className="h-6 w-6 text-primary" />
          <h1 className="text-2xl font-bold">Checkout</h1>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Delivery Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <MapPin className="h-4 w-4" /> Delivery Address
              </Label>
              <Textarea
                {...register('address', { required: "Address is required" })}
                placeholder="Full address, building, apartment number..."
                className="resize-none"
              />
              {errors.address && <p className="text-xs text-red-500">{errors.address.message}</p>
              }
            </div>

            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Calendar className="h-4 w-4" /> Delivery Date
              </Label>
              <Input
                type="date"
                {...register('date', { required: "Date is required" })}
              />
              {errors.date && <p className="text-xs text-red-500">{errors.date.message}</p>}
            </div>

            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <MessageSquare className="h-4 w-4" /> Gift Note (Optional)
              </Label>
              <Textarea
                {...register('notes')}
                placeholder="Write something sweet for the recipient..."
                className="resize-none"
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button
              className="w-full py-6 text-lg"
              onClick={handleSubmit(onSubmit)}
              disabled={orderMutation.isPending}
            >
              {orderMutation.isPending ? "Processing..." : "Place Order"}
            </Button>
          </CardFooter>
        </Card>
      </div>

      <div className="space-y-6">
        <h2 className="text-xl font-semibold">Order Summary</h2>
        <Card>
          <CardContent className="p-4 space-y-4">
            {items.map((item) => (
              <div key={item.id} className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <img src={item.image} alt={item.name} className="h-12 w-12 rounded-md object-cover" />
                  <div>
                    <p className="text-sm font-medium">{item.name}</p>
                    <p className="text-xs text-muted-foreground">Qty: {item.quantity}</p>
                  </div>
                </div>
                <p className="text-sm font-semibold">${(item.price * item.quantity).toFixed(2)}</p>
              </div>
            ))}
            <Separator />
            <div className="flex justify-between items-center pt-2">
              <span className="text-lg font-bold">Total</span>
              <span className="text-2xl font-bold text-primary">${getTotal().toFixed(2)}</span>
            </div>
          </CardContent>
        </Card>
        <p className="text-xs text-center text-muted-foreground">
          By placing an order, you agree to our delivery terms.
          We will contact you via email/phone to confirm the payment.
        </p>
      </div>
    </div>
  )
}
