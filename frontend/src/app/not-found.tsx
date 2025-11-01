'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { Home } from 'lucide-react'
import { Button } from '@/components/Button'

export function NotFoundPage() {
    return (
        <div className="relative flex items-center justify-center min-h-screen bg-discord-bg">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="max-w-xl mx-auto px-6 text-center"
            >
                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.1, duration: 0.4, type: 'spring' }}
                    className="mb-8"
                >
                    <h1 className="text-9xl font-bold text-discord-blurple mb-4">404</h1>
                    <h2 className="text-2xl font-semibold text-discord-text-normal mb-2">
                        Page Not Found
                    </h2>
                    <p className="text-discord-text-muted">
                        The page you are looking for does not exist or has been moved.
                    </p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3, duration: 0.4 }}
                >
                    <Link href="/">
                        <Button className="inline-flex items-center gap-2">
                            <Home className="w-4 h-4" />
                            Back to Home
                        </Button>
                    </Link>
                </motion.div>
            </motion.div>
        </div>
    )
}

export default NotFoundPage
