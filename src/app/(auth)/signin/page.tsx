'use client'
import { ModeToggle } from "@/ThemeProvider/toggleTheme"
import { zodResolver } from "@hookform/resolvers/zod"
import { GalleryVerticalEnd } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { signIn } from "next-auth/react"
import { Loader } from "lucide-react"
import { toast } from "sonner"
import { z } from "zod"
import { signInSchema } from "@/Schemas/SignInSchema"

function signInPage() {

    const [isSubmitting, setisSubmitting] = useState(false)

    const router = useRouter()

    const form = useForm<z.infer<typeof signInSchema>>({
        resolver: zodResolver(signInSchema),
        defaultValues: {
            email: "",
            password: ""
        }
    })

    const { register, formState: { errors } } = form


    const submit = async (data: z.infer<typeof signInSchema>) => {
        setisSubmitting(true)
        console.log(data)
        if (data) {
            const result = await signIn('credentials', {
                redirect: false,
                email: data.email,
                password: data.password
            })
            if (result?.error) {
                if (result.error === "CredentialsSignin") {
                    toast("Sign in Failed", {
                        description: 'Incorrect email or password'
                    });
                } else {
                    toast("Sign in Failed", {
                        description: result.error,
                    });
                }
            }
            setisSubmitting(false)
            if(result?.url){
                toast("Sign in successful", {
                    description: "user logged in successfully",
                });
                router.replace('/dashboard')
            }
        }
    }

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-100 p-4">
            <div className="w-full max-w-md rounded-md bg-white p-6 shadow-md sm:w-96">
                <ModeToggle />
                <div className="flex flex-col items-center gap-2">
                    <a href="#" className="flex flex-col items-center gap-2 font-medium">
                        <div className="flex h-10 w-10 items-center justify-center rounded-md bg-gray-200">
                            <GalleryVerticalEnd className="size-6 text-gray-700" />
                        </div>
                        <span className="sr-only">X Connect</span>
                    </a>
                    <h1 className="text-xl font-bold">Welcome to X Connect</h1>
                    <p className="text-center text-sm text-muted-foreground">
                        <span className="font-semibold">"Speak Freely, Stay Anonymous."</span>
                    </p>
                </div>

                <form onSubmit={form.handleSubmit(submit)} className="mt-6 space-y-4">
                    <div className="grid gap-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                            id="email"
                            type="email"
                            placeholder="example@gmail.com"
                            required
                            {...register("email", { required: "email is required" })}
                        />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="password">Password</Label>
                        <Input
                            id="password"
                            type="password"
                            placeholder="*********"
                            required
                            {...register("password", { required: "password is required" })}
                        />
                        {errors.password && <p className="text-red-500">{errors.password.message}</p>}
                    </div>
                    <Button type="submit" className="w-full">
                        {isSubmitting ? <Loader className="animate-spin" /> : "Sign In"}
                    </Button>
                </form>

                <p className="mt-4 text-center text-sm text-muted-foreground">
                    haven't joined yet ?{" "}
                    <a href="#" className="underline underline-offset-4 hover:text-primary">
                        Sign in
                    </a>
                </p>
            </div>
        </div>

    )
}

export default signInPage
