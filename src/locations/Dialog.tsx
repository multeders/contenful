import React, { useEffect, useState }  from 'react';
import { Button, TextInput } from '@contentful/f36-components';
import { DialogAppSDK } from '@contentful/app-sdk';
import { /* useCMA, */ useSDK } from '@contentful/react-apps-toolkit';


interface PixabayImage {
  id: number;
  webformatURL: string;
}

const Dialog = () => {
  const sdk = useSDK<DialogAppSDK>();
  const [apiKey, setApiKey] = useState<string>('');
  const [images, setImages] = useState<PixabayImage[]>([]);
  const [selectedImages, setSelectedImages] = useState<PixabayImage[]>([]);
  const [error, setError] = useState<string | null>(null);

  const handleApiKeyChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setApiKey(event.target.value);
  };

  const fetchImages = async () => {
    if (!apiKey) {
      setError('Please enter a valid Pixabay API key.');
      return;
    }

    try {
      const response = await fetch(
        // Fetch Pixabay images, only 12 images for simplicity
        `https://pixabay.com/api/?key=${apiKey}&q=nature&image_type=photo&per_page=12`
      );
      const data = await response.json();
      setImages(data.hits);
      setError(null);
    } catch (error) {
      setError('Error fetching Pixabay images.');
      console.error('Error fetching Pixabay images:', error);
    }
  };

  const toggleImageSelection = (image: PixabayImage) => {
    if (selectedImages.some((img) => img.id === image.id)) {
      setSelectedImages(selectedImages.filter((img) => img.id !== image.id));
    } else {
      setSelectedImages([...selectedImages, image]);
    }
  };

  // Submit selected images
  const handleSubmit = () => {
    sdk.close(selectedImages); 
  };

  return (
    <div style={{margin: '10px'}}>
      <h2 style={{margin: '10px'}}>Enter Pixabay API Key</h2>
      <TextInput
        name="pixabayApiKey"
        value={apiKey}
        onChange={handleApiKeyChange}
        placeholder="Enter your Pixabay API key"
        style={{ marginBottom: '10px', width: '100%' }}
      />
      <Button onClick={fetchImages} isDisabled={!apiKey}  >
        Fetch Images
      </Button>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      {images.length > 0 && (
        <div style={{margin: '10px'}}>
          <h2 style={{margin: '10px'}}>Images</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
            {images.map((image) => (
              <div
                key={image.id}
                onClick={() => toggleImageSelection(image)}
                style={{
                  border: selectedImages.some((img) => img.id === image.id) ? '2px solid blue' : '1px solid gray',
                  cursor: 'pointer',
                }}
              >
                <img src={image.webformatURL} alt="" style={{ width: '100%', height: 'auto' }} />
              </div>
            ))}
          </div>
          <Button onClick={handleSubmit} style={{marginTop: '10px'}}>Select Images</Button>
        </div>
      )}
    </div>
  );
};

export default Dialog;
