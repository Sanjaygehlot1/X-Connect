"use client"
import { Card, CardContent } from "@/components/ui/card"
import { zodResolver } from "@hookform/resolvers/zod"
import { verifySchema } from "@/Schemas/VerifySchema"
import { Button } from "@/components/ui/button"
import { usePathname } from "next/navigation"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { useState } from "react"
import { z } from "zod"
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import {
    InputOTP,
    InputOTPGroup,
    InputOTPSlot,
} from "@/components/ui/input-otp"
import axios, { AxiosError } from "axios"
import path from "path"
import { ApiResponse } from "@/lib/utils/ApiResponse"
import { toast } from "sonner"
import { CheckCircle, Loader, XCircle } from "lucide-react"

const FormSchema = verifySchema

function page() {
    const [isverifying, setisVerifying] = useState(false)
    const [verifyMessage, setverifyMessage] = useState("")

    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            code: "",
        },
    })

    const router = useRouter()

    const pathname = usePathname()
    console.log(pathname.trim().split("/"))
    const username = pathname.trim()?.toString().split("/")[2]
    console.log(username)
    async function onSubmit(data: z.infer<typeof FormSchema>) {
        setisVerifying(true)
        try {
            const response = await axios.post<ApiResponse>(`/api/verify-code`, { username, code: data.code })
            console.log(response)
            console.log(data)
            if (response.data.success) {
                router.replace("/dashboard")
                toast("Verfication successful", {
                    description: "email verified successfully",
                    icon: <CheckCircle />,
                    position: "top-center"
                })
            }else{
                toast("VerficationFailed", {
                    description: response.data.message || "Unexpected error occured",
                    position: "top-center",
                    icon: <XCircle color="red"/>
                })
            }
            setisVerifying(false)

        } catch (error) {
            const AxiosError = error as AxiosError<ApiResponse>
            setverifyMessage(AxiosError.response?.data.message || "")
            console.log(error)
            toast("Verification Failed",
                {
                    position: "top-center",
                    description: AxiosError.response?.data.message || "",
                    icon:  <XCircle color="red"/>
                }
            )
            setisVerifying(false)
        }
    }

    return (
        <div className="flex items-center justify-center min-h-screen bg-black p-4">
            <Card className="w-full max-w-md shadow-lg">
                <CardContent className="p-6 space-y-6">
                    <h2 className="text-2xl font-bold text-center">Verify Your Account</h2>
                    <p className="text-white text-center">
                        Enter the verification code sent to your email
                    </p>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="w-2/3 space-y-6 mx-auto">
                            <FormField
                                control={form.control}
                                name="code"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>One time verification Code</FormLabel>
                                        <FormControl>
                                            <InputOTP maxLength={4} {...field}>
                                                <InputOTPGroup>
                                                    <InputOTPSlot index={0} />
                                                    <InputOTPSlot index={1} />
                                                    <InputOTPSlot index={2} />
                                                    <InputOTPSlot index={3} />
                                                </InputOTPGroup>
                                            </InputOTP>
                                        </FormControl>
                                        <FormDescription>
                                            Please enter the one-time code sent to your email.
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <Button type="submit" className="w-full" disabled={isverifying}>
                                {isverifying ? <Loader className="animate-spin" /> : "Submit"}
                            </Button>
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </div>
    )
}

export default page
