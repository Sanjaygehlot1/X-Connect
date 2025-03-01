'use client'
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { ApiResponse } from '@/lib/utils/ApiResponse';
import { Message } from '@/Models/message.model';
import axios, { AxiosError } from 'axios';
import { Copy, Loader, RefreshCcw } from 'lucide-react';
import { useSession } from 'next-auth/react';
import React, {useEffect, useState} from 'react'
import { MessageCard } from '@/components/MessageCard';
import { toast } from 'sonner';
import { AcceptMessageSchema } from '@/Schemas/AcceptMessageSchema';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

function page() {

  const [messages, setmessages] = useState<Message[]>([])
  const [isLoading, setisLoading] = useState(false)
  const [isTogglingSwitch, setisTogglingSwitch] = useState(false)

  const {data: session} = useSession()
  const username = session?.user?.username

  const host = window?.location.host
  const protocol = window?.location.protocol

  const form  = useForm({
    resolver: zodResolver(AcceptMessageSchema)
  })

  const {setValue, register,watch} = form
  const isAcceptingmessages = watch('messagePreference')


  const GetMessagesAfterDelete = (messageId : string)=>{
    setmessages(messages.filter((message)=>message._id !== messageId))
  }

  const GetAllMessages = async()=>{
    setisLoading(true)
    try {
    const response =  await axios.get<ApiResponse>('/api/get-messages')
      if(response){
          setmessages(response.data.messages || [])
          toast("Messages Refreshed",{
            description: <span className="dark:text-white text-black">{response.data.message}</span>,
            position: "top-center",
            duration: 1000,
          });
      }
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
        toast("Error",{
          description:
            <span className='dark:text-white text-black'>{axiosError.response?.data.message ??  'Failed to fetch messages'}</span>,
            position: "top-center",
            duration: 1000
        });
    }finally{
      setisLoading(false)
    }
  }

  const ToggleMessagePref = async()=>{
    setisTogglingSwitch(true)
    try {
    const response =  await axios.patch<ApiResponse>("/api/accept-message")
      setValue("messagePreference", response.data.isAcceptingMessage as boolean)
      console.log(response.data.isAcceptingMessage)
      toast("Message Preference toggled",
        {
          position: "top-center",
          description: <span className='dark:text-white text-black'>{response.data.isAcceptingMessage ? "Message preference: ON" : "Message preference: OFF"}</span>,
          duration: 1000
        }
      )
    } catch (error) {
      const AxiosError = error as AxiosError<ApiResponse>
      toast("Error",{
        description: <span className='dark:text-white text-black'>{AxiosError.response?.data.message ??  'Failed to update message preference'}</span>,
        position: "top-center",
        duration: 1000
      })
    }finally{
      setisTogglingSwitch(false)
    }
  }

  const GetMessagePref = async()=>{
    try {
      const response = await axios.get<ApiResponse>("/api/accept-message")
      setValue("messagePreference",response.data.isAcceptingMessage as boolean)

    } catch (error) {
      console.log("EROORL::",error)
      const AxiosError = error as AxiosError<ApiResponse>
      toast("Erro",{
        description: <span className='dark:text-white text-black'>{AxiosError.response?.data.message ??  'Failed to fetch message prefernece'}</span>,
        position: "top-center",
        duration: 1000
      })
    }
  }
  
  useEffect(()=>{
    GetAllMessages()
    GetMessagePref()
  },[watch])

  const CopyToClipboard = ()=>{
    navigator.clipboard.writeText(`${protocol}//${host}/m/${username}`)
    toast("Copied to clipboard",{
      position: "top-center",
      duration: 1000
    })
  }

  if (!session || !session.user) {
    return <div>Please login to continue</div>;
  }

  return (
    <div className="max-w-full mx-auto p-8 bg-white dark:bg-black dark:text-white rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
    <h1 className="text-4xl font-poppins font-bold text-gray-900 dark:text-white mb-6">User Dashboard</h1>
  
    <Card className="mb-6 bg-gray-50 dark:bg-black border border-gray-300 dark:border-gray-600">
      <CardHeader>
        <CardTitle className="text-xl font-semibold text-gray-800 dark:text-gray-200">Your Unique Link</CardTitle>
      </CardHeader>
      <CardContent className="flex items-center gap-4 p-4">
        <Input
          value={`${protocol}//${host}/m/${username}`}
          readOnly
          className="flex-1 text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 p-2 rounded-md"
        />
        <Button
          variant="outline"
          onClick={CopyToClipboard}
          className="flex items-center px-4 py-2 border border-gray-400 dark:border-gray-600 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700"
        >
          <Copy className="h-5 w-5 mr-2" />
        </Button>
      </CardContent>
    </Card>
  
    <Card className="mb-6 flex items-center justify-between p-4 bg-gray-50 dark:bg-black border border-gray-300 dark:border-gray-600">
      <span className="text-gray-700 dark:text-gray-300 font-medium text-lg">Accept Messages</span>
      <Switch checked={isAcceptingmessages} disabled={isTogglingSwitch} onCheckedChange={ToggleMessagePref} />
    </Card>
  
    <div className="flex justify-between items-center mb-6">
      <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200">Your Messages</h2>
      <Button
        variant="outline"
        onClick={GetAllMessages}
        disabled={isLoading}
        className="flex items-center px-4 py-2 border border-gray-400 dark:border-gray-600 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700"
      >
        {isLoading ? <Loader className="h-5 w-5 animate-spin" /> : <RefreshCcw className="h-5 w-5" />} Refresh
      </Button>
    </div>
  
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {messages.length > 0 ? (
        messages.map((message, index) => (
          <MessageCard key={index} message={message} onMessageDelete={GetMessagesAfterDelete} />
        ))
      ) : (
        <p className="text-gray-500 dark:text-gray-400 text-center">No messages available.</p>
      )}
    </div>
  </div>
  
  )
}

export default page
