'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { CheckCircle, XCircle, Loader2 } from 'lucide-react'
import axios from '@/lib/axios'
import type { ApiErrorResponse } from '@/types'

type VerificationStatus = 'verifying' | 'success' | 'error'

export function EmailVerifyPage() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const [status, setStatus] = useState<VerificationStatus>('verifying')
    const [errorMessage, setErrorMessage] = useState<string>('')

    useEffect(() => {
        const verifyEmail = async () => {
            const id = searchParams.get('id')
            const hash = searchParams.get('hash')
            const expires = searchParams.get('expires')
            const signature = searchParams.get('signature')

            if (!id || !hash || !expires || !signature) {
                setStatus('error')
                setErrorMessage('Invalid verification link')
                return
            }

            try {
                const response = await axios.get(`/api/verify-email/${id}/${hash}`, {
                    params: { expires, signature }
                })

                if (response.data.verified) {
                    setStatus('success')
                    setTimeout(() => {
                        router.push('/dashboard')
                    }, 2000)
                } else {
                    setStatus('error')
                    setErrorMessage(response.data.message || 'The verification link is invalid or has expired.')
                }
            } catch (error) {
                const apiError = error as ApiErrorResponse
                setStatus('error')
                setErrorMessage(apiError.response?.data?.message || 'The verification link is invalid or has expired.')
            }
        }

        verifyEmail()
    }, [searchParams, router])

    return (
        <div className="text-center">
            <AnimatePresence mode="wait">
                {status === 'verifying' && (
                    <motion.div
                        key="verifying"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        transition={{ duration: 0.3 }}
                    >
                        <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                            className="inline-block mb-4"
                        >
                            <Loader2 className="w-12 h-12 text-indigo-600" />
                        </motion.div>
                        <h2 className="text-lg font-medium text-gray-900 mb-2">
                            Verifying your email...
                        </h2>
                        <p className="text-sm text-gray-600">
                            Please wait while we verify your email address.
                        </p>
                    </motion.div>
                )}

                {status === 'success' && (
                    <motion.div
                        key="success"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        transition={{ duration: 0.3 }}
                    >
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.1, type: "spring", stiffness: 200 }}
                            className="inline-block mb-4"
                        >
                            <CheckCircle className="w-12 h-12 text-green-600" />
                        </motion.div>
                        <h2 className="text-lg font-medium text-green-600 mb-2">
                            Email verified successfully!
                        </h2>
                        <p className="text-sm text-discord-text-muted">
                            Redirecting you to the dashboard...
                        </p>
                    </motion.div>
                )}

                {status === 'error' && (
                    <motion.div
                        key="error"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        transition={{ duration: 0.3 }}
                    >
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.1, type: "spring", stiffness: 200 }}
                            className="inline-block mb-4"
                        >
                            <XCircle className="w-12 h-12 text-red-600" />
                        </motion.div>
                        <h2 className="text-lg font-medium text-red-600 mb-2">
                            Verification failed
                        </h2>
                        <p className="text-sm text-gray-600 mb-4">
                            {errorMessage}
                        </p>
                        <Link
                            href="/verify-email"
                            className="inline-block px-4 py-2 bg-gray-800 text-white rounded-md hover:bg-gray-700 transition-all duration-200 hover:scale-105 active:scale-95"
                        >
                            Go back to verification page
                        </Link>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}

export default EmailVerifyPage