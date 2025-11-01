'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { useSearchParams, useParams } from 'next/navigation'
import { usePasswordReset } from '@/hooks/usePasswordReset'
import { Button } from '@/components/Button'
import { Input } from '@/components/Input'
import { InputError } from '@/components/InputError'
import { Label } from '@/components/Label'
import { Loading } from '@/components/Loading'
import type { ValidationError } from '@/types'

export function PasswordResetPage() {
    const searchParams = useSearchParams()
    const params = useParams()
    const token = params.token as string
    const { resetPassword, errors, status, isLoading } = usePasswordReset()

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [passwordConfirmation, setPasswordConfirmation] = useState('')
    const hasTokenError = !!(errors.token || (errors.email && typeof errors.email[0] === 'string' && errors.email[0].toLowerCase().includes('token')))

    useEffect(() => {
        const emailParam = searchParams.get('email')
        if (emailParam) {
            setEmail(emailParam)
        }
    }, [searchParams])

    const submitForm = (event: React.FormEvent) => {
        event.preventDefault()

        if (!token) {
            return
        }

        resetPassword({
            token,
            email,
            password,
            password_confirmation: passwordConfirmation,
        })
    }

    if (isLoading) {
        return <Loading fullScreen message="Resetting your password..." />
    }

    return (
        <motion.form
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            onSubmit={submitForm}
        >
            {status && (
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="mb-4 font-medium text-sm text-green-600"
                >
                    {status}
                </motion.div>
            )}

            <input
                type="hidden"
                name="email"
                value={email}
            />

            <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1, duration: 0.3 }}
            >
                <Label htmlFor="password" className="text-discord-text-normal">New Password</Label>
                <Input
                    id="password"
                    type="password"
                    value={password}
                    className="block mt-1 w-full bg-discord-input text-discord-text-normal border-discord-light"
                    onChange={(event) => setPassword(event.target.value)}
                    required
                    autoFocus
                    autoComplete="new-password"
                    disabled={hasTokenError}
                />
                <InputError message={errors.password} className="mt-2" />
            </motion.div>

            <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2, duration: 0.3 }}
                className="mt-4"
            >
                <Label htmlFor="passwordConfirmation" className="text-discord-text-normal">Confirm New Password</Label>
                <Input
                    id="passwordConfirmation"
                    type="password"
                    value={passwordConfirmation}
                    className="block mt-1 w-full bg-discord-input text-discord-text-normal border-discord-light"
                    onChange={(event) => setPasswordConfirmation(event.target.value)}
                    required
                    autoComplete="new-password"
                    disabled={hasTokenError}
                />
                <InputError message={errors.password_confirmation} className="mt-2" />
            </motion.div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.3 }}
                className="flex items-center justify-end mt-4"
            >
                <Button className="bg-discord-blurple hover:bg-discord-blurple-hover" disabled={hasTokenError}>Reset Password</Button>
            </motion.div>

            {hasTokenError && (
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3 }}
                    className="mt-6 p-4 bg-discord-darkest border border-discord-light rounded-lg"
                >
                    <div className="text-sm text-discord-text-muted">
                        <p>
                            This password reset link is invalid or has expired. Please request a new password reset link.{' '}
                            <a href="/forgot-password" className="underline font-medium text-discord-text-link hover:opacity-80 transition-all duration-200">
                                Click here to request a new link
                            </a>
                        </p>
                    </div>
                </motion.div>
            )}
        </motion.form>
    )
}

export default PasswordResetPage