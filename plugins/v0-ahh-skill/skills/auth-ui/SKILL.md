---
name: auth-ui
description: "Build polished authentication UI flows including login, signup, forgot password, OTP verification, and social auth."
---

Use this skill when the user mentions login, signup, sign in, register, authentication UI, forgot password, auth page, or social login.

You are an expert at building polished, accessible authentication flows.

## Login Page

```tsx
'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { Eye, EyeOff, Loader2 } from 'lucide-react'
import Link from 'next/link'

export default function Component() {
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Welcome back</CardTitle>
          <CardDescription>Sign in to your account to continue</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Social Auth */}
          <div className="grid grid-cols-2 gap-3">
            <Button variant="outline"><svg className="mr-2 h-4 w-4" />{/* Google icon */}Google</Button>
            <Button variant="outline"><svg className="mr-2 h-4 w-4" />{/* GitHub icon */}GitHub</Button>
          </div>

          <div className="relative">
            <Separator />
            <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-card px-2 text-xs text-muted-foreground">or continue with</span>
          </div>

          {/* Email/Password */}
          <form className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="name@example.com" autoComplete="email" />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <Link href="/forgot-password" className="text-sm text-primary hover:underline">Forgot password?</Link>
              </div>
              <div className="relative">
                <Input id="password" type={showPassword ? "text" : "password"} autoComplete="current-password" />
                <Button
                  type="button" variant="ghost" size="icon"
                  className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  <span className="sr-only">{showPassword ? "Hide" : "Show"} password</span>
                </Button>
              </div>
            </div>
            <Button className="w-full" disabled={isLoading}>
              {isLoading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Signing in...</> : "Sign in"}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="justify-center">
          <p className="text-sm text-muted-foreground">
            {"Don't have an account? "}<Link href="/signup" className="text-primary hover:underline">Sign up</Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  )
}
```

## Signup Page Additions

```tsx
// Password strength indicator
function PasswordStrength({ password }: { password: string }) {
  const strength = getStrength(password) // 0-4

  return (
    <div className="flex gap-1 mt-2">
      {[...Array(4)].map((_, i) => (
        <div key={i} className={cn("h-1 flex-1 rounded-full", i < strength ? strengthColors[strength] : "bg-muted")} />
      ))}
    </div>
  )
}

// Terms checkbox
<div className="flex items-start space-x-2">
  <Checkbox id="terms" />
  <Label htmlFor="terms" className="text-sm font-normal leading-snug">
    I agree to the <Link href="/terms" className="text-primary hover:underline">Terms</Link> and{" "}
    <Link href="/privacy" className="text-primary hover:underline">Privacy Policy</Link>
  </Label>
</div>
```

## OTP Verification

```tsx
import { InputOTP, InputOTPGroup, InputOTPSlot, InputOTPSeparator } from '@/components/ui/input-otp'

<Card className="w-full max-w-md">
  <CardHeader className="text-center">
    <CardTitle>Check your email</CardTitle>
    <CardDescription>{"We've sent a 6-digit code to user@example.com"}</CardDescription>
  </CardHeader>
  <CardContent className="flex flex-col items-center gap-4">
    <InputOTP maxLength={6} value={otp} onChange={setOtp}>
      <InputOTPGroup>
        <InputOTPSlot index={0} />
        <InputOTPSlot index={1} />
        <InputOTPSlot index={2} />
      </InputOTPGroup>
      <InputOTPSeparator />
      <InputOTPGroup>
        <InputOTPSlot index={3} />
        <InputOTPSlot index={4} />
        <InputOTPSlot index={5} />
      </InputOTPGroup>
    </InputOTP>
    <Button className="w-full" disabled={otp.length < 6}>Verify</Button>
    <Button variant="link" className="text-sm">Resend code</Button>
  </CardContent>
</Card>
```

## Forgot Password Flow

```tsx
// Step 1: Email input
<CardContent className="space-y-4">
  <div className="space-y-2">
    <Label htmlFor="email">Email address</Label>
    <Input id="email" type="email" placeholder="name@example.com" />
  </div>
  <Button className="w-full">Send reset link</Button>
  <Button variant="link" className="w-full" asChild>
    <Link href="/login">Back to sign in</Link>
  </Button>
</CardContent>

// Step 2: New password
<CardContent className="space-y-4">
  <div className="space-y-2">
    <Label htmlFor="new-password">New password</Label>
    <Input id="new-password" type="password" />
  </div>
  <div className="space-y-2">
    <Label htmlFor="confirm-password">Confirm password</Label>
    <Input id="confirm-password" type="password" />
  </div>
  <Button className="w-full">Reset password</Button>
</CardContent>
```

## Best Practices

1. Always use `autoComplete` attributes (`email`, `current-password`, `new-password`, `username`)
2. Add show/hide toggle for password fields
3. Use `sr-only` labels for icon-only buttons
4. Link to forgot password from login page
5. Link between login and signup pages
6. Show loading state on submit buttons
7. Center auth cards vertically and horizontally
8. Keep forms simple - social auth first, then email/password
