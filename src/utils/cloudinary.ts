import { getUrl } from '@/lib/helpers'
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera'

export const pickImageFromGallery = async () => {
    try {
        const image = await Camera.getPhoto({
            resultType: CameraResultType.Uri,
            source: CameraSource.Photos, // This ensures the photo is picked from the gallery
            quality: 90
        })

        if (image.webPath) {
            // Convert the image to a file for upload
            const response = await fetch(image.webPath)
            const blob = await response.blob()
            const file = new File([blob], 'photo.jpg', { type: 'image/jpeg' })

            // Use your function to upload the file to Cloudinary
            return file
        }
    } catch (error) {
        console.error('Error picking image from gallery:', error)
    }
}

export async function uploadImageToCloudinary(file:File) {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', 'dancersapp_events'); // Replace with your actual preset

    try {
        const response = await fetch('https://api.cloudinary.com/v1_1/'+process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME+'/image/upload', {
            method: 'POST',
            body: formData,
        });

        if (!response.ok) {
            throw new Error(`Error: ${response.statusText}`);
        }

        const data = await response.json();
        console.log('Uploaded image URL:', data.secure_url);
        return data.secure_url; // Return the secure URL of the uploaded image
    } catch (error) {
        console.error('Error uploading image:', error);
    }
}

