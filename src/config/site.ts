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
    lat: 38.7063702,
    lng: -8.9693854,
    googleMapsQuery: '38.7063702,-8.9693854+(Pro+Motors+Montijo)',
    googleMapsUrl:
      'https://www.google.com/maps/place/Pro+Motors+-+Mec%C3%A2nica+de+Motos+%26+Pe%C3%A7as+%7C+Montijo/@38.7063702,-8.9693854,17z/data=!4m15!1m8!3m7!1s0xd19399feffcfd77:0xce81a1a17ffc4937!2sR.+Joaquim+de+Almeida+90A,+2870-342+Montijo!3b1!8m2!3d38.7063702!4d-8.9693854!16s%2Fg%2F11c1y5swpk!3m5!1s0xd193936fa58b24d:0x30b39428c05c5de8!8m2!3d38.7063702!4d-8.9693854!16s%2Fg%2F11rd_c9w_j?entry=ttu&g_ep=EgoyMDI2MTEyMy4wIKXMDSoASAFQAw%3D%3D',
    wazeUrl: 'https://waze.com/ul?ll=38.7063702,-8.9693854&navigate=yes',
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
