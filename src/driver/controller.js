import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import Driver from './model.js';
import { sendSuccessResponse, sendErrorResponse, HTTP_STATUS } from '../utils/responseUtils.js';
import Passenger from '../passenger/model.js';
import Wallet from '../wallet/model.js';

const { OK, CREATED, BAD_REQUEST, INTERNAL_SERVER_ERROR, NOT_FOUND } = HTTP_STATUS;

class DriverController {

  async registerDriver(req, res) {
    try {
      const { 
        name, 
        type,
        email, 
        password, 
        phone,
        location,
        driverImage, 
        idCardFront, 
        idCardBack, 
        drivingLicenseFront, 
        drivingLicenseBack,
        identityCardNumber
      } = req.body;
  
      // Check if driver already exists
      const existingDriver = await Driver.findOne({ email });
      if (existingDriver) {
        return sendErrorResponse(res, BAD_REQUEST, 'Driver already exists');
      }
  

  
      // Validate location
      if (!location.type || !location.coordinates || 
          !Array.isArray(location.coordinates) || location.coordinates.length !== 2) {
        return sendErrorResponse(res, BAD_REQUEST, 'Invalid location format');
      }
  
      const hashedPassword = await bcrypt.hash(password, 10);
  
      const driverData = {
        name,
        type,
        email,
        password: hashedPassword,
        phone,
        location: {
          type: location.type,
          coordinates: location.coordinates
        },
        driverImage,
        idCardFront,
        idCardBack,
        drivingLicenseFront,
        drivingLicenseBack,
        identityCardNumber,
        status: 'available', // default value
        rating: 5.0, // default value
      };
  
      const driver = new Driver(driverData);
      const savedDriver = await driver.save();
  
      // Remove sensitive information before sending response
      const driverResponse = savedDriver.toObject();
      delete driverResponse.password;
  
      return sendSuccessResponse(res, CREATED, 'Driver registered successfully', driverResponse);
    } catch (error) {
      console.error('Error registering driver:', error);
      return sendErrorResponse(res, INTERNAL_SERVER_ERROR, 'Error registering driver', error.message);
    }
  }

  // async loginDriver(req, res) {
  //   const { email, password } = req.body;

  //   try {
  //     let user = {}
  //     if (email) {
  //       user = await Driver.findOne({ email });

  //     }

  //       if (!user) {

  //         user = await Passenger.findOne({ email });
  //       }

  //     // if (user) {
  //     //   return sendErrorResponse(res, NOT_FOUND, 'Not found');
  //     // }
  //     console.log('passenger', user);
  //     const isMatch = await bcrypt.compare(password, user.password);
  //     if (!isMatch) {
  //       return sendErrorResponse(res, BAD_REQUEST, 'Invalid credentials');
  //     }

  //     const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);

  //     return sendSuccessResponse(res, OK, 'Login successful', { data: user, token });
  //   } catch (error) {
  //     return sendErrorResponse(res, INTERNAL_SERVER_ERROR, 'Error logging in', error.message);
  //   }
  // }

async transectionHistory (req,res){
    try {
      const { ownerId } = req.params;
      const wallet = await Wallet.findOne({ owner: ownerId });
      if (!wallet) {
        return res.status(404).json({ error: 'Wallet not found' });
      }
      return sendSuccessResponse(res, 200, 'Transections retireve successfully',wallet);
    } catch (error) {
      console.error('Error fetching wallet:', error.message);
      res.status(500).json({ error: 'Internal server error' });
    }
  
}

  async loginDriver(req, res) {
    const { email, password } = req.body;

    try {
      let user = await Driver.findOne({ email });
      console.log('User found>', user)
      if (!user) {
        user = await Passenger.findOne({ email }).populate('wallet');
        console.log('User  found',user)
      }
      
      if (!user) {
        return sendErrorResponse(res, 404, 'User not found');
      }

      const isMatch = await bcrypt.compare(password, user.password);
      console.log(password,user.password,"password")
      if (!isMatch) {
        
        return sendErrorResponse(res, 400, 'Invalid credentials');
      }

      const token = jwt.sign({ id: user._id },'myverysecuresecret');

      return sendSuccessResponse(res, 200, 'Login successful', { data: user, token });
    } catch (error) {
      return sendErrorResponse(res, 500, 'Error logging in', error.message);
    }
  }



  async getDriverProfile(req, res) {
    try {
      const driver = await Driver.findById(req.userId).select('-password');
      if (!driver) {
        return sendErrorResponse(res, NOT_FOUND, 'Driver not found');
      }

      return sendSuccessResponse(res, OK, 'Driver profile retrieved successfully', driver);
    } catch (error) {
      return sendErrorResponse(res, INTERNAL_SERVER_ERROR, 'Error fetching driver profile', error.message);
    }
  }

  async updateDriverProfile(req, res) {
    const updates = req.body;

    try {
      const driver = await Driver.findByIdAndUpdate(req.userId, updates, { new: true }).select('-password');
      if (!driver) {
        return sendErrorResponse(res, NOT_FOUND, 'Driver not found');
      }

      return sendSuccessResponse(res, OK, 'Profile updated successfully', driver);
    } catch (error) {
      return sendErrorResponse(res, INTERNAL_SERVER_ERROR, 'Error updating profile', error.message);
    }
  }
}

export default new DriverController();
