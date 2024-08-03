"use client"
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { createClient } from "@supabase/supabase-js";
import { useUser } from "@clerk/nextjs";
import Link from "next/link";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { UserButton } from "@clerk/nextjs";
import { ShoppingBag, Clock, Plus, MessageSquare, Send, Check, X } from "lucide-react";
import { Bricolage_Grotesque } from 'next/font/google'
import { Space_Mono } from 'next/font/google'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

const fontBold = Bricolage_Grotesque({
  subsets: ['latin'],
  display: 'swap',
  weight: '700',
  variable: '--font-heading',
})

const fontBody = Space_Mono({
  subsets: ['latin'],
  display: 'swap',
  weight: '400',
  variable: '--font-body',
})

function ProjectDetails({ project, user }) {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [offer, setOffer] = useState(null);
  const [offerForm, setOfferForm] = useState({ title: '', description: '', amount: '' });
  const [workSubmissionForm, setWorkSubmissionForm] = useState({ link: '', description: '' });
  const messagesEndRef = useRef(null);





  
  useEffect(() => {
    fetchMessages();
    fetchOffer();
    const subscription = supabase
      .channel(`project-${project.id}`)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'messages', filter: `project_id=eq.${project.id}` }, handleNewMessage)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'offers', filter: `project_id=eq.${project.id}` }, handleOfferChange)
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }, [project.id]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const fetchMessages = async () => {
    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .eq('project_id', project.id)
      .order('created_at', { ascending: true });

    if (data) setMessages(data);
  };

  const fetchOffer = async () => {
    const { data, error } = await supabase
      .from('offers')
      .select('*')
      .eq('project_id', project.id)
      .single();
    
    if (data) setOffer(data);
  };

  const handleNewMessage = (payload) => {
    setMessages(currentMessages => [...currentMessages, payload.new]);
  };

  const handleOfferChange = (payload) => {
    setOffer(payload.new);
  };

  const sendMessage = async (content, type = 'text') => {
    const { data, error } = await supabase
      .from('messages')
      .insert({
        project_id: project.id,
        user_id: user.id,
        content,
        type
      })
      .select();

    if (error) console.error('Error sending message:', error);
    else {
      setNewMessage('');
      setMessages(currentMessages => [...currentMessages, data[0]]);
    }
  };

  const createOffer = async () => {
    const { data, error } = await supabase
      .from('offers')
      .insert({
        project_id: project.id,
        title: offerForm.title,
        description: offerForm.description,
        amount: parseFloat(offerForm.amount),
        status: 'pending'
      })
      .select()
      .single();

    if (data) {
      setOffer(data);
      sendMessage(JSON.stringify(data), 'offer_created');
      setOfferForm({ title: '', description: '', amount: '' });
    }
  };

  const payOffer = async (paymentDetails) => {
    const { data, error } = await supabase
      .from('offers')
      .update({ status: 'paid', payment_details: paymentDetails })
      .eq('id', offer.id)
      .select()
      .single();

    if (data) {
      setOffer(data);
      sendMessage('Offer has been paid', 'offer_paid');
    }
  };

  const submitWork = async () => {
    const { data, error } = await supabase
      .from('offers')
      .update({ 
        work_submission: workSubmissionForm,
        status: 'work_submitted' 
      })
      .eq('id', offer.id)
      .select()
      .single();

    if (data) {
      setOffer(data);
      sendMessage(`Work submitted: ${workSubmissionForm.link}`, 'work_submitted');
      setWorkSubmissionForm({ link: '', description: '' });
    }
  };

  const approveWork = async () => {
    const { data, error } = await supabase
      .from('offers')
      .update({ status: 'completed' })
      .eq('id', offer.id)
      .select()
      .single();

      if (error) throw error;

      const response = await fetch('http://localhost:5000/api/paypal-payout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          recipientEmail: 'sb-5rvcl31362142@business.example.com',
          amount: '20',
          currency: 'USD', // or whatever currency you're using
        }),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        console.error('PayPal payout error:', errorData);
        throw new Error(`Failed to initiate PayPal payout: ${errorData.error || response.statusText}`);
      }
  
      const payoutResult = await response.json();
      console.log('PayPal payout result:', payoutResult);

    if (data) {
      setOffer(data);
      sendMessage('Work has been approved and payment released', 'work_approved');
      // In a real application, trigger payment to seller's PayPal here
    }
  };

  const requestRevision = async () => {
    const { data, error } = await supabase
      .from('offers')
      .update({ status: 'revision_requested' })
      .eq('id', offer.id)
      .select()
      .single();

    if (data) {
      setOffer(data);
      sendMessage('Revision requested for the submitted work', 'revision_requested');
    }
  };

  const renderMessage = (message) => {
    switch (message.type) {
      case 'text':
        return <p>{message.content}</p>;
      case 'offer_created':
        const offerData = JSON.parse(message.content);
        return (
          <div className="bg-blue-100 p-2 rounded">
            <h4>New Offer Created</h4>
            <p>Title: {offerData.title}</p>
            <p>Description: {offerData.description}</p>
            <p>Amount: ${offerData.amount}</p>
          </div>
        );
      case 'offer_paid':
      case 'work_submitted':
      case 'work_approved':
      case 'revision_requested':
        return <p className="font-bold">{message.content}</p>;
      default:
        return <p>{message.content}</p>;
    }
  };

 

  return (
    <PayPalScriptProvider options={{ "client-id": process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID }}>
    <Card className="">
      <CardHeader>
        <CardTitle>{project.name}</CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[300px] rounded-md border p-4">
          {messages.map(message => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="flex items-start space-x-2 mb-4"
            >
              <Avatar>
                <AvatarFallback>{message.user_id === user.id ? 'You' : 'Other'}</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <p className="font-semibold">{message.user_id === user.id ? 'You' : 'Other'}</p>
                {renderMessage(message)}
              </div>
            </motion.div>
          ))}
          <div ref={messagesEndRef} />
        </ScrollArea>
        <div className="flex items-center space-x-2 mt-4">
          <Input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
            onKeyPress={(e) => e.key === 'Enter' && sendMessage(newMessage)}
          />
          <Button onClick={() => sendMessage(newMessage)}>
            <Send className="h-4 w-4 mr-2" />
            Send
          </Button>
        </div>
      </CardContent>
      <CardFooter>
        <AnimatePresence>
          {project.creator_id === user.id && project.creator_role === 'buyer' && !offer && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="w-full"
            >
              <Card>
                <CardHeader>
                  <CardTitle>Create Offer</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="offerTitle">Offer Title</Label>
                      <Input
                        id="offerTitle"
                        value={offerForm.title}
                        onChange={(e) => setOfferForm({...offerForm, title: e.target.value})}
                        placeholder="Enter offer title"
                      />
                    </div>
                    <div>
                      <Label htmlFor="offerDescription">Offer Description</Label>
                      <Input
                        id="offerDescription"
                        value={offerForm.description}
                        onChange={(e) => setOfferForm({...offerForm, description: e.target.value})}
                        placeholder="Enter offer description"
                      />
                    </div>
                    <div>
                      <Label htmlFor="offerAmount">Offer Amount ($)</Label>
                      <Input
                        id="offerAmount"
                        type="number"
                        value={offerForm.amount}
                        onChange={(e) => setOfferForm({...offerForm, amount: e.target.value})}
                        placeholder="Enter offer amount"
                      />
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button onClick={createOffer}>Create Offer</Button>
                </CardFooter>
              </Card>
            </motion.div>
          )}

          {offer && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="w-full"
            >
              <Card>
                <CardHeader>
                  <CardTitle>Current Offer</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>Status: <Badge>{offer.status}</Badge></p>
                  {project.creator_id === user.id && project.creator_role === 'buyer' && offer.status === 'pending' && (
                    <PayPalButtons
                      createOrder={(data, actions) => {
                        return actions.order.create({
                          purchase_units: [
                            {
                              amount: {
                                value: offer.amount.toString(),
                              },
                            },
                          ],
                        });
                      }}
                      onApprove={(data, actions) => {
                        return actions.order.capture().then((details) => {
                          payOffer(details);
                        });
                      }}
                    />
                  )}
                  {project.creator_id !== user.id && offer.status === 'paid' && (
                    <div className="space-y-4 mt-4">
                      <Input
                        value={workSubmissionForm.link}
                        onChange={(e) => setWorkSubmissionForm({...workSubmissionForm, link: e.target.value})}
                        placeholder="Work Sample Link"
                      />
                      <Input
                        value={workSubmissionForm.description}
                        onChange={(e) => setWorkSubmissionForm({...workSubmissionForm, description: e.target.value})}
                        placeholder="Work Description"
                      />
                      <Button onClick={submitWork}>Submit Work</Button>
                    </div>
                  )}
                  {project.creator_id === user.id && project.creator_role === 'buyer' && offer.status === 'work_submitted' && (
                    <div className="space-y-4 mt-4">
                      <p>Work Link: <a href={offer.work_submission.link} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">{offer.work_submission.link}</a></p>
                      <p>Description: {offer.work_submission.description}</p>
                      <div className="space-x-2">
                        <Button onClick={approveWork}>
                          <Check className="h-4 w-4 mr-2" />
                          Approve Work
                        </Button>
                        <Button onClick={requestRevision} variant="outline">
                          <X className="h-4 w-4 mr-2" />
                          Request Revision
                        </Button>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </CardFooter>
    </Card>
    </PayPalScriptProvider>
  );
}

export default function Component() {
  const [error, setError] = useState(null);
  const { user } = useUser();
  const [credits, setCredits] = useState("");
  const [projectName, setProjectName] = useState('');
  const [role, setRole] = useState('');
  const [inviteEmail, setInviteEmail] = useState('');
  const [projects, setProjects] = useState([]);
  const [invitations, setInvitations] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [allUsers, setAllUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showCreateProject, setShowCreateProject] = useState(false);
  const [showInvitations, setShowInvitations] = useState(false);

  useEffect(() => {
    async function fetchUserCredits() {
      if (user) {
        const { data, error } = await supabase
          .from('escrowuser')
          .select('credits')
          .eq('userid', user.id)
          .single();

        if (error) {
          console.error('Error fetching user credits:', error);
        } else {
          setCredits(data?.credits || 0);
        }
      }
    }

    async function initializeUser() {
      if (!user) return;

      try {
        const { data, error } = await supabase
          .from('escrowuser')
          .select('id, credits')
          .eq('userid', user.id)
          .single();

        if (error && error.code !== 'PGRST116') {
          throw error;
        }

        if (!data) {
          const { data: newUser, error: insertError } = await supabase
            .from('escrowuser')
            .insert({
              userid: user.id,
              email: user.primaryEmailAddress?.emailAddress,
              credits: 100
            })
            .single();

          if (insertError) throw insertError;

          setCredits(100);
        } else {
          setCredits(data.credits);
        }
      } catch (err) {
        console.error('Error initializing user:', err);
        setError('Failed to initialize user data');
      } 
    }

    const fetchAllUsers = async () => {
      try {
        const { data, error } = await supabase
          .from('escrowuser')
          .select('userid, email')
          .order('email');
    
        if (error) throw error;
        setAllUsers(data);
      } catch (error) {
        console.error('Error fetching users:', error);
        setError('Failed to fetch users');
      }
    };
    
    fetchAllUsers();
    initializeUser();
    fetchUserCredits();
  }, [user]);

  useEffect(() => {
    if (user) {
      fetchProjects();
      fetchInvitations();
    }
  }, [user]);

  const handleCreateProject = async (e) => {
    e.preventDefault();
    if (!user) {
      console.error('User not logged in');
      setError('Please log in to create a project');
      return;
    }
  
    try {
      console.log('Attempting to create project with:', { projectName, role, user });
  
      const { data, error } = await supabase
        .from('projects')
        .insert({
          name: projectName,
          creator_id: user.id,
          creator_role: role
        })
        .select()
        
      console.log('Project creation response:', { data, error });
  
      if (error) {
        throw error;
      }
  
      if (!data) {
        throw new Error('Project created but no data returned');
      }
  
      console.log('Project created successfully:', data);
  
      if (role === 'buyer' && inviteEmail) {
        const { data: invitationData, error: invitationError } = await supabase
          .from('invitations')
          .insert({
            project_id: data[0].id,
            invitee_email: inviteEmail,
            status: 'pending'
          });
      
        console.log('Invitation creation response:', { invitationData, invitationError });
      
        if (invitationError) {
          console.error('Error creating invitation:', invitationError);
        }
      }
      
      setError(null);
      setProjectName('');
      setRole('');
      setInviteEmail('');
      fetchProjects();
      setShowCreateProject(false);
    } catch (error) {
      console.error('Error creating project:', error);
      setError(`Failed to create project: ${error.message}`);
    }
  };

  const fetchProjects = async () => {
    if (user) {
      try {
        const { data: createdProjects, error: createdError } = await supabase
          .from('projects')
          .select('*')
          .eq('creator_id', user.id);

        if (createdError) throw createdError;

        const { data: acceptedInvitations, error: acceptedError } = await supabase
          .from('invitations')
          .select('project_id, status')
          .eq('invitee_email', user.primaryEmailAddress.emailAddress)
          .eq('status', 'accepted');

        if (acceptedError) throw acceptedError;

        const acceptedProjectIds = acceptedInvitations.map(inv => inv.project_id);
        const { data: acceptedProjects, error: projectsError } = await supabase
          .from('projects')
          .select('*')
          .in('id', acceptedProjectIds);

        if (projectsError) throw projectsError;

        const allProjects = [
          ...(createdProjects || []),
          ...(acceptedProjects || []).map(project => ({
            ...project,
            status: 'accepted'
          }))
        ];

        setProjects(allProjects);
      } catch (error) {
        console.error('Error fetching projects:', error);
        setError('Failed to fetch projects');
      }
    }
  };

  const fetchInvitations = async () => {
    const { data, error } = await supabase
      .from('invitations')
      .select('*')
      .eq('invitee_email', user.primaryEmailAddress.emailAddress);
    if (error) console.error('Error fetching invitations:', error);
    else setInvitations(data);
  };

  const handleInvitation = async (invitationId, status) => {
    const { error } = await supabase
      .from('invitations')
      .update({ status })
      .eq('id', invitationId);
    if (error) console.error('Error updating invitation:', error);
    else {
      fetchInvitations();
      fetchProjects();
    }
  };

  return (
    <div className="min-h-screen bg-background">
    <header className="bg-primary text-primary-foreground py-4 px-6">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link href="/">
          <div className="flex items-center space-x-2">
            <img src="/logo.png" alt="Logo" className="h-8 w-auto" />
            <h1 className="text-2xl font-bold">DressMeUp</h1>
          </div>
        </Link>
        <div className="flex items-center space-x-4">
          <UserButton />
          {credits !== null && (
            credits > 0 ? (
              <Button variant="outline" size="sm" className="flex items-center space-x-1">
                <Clock className="h-4 w-4" />
                <span>{credits} Credits</span>
              </Button>
            ) : (
              <Button variant="outline" size="sm" className="flex items-center space-x-1">
                <ShoppingBag className="h-4 w-4" />
                <span>Buy Credits</span>
              </Button>
            )
          )}
        </div>
      </div>
    </header>
    <main className="max-w-7xl mx-auto p-6">
      <Tabs defaultValue="projects">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="projects">My Projects</TabsTrigger>
          <TabsTrigger value="invitations">Invitations</TabsTrigger>
        </TabsList>
        <TabsContent value="projects">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>My Projects</CardTitle>
                  <Button onClick={() => setShowCreateProject(!showCreateProject)}>
                    <Plus className="h-4 w-4 mr-2" />
                    {showCreateProject ? 'Cancel' : 'Create New Project'}
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <AnimatePresence>
                  {showCreateProject && (
                    <motion.form
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                      onSubmit={handleCreateProject}
                      className="space-y-4 mb-6"
                    >
                      <div>
                        <Label htmlFor="projectName">Project Name</Label>
                        <Input
                          id="projectName"
                          value={projectName}
                          onChange={(e) => setProjectName(e.target.value)}
                          required
                        />
                      </div>
                      <div>
                        <Label>Choose Your Role</Label>
                        <RadioGroup value={role} onValueChange={setRole} required>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="buyer" id="buyer" />
                            <Label htmlFor="buyer">Buyer</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="seller" id="seller" />
                            <Label htmlFor="seller">Seller</Label>
                          </div>
                        </RadioGroup>
                      </div>
                      {role === 'buyer' && (
                        <div>
                          <Label htmlFor="searchUser">Search User to Invite</Label>
                          <Input
                            id="searchUser"
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Search by email"
                          />
                          <ScrollArea className="h-[100px] mt-2">
                            {allUsers
                              .filter(user => user.email.toLowerCase().includes(searchTerm.toLowerCase()))
                              .map(user => (
                                <div key={user.userid} className="flex items-center space-x-2 my-1">
                                  <input
                                    type="radio"
                                    id={user.userid}
                                    name="inviteUser"
                                    value={user.email}
                                    onChange={(e) => setInviteEmail(e.target.value)}
                                  />
                                  <label htmlFor={user.userid}>{user.email}</label>
                                </div>
                              ))
                            }
                          </ScrollArea>
                        </div>
                      )}
                      <Button type="submit">Create Project</Button>
                    </motion.form>
                  )}
                </AnimatePresence>
                <ScrollArea className="h-[400px]">
                  {projects.map(project => (
                    <motion.div
                      key={project.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <Button
                        variant={selectedProject?.id === project.id ? "default" : "outline"}
                        onClick={() => setSelectedProject(project)}
                        className="w-full justify-between mb-2"
                      >
                        <span>{project.name}</span>
                        <Badge>{project.creator_role}</Badge>
                      </Button>
                    </motion.div>
                  ))}
                </ScrollArea>
              </CardContent>
            </Card>
            <AnimatePresence>
              {selectedProject && (
                <motion.div
                  key={selectedProject.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.3 }}
                >
                  <ProjectDetails project={selectedProject} user={user} />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </TabsContent>
        <TabsContent value="invitations">
          <Card>
            <CardHeader>
              <CardTitle>Invitations</CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[400px]">
                {invitations.map(invitation => (
                  <motion.div
                    key={invitation.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3 }}
                    className="mb-4"
                  >
                    <Card>
                      <CardContent className="pt-6">
                        <div className="flex justify-between items-center">
                          <span>Project ID: {invitation.project_id}</span>
                          <Badge>{invitation.status}</Badge>
                        </div>
                        {invitation.status === 'pending' && (
                          <div className="mt-4 space-x-2">
                            <Button onClick={() => handleInvitation(invitation.id, 'accepted')}>Accept</Button>
                            <Button onClick={() => handleInvitation(invitation.id, 'rejected')} variant="outline">Reject</Button>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </main>
  </div>
  )
}

