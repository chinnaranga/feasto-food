import { useEffect } from 'react';

/**
 * Custom hook to dynamically update the HTML document title and meta description.
 * Useful for client-side routing SEO updates.
 */
export function useDocumentTitle(title: string, description?: string) {
  useEffect(() => {
    const defaultTitle = 'Feasto | AI-Powered Food Discovery & Delivery';
    document.title = title ? `${title} | Feasto` : defaultTitle;

    if (description) {
      const metaDescription = document.querySelector('meta[name="description"]');
      if (metaDescription) {
        metaDescription.setAttribute('content', description);
      }
    }
  }, [title, description]);
}
