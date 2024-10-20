import {v2 as cloudinary} from "cloudinary"
import fs from "fs"


cloudinary.config({ 
  cloud_name: 'dcfpazr4b', 
  api_key: '534884361264524', 
  api_secret: 'eM-jhJ0tX2nk1R97TPIpQyusB2o' 
});

const uploadOnCloudinary = async (localFilePath, retries = 9) => {
    try {
        if (!localFilePath) return null;

        console.log('localFilePath', localFilePath);
        
        // Attempt the upload
        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: "auto"
        });

        console.log('>>> localFilePath', response);

        // Remove the local file after a successful upload
        fs.unlinkSync(localFilePath);
        return response;

    } catch (error) {
        console.log('Error uploading', error);

        // Retry logic
        if (retries > 0) {
            console.log(`Retrying upload... Attempts remaining: ${retries}`);
            return uploadOnCloudinary(localFilePath, retries - 1);
        } else {
            console.log('Max retries reached. Upload failed.');
            fs.unlinkSync(localFilePath);  // Clean up even if the retries fail
            return null;
        }
    }
};



export {uploadOnCloudinary}