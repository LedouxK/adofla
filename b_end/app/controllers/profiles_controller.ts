import { HttpContext } from '@adonisjs/core/http'
import Profile from '#models/profile'
import app from '@adonisjs/core/services/app'

import { randomBytes } from 'crypto'
import { promisify } from 'util'
import fs from 'fs/promises';


export default class ProfilesController {
  
  public async profilePicture({ request, response, auth }: HttpContext) {
    // console.log(request.all())
    //   return response.created(request.all());
    const file = request.file('file', {
      size: '10mb', // Maximum file size (e.g., 10 MB)
      extnames: ['jpg', 'png', 'jpeg'],
    });

    if (!file) {
      return response.badRequest({ message: 'No file uploaded' });
    }

    if (!file.isValid) {
      return response.badRequest({ message: file.errors });
    }

    try {
      const random = await promisify(randomBytes)(32)
      const token = random.toString('hex')

      const newFileName = `${token}.${file.extname}`;

      const filePath:any = await file.move(app.makePath('../f_end/public/uploads/profile'), {
        name: newFileName,
      })

      const user = auth.user;
          if (!user) {
            return response.unauthorized({ message: 'User not authenticated' });
          }

      var data = {
        user_id: 0,
        p_pic: newFileName
      };
      data.user_id = user.id;

      // const has_profile = Profile.query().where('user_id', user.id).first();
      const has_profile = await Profile.findBy('user_id', user.id);
      var profile
      if (!has_profile) {
        //create
         profile = await Profile.create(data);
      }
      else
      {
        // Delete the file
        // await fs.access(has_profile.p_pic);
        // await fs.unlink(has_profile.p_pic);
        //update 
         profile = await Profile.find(has_profile.id)
        profile.p_pic = newFileName

        await profile.save()
      }

      return response.ok({ message: 'File uploaded successfully', fileName: file.fileName });
    } catch (error) {
      return response.internalServerError({ message: 'Failed to upload file', error });
    }
   }

    public async store({ request, response, auth }: HttpContext) {
        try {
          // Extract data from the request
          const data = request.only(['name', 'role', 'about', 'user_id']);
      
          // Get the authenticated user
          const user = auth.user;
          if (!user) {
            return response.unauthorized({ message: 'User not authenticated' });
          }
      
          // Add the user ID to the data
          data.user_id = user.id;

          // const has_profile = Profile.query().where('user_id', user.id).first();
          const has_profile = await Profile.findBy('user_id', user.id);
          var profile
          if (!has_profile) {
            //create
             profile = await Profile.create(data);
          }
          else
          {
            //update 
             profile = await Profile.find(has_profile.id)
            profile.name = data.name
            profile.role = data.role
            profile.about = data.about

            await profile.save()
          }
      
          // Update or create the profile
          // const profile = await Profile.updateOrCreate(
          //   { user_id: user.id }, data
          // );
      
          // Return the created or updated profile
          return response.created(profile);
        } catch (error) {
          console.error(error);
          return response.badRequest({ message: 'Failed to save profile', error: error.message });
        }
      }

      public async index({ request, response, auth }: HttpContext) {
        const user = auth.user;
        if (!user) {
            return response.unauthorized({ message: 'User not authenticated' });
          }
          const users = await Profile.query().preload('user').where('user_id', user.id).first()
          return users
        }
      
}