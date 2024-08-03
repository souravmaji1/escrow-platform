'use client'
import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

const LayerShop = () => {
  const [layers, setLayers] = useState([
    { id: 'background', name: 'Background', options: [
      '/2.png','/3.png','/4.png','5.png','6.png'
    ], selected: null, custom: null },
    { id: 'body', name: 'Body', options: [
      '/11.png','/22.png','/33.png','/44.png','/55.png'
    ], selected: null, custom: null },
    { id: 'clothes', name: 'Clothes', options: [
      '/21.png','/23.png','25.png','/27.png','/29.png'
    ], selected: null, custom: null },
    { id: 'head', name: 'Head', options: [
      '/head1.png','/head2.png','/head3.png','/head4.png','/head5.png'
    ], selected: null, custom: null },
    { id: 'eyes', name: 'Eyes', options: [
      '/eye1.png','/eye2.png','/eye3.png','/eye4.png','/eye5.png'
    ], selected: null, custom: null },
  ]);
  const [activeTab, setActiveTab] = useState('background');
  const [newLayerName, setNewLayerName] = useState('');
  const canvasRef = useRef(null);

  useEffect(() => {
    const fetchImages = async () => {
      // In a real app, you might still fetch these from an API
      // For now, we'll use the predefined options
      setLayers(prevLayers => prevLayers.map(layer => ({
        ...layer,
        options: layer.options // Use the predefined options
      })));
    };
  
    fetchImages();
  }, []);

  const selectImage = (layerId, imageSrc) => {
    setLayers(prevLayers => prevLayers.map(layer => 
      layer.id === layerId ? { ...layer, selected: imageSrc, custom: null } : layer
    ));
  };

  const handleCustomImageUpload = (e, layerId) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setLayers(prevLayers => prevLayers.map(layer => 
          layer.id === layerId ? { ...layer, selected: null, custom: event.target.result } : layer
        ));
      };
      reader.readAsDataURL(file);
    }
  };

  const generateImage = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    layers.forEach(({ selected, custom }) => {
      const imageSrc = custom || selected;
      if (imageSrc) {
        const img = new Image();
        img.onload = () => {
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        };
        img.src = imageSrc;
      }
    });
  };

  const addNewLayer = () => {
    if (newLayerName) {
      const newLayer = {
        id: `custom-${Date.now()}`,
        name: newLayerName,
        options: [],
        selected: null,
        custom: null
      };
      setLayers(prevLayers => [...prevLayers, newLayer]);
      setActiveTab(newLayer.id);
      setNewLayerName('');
    }
  };

  const removeLayer = (layerId) => {
    setLayers(prevLayers => prevLayers.filter(layer => layer.id !== layerId));
    if (activeTab === layerId) {
      setActiveTab(layers[0].id);
    }
  };

  const onDragEnd = (result) => {
    if (!result.destination) return;

    const items = Array.from(layers);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setLayers(items);
  };

  return (
    <div className="p-4">
      <Card>
        <CardHeader>
          <CardTitle>Create Your Custom Image</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-4 flex items-center">
            <Input
              type="text"
              value={newLayerName}
              onChange={(e) => setNewLayerName(e.target.value)}
              placeholder="New layer name"
              className="mr-2"
            />
            <Button onClick={addNewLayer}>Add Layer</Button>
          </div>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <DragDropContext onDragEnd={onDragEnd}>
              <Droppable droppableId="layers" direction="horizontal">
                {(provided) => (
                  <TabsList {...provided.droppableProps} ref={provided.innerRef} className="mb-4">
                    {layers.map((layer, index) => (
                      <Draggable key={layer.id} draggableId={layer.id} index={index}>
                        {(provided) => (
                          <TabsTrigger
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            value={layer.id}
                            className="capitalize flex items-center"
                          >
                            {layer.name}
                            {!['background', 'body', 'clothes', 'head', 'eyes'].includes(layer.id) && (
                              <Button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  removeLayer(layer.id);
                                }}
                                variant="ghost"
                                size="sm"
                                className="ml-2"
                              >
                                ×
                              </Button>
                            )}
                          </TabsTrigger>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </TabsList>
                )}
              </Droppable>
            </DragDropContext>
            {layers.map((layer) => (
              <TabsContent key={layer.id} value={layer.id}>
                <div className="mb-4">
                  <Input
                    type="file"
                    onChange={(e) => handleCustomImageUpload(e, layer.id)}
                    accept="image/*"
                    className="mb-2"
                  />
                  <p className="text-sm text-gray-500">Upload your own image or select from options below</p>
                </div>
                <div className="grid grid-cols-5 gap-4 mb-4">
                  {layer.options.map((imageSrc, index) => (
                    <div 
                      key={index} 
                      className={`cursor-pointer border-2 p-1 ${layer.selected === imageSrc ? 'border-blue-500' : 'border-gray-200'}`}
                      onClick={() => selectImage(layer.id, imageSrc)}
                    >
                      <img src={imageSrc} alt={`${layer.name} option ${index + 1}`} className="w-full h-auto" />
                    </div>
                  ))}
                </div>
                {layer.custom && (
                  <div className="mt-4">
                    <p>Custom image selected:</p>
                    <img src={layer.custom} alt="Custom uploaded" className="max-w-xs mt-2" />
                  </div>
                )}
              </TabsContent>
            ))}
          </Tabs>
          <Button onClick={generateImage} className="mt-4">Generate Final Image</Button>
          <div className="mt-4 border p-4">
            <canvas ref={canvasRef} width="300" height="300" className="mx-auto" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LayerShop;