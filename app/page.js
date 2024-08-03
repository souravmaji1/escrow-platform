"use client"
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Shield, ThumbsUp, ThumbsDown, BarChart2, FileCode, AlertTriangle } from 'lucide-react';
import { chatSession } from '@/utils/GeminiAIModal';

export default function SmartContractAnalyzer() {
  const [contract, setContract] = useState('');
  const [analysis, setAnalysis] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [rawResponse, setRawResponse] = useState('');

  const analyzeContract = async () => {
    setIsLoading(true);
    setError(null);
    setRawResponse('');
    setAnalysis(null);
    try {
      const result = await chatSession.sendMessage(
        `Analyze the following smart contract for security threats, good points, and bad points. Provide a detailed breakdown in the following JSON format:
        {
          "securityThreats": [
            { "threat": "Description of threat 1" },
            { "threat": "Description of threat 2" }
          ],
          "goodPoints": [
            { "point": "Description of good point 1" },
            { "point": "Description of good point 2" }
          ],
          "badPoints": [
            { "point": "Description of bad point 1" },
            { "point": "Description of bad point 2" }
          }
        }

        Smart Contract:
        ${contract}`
      );
      const response = await result.response;
      const analysisText = response.text();
      setRawResponse(analysisText);
      
      // Extract JSON from the response
      const jsonMatch = analysisText.match(/```json\n([\s\S]*?)\n```/);
      if (jsonMatch && jsonMatch[1]) {
        const jsonStr = jsonMatch[1].trim();
        try {
          setAnalysis(JSON.parse(jsonStr));
        } catch (jsonError) {
          throw new Error(`Invalid JSON: ${jsonError.message}`);
        }
      } else {
        throw new Error("Unable to extract JSON from the response");
      }
    } catch (error) {
      console.error('Error analyzing contract:', error);
      setError(`Error analyzing contract: ${error.message}`);
    }
    setIsLoading(false);
  };

  const renderTable = (title, data, icon) => (
    <Card className="mt-4">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {icon}
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[50px]">#</TableHead>
              <TableHead>Description</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((item, index) => (
              <TableRow key={index}>
                <TableCell className="font-medium">{index + 1}</TableCell>
                <TableCell>{item.threat || item.point}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );

  const renderChart = () => {
    if (!analysis) return null;

    const data = [
      { name: 'Security Threats', value: analysis.securityThreats.length },
      { name: 'Good Points', value: analysis.goodPoints.length },
      { name: 'Bad Points', value: analysis.badPoints.length },
    ];

    return (
      <Card className="mt-4">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart2 className="h-6 w-6" />
            Analysis Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="value" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4 flex items-center gap-2" style={{display:"flex",alignItems:"center",justifyContent:"center"}}>
        <FileCode className="h-8 w-8" />
        Smart Contract Analyzer
      </h1>
      <Card className="mb-4">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileCode className="h-6 w-6" />
            Input Smart Contract
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea
            placeholder="Paste your smart contract here..."
            value={contract}
            onChange={(e) => setContract(e.target.value)}
            className="min-h-[200px]"
          />
          <Button
            onClick={analyzeContract}
            className="mt-4 flex items-center gap-2"
            disabled={isLoading || !contract.trim()}
          >
            {isLoading ? (
              <>
                <span className="loading loading-spinner"></span>
                Analyzing...
              </>
            ) : (
              <>
                <Shield className="h-4 w-4" />
                Analyze Contract
              </>
            )}
          </Button>
        </CardContent>
      </Card>
      {error && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      {rawResponse && (
        <Card className="mb-4">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileCode className="h-6 w-6" />
              Raw AI Response (for debugging)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea
              value={rawResponse}
              readOnly
              className="min-h-[200px]"
            />
          </CardContent>
        </Card>
      )}
      {analysis && (
        <>
          {renderChart()}
          {renderTable("Security Threats", analysis.securityThreats, <Shield className="h-6 w-6" />)}
          {renderTable("Good Points", analysis.goodPoints, <ThumbsUp className="h-6 w-6" />)}
          {renderTable("Bad Points", analysis.badPoints, <ThumbsDown className="h-6 w-6" />)}
        </>
      )}
    </div>
  );
}