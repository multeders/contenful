import React, { useState, useEffect } from 'react';
import { Button } from '@contentful/f36-components';
import { DialogAppSDK, FieldAppSDK } from '@contentful/app-sdk';
import { /* useCMA, */ useSDK } from '@contentful/react-apps-toolkit';

interface SelectedImage {
  id: number;
  webformatURL: string;
}

const Field = () => {
  const [selectedImages, setSelectedImages] = useState<SelectedImage[]>([]);
  const dialogsdk = useSDK<DialogAppSDK>();
  const fieldsdk = useSDK<FieldAppSDK>();

  const openDialog = async () => {
    const data: SelectedImage[] = await dialogsdk.dialogs.openCurrentApp({
      title: 'Select Images from Pixabay',
      width: 'large',
      minHeight: '400px',
    });

    if (data) {
      setSelectedImages(data);
    }
  };

  useEffect(() => {
    fieldsdk.field.setValue(selectedImages);
  }, [selectedImages]);

  return (
    <div>
      <Button onClick={openDialog}>Open Pixabay Image Picker</Button>
      {selectedImages.length > 0 && (
        <div style={{marginTop: '10px'}}>
          <h3>Selected Images:</h3>
          <div style={{ 
            gap: '10px', 
            margin: '5px',
            overflowX: 'auto',
            maxWidth: '100%',
            whiteSpace: 'nowrap',
          }}>
            {selectedImages.map((image) => (
              <div style={{ position: 'relative', display: 'inline-block', margin: '5px' }}>
                <img src={image.webformatURL} alt="Pixabay Image" style={{ width: '200px', height: '200px' }} />
                <span style={{position: 'absolute', top: '0px', right: '0px', cursor: 'pointer', color: 'red'}} onClick={() => setSelectedImages(selectedImages.filter((img) => img.id !== image.id))}>
                  x
                </span>
              </div>
              
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Field;
