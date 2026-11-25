export const SITE_CONFIG = {
  brandName: 'Pro Motors',
  brandWordmark: {
    prefix: 'PRO',
    suffix: 'MOTORS',
  },
  siteUrl: 'https://promotors.pt',
  timezone: 'Europe/Lisbon',
  address: {
    street: 'R. Joaquim de Almeida, 90A',
    postalCode: '2870-342',
    city: 'Montijo',
    country: 'Portugal',
    landmarkPt: 'Junto à PSP',
    landmarkEn: 'Next to PSP Police Station',
    full: 'R. Joaquim de Almeida, 90A, 2870-342 Montijo, Portugal',
    googleMapsQuery: 'R.+Joaquim+de+Almeida+90A,+2870-342+Montijo,+Portugal',
    googleMapsUrl:
      'https://www.google.com/maps/search/?api=1&query=R.+Joaquim+de+Almeida+90A,+2870-342+Montijo,+Portugal',
    wazeUrl:
      'https://waze.com/ul?q=Rua%20Joaquim%20de%20Almeida%2090A%20Montijo%20Portugal&navigate=yes',
  },
  contact: {
    phoneDisplay: '+351 212 314 830',
    phoneHref: 'tel:+351212314830',
    whatsappDisplay: '+351 968 505 075',
    whatsappDigits: '351968505075',
    whatsappHref: 'https://wa.me/351968505075',
    email: 'geral@promotors.pt',
    emailHref: 'mailto:geral@promotors.pt',
  },
  social: {
    instagramHandle: '@promotorspt',
    instagramUrl: 'https://www.instagram.com/promotorspt/',
    facebookUrl: 'https://www.facebook.com/promotorspt',
    partsShopUrl: 'https://promotorsparts.com/',
  },
  legal: {
    livroReclamacoesUrl: 'https://www.livroreclamacoes.pt/Inicio/',
  },
  hours: {
    weekdayOpen: 9,
    weekdayClose: 19,
    saturdayOpen: 9,
    saturdayClose: 13,
  },
} as const;

export function getGasWebAppUrl(): string {
  return (import.meta.env.PUBLIC_GAS_WEB_APP_URL ?? '').trim();
}
