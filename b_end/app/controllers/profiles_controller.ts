import { HttpContext } from '@adonisjs/core/http'
import Profile from '#models/profile'
import app from '@adonisjs/core/services/app'

import { randomBytes } from 'crypto'
import { promisify } from 'util'
import * as fs from 'fs';
import * as fsPromises from 'fs/promises';

export default class ProfilesController {
  
  public async profilePicture({ request, response, auth }: HttpContext) {
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

      // Générer un nom unique pour le fichier
      const newFileName = `${token}.${file.extname}`;
      
      // Créer les chemins complets
      const profileDir = app.makePath('../f_end/public/uploads/profile');
      const originalsDir = app.makePath('../f_end/public/uploads/profile/originals');
      
      // S'assurer que les dossiers existent
      try {
        // Vérifier si les dossiers existent
        await fsPromises.access(profileDir, fs.constants.F_OK);
        
        try {
          await fsPromises.access(originalsDir, fs.constants.F_OK);
        } catch (dirError) {
          // Créer le répertoire des originaux s'il n'existe pas
          await fsPromises.mkdir(originalsDir);
        }
      } catch (mainDirError) {
        // Créer le répertoire principal s'il n'existe pas
        await fsPromises.mkdir(profileDir);
      }
      
      // Stocker l'image dans le dossier principal pour l'utiliser comme image de profil
      try {
        await file.move(profileDir, {
          name: newFileName,
          overwrite: true // Écraser si le fichier existe déjà
        });
      } catch (moveError) {
        throw moveError; // Propager l'erreur
      }
      
      // Copier le même fichier dans le dossier "originals" pour conserver la version haute qualité
      try {
        // Utiliser fs pour copier le fichier vers le dossier des originaux
        const sourcePath = app.makePath(`../f_end/public/uploads/profile/${newFileName}`);
        const destPath = app.makePath(`../f_end/public/uploads/profile/originals/${newFileName}`);
        
        // Vérifier que le fichier source existe avant de copier
        try {
          await fsPromises.access(sourcePath, fs.constants.F_OK);
          await fsPromises.copyFile(sourcePath, destPath);
        } catch (accessError) {
          // Si le fichier source n'existe pas, on ignore silencieusement
        }
      } catch (copyError) {
        // Ne pas échouer tout le processus si la copie de l'original échoue
      }

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
        // Création d'un nouveau profil
        profile = await Profile.create(data);
      }
      else
      {
        // Mise à jour du profil existant
        profile = await Profile.find(has_profile.id);
        if (profile) {
          // Si l'utilisateur avait déjà une photo de profil et qu'elle est différente de la nouvelle
          const oldPicture = profile.p_pic;
          if (oldPicture && oldPicture !== 'default.jpg' && oldPicture !== newFileName) {
            // Chemins vers les anciens fichiers (original et optimisé)
            const oldFilePath = app.makePath('../f_end/public/uploads/profile', oldPicture);
            const oldOriginalPath = app.makePath('../f_end/public/uploads/profile/originals', oldPicture);
            
            // Supprimer les anciens fichiers s'ils existent
            try {
              // Vérifier et supprimer le fichier principal
              try {
                await fsPromises.access(oldFilePath, fs.constants.F_OK);
                await fsPromises.unlink(oldFilePath);
                console.log(`Ancien fichier supprimé: ${oldFilePath}`);
              } catch (accessError) {
                // Le fichier n'existe pas, on ignore
              }
              
              // Vérifier et supprimer le fichier original
              try {
                await fsPromises.access(oldOriginalPath, fs.constants.F_OK);
                await fsPromises.unlink(oldOriginalPath);
                console.log(`Ancien fichier original supprimé: ${oldOriginalPath}`);
              } catch (accessError) {
                // Le fichier n'existe pas, on ignore
              }
            } catch (deleteError) {
              console.error('Erreur lors de la suppression des anciens fichiers:', deleteError);
              // On continue malgré l'erreur de suppression
            }
          }
          
          // Mise à jour du profil avec la nouvelle photo
          profile.p_pic = newFileName;
          await profile.save();
        }
      }

      return response.ok({ message: 'File uploaded successfully', pPic: newFileName });
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
             profile = await Profile.find(has_profile.id);
             
            if (profile) {
              profile.name = data.name;
              profile.role = data.role;
              profile.about = data.about;
              await profile.save();
            } else {
              throw new Error('Profil introuvable malgré son existence dans la base');
            }
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

      public async index({ response, auth }: HttpContext) {
        const user = auth.user;
        if (!user) {
            return response.unauthorized({ message: 'User not authenticated' });
          }
          const users = await Profile.query().preload('user').where('user_id', user.id).first()
          return users
        }
      
}