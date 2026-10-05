import { EN_IN_TEMPLATES } from './locales/en-IN.js';

export function resolveTemplateVariables(template: string, vars: Record<string, any> = {}): string {
  let result = template;
  for (const [key, val] of Object.entries(vars)) {
    const regex = new RegExp(`{{\\s*${key}\\s*}}`, 'g');
    result = result.replace(regex, String(val ?? ''));
  }
  return result;
}

export function getResolvedTemplate(
  type: string,
  variables: Record<string, any> = {},
  _locale = 'en-IN'
): {
  title: string;
  body: string;
  emailSubject?: string;
  emailHtml?: string;
  smsText?: string;
} {
  const tpl = EN_IN_TEMPLATES[type] || {
    title: 'Notification Notice',
    body: 'You have a new update from Feasto.',
  };

  return {
    title: resolveTemplateVariables(tpl.title, variables),
    body: resolveTemplateVariables(tpl.body, variables),
    emailSubject: tpl.emailSubject ? resolveTemplateVariables(tpl.emailSubject, variables) : undefined,
    emailHtml: tpl.emailHtml ? resolveTemplateVariables(tpl.emailHtml, variables) : undefined,
    smsText: tpl.smsText ? resolveTemplateVariables(tpl.smsText, variables) : undefined,
  };
}
