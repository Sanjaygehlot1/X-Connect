'use client'
import { zodResolver } from "@hookform/resolvers/zod"
import { SignUpSchema } from "@/Schemas/SignupSchema"
import { ApiResponse } from "@/lib/utils/ApiResponse"
import { useDebounceCallback } from "usehooks-ts"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import axios, { AxiosError } from "axios"
import { Loader } from "lucide-react"
import { toast } from "sonner"
import { CheckCircle, XCircle } from "lucide-react"
import { z } from "zod"
import Link from "next/link"
import Image from "next/image"

function SignUpPage() {

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
                        description: "Please verify email to complete signup",
                        icon: <CheckCircle/>
                    })
                    router.replace(`/verify/${username}`)
                }else{
                    toast("Signup Failed!", {
                        position: "top-center",
                        description: submitResponse.data.message ?? "Unexpected error occured",
                        icon: <XCircle color="red"/>
                    })
                }
                setisSubmitting(false)

            } catch (error) {
                console.error('Error during sign-up:', error);

                const axiosError = error as AxiosError<ApiResponse>;
                toast("Signup Failed!", {
                    position: "top-center",
                    description: axiosError.response?.data.message ?? "Unexpected error occured",
                    icon: <XCircle color="red"/>
                })
                setisSubmitting(false)
            }
        }
    }

    return (
        <div className="flex min-h-screen bg-black text-white items-center justify-center  p-4">
            <div className="w-full max-w-md rounded-md bg-black text-white p-6 shadow-md sm:w-96">
                <div className="flex flex-col bg-black text-white items-center gap-2">
                    <Link href="/" className="flex bg-black text-white flex-col items-center gap-2 font-medium">
                        <div className="flex h-16 w-[116px] items-center justify-center rounded-md bg-black text-white">
                       <Image src="/icon.svg" width={150} height={96} alt="X Connect"></Image>
                        </div>
                        <span className="sr-only bg-black text-white">X Connect</span>
                    </Link>
                    <h1 className="text-xl font-bold bg-black text-white">Welcome to X Connect</h1>
                    <p className="text-center text-sm text-muted-foreground bg-black text-white">
                        <span className="font-semibold bg-black text-white">&quot;Connect Anonymously, Share Freely.&quot;</span>
                    </p>
                </div>

                <form onSubmit={form.handleSubmit(submit)} className="mt-6 space-y-4 bg-black text-white">
                    <div className="grid gap-2 bg-black text-white">
                        <Label htmlFor="username" className="bg-black text-white">Username</Label>
                        <Input
                            id="username"
                            type="text"
                            placeholder="John Doe"
                            required
                            className="bg-black text-white"
                            {...register("username", { required: "Username is required" })}
                            onChange={(e) => {
                                debouncedValue(e.target.value);
                            }}
                        />
                        {isChecking && <Loader className="animate-spin text-gray-500" />}
                        {usernameMessage && <p className={usernameMessage == "username is available"? "text-green-500" : "text-red-600" }>{usernameMessage}</p>}
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                            id="email"
                            type="email"
                            placeholder="example@gmail.com"
                            required
                            className="bg-black text-white"
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
                            className="bg-black text-white"
                            {...register("password", { required: "Password is required" })}
                        />
                        {errors.password && <p className="text-red-500">{errors.password.message}</p>}
                    </div>

                    <Button type="submit" className="w-full bg-white text-black">
                        {isSubmitting ? <Loader className="animate-spin" /> : "Sign up"}
                    </Button>
                </form>

                <p className="mt-4 text-center text-sm text-muted-foreground bg-black text-white">
                    Already have an account?{" "}
                    <a href="/signin" className="underline underline-offset-4 bg-black text-white hover:text-primary">
                        Sign in
                    </a>
                </p>
            </div>
        </div>

    )
}

export default SignUpPage
