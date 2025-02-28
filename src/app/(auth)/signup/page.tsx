'use client'
import {ModeToggle} from "@/ThemeProvider/toggleTheme"
import { zodResolver } from "@hookform/resolvers/zod"
import { SignUpSchema } from "@/Schemas/SignupSchema"
import { ApiResponse } from "@/lib/utils/ApiResponse"
import { useDebounceCallback } from "usehooks-ts"
import { GalleryVerticalEnd } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import axios, { AxiosError } from "axios"
import { Loader } from "lucide-react"
import { toast } from "sonner"
import { z } from "zod"

function signUpPage() {

    const [usernameMessage, setusernameMessage] = useState("")
    const [username, setusername] = useState("")
    const debouncedValue = useDebounceCallback(setusername, 500)
    const [isChecking, setisChecking] = useState(false)
    const [isSubmitting, setisSubmitting] = useState(false)

    const router = useRouter()

    const form = useForm<z.infer<typeof SignUpSchema>>({
        resolver: zodResolver(SignUpSchema),
        defaultValues: {
            username: "",
            email: "",
            password: ""
        }
    })

    const { register, formState: { errors } } = form

    

    useEffect(() => {
            const CheckUniqueUsername = async () => {
                if (username) {
                    setisChecking(true)
                    setusernameMessage('')
                    try {
                        const usernameResponse = await axios.get<ApiResponse>(`/api/unique-username?username=${username}`)
                        if (usernameResponse.data?.message) {
                            setusernameMessage(usernameResponse.data?.message)
                        }
                        setisChecking(false)

                    } catch (error) {
                        const AxiosError = error as AxiosError<ApiResponse>
                        setusernameMessage(AxiosError.response?.data.message ?? "Something went wrong")
                        setisChecking(false)
                    }
                }
            }
            CheckUniqueUsername()
        
    }, [username])

    const submit = async (data: z.infer<typeof SignUpSchema>) => {
        setisSubmitting(true)
        console.log(data)
        if (data) {
            try {
                const submitResponse = await axios.post<ApiResponse>("/api/signup", { username: data.username, email: data.email, password: data.password })

                if (submitResponse.data.success) {
                    toast("Signup almost done", {
                        position: "top-center",
                        description: "Please verify email to complete signup"
                    })
                    router.replace(`/verify/${username}`)
                }else{
                    toast("Signup Failed!", {
                        position: "top-center",
                        description: submitResponse.data.message ?? "Unexpected error occured"
                    })
                }
                setisSubmitting(false)

            } catch (error) {
                console.error('Error during sign-up:', error);

                const axiosError = error as AxiosError<ApiResponse>;
                toast("Signup Failed!", {
                    position: "top-center",
                    description: axiosError.response?.data.message ?? "Unexpected error occured"
                })
                setisSubmitting(false)
            }
        }
    }

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-100 p-4">
            <div className="w-full max-w-md rounded-md bg-white p-6 shadow-md sm:w-96">
                <ModeToggle/>
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
                        <Label htmlFor="username">Username</Label>
                        <Input
                            id="username"
                            type="text"
                            placeholder="John Doe"
                            required
                            {...register("username", { required: "Username is required" })}
                            onChange={(e) => {
                                debouncedValue(e.target.value);
                            }}
                        />
                        {isChecking && <Loader className="animate-spin text-gray-500" />}
                        {usernameMessage && <p className="text-red-500">{usernameMessage}</p>}
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                            id="email"
                            type="email"
                            placeholder="m@example.com"
                            required
                            {...register("email", { required: "Email is required" })}
                        />
                        {errors.email && <p className="text-red-500">{errors.email.message}</p>}
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="password">Password</Label>
                        <Input
                            id="password"
                            type="password"
                            placeholder="*********"
                            required
                            {...register("password", { required: "Password is required" })}
                        />
                        {errors.password && <p className="text-red-500">{errors.password.message}</p>}
                    </div>

                    <Button type="submit" className="w-full">
                        {isSubmitting ? <Loader className="animate-spin" /> : "Sign up"}
                    </Button>
                </form>

                <p className="mt-4 text-center text-sm text-muted-foreground">
                    Already have an account?{" "}
                    <a href="/signin" className="underline underline-offset-4 hover:text-primary">
                        Sign in
                    </a>
                </p>
            </div>
        </div>

    )
}

export default signUpPage
