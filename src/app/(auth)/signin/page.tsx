'use client'
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { signIn } from "next-auth/react"
import { Loader } from "lucide-react"
import { toast } from "sonner"
import { z } from "zod"
import { signInSchema } from "@/Schemas/SignInSchema"
import { CheckCircle, XCircle } from "lucide-react"

function SignInPage() {

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
        if (data) {
            const result = await signIn('credentials', {
                redirect: false,
                email: data.email,
                password: data.password
            })
            if (result?.error) {
                if (result.error === "CredentialsSignin") {
                    toast("Sign in Failed", {
                        description: 'Incorrect email or password',
                        position: "top-center",
                        icon: <XCircle color="red" />
                    });
                } else {
                    toast("Sign in Failed", {
                        description: result.error,
                        position: "top-center",
                        icon: <XCircle color="red" />
                    });
                }
            }
            setisSubmitting(false)
            if (result?.url) {
                toast("Sign in successful", {
                    description: "user logged in successfully",
                    position: "top-center",
                    icon: <CheckCircle />
                });
                await new Promise((resolve) => setTimeout(resolve, 1000)); 
                router.push('/dashboard');
                
            }
        }
    }

    return (
        <div className="flex min-h-screen items-center justify-center bg-black text-white p-4">

            <div className=" w-full max-w-md rounded-md bg-black text-white shadow-md sm:w-96 p-4">
                <div className="flex flex-col items-center gap-2">
                    <Link href="/" className="flex flex-col items-center gap-2 font-medium">
                        <div className="flex h-16 w-[116px] items-center justify-center rounded-mdbg-black text-white">
                            <Image src="/icon.svg" width={150} height={96} alt="X Connect"></Image>
                        </div>
                        <span className="sr-only bg-black text-white">X Connect</span>
                    </Link>
                    <h1 className="text-xl font-bold bg-black text-white">Welcome to X Connect</h1>
                    <p className="text-center text-sm text-muted-foreground">
                        <span className="font-semibold">&quot;Connect Anonymously, Share Freely.&quot;</span>
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
                            className="bg-black text-white"
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
                            className="bg-black text-white"
                            {...register("password", { required: "password is required" })}
                        />
                        {errors.password && <p className="text-red-500">{errors.password.message}</p>}
                    </div>
                    <Button type="submit" className=" bg-white text-black w-full">
                        {isSubmitting ? <Loader className="animate-spin" /> : "Sign in"}
                    </Button>
                </form>

                <p className="mt-4 text-center text-sm text-muted-foreground">
                    haven&#39;t joined yet?{" "}
                    <a href="/signup" className="text-white underline underline-offset-4 hover:text-primary">
                        Sign up
                    </a>
                </p>
            </div>
        </div>

    )
}

export default SignInPage
