'use client'
import React, { useEffect, useState } from 'react'
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useForm } from 'react-hook-form'
import { DemoMessages } from './DemoMessages'
import { zodResolver } from '@hookform/resolvers/zod'
import { messageSchema } from '@/Schemas/MessageSchema'
import axios, { AxiosError } from 'axios'
import { z } from 'zod'
import { useParams } from 'next/navigation'
import { toast } from 'sonner'
import { ApiResponse } from '@/lib/utils/ApiResponse'
import { CheckCircle, Loader, XCircle } from 'lucide-react'

const MessageUser = () => {

  const [AiMessages, setAiMessages] = useState<string[]>([])
  const [isSending, setisSending] = useState(false)
  const [isGeneratingMessages, setisGeneratingMessages] = useState(false)
  const form = useForm({
    resolver: zodResolver(messageSchema)
  })

  const { register, setValue, formState: { errors } } = form
  const { username } = useParams()

  const handleSendMessage = async (data: z.infer<typeof messageSchema>) => {
    setisSending(true)
    try {
      const response = await axios.post<ApiResponse>("/api/send-message", { content: data.content, username: username })
      toast("Message sent",
        {
          description: <span className='dark:text-white text-black'>{response.data.message ? `${response.data.message} to ${username}` : `message delivered successfully to ${username}`}</span>,
          position: "top-center",
          icon: <CheckCircle/>
        }
      )
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>
      toast("Error",
        {
          description: <span className='dark:text-white text-black'>{axiosError.response?.data.message}</span>,
          position: "top-center",
          icon: <XCircle color='red'/>
        })
    } finally {
      setisSending(false)
    }
  }

  const GetAiSuggestedMessages = async () => {
    setisGeneratingMessages(true)
    try {
      const response = await axios.post<string>("/api/generate-messages")
      const MessagesArray = response.data.split("||")
      setAiMessages(MessagesArray)
    } catch (error) {
      toast("Error",
        {
          description: <span className='dark:text-white text-black'>Something went wrong</span>,
          position: "top-center",
          icon:<XCircle color='red'/>
        })
    } finally {
      setisGeneratingMessages(false)
    }
  }

  useEffect(() => {
    setAiMessages(DemoMessages)
  }, [])

  return (
    <div className='w-full mt-3 px-4 sm:px-6 lg:px-8 flex flex-col items-center space-y-6'>
      <div className='w-full max-w-4xl'>
        <Card className="w-full shadow-lg rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-black p-4">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-900 dark:text-gray-100">Message Anonymously</CardTitle>
            <CardDescription className="text-sm text-black dark:text-white">
              Message <h2 className="text-base inline  font-bold">{username}</h2> Anonymously with X Connect
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={form.handleSubmit(handleSendMessage)} className="space-y-4">
              <div className="flex flex-col space-y-2">
                <Label htmlFor="content" className="text-sm font-medium text-black dark:text-white">Message</Label>
                <Input id="content" placeholder="Send a message"
                  {...register("content")} className="border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-white dark:bg-black dark:text-white dark:border-gray-600" />
              </div>
              {errors.content && <p className='text-red-600 text-sm'>{errors.content.message}</p>}
              <Button type='submit' variant="default" className="w-fit flex items-center justify-center gap-2 py-2">
                {isSending ? <Loader className='animate-spin' /> : "Send Message"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>

      <div className='w-full max-w-4xl flex justify-start flex-col space-y-4'>
        <h2 className="text-lg w-fit font-semibold text-black dark:text-white text-center">AI Messages</h2>
        <Button onClick={GetAiSuggestedMessages} className=" w-fit flex items-center justify-center gap-2 py-2">
          {isGeneratingMessages ? <Loader className='animate-spin' /> : "Generate Messages"}
        </Button>
        <div className="w-full space-y-2 py-4">
          {AiMessages.length !== 0 ? AiMessages.map((message, index) => (
            <div
              key={index}
              onClick={() => setValue("content", message)}
              className="w-full cursor-pointer text-black dark:text-white bg-white dark:bg-black border border-gray-300 dark:border-gray-600 p-3 rounded-md shadow-sm transition-all duration-200 hover:bg-gray-100 dark:hover:bg-gray-950 active:scale-95"
            >
              {message}
            </div>
          )) : <p className="text-black text-sm dark:text-white text-center">No messages yet</p>}
        </div>
      </div>
    </div>


  )
}

export default MessageUser
