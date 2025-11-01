"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/contexts/ToastContext";
import { useSubMenuRegistry } from "@/hooks/useSubMenuRegistry";
import { useSubMenuContext } from "@/contexts/SubMenuContext";
import { useUserAreaMenu } from "@/hooks/useUserAreaMenu";
import { Button } from "@/components/Button";
import { Input } from "@/components/Input";
import { Label } from "@/components/Label";
import { InputError } from "@/components/InputError";
import { Loading } from "@/components/Loading";
import axios from "@/lib/axios";
import type { ApiErrorResponse, ValidationError } from "@/types";

export function SettingsPage() {
    const { user, isLoading } = useAuth({ middleware: "auth" });
    const { showToast } = useToast();
    const userAreaMenu = useUserAreaMenu();
    const { setTitle } = useSubMenuContext();
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [errors, setErrors] = useState<ValidationError>({});
    const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);
    const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);

    useSubMenuRegistry(userAreaMenu);

    useEffect(() => {
        setTitle("User Area");
        return () => setTitle(null);
    }, [setTitle]);

    useEffect(() => {
        if (user) {
            setName(user.name || '')
            setEmail(user.email || '')
        }
    }, [user])

    const updateProfile = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrors({});
        setIsUpdatingProfile(true);

        try {
            await axios.put("/api/user/profile", {
                name,
                email,
            });
            showToast("Profile updated successfully!", "success");
        } catch (error) {
            const apiError = error as ApiErrorResponse;
            if (apiError.response?.data?.errors) {
                setErrors(apiError.response.data.errors);
            }
            showToast("Failed to update profile", "error");
        } finally {
            setIsUpdatingProfile(false);
        }
    };

    const updatePassword = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrors({});
        setIsUpdatingPassword(true);

        try {
            await axios.put("/api/user/password", {
                current_password: currentPassword,
                password: newPassword,
                password_confirmation: confirmPassword,
            });
            showToast("Password updated successfully!", "success");
            setCurrentPassword("");
            setNewPassword("");
            setConfirmPassword("");
        } catch (error) {
            const apiError = error as ApiErrorResponse;
            if (apiError.response?.data?.errors) {
                setErrors(apiError.response.data.errors);
            }
            showToast("Failed to update password", "error");
        } finally {
            setIsUpdatingPassword(false);
        }
    };

    if (isLoading) {
        return <Loading fullScreen message="Loading settings..." />
    }

    return (
        <div className="p-6">
            <div className="mb-6 rounded-lg bg-discord-card p-6">
                <div className="mb-6">
                    <h2 className="text-xl font-semibold text-discord-text-normal">Profile Information</h2>
                    <p className="text-sm text-discord-text-muted mt-1">Update your account&apos;s profile information and email address.</p>
                </div>

                <form onSubmit={updateProfile} className="space-y-6">
                    <div>
                        <Label htmlFor="name" required>
                            Name
                        </Label>
                        <Input
                            id="name"
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="mt-1 w-full bg-discord-input text-discord-text-normal"
                            placeholder="Enter your name"
                            required
                            error={!!errors.name}
                        />
                        <InputError message={errors.name} />
                    </div>

                    <div>
                        <Label htmlFor="email" required>
                            Email
                        </Label>
                        <Input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="mt-1 w-full bg-discord-input text-discord-text-normal"
                            placeholder="Enter your email"
                            required
                            error={!!errors.email}
                        />
                        <InputError message={errors.email} />
                    </div>

                    <div className="flex justify-end">
                        <Button
                            type="submit"
                            isLoading={isUpdatingProfile}
                            disabled={isUpdatingProfile}
                        >
                            {isUpdatingProfile ? "Saving..." : "Save Changes"}
                        </Button>
                    </div>
                </form>
            </div>

            <div className="rounded-lg bg-discord-card p-6">
                <div className="mb-6">
                    <h2 className="text-xl font-semibold text-discord-text-normal">Update Password</h2>
                    <p className="text-sm text-discord-text-muted mt-1">Ensure your account is using a long, random password to stay secure.</p>
                </div>

                <form onSubmit={updatePassword} className="space-y-6">
                    <div>
                        <Label htmlFor="current_password" required>
                            Current Password
                        </Label>
                        <Input
                            id="current_password"
                            type="password"
                            value={currentPassword}
                            onChange={(e) => setCurrentPassword(e.target.value)}
                            className="mt-1 w-full bg-discord-input text-discord-text-normal"
                            placeholder="Enter current password"
                            required
                            error={!!errors.current_password}
                        />
                        <InputError message={errors.current_password} />
                    </div>

                    <div>
                        <Label htmlFor="new_password" required>
                            New Password
                        </Label>
                        <Input
                            id="new_password"
                            type="password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            className="mt-1 w-full bg-discord-input text-discord-text-normal"
                            placeholder="Enter new password (min. 8 characters)"
                            required
                            minLength={8}
                            error={!!errors.password}
                        />
                        <InputError message={errors.password} />
                    </div>

                    <div>
                        <Label htmlFor="confirm_password" required>
                            Confirm Password
                        </Label>
                        <Input
                            id="confirm_password"
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="mt-1 w-full bg-discord-input text-discord-text-normal"
                            placeholder="Confirm new password"
                            required
                            minLength={8}
                            error={!!errors.password_confirmation}
                        />
                        <InputError message={errors.password_confirmation} />
                    </div>

                    <div className="flex justify-end">
                        <Button
                            type="submit"
                            isLoading={isUpdatingPassword}
                            disabled={isUpdatingPassword}
                        >
                            {isUpdatingPassword ? "Updating..." : "Update Password"}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default SettingsPage