// composables/useTableRender.ts

/**
 * Utilitaire pour rendre dynamiquement les cellules ou entêtes
 * d'une colonne dans TanStack Table avec Vue
 */
export const useTableRender = () => {
    const flexRender = (comp: any, props: any) => {
      // Si la définition est une fonction (ex: renderFn), on l'appelle
      // Sinon on retourne directement la valeur (ex: string ou JSX statique)
      return typeof comp === 'function' ? comp(props) : comp
    }
  
    return { flexRender }
  }
  