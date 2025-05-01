export default defineNuxtRouteMiddleware((to, from) => {
  // Routes accessibles sans authentification
  const publicRoutes = [
    '/login',
    '/register',
    '/forgotPassword',
    '/verify-email',
    '/verify-email-notice'
  ]
  
  // Vérifier si l'utilisateur est authentifié
  const authUser = process.client ? localStorage.getItem('authUser') : null
  
  // Vérifier si la route actuelle est pour la vérification d'email (avec deux formats possibles)
  const isEmailVerificationRoute = to.path.startsWith('/verify-email/') || to.path.startsWith('/verify-email-');
  
  if (!authUser && !publicRoutes.includes(to.path) && !isEmailVerificationRoute) {
    // Si l'utilisateur n'est pas authentifié et tente d'accéder à une route protégée
    return navigateTo('/login')
  }
  
  // Si l'utilisateur est authentifié et tente d'accéder à une page publique (login, register, etc.)
  if (authUser && publicRoutes.includes(to.path)) {
    // Rediriger vers l'accueil si on essaie d'accéder à une page publique alors qu'on est déjà connecté
    return navigateTo('/')
  }
})
