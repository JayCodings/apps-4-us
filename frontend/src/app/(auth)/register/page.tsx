'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { useRegister } from '@/hooks/useRegister'
import { Button } from '@/components/Button'
import { Input } from '@/components/Input'
import { InputError } from '@/components/InputError'
import { Label } from '@/components/Label'
import { Loading } from '@/components/Loading'

export function RegisterPage() {
    const { register, errors, isLoading } = useRegister()
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [passwordConfirmation, setPasswordConfirmation] = useState('')

    const submitForm = (event: React.FormEvent) => {
        event.preventDefault()

        register({
            name,
            email,
            password,
            password_confirmation: passwordConfirmation,
        })
    }

    if (isLoading) {
        return <Loading fullScreen message="Creating your account..." />
    }

    return (
        <motion.form
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            onSubmit={submitForm}
        >
            <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1, duration: 0.3 }}
            >
                <Label htmlFor="name" className="text-discord-text-normal">Name</Label>
                <Input
                    id="name"
                    type="text"
                    value={name}
                    className="block mt-1 w-full bg-discord-input text-discord-text-normal border-discord-light"
                    onChange={(event) => setName(event.target.value)}
                    required
                    autoFocus
                    autoComplete="name"
                />
                <InputError message={errors.name} className="mt-2" />
            </motion.div>

            <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2, duration: 0.3 }}
                className="mt-4"
            >
                <Label htmlFor="email" className="text-discord-text-normal">Email</Label>
                <Input
                    id="email"
                    type="email"
                    value={email}
                    className="block mt-1 w-full bg-discord-input text-discord-text-normal border-discord-light"
                    onChange={(event) => setEmail(event.target.value)}
                    required
                    autoComplete="username"
                />
                <InputError message={errors.email} className="mt-2" />
            </motion.div>

            <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3, duration: 0.3 }}
                className="mt-4"
            >
                <Label htmlFor="password" className="text-discord-text-normal">Password</Label>
                <Input
                    id="password"
                    type="password"
                    value={password}
                    className="block mt-1 w-full bg-discord-input text-discord-text-normal border-discord-light"
                    onChange={(event) => setPassword(event.target.value)}
                    required
                    autoComplete="new-password"
                />
                <InputError message={errors.password} className="mt-2" />
            </motion.div>

            <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4, duration: 0.3 }}
                className="mt-4"
            >
                <Label htmlFor="passwordConfirmation" className="text-discord-text-normal">Confirm Password</Label>
                <Input
                    id="passwordConfirmation"
                    type="password"
                    value={passwordConfirmation}
                    className="block mt-1 w-full bg-discord-input text-discord-text-normal border-discord-light"
                    onChange={(event) => setPasswordConfirmation(event.target.value)}
                    required
                    autoComplete="new-password"
                />
                <InputError message={errors.password_confirmation} className="mt-2" />
            </motion.div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.3 }}
                className="flex items-center justify-between mt-4"
            >
                <Link
                    href="/"
                    className="underline text-sm text-discord-text-link hover:opacity-80 rounded-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-discord-text-link"
                >
                    Already have an account? Sign in
                </Link>
                <Button className="ms-3 bg-discord-blurple hover:bg-discord-blurple-hover">Register</Button>
            </motion.div>
        </motion.form>
    )
}

export default RegisterPage