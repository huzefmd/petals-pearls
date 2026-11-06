import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useState } from 'react'
import { supabase } from '@/integrations/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { toast } from 'sonner'
import { SiteLayout } from '@/components/site/SiteLayout'
import { Lock, Mail } from 'lucide-react'

export const Route = createFileRoute('/login')({
  component: LoginPage,
})

function LoginPage() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isSignUp, setIsSignUp] = useState(false)

  async function handleAuth() {
    setIsLoading(true)
    try {
      // --- ADMIN BACKDOOR ---
      if (email === 'admin' && password === 'admin') {
        // Save session to local storage so the /admin guard lets them in
        localStorage.setItem('demo_admin_session', 'true')
        toast.success("Admin Access Granted!")

        // Use a small timeout to ensure localStorage is written before redirect
        setTimeout(() => {
          navigate({ to: '/admin' })
        }, 100)
        return
      }
      // ----------------------

      if (isSignUp) {
        const { error } = await supabase.auth.signUp({
          email,
          password,
        })
        if (error) throw error
        toast.success("Account created! Please check your email for verification.")
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        })
        if (error) throw error
        toast.success("Welcome back!")
        navigate({ to: '/' })
      }
    } catch (error: any) {
      toast.error(error.message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <SiteLayout>
      <div className="container mx-auto flex min-h-[80vh] items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="font-serif text-3xl text-primary">
              {isSignUp ? "Join the Circle" : "Welcome Back"}
            </CardTitle>
            <CardDescription>
              {isSignUp
                ? "Create an account to track your blooms."
                : "Login to manage your orders and favorites."}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 size-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="name@example.com"
                  className="pl-10"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 size-4 text-muted-foreground" />
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  className="pl-10"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-4">
            <Button
              className="w-full py-6 text-lg"
              onClick={handleAuth}
              disabled={isLoading}
            >
              {isLoading ? "Processing..." : isSignUp ? "Create Account" : "Login"}
            </Button>
            <button
              type="button"
              className="text-sm text-muted-foreground hover:text-primary transition-colors"
              onClick={() => setIsSignUp(!isSignUp)}
            >
              {isSignUp ? "Already have an account? Login" : "Don't have an account? Sign up"}
            </button>
          </CardFooter>
        </Card>
      </div>
    </SiteLayout>
  )
}
