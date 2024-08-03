"use client"
import { db } from '@/utils/db';
import { UserAnswer } from '@/utils/schema';
import { eq } from 'drizzle-orm';
import React, { useEffect, useState } from 'react';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {ChevronsUpDown} from 'lucide-react'
import { Button } from "@/components/ui/button";
import { useRouter } from 'next/navigation';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

const Feedback = ({params}) => {
  const [feedbackList, setFeedbackList] = useState([]);
  const router = useRouter()

  useEffect(() => {
    getFeedback();
  }, [])

  const getFeedback = async () => {
    try {
      const { data, error } = await supabase
        .from('user_answers')
        .select('*')
        .eq('mock_id_ref', params.interviewId)
        .order('id', { ascending: true });

      if (error) throw error;

      console.log("🚀 ~ file: page.jsx:11 ~ getFeedback ~ data:", data);
      setFeedbackList(data);
    } catch (error) {
      console.error("Error fetching feedback:", error);
    }
  }



  return (
    <div className='p-10'>
      <h2 className='text-3xl font-bold text-green-600'>Congratulations!</h2>
      <h2 className='font-bold text-2xl'>Here is your interview feedback</h2>
      {feedbackList?.length ==0 ?
      <h2 className='font-bold text-lg text-green-500'>No interview Feedback</h2>
      : <>
      <h2 className='text-primary text-lg my-2'>
        Your overall interview rating: <strong>7/10</strong>
      </h2>
      <h2 className='text-sm text-gray-500'>Find below interview questions with coreect answers,Your answer and feedback for improvements for your next interview</h2>
      {feedbackList&&feedbackList.map((item,index)=>(
        <Collapsible key={index} className='mt-7'>
        <CollapsibleTrigger className='p-2 flex justify-between bg-secondary rounded-lg my-2 text-left gap-7 w-full'>
        {item.question} <ChevronsUpDown className='h-4'/>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <div className='flex flex-col gap-2'>
            <h2 className='text-red-500 p-2 border rounded-lg'>
              <strong>
                Rating:
              </strong>
              {item.rating}
            </h2>
            <h2 className='p-2 border rounded-lg bg-red-50 text-sm text-red-900'><strong>Your Answer: </strong>{item.userAns}</h2>
            <h2 className='p-2 border rounded-lg bg-green-50 text-sm text-green-900'><strong>Correct Answer Looks Like: </strong>{item.correctAns}</h2>
            <h2 className='p-2 border rounded-lg bg-blue-50 text-sm text-primary'><strong>Feedback: </strong>{item.feedback}</h2>
          </div>
        </CollapsibleContent>
      </Collapsible>      
      ))}
      </>
      }
   <Button className='mt-5' onClick={()=>router.replace('/dashboard')}> Go Home</Button>
    </div>
  );
}

export default Feedback;
