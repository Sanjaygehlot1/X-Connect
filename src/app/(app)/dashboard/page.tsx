import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { ApiResponse } from '@/lib/utils/ApiResponse';
import { Message } from '@/Models/message.model';
import axios, { AxiosError } from 'axios';
import { Loader, RefreshCcw } from 'lucide-react';
import { useSession } from 'next-auth/react';
import React, {useState} from 'react'
import { MessageCard } from '@/components/MessageCard';
import { toast } from 'sonner';
import { AcceptMessageSchema } from '@/Schemas/AcceptMessageSchema';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

function page() {

  const [messages, setmessages] = useState<Message[]>([])
  const [isLoading, setisLoading] = useState(false)
  const [isTogglingSwitch, setisTogglingSwitch] = useState(false)

  const {data: session} = useSession()
  const username = session?.user?.username

  const host = window.location.host
  const protocol = window.location.protocol

  const form  = useForm({
    resolver: zodResolver(AcceptMessageSchema)
  })

  const {setValue, register} = form



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
            description: response.data.message
          });
      }
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
        toast("Error",{
          description:
            axiosError.response?.data.message ?? 'Failed to fetch messages',
        });
    }finally{
      setisLoading(false)
    }
  }

  const CopyToClipboard = ()=>{
    navigator.clipboard.writeText(`${protocol}//${host}/m/${username}`)
    toast("Copied to clipboard",{
      position: "top-center"
    })
  }



  return (
    <div className="my-8 mx-4 md:mx-8 lg:mx-auto p-6 bg-white rounded w-full max-w-6xl">
    <h1 className="text-4xl font-bold mb-4">User Dashboard</h1>

    <div className="mb-4">
      <h2 className="text-lg font-semibold mb-2">Copy Your Unique Link</h2>{' '}
      <div className="flex items-center">
        <input
          type="text"
          value={`${protocol}//${host}/m/${username}`}
          disabled
          className="input input-bordered w-full p-2 mr-2"
        />
        <Button onClick={CopyToClipboard}>Copy</Button>
      </div>
    </div>

    <div className="mb-4">
      <Switch
        {...register('acceptMessages')}
        checked={}
        onCheckedChange={}
        disabled={isTogglingSwitch}
      />
      <span className="ml-2">
        Accept Messages: {isTogglingSwitch ? 'On' : 'Off'}
      </span>
    </div>
    <Separator />

    <Button
      className="mt-4"
      variant="outline"
      onClick={(e) => {
        e.preventDefault();
        GetAllMessages();
      }}
    >
      {isLoading ? (
        <Loader className="h-4 w-4 animate-spin" />
      ) : (
        <RefreshCcw className="h-4 w-4" />
      )}
    </Button>
    <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
      {messages.length > 0 ? (
        messages.map((singleMessage, index) => (
          <MessageCard
            key={index}
            message={singleMessage}
            onMessageDelete={GetMessagesAfterDelete}
          />
        ))
      ) : (
        <p>No messages to display.</p>
      )}
    </div>
  </div>
  )
}

export default page
