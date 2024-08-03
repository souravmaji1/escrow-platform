import { Client } from "@gradio/client";
import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    console.log("API route called");
    const formData = await req.formData();
    console.log("Form data received");

    const backgroundFile = formData.get('background');
    const garmentFile = formData.get('garment');

    if (!backgroundFile || !garmentFile) {
      console.log("Missing files");
      return NextResponse.json({ error: 'Both background and garment files are required.' }, { status: 400 });
    }

    const backgroundBlob = await backgroundFile.arrayBuffer();
    const garmentBlob = await garmentFile.arrayBuffer();

    console.log("Files converted to ArrayBuffer");

    const app = await Client.connect("dryade36513/ClothStudio");
    console.log("Connected to Gradio client");

    //dryade36513/ClothStudio

    const result = await app.predict("/tryon", [
      {"background": new Blob([backgroundBlob]), "layers": [], "composite": null},
      new Blob([garmentBlob]),
      "Hello!!",
      true,
      true,
      20,
      20,
    ]);

    console.log("Prediction result:", JSON.stringify(result, null, 2));

    if (Array.isArray(result.data) && result.data.length >= 2) {
      const backgroundUrl = result.data[0]?.url;
      const garmentUrl = result.data[1]?.url;

      if (backgroundUrl && garmentUrl) {
        return NextResponse.json({ backgroundUrl, garmentUrl });
      }
    }

    console.log('Unexpected result format:', JSON.stringify(result.data, null, 2));
    return NextResponse.json({ error: 'Received an unexpected result format from the server.', data: result.data }, { status: 500 });
  } catch (error) {
    console.error("An error occurred:", error);
    return NextResponse.json({ error: 'An error occurred while processing your request: ' + error.message }, { status: 500 });
  }
}