'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { usePasswordReset } from '@/hooks/usePasswordReset'
import { Button } from '@/components/Button'
import { Input } from '@/components/Input'
import { InputError } from '@/components/InputError'
import { Label } from '@/components/Label'
import { AuthSessionStatus } from '@/components/AuthSessionStatus'
import { Loading } from '@/components/Loading'

export function ForgotPasswordPage() {
    const { forgotPassword, errors, status, isLoading } = usePasswordReset()
    const [email, setEmail] = useState('')

    const submitForm = (event: React.FormEvent) => {
        event.preventDefault()
        forgotPassword(email)
    }

    if (isLoading) {
        return <Loading fullScreen message="Sending reset link..." />
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
        >
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.1, duration: 0.3 }}
                className="mb-4 text-sm text-discord-text-muted"
            >
                Forgot your password? No problem. Just let us know your email address and we will
                email you a password reset link that will allow you to choose a new one.
            </motion.div>

            <AuthSessionStatus className="mb-4" status={status} />

            <motion.form
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.3 }}
                onSubmit={submitForm}
            >
                <div>
                    <Label htmlFor="email" className="text-discord-text-normal">Email</Label>
                    <Input
                        id="email"
                        type="email"
                        value={email}
                        className="block mt-1 w-full bg-discord-input text-discord-text-normal border-discord-light"
                        onChange={(event) => setEmail(event.target.value)}
                        required
                        autoFocus
                        autoComplete="username"
                    />
                    <InputError message={errors.email} className="mt-2" />
                </div>

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3, duration: 0.3 }}
                    className="flex items-center justify-end mt-4"
                >
                    <Button className="bg-discord-blurple hover:bg-discord-blurple-hover">Email Password Reset Link</Button>
                </motion.div>
            </motion.form>
        </motion.div>
    )
}

export default ForgotPasswordPage