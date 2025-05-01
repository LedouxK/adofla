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
          // Extraire les données du profil de la requête
          const profileData = request.only(['name', 'role', 'about']);
          
          // Extraire les données utilisateur de la requête
          const userData = request.only(['first_name', 'last_name']);
      
          // Récupérer l'utilisateur authentifié
          const authUser = auth.user;
          if (!authUser) {
            return response.unauthorized({ message: 'User not authenticated' });
          }
      
          // Mettre à jour les données utilisateur si fournies
          if (userData.first_name !== undefined || userData.last_name !== undefined) {
            try {
              const user = await authUser.refresh(); // S'assurer que les données sont fraîches
              
              // Ne mettre à jour que les champs qui sont fournis
              if (userData.first_name !== undefined) {
                user.first_name = userData.first_name;
              }
              
              if (userData.last_name !== undefined) {
                user.last_name = userData.last_name;
              }
              
              await user.save();
              console.log('Informations utilisateur mises à jour:', userData);
            } catch (userError) {
              console.error('Erreur lors de la mise à jour des informations utilisateur:', userError);
              // On continue quand même pour mettre à jour le profil
            }
          }
      
          // Ajouter l'ID utilisateur aux données du profil
          const data = {
            ...profileData,
            user_id: authUser.id
          };

          // Vérifier si un profil existe déjà pour cet utilisateur
          const has_profile = await Profile.findBy('user_id', authUser.id);
          let profile;
          
          if (!has_profile) {
            // Créer un nouveau profil
            profile = await Profile.create(data);
          }
          else {
            // Mettre à jour le profil existant
            profile = await Profile.find(has_profile.id);
             
            if (profile) {
              profile.name = data.name;
              profile.role = data.role;
              profile.about = data.about;
            } else {
              throw new Error('Profil introuvable malgré son existence dans la base');
            }
          }
      
          // Récupérer le profil mis à jour avec les données utilisateur
          const updatedProfile = await Profile.query()
            .preload('user')
            .where('id', profile.id)
            .firstOrFail();
          
          // Retourner le profil créé ou mis à jour avec les informations utilisateur
          return response.created({
            ...updatedProfile.serialize(),
            first_name: updatedProfile.user.first_name,
            last_name: updatedProfile.user.last_name
          });
        } catch (error) {
          console.error('Erreur lors de la sauvegarde du profil:', error);
          return response.badRequest({ 
            message: 'Erreur lors de la sauvegarde du profil', 
            error: error.message 
          });
        }
      }

      // La méthode updateUserInfo a été supprimée car elle était redondante avec la méthode store améliorée
      // qui peut déjà mettre à jour les informations utilisateur (first_name, last_name) en même temps que le profil

      public async index({ response, auth }: HttpContext) {
        const user = auth.user;
        if (!user) {
            return response.unauthorized({ message: 'User not authenticated' });
        }
        
        // Récupérer le profil avec les informations utilisateur
        const profile = await Profile.query()
          .preload('user') // Charger la relation utilisateur
          .where('user_id', user.id)
          .first();
        
        if (!profile) {
          return response.notFound({ message: 'Profil introuvable' });
        }
        
        // Ajouter les champs first_name et last_name directement dans la réponse du profil
        // pour simplifier l'accès côté frontend
        return {
          ...profile.serialize(),
          first_name: profile.user.first_name,
          last_name: profile.user.last_name
        };
      }
      
}