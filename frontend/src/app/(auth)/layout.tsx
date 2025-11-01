import { AuthCard } from '@/components/AuthCard'

interface AuthLayoutProps {
    children: React.ReactNode
}

export function AuthLayout({ children }: AuthLayoutProps) {
    return (
        <AuthCard>
            {children}
        </AuthCard>
    )
}

export default AuthLayout