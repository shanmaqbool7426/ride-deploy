import {v2 as cloudinary} from "cloudinary"
import fs from "fs"


cloudinary.config({ 
  cloud_name: 'dcfpazr4b', 
  api_key: '534884361264524', 
  api_secret: 'eM-jhJ0tX2nk1R97TPIpQyusB2o' 
});

const uploadOnCloudinary = async (localFilePath) => {
    try {
        if (!localFilePath) return null
        //upload the file on cloudinary
        console.log('localFilePath',localFilePath)
        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: "auto"
        })
        // file has been uploaded successfull
        //console.log("file is uploaded on cloudinary ", response.url);
        return response;

    } catch (error) {
        return null;
    }
}



export {uploadOnCloudinary}