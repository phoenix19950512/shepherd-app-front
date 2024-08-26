import React, { useCallback, useState } from 'react';
import { Button } from '../../../../../../../../../../components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogTrigger
} from '../../../../../../../../../../components/ui/dialog';
import { ReloadIcon, UploadIcon } from '@radix-ui/react-icons';
import { cn } from '../../../../../../../../../../library/utils';
import { useDropzone } from 'react-dropzone';
import { Switch } from '../../../../../../../../../../components/ui/switch';
import { Label } from '../../../../../../../../../../components/ui/label';
import useAutomaticImageOcclusion from '../../../../hook/useAutomaticImageOcclusion';
import PlansModal from '../../../../../../../../../../components/PlansModal';
import useUserStore from '../../../../../../../../../../state/userStore';

function resizeImageToWindow(src, callback) {
  const targetWidth = 714;
  const targetHeight = 475;

  // Create an image element
  const img = new Image();

  // Once the image is loaded, resize and create the data URI
  img.onload = () => {
    // Create a canvas element
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    // Calculate the scaling factor to maintain aspect ratio
    const scalingFactor = Math.min(
      targetWidth / img.width,
      targetHeight / img.height
    );

    // Calculate the new image size
    const newWidth = img.width * scalingFactor;
    const newHeight = img.height * scalingFactor;

    // Set canvas size to target dimensions
    canvas.width = targetWidth;
    canvas.height = targetHeight;

    // Clear the canvas
    ctx.clearRect(0, 0, targetWidth, targetHeight);

    // Optional: fill the background if you want the empty area to have a color (e.g., white). Remove if transparency is desired.
    ctx.fillStyle = '#ffffff'; // Background color
    ctx.fillRect(0, 0, targetWidth, targetHeight);

    // Draw the adjusted image in the center of the canvas
    const xOffset = (targetWidth - newWidth) / 2; // xOffset for centering the image
    const yOffset = (targetHeight - newHeight) / 2; // yOffset for centering the image

    ctx.drawImage(img, xOffset, yOffset, newWidth, newHeight);

    // Get the new image as a data URI
    const dataURI = canvas.toDataURL('image/png');

    // Return the data URI through a callback
    callback(dataURI);
  };

  // Handle errors in loading the image
  img.onerror = (error) => {
    callback(null, error);
  };

  // Set the source of the image to trigger the load
  img.src = src;
}

function ImageUploader({
  open,
  setImage,
  deckName,
  handleClose,
  handleOpen,
  setElements
}: {
  open: boolean;
  setImage: (image: string) => void;
  deckName: string;
  handleClose: (any) => void;
  handleOpen: () => void;
  setElements: (elements: any) => void;
}) {
  const { getOcclusionCoordinates } = useAutomaticImageOcclusion();
  const [imageURI, setImageURI] = useState('');
  const [imageName, setImageName] = useState('');
  const [error, setError] = useState('');
  const [openPlansModel, setPlansModel] = useState(false);
  const { user }: any = useUserStore();
  // const user = {
  //   subscription: {
  //     tier: 'Basic'
  //   }
  // };

  console.log('imageURI', {
    imageURI,
    imageName,
    deckName
  });

  const onDrop = useCallback((acceptedFiles) => {
    const file = acceptedFiles[0];
    if (file) {
      if (file.size > 1024 * 1024) {
        alert('File size is greater than 500KB');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        resizeImageToWindow(reader.result as string, (dataURI) => {
          console.log('dataURI', dataURI);
          setImageURI(dataURI);
        });
      };
      reader.readAsDataURL(file);
      setImageName(file.name);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    disabled: deckName.trim() === '',
    accept: {
      'image/png': ['.png'],
      'image/jpeg': ['.jpeg', '.jpg']
    }
  });

  const [enableAIOcclusion, setEnableAIOcclusion] = useState(false);
  const [loadOcclusionGeneration, setLoadOcclusionGeneration] = useState(false);

  const handleUpload = async () => {
    if (!imageURI) return;
    if (enableAIOcclusion) {
      try {
        setLoadOcclusionGeneration(true);
        const { mergedEle: elements } = await getOcclusionCoordinates(imageURI);
        setLoadOcclusionGeneration(false);
        setImage(imageURI);
        setElements(elements);
        handleClose({});
        setImageName('');
        setEnableAIOcclusion(false);
        setError('');
        setImageURI('');
      } catch (error) {
        if (error) {
          setLoadOcclusionGeneration(false);
          setImageName('');
          setImageURI('');
          setError('Something went wrong');
        }
      }
    } else {
      setImage(imageURI);
      handleClose({});
      setImageName('');
      setEnableAIOcclusion(false);
    }
  };

  const handleClosePlansModal = () => {
    setPlansModel(false);
  };

  return (
    <React.Fragment>
      <PlansModal
        togglePlansModal={openPlansModel}
        setTogglePlansModal={handleClosePlansModal}
        message="Upgrade to Premium to access AI Occlusion &#9889;"
        subMessage="One-click Cancel at anytime"
      />
      <div className="my-4">
        <Dialog
          open={open}
          onOpenChange={(open) => {
            if (open) {
              handleOpen();
              setImageName('');
            }
          }}
        >
          <DialogTrigger asChild>
            <Button
              disabled={deckName.trim() === ''}
              className={cn(
                'bg-[#207DF7] text-white h-10 w-32 cursor-pointer',
                {
                  'cursor-not-allowed': deckName === ''
                }
              )}
            >
              <UploadIcon className="w-5 h-5 mr-2" />
              Add Image
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-white w-[25rem] h-[24.5rem] flex flex-col p-0">
            <div className="flex justify-center items-center border-b py-4">
              <p className="text-[#212224] font-medium text-sm">Add Image</p>
            </div>
            <div
              className={cn(
                'flex-1 flex flex-col items-center justify-center gap-3 w-full h-full',
                { 'pointer-events-none': imageName }
              )}
              {...getRootProps()}
            >
              <div
                className={cn(
                  'w-80 h-32 mx-auto border-2 rounded-md border-dashed transition-colors flex items-center justify-center pointer-events-auto',
                  {
                    'border-[#E4E5E7]': !isDragActive,
                    'border-[#207DF7]': isDragActive || imageName
                  }
                )}
              >
                <input {...getInputProps()} />
                {imageName ? (
                  <div className="flex flex-col justify-center items-center gap-1">
                    <p className="text-xs max-w-[32ch] truncate text-[#207DF7]">
                      {imageName}
                    </p>
                  </div>
                ) : (
                  <div className="flex flex-col items-center">
                    <UploadIcon className="w-12 h-12 text-[#E4E5E7]" />
                    <p className="text-[#585F68] text-sm font-normal">
                      Drag and drop
                    </p>
                    <p className="text-[#585F68] text-sm font-normal">
                      or
                      <Button
                        variant="link"
                        size="sm"
                        className="pl-1 pr-0 text-[#207DF7] font-medium"
                      >
                        Browse files
                      </Button>
                    </p>
                  </div>
                )}
              </div>
              <p className="max-w-80 mx-auto text-[#585F68] text-sm font-normal">
                Shepherd supports{' '}
                <span className="font-medium">.jpg, .jpeg & .png</span> document
                formats. (Max file size 1MB)
              </p>
              {error && (
                <p className="text-xs text-left w-full pl-10 text-red-600">
                  *{error}
                </p>
              )}
            </div>
            <div className="footer px-6 bg-[#F7F7F8] py-2.5">
              <div className="flex justify-between gap-2">
                <div className="flex items-center space-x-2 cursor-pointer">
                  <Switch
                    checked={enableAIOcclusion}
                    id="ai-occlusion-mode"
                    onCheckedChange={(checked) => {
                      if (
                        user.subscription &&
                        user.subscription.tier !== 'Premium'
                      ) {
                        setPlansModel(true);
                        setEnableAIOcclusion(false);

                        handleClose({
                          formReset: true
                        });
                        setEnableAIOcclusion(false);
                        setLoadOcclusionGeneration(false);
                        setImageURI('');
                      } else {
                        setEnableAIOcclusion(checked);
                      }
                    }}
                    className={cn('cursor-pointer', {
                      'bg-[#207df74a]': enableAIOcclusion,
                      'bg-[#E4E5E7]': !enableAIOcclusion
                    })}
                  />
                  <Label htmlFor="ai-occlusion-mode">
                    <span
                      className={cn(
                        'text-[#212224] font-normal text-xs whitespace-nowrap cursor-pointer',
                        {
                          'opacity-50': !enableAIOcclusion
                        }
                      )}
                    >
                      Enable AI Occlusion
                    </span>
                  </Label>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={() => {
                      handleClose({
                        formReset: true
                      });
                      setEnableAIOcclusion(false);
                      setLoadOcclusionGeneration(false);
                      setImageURI('');
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleUpload}
                    disabled={loadOcclusionGeneration || !imageURI}
                  >
                    {enableAIOcclusion && loadOcclusionGeneration && (
                      <ReloadIcon className="animate-spin mr-2" />
                    )}
                    Upload
                  </Button>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </React.Fragment>
  );
}

export default ImageUploader;
