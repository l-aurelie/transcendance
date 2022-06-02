import {Request} from 'express';
import IUser from '../../typeorm/entities/User';

interface RequestWithUser extends Request {
    user: IUser;
  }
  
  export default RequestWithUser;