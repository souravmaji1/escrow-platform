// app/page.js
'use client';


import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { AlertCircle, CheckCircle2, XCircle, ShieldCheck } from 'lucide-react';
import Abi from './abi.json';
import Link from 'next/link';
import { Roboto_Slab, Poppins, Merriweather } from 'next/font/google'
import Image from "next/image"

const robotoSlab = Roboto_Slab({
  subsets: ['latin'],
  display: 'swap',
})

const poppins = Poppins({
  weight: ['400', '600', '700'],
  subsets: ['latin'],
  display: 'swap',
})
// Replace with your contract's ABI and address
const contractABI = Abi;
const contractAddress = "0xd7cdd887b93a232de0394666e9a705385af50e16";

const CreateProject = () => {
  const [buyerAddress, setBuyerAddress] = useState('');
  const [sellerAddress, setSellerAddress] = useState('');
  const [status, setStatus] = useState('');

  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [account, setAccount] = useState(null);
  const [isWalletConnected, setIsWalletConnected] = useState(false);

  const [invitations, setInvitations] = useState([]);
  const [userProjects, setUserProjects] = useState([]);
  const [fundAmount, setFundAmount] = useState('');

  const [assetLink, setAssetLink] = useState('');
  const [assetInstructions, setAssetInstructions] = useState('');

  const [ assetdata, setAssetdata] = useState('');


  useEffect(() => {
    if (account) {
      fetchUserProjects(account);
    }
  }, [account]);

  const connectWallet = async () => {
    if (typeof window.ethereum !== 'undefined') {
      try {
        // Request account access
        await window.ethereum.request({ method: 'eth_requestAccounts' });

        const provider = new ethers.providers.Web3Provider(window.ethereum);
        setProvider(provider);

        const signer = provider.getSigner();
        setSigner(signer);

        const account = await signer.getAddress();
        setAccount(account);
        fetchInvitations(account);
        console.log(account)

        setIsWalletConnected(true);
      } catch (error) {
        console.error('Failed to connect wallet:', error);
        setError('Failed to connect wallet. Please try again.');
      }
    } else {
      setError(
        'MetaMask is not installed. Please install it to use this feature.'
      );
    }
  };

  const fetchAssetInfo = async (projectId) => {
    try {
      const providers = new ethers.providers.JsonRpcProvider('https://bsc-prebsc-dataseed.bnbchain.org');
      const contract = new ethers.Contract(contractAddress, contractABI, providers);
      const assetInfo = await contract.getAssetInfo(projectId);
      console.log(assetInfo);
      setAssetdata(`Asset Link:  ${assetInfo}`);
    } catch (error) {
      console.error('Error fetching asset info:', error);
      setStatus(`Error fetching asset info: ${error.message}`);
      return null;
    }
  };

  const acceptAsset = async (projectId) => {
    if (!isWalletConnected) {
      setStatus('Please connect your wallet first.');
      return;
    }

    try {
      const contract = new ethers.Contract(contractAddress, contractABI, signer);
      
      const tx = await contract.acceptAsset(projectId, {
        gasLimit: 1000000 // Adjust this value as needed
      });

      setStatus(`Accepting asset for Project ID: ${projectId}. Waiting for confirmation...`);
      
      await tx.wait();
      setStatus(`Asset accepted successfully for Project ID: ${projectId}`);
      
    
    } catch (error) {
      console.error('Error accepting asset:', error);
      setStatus(`Error: ${error.message}`);
    }
  };

  const rejectAsset = async (projectId) => {
    if (!isWalletConnected) {
      setStatus('Please connect your wallet first.');
      return;
    }

    try {
      const contract = new ethers.Contract(contractAddress, contractABI, signer);
      
      const tx = await contract.rejectAsset(projectId, {
        gasLimit: 1000000 // Adjust this value as needed
      });

      setStatus(`Rejecting asset for Project ID: ${projectId}. Waiting for confirmation...`);
      
      await tx.wait();
      setStatus(`Asset rejected successfully for Project ID: ${projectId}`);
      
     
    } catch (error) {
      console.error('Error rejecting asset:', error);
      setStatus(`Error: ${error.message}`);
    }
  };


const addFunds = async (projectId) => {
    if (!isWalletConnected) {
      setStatus('Please connect your wallet first.');
      return;
    }

    if (!fundAmount || isNaN(fundAmount) || parseFloat(fundAmount) <= 0) {
      setStatus('Please enter a valid amount.');
      return;
    }

    try {
      const contract = new ethers.Contract(contractAddress, contractABI, signer);
      const amountInWei = ethers.utils.parseEther(fundAmount);
      
      const tx = await contract.addFunds(projectId, {
        value: amountInWei,
        gasLimit: 1000000 // Adjust this value as needed
      });

      setStatus(`Adding funds to Project ID: ${projectId}. Waiting for confirmation...`);
      
      await tx.wait();
      setStatus(`Funds added successfully to Project ID: ${projectId}`);
      
      // Refresh user projects after adding funds
      fetchUserProjects(account);
    } catch (error) {
      console.error('Error adding funds:', error);
      setStatus(`Error: ${error.message}`);
    }
  };

  const submitAsset = async (projectId) => {
    if (!isWalletConnected) {
      setStatus('Please connect your wallet first.');
      return;
    }

    if (!assetLink || !assetInstructions) {
      setStatus('Please enter both asset link and instructions.');
      return;
    }

    try {
      const contract = new ethers.Contract(contractAddress, contractABI, signer);
      
      const tx = await contract.submitAsset(projectId, assetLink, assetInstructions, {
        gasLimit: 1000000 // Adjust this value as needed
      });

      setStatus(`Submitting asset for Project ID: ${projectId}. Waiting for confirmation...`);
      
      await tx.wait();
      setStatus(`Asset submitted successfully for Project ID: ${projectId}`);
      
      // Clear input fields
      setAssetLink('');
      setAssetInstructions('');
      
    } catch (error) {
      console.error('Error submitting asset:', error);
      setStatus(`Error: ${error.message}`);
    }
  };
  
  const fetchInvitations = async ( address) => {
    try {
      const signer = new ethers.providers.JsonRpcProvider('https://bsc-testnet-dataseed.bnbchain.org');
      const contract = new ethers.Contract(contractAddress, contractABI, signer);
      const projectIds = await contract.getProjectsForApproval(address);
      console.log(projectIds)
      setInvitations(projectIds.map(id => id.toString()));
    } catch (error) {
      console.error('Error fetching invitations:', error);
      setStatus('Failed to fetch invitations. Please try again.');
    }
  };

  const fetchUserProjects = async (address) => {
    try {
      const provider = new ethers.providers.JsonRpcProvider('https://bsc-testnet-dataseed.bnbchain.org');
      const contract = new ethers.Contract(contractAddress, contractABI, provider);
      const projects = await contract.getUserProjects(address);
      setUserProjects(projects);
    } catch (error) {
      console.error('Error fetching user projects:', error);
      setStatus('Failed to fetch user projects. Please try again.');
    }
  };

  const acceptInvitation = async (projectId) => {
    if (!isWalletConnected) {
      setStatus('Please connect your wallet first.');
      return;
    }

    try {
      const contract = new ethers.Contract(contractAddress, contractABI, signer);
      const tx = await contract.acceptProject(projectId, {
        gasLimit: 1000000 // Adjust this value as needed
      });
      setStatus(`Accepting invitation for Project ID: ${projectId}. Waiting for confirmation...`);
      
      await tx.wait();
      setStatus(`Invitation accepted successfully for Project ID: ${projectId}`);
      
      // Refresh invitations after accepting
      fetchInvitations(account);
    } catch (error) {
      console.error('Error accepting invitation:', error);
      setStatus(`Error: ${error.message}`);
    }
  };

  

  const createProject = async () => {
    if (!window.ethereum) {
      setStatus('Please install MetaMask to use this feature.');
      return;
    }

    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(contractAddress, contractABI, signer);

      const tx = await contract.createProject('0x1667c8c38e77a79395eb05a9384bbbf37d951d34', '0xC8CBefeC99D582351a0aeF7fA22B417484C6fd05',{
        gasLimit: 1000000 // Adjust this value as needed
      }  );
      setStatus('Transaction sent. Waiting for confirmation...');
      
      const receipt = await tx.wait();
      
      setStatus(`Project created successfully! Project ID: ${receipt}`);
    } catch (error) {
      console.error('Error:', error);
      setStatus(`Error: ${error.message}`);
    }
  };


  const getStatusBadge = (status) => {
    switch(status) {
      case 0: return <Badge variant="outline">Pending</Badge>;
      case 1: return <Badge variant="secondary">Awaiting Funds</Badge>;
      case 2: return <Badge variant="primary">Funded</Badge>;
      case 3: return <Badge variant="warning">Asset Submitted</Badge>;
      case 7: return <Badge variant="success">Completed</Badge>;
      default: return <Badge variant="destructive">Unknown</Badge>;
    }
  };

  return (
    <>
     <header className="px-4 lg:px-6 h-14 flex items-center border">
     <Link className="flex items-center justify-center" href="/">
          <Image
            src="/logo.png"
            alt="EasyTransact Logo"
            width={32}
            height={32}
            className="mr-2"
          />
          <span className={`font-bold text-xl bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-green-600 ${poppins.className}`}>EasyTransact</span>
        </Link>
        <nav className="ml-auto flex gap-4 sm:gap-6">
          <Link className="text-sm text-green-400  font-medium hover:underline underline-offset-4" href="#">
            How It Works
          </Link>
          <Link className="text-sm text-green-400 font-medium hover:underline underline-offset-4" href="#">
            Features
          </Link>
          <Link className="text-sm text-green-400 font-medium hover:underline underline-offset-4" href="#">
            Pricing
          </Link>
        </nav>
      </header>

      
    <div className="container mx-auto p-4">
     
    <Card className="mb-8 bg-gray-900 border-green-800 mb-4 ">
          <CardHeader>
            <CardTitle className="text-green-400">Escrow Dashboard</CardTitle>
            <CardDescription className="text-green-300">Manage your escrow projects and transactions</CardDescription>
          </CardHeader>
          <CardContent>
            {!isWalletConnected ? (
              <Button onClick={connectWallet} className="w-full bg-green-500 hover:bg-green-600 text-black">
                Connect Wallet
              </Button>
            ) : (
              <div className="flex items-center space-x-2">
                <Avatar>
                  <AvatarFallback className="bg-green-700 text-black">{account ? account.slice(0, 2) : '??'}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-medium text-green-400">Connected</p>
                  <p className="text-xs text-green-300">{account}</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

      <Tabs defaultValue="projects" className="space-y-4">
        <TabsList>
          <TabsTrigger   value="projects">Your Projects</TabsTrigger>
          <TabsTrigger value="invitations">Invitations</TabsTrigger>
          <TabsTrigger value="create">Create Project</TabsTrigger>
        </TabsList>

        <TabsContent value="projects">
        <Card className="bg-gray-900 border-green-800">
              <CardHeader>
                <CardTitle className="text-green-400">Your Projects</CardTitle>
              </CardHeader>
              <CardContent>
                {userProjects.length > 0 ? (
                  <div className="space-y-4">
                    {userProjects.map((project, index) => (
                      <Card key={index} className="bg-gray-800 border-green-700">
                        <CardHeader>
                          <CardTitle className="text-lg text-green-400">Project ID: {project.projectId.toString()}</CardTitle>
                          <CardDescription>
                            {getStatusBadge(project.status)}
                          </CardDescription>
                        </CardHeader>
                        <CardContent className="text-green-300">
                        <div className="space-y-2">
                          <p><strong>Amount:</strong> {ethers.utils.formatEther(project.amount)} ETH</p>
                          <p><strong>Buyer:</strong> {project.buyer}</p>
                          <p><strong>Seller:</strong> {project.seller}</p>
                          <Separator className="my-4" />
                          {project.status === 1 && project.buyer.toLowerCase() === account.toLowerCase() && (
                            <div className="space-y-2">
                              <Input
                                type="number"
                                placeholder="Amount to fund (ETH)"
                                value={fundAmount}
                                onChange={(e) => setFundAmount(e.target.value)}
                              />
                              <Button onClick={() => addFunds(project.projectId)} className="w-full">
                                Add Funds
                              </Button>
                            </div>
                          )}
                          {project.status === 2 && project.seller.toLowerCase() === account.toLowerCase() && (
                            <div className="space-y-2">
                              <Input
                                type="text"
                                placeholder="Asset Link"
                                value={assetLink}
                                onChange={(e) => setAssetLink(e.target.value)}
                              />
                              <Input
                                type="text"
                                placeholder="Asset Instructions"
                                value={assetInstructions}
                                onChange={(e) => setAssetInstructions(e.target.value)}
                              />
                              <Button onClick={() => submitAsset(project.projectId)} className="w-full">
                                Submit Asset
                              </Button>
                            </div>
                          )}
                          {project.status === 3 && project.buyer.toLowerCase() === account.toLowerCase() && (
                            <div className="space-y-2">
                              <Button 
                                onClick={() => fetchAssetInfo(project.projectId)} 
                                className="w-full"
                              >
                                View Asset Info
                              </Button>
                              <div className="flex space-x-2">
                                <Button onClick={() => acceptAsset(project.projectId)} className="flex-1">
                                  <CheckCircle2 className="w-4 h-4 mr-2" />
                                  Accept Asset
                                </Button>
                                <Button onClick={() => rejectAsset(project.projectId)} className="flex-1">
                                  <XCircle className="w-4 h-4 mr-2" />
                                  Reject Asset
                                </Button>
                              </div>
                              {assetdata && (
                                <Alert>
                                  <AlertCircle className="h-4 w-4" />
                                  <AlertDescription>{assetdata}</AlertDescription>
                                </Alert>
                              )}
                            </div>
                          )}
                          {project.status === 7 && (
                            <Alert>
                              <CheckCircle2 className="h-4 w-4" />
                              <AlertDescription>Escrow Completed</AlertDescription>
                            </Alert>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <p className="text-center text-green-300">No projects found.</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="invitations">
          <Card className='bg-gray-900 border-green-800 '  >
            <CardHeader>
              <CardTitle>Your Invitations</CardTitle>
            </CardHeader>
            <CardContent>
              {invitations.length > 0 ? (
                <div className="space-y-2">
                  {invitations.map((projectId) => (
                    <div key={projectId} className="flex justify-between items-center p-2 bg-secondary rounded-lg">
                      <span>Project ID: {projectId}</span>
                      <Button onClick={() => acceptInvitation(projectId)} size="sm">
                        Accept
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-muted-foreground">No invitations found.</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="create">
          <Card className='bg-gray-900 border-green-800 '>
            <CardHeader>
              <CardTitle>Create New Project</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Input
                  placeholder="Buyer Address"
                  value={buyerAddress}
                  onChange={(e) => setBuyerAddress(e.target.value)}
                />
                <Input
                  placeholder="Seller Address"
                  value={sellerAddress}
                  onChange={(e) => setSellerAddress(e.target.value)}
                />
                <Button onClick={createProject} className="w-full bg-green-500 hover:bg-green-600 text-black">
                  Create Project
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {status && (
         <Alert className="mt-4 bg-gray-800 border-green-700">
         <AlertDescription className="text-green-300">{status}</AlertDescription>
       </Alert>
      )}
    </div>
  
    </>
  );
};

export default CreateProject;