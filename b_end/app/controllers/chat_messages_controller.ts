import type { HttpContext } from '@adonisjs/core/http'
import ChatMessage from '#models/chat_message'
import ChatTicket from '#models/chat_ticket'

export default class ChatMessagesController {
  /**
   * Liste tous les messages d'un ticket
   */
  public async index({ params, auth, response }: HttpContext) {
    try {
      const { ticket_id } = params
      const user = auth.user

      if (!user) {
        return response.unauthorized('Utilisateur non authentifié')
      }

      // Vérifier que le ticket existe
      const ticket = await ChatTicket.find(ticket_id)
      if (!ticket) {
        return response.notFound('Ticket non trouvé')
      }

      // Vérifier que l'utilisateur est le propriétaire du ticket ou un admin
      const isAdmin = await this.checkIfUserIsAdmin(user)
      if (ticket.user_id !== user.id && !isAdmin) {
        return response.forbidden('Vous n\'avez pas accès à ce ticket')
      }

      // Récupérer les messages
      const messages = await ChatMessage.query()
        .where('ticket_id', ticket_id)
        .preload('user')
        .orderBy('created_at', 'asc')

      return response.ok(messages)
    } catch (error) {
      return response.internalServerError({
        message: 'Une erreur est survenue lors de la récupération des messages',
        error: error.message,
      })
    }
  }

  /**
   * Ajoute un nouveau message à un ticket
   */
  public async store({ params, request, auth, response }: HttpContext) {
    try {
      const { ticket_id } = params
      const { message } = request.body()
      const user = auth.user

      if (!user) {
        return response.unauthorized('Utilisateur non authentifié')
      }

      // Valider le message
      if (!message || typeof message !== 'string' || message.trim() === '') {
        return response.badRequest('Le message est requis')
      }

      // Vérifier que le ticket existe
      const ticket = await ChatTicket.find(ticket_id)
      if (!ticket) {
        return response.notFound('Ticket non trouvé')
      }

      // Vérifier que l'utilisateur est le propriétaire du ticket ou un admin
      const isAdmin = await this.checkIfUserIsAdmin(user)
      if (ticket.user_id !== user.id && !isAdmin) {
        return response.forbidden('Vous n\'avez pas accès à ce ticket')
      }

      // Vérifier que le ticket n'est pas fermé
      if (ticket.status === 'closed') {
        return response.badRequest('Ce ticket est clôturé, vous ne pouvez plus y ajouter de messages')
      }

      // Créer le message
      const chatMessage = await ChatMessage.create({
        ticket_id,
        user_id: user.id,
        message,
        is_admin: isAdmin,
        read: false,
      })

      // Si le ticket était en attente (pending) et qu'un administrateur répond, le passer en ouvert
      if (ticket.status === 'pending' && isAdmin) {
        ticket.status = 'open'
        await ticket.save()
      }
      
      // Si l'utilisateur répond, passer le ticket en attente
      if (ticket.status === 'open' && !isAdmin) {
        ticket.status = 'pending'
        await ticket.save()
      }

      // Recharger le message avec les relations
      await chatMessage.load('user')

      return response.created(chatMessage)
    } catch (error) {
      return response.internalServerError({
        message: 'Une erreur est survenue lors de l\'ajout du message',
        error: error.message,
      })
    }
  }

  /**
   * Marquer les messages comme lus
   */
  public async markAsRead({ params, auth, response }: HttpContext) {
    try {
      const { ticket_id } = params
      const user = auth.user

      if (!user) {
        return response.unauthorized('Utilisateur non authentifié')
      }

      // Vérifier que le ticket existe
      const ticket = await ChatTicket.find(ticket_id)
      if (!ticket) {
        return response.notFound('Ticket non trouvé')
      }

      // Vérifier que l'utilisateur est le propriétaire du ticket ou un admin
      const isAdmin = await this.checkIfUserIsAdmin(user)
      if (ticket.user_id !== user.id && !isAdmin) {
        return response.forbidden('Vous n\'avez pas accès à ce ticket')
      }

      // Marquer les messages comme lus selon le rôle
      if (isAdmin) {
        // Un admin marque tous les messages des utilisateurs comme lus
        await ChatMessage.query()
          .where('ticket_id', ticket_id)
          .where('is_admin', false)
          .update({ read: true })
      } else {
        // Un utilisateur marque tous les messages des admins comme lus
        await ChatMessage.query()
          .where('ticket_id', ticket_id)
          .where('is_admin', true)
          .update({ read: true })
      }

      return response.ok({ message: 'Messages marqués comme lus' })
    } catch (error) {
      return response.internalServerError({
        message: 'Une erreur est survenue lors du marquage des messages',
        error: error.message,
      })
    }
  }

  /**
   * Méthode auxiliaire pour vérifier si un utilisateur est admin
   */
  private async checkIfUserIsAdmin(user: any) {
    if (!user) return false
    
    // Utilisation de la méthode hasRole si disponible
    if (typeof user.hasRole === 'function') {
      return await user.hasRole('Admin')
    }
    
    // Fallback : vérification par requête directe
    try {
      const roles = await user.related('roles').query()
      return roles.some(role => role.name === 'Admin')
    } catch (error) {
      console.error('Erreur lors de la vérification du rôle admin:', error)
      return false
    }
  }
}