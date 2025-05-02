import type { HttpContext } from '@adonisjs/core/http'
import ChatTicket from '#models/chat_ticket'
import ChatMessage from '#models/chat_message'

export default class ChatTicketsController {
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
      return roles.some((role: any) => role.name === 'Admin')
    } catch (error) {
      console.error('Erreur lors de la vérification du rôle admin:', error)
      return false
    }
  }

  /**
   * Liste tous les tickets pour l'utilisateur connecté
   */
  public async index({ auth, response }: HttpContext) {
    try {
      const user = auth.user
      if (!user) {
        return response.unauthorized('Utilisateur non authentifié')
      }

      // Les administrateurs peuvent voir tous les tickets
      const isAdmin = await this.checkIfUserIsAdmin(user)
      
      let tickets
      if (isAdmin) {
        tickets = await ChatTicket.query()
          .preload('user')
          .orderBy('created_at', 'desc')
      } else {
        tickets = await ChatTicket.query()
          .where('user_id', user.id)
          .orderBy('created_at', 'desc')
      }

      return response.ok(tickets)
    } catch (error) {
      return response.internalServerError({
        message: 'Une erreur est survenue lors de la récupération des tickets',
        error: error.message,
      })
    }
  }

  /**
   * Affiche un ticket spécifique avec ses messages
   */
  public async show({ params, auth, response }: HttpContext) {
    try {
      const { id } = params
      const user = auth.user
      
      if (!user) {
        return response.unauthorized('Utilisateur non authentifié')
      }

      const ticket = await ChatTicket.query()
        .where('id', id)
        .preload('user')
        .preload('messages', (query) => {
          query.orderBy('created_at', 'asc')
        })
        .first()

      if (!ticket) {
        return response.notFound('Ticket non trouvé')
      }

      // Vérifier que l'utilisateur est le propriétaire du ticket ou un admin
      const isAdmin = await this.checkIfUserIsAdmin(user)
      if (ticket.user_id !== user.id && !isAdmin) {
        return response.forbidden('Vous n\'avez pas accès à ce ticket')
      }

      return response.ok(ticket)
    } catch (error) {
      return response.internalServerError({
        message: 'Une erreur est survenue lors de la récupération du ticket',
        error: error.message,
      })
    }
  }

  /**
   * Crée un nouveau ticket
   */
  public async store({ request, auth, response }: HttpContext) {
    try {
      const user = auth.user
      if (!user) {
        return response.unauthorized('Utilisateur non authentifié')
      }

      const { subject, message } = request.body()

      if (!subject || !message) {
        return response.badRequest('Le sujet et le message sont requis')
      }

      // Créer le ticket
      const ticket = await ChatTicket.create({
        user_id: user.id,
        subject,
        status: 'open',
      })

      // Ajouter le premier message
      await ChatMessage.create({
        ticket_id: ticket.id,
        user_id: user.id,
        message,
        is_admin: false,
        read: false,
      })

      // Recharger le ticket avec les relations
      await ticket.load('user')
      await ticket.load('messages')

      return response.created(ticket)
    } catch (error) {
      return response.internalServerError({
        message: 'Une erreur est survenue lors de la création du ticket',
        error: error.message,
      })
    }
  }

  /**
   * Mettre à jour le statut d'un ticket
   */
  public async updateStatus({ params, request, auth, response }: HttpContext) {
    try {
      const { id } = params
      const { status } = request.body()
      const user = auth.user

      if (!user) {
        return response.unauthorized('Utilisateur non authentifié')
      }

      // Valider le statut
      const validStatuses = ['open', 'closed', 'pending']
      if (!validStatuses.includes(status)) {
        return response.badRequest('Statut invalide')
      }

      const ticket = await ChatTicket.find(id)
      if (!ticket) {
        return response.notFound('Ticket non trouvé')
      }

      // Vérifier que l'utilisateur est le propriétaire du ticket ou un admin
      const isAdmin = await this.checkIfUserIsAdmin(user)
      if (ticket.user_id !== user.id && !isAdmin) {
        return response.forbidden('Vous n\'avez pas accès à ce ticket')
      }

      // Mettre à jour le statut
      ticket.status = status
      await ticket.save()

      return response.ok(ticket)
    } catch (error) {
      return response.internalServerError({
        message: 'Une erreur est survenue lors de la mise à jour du statut',
        error: error.message,
      })
    }
  }

  /**
   * Clôturer un ticket
   */
  public async close({ params, auth, response }: HttpContext) {
    try {
      const { id } = params
      const user = auth.user

      if (!user) {
        return response.unauthorized('Utilisateur non authentifié')
      }

      const ticket = await ChatTicket.find(id)
      if (!ticket) {
        return response.notFound('Ticket non trouvé')
      }

      // Vérifier que l'utilisateur est le propriétaire du ticket ou un admin
      const isAdmin = await this.checkIfUserIsAdmin(user)
      if (ticket.user_id !== user.id && !isAdmin) {
        return response.forbidden('Vous n\'avez pas accès à ce ticket')
      }

      // Clôturer le ticket
      ticket.status = 'closed'
      await ticket.save()

      return response.ok(ticket)
    } catch (error) {
      return response.internalServerError({
        message: 'Une erreur est survenue lors de la clôture du ticket',
        error: error.message,
      })
    }
  }

}
