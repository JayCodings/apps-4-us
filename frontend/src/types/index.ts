import { AxiosError } from 'axios'

// Feature Types
export interface UserFeature {
  feature: string
  context?: {
    'max-projects'?: number
  }
}

// User Types
export interface User {
  id: string
  name: string
  email: string
  email_verified_at?: string
  must_verify_email?: boolean
  created_at?: string
  updated_at?: string
  active_project?: Project
  features: UserFeature[]
  permissions?: {
    can?: {
      createProject?: AuthorizationResponse
    }
  }
}

// Auth Types
export interface LoginData {
  email: string
  password: string
  remember?: boolean
}

export interface RegisterData {
  name: string
  email: string
  password: string
  password_confirmation: string
}

export interface ResetPasswordData {
  token: string
  email: string
  password: string
  password_confirmation: string
}

export interface UpdateProfileData {
  name: string
  email: string
}

export interface UpdatePasswordData {
  current_password: string
  password: string
  password_confirmation: string
}

// Error Types
export interface ValidationError {
  [key: string]: string[]
}

export interface ApiError {
  message?: string
  errors?: ValidationError
  status?: number
}

export type ApiErrorResponse = AxiosError<ApiError>

// Status Types
export enum AuthStatusEnum {
  Authenticated = 'authenticated',
  Loading = 'loading',
  Unauthenticated = 'unauthenticated',
}

export enum LoadingStateEnum {
  Idle = 'idle',
  Loading = 'loading',
  Success = 'success',
  Error = 'error',
}

// Toast Types
export type ToastVariant = 'success' | 'error' | 'info' | 'warning'

export interface ToastMessage {
  id: string
  message: string
  variant: ToastVariant
}

// Authorization Types
export interface AuthorizationResponse {
  allowed: boolean
  message?: string
}

// Project Types
export interface Project {
  id: string
  name: string
  description?: string
  type: string
  role: 'owner' | 'member'
  created_at: string
  updated_at: string
  permissions: {
    can: {
      view: AuthorizationResponse
      update: AuthorizationResponse
      delete: AuthorizationResponse
      create_webhooks: AuthorizationResponse
    }
  }
}

export interface CreateProjectData {
  type: string
  name: string
  description?: string
}

// Channel Types
export interface Channel {
  id: string
  name: string
  type: 'text' | 'voice'
  isActive?: boolean
}