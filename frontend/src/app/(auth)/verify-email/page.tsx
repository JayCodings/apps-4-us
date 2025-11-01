'use client'

import { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import { useEmailVerification } from '@/hooks/useEmailVerification'
import { Button } from '@/components/Button'
import { Loading } from '@/components/Loading'

export function VerifyEmailPage() {
    const router = useRouter()
    const { logout, user } = useAuth({ middleware: 'auth' })
    const { resendEmailVerification, message, isLoading } = useEmailVerification()

    const emailVerificationRequired = process.env.NEXT_PUBLIC_EMAIL_VERIFICATION_REQUIRED === 'true'

    useEffect(() => {
        if (!emailVerificationRequired) {
            router.push('/dashboard')
        }
        if (user?.email_verified_at) {
            router.push('/dashboard')
        }
    }, [emailVerificationRequired, user, router])

    if (!emailVerificationRequired) {
        return null
    }

    if (isLoading) {
        return <Loading fullScreen message="Sending verification email..." />
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
                Thanks for signing up! Before getting started, could you verify your email address
                by clicking on the link we just emailed to you? If you didn&apos;t receive the
                email, we will gladly send you another.
            </motion.div>

            <AnimatePresence>
                {message && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.3 }}
                        className="mb-4 font-medium text-sm text-green-400"
                    >
                        {message}
                    </motion.div>
                )}
            </AnimatePresence>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.3 }}
                className="mt-4 flex items-center justify-between"
            >
                <Button className="bg-discord-blurple hover:bg-discord-blurple-hover" onClick={resendEmailVerification}>
                    Resend Verification Email
                </Button>

                <button
                    type="button"
                    className="underline text-sm text-discord-text-muted hover:text-discord-text-normal rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-discord-blurple"
                    onClick={logout}
                >
                    Logout
                </button>
            </motion.div>
        </motion.div>
    )
}

export default VerifyEmailPage