export interface InstagramShowcaseItem {
  id: string;
  categoryPt: string;
  categoryEn: string;
  captionPt: string;
  captionEn: string;
  imageUrl: string;
  instagramUrl: string;
}

export const instagramFallback: InstagramShowcaseItem[] = [
  {
    id: 'fallback-brakes',
    categoryPt: 'Travões',
    categoryEn: 'Brakes',
    captionPt: 'Revisão de pinças, pastilhas e sangramento do sistema de travagem',
    captionEn: 'Brake caliper service, fresh pads, and hydraulic bleed',
    imageUrl: '/images/work-brakes.jpg',
    instagramUrl: 'https://www.instagram.com/promotorspt/',
  },
  {
    id: 'fallback-scooter',
    categoryPt: 'Scooters',
    categoryEn: 'Scooters',
    captionPt: 'Manutenção rápida para scooters urbanas e frotas de entregas',
    captionEn: 'Fast-turnaround servicing for urban and delivery scooters',
    imageUrl: '/images/work-scooter.jpg',
    instagramUrl: 'https://www.instagram.com/promotorspt/',
  },
  {
    id: 'fallback-tires',
    categoryPt: 'Pneus',
    categoryEn: 'Tires',
    captionPt: 'Venda, montagem e calibragem de pneus para moto e scooter',
    captionEn: 'Motorcycle and scooter tire sales, fitting, and balancing',
    imageUrl: '/images/work-tires.jpg',
    instagramUrl: 'https://www.instagram.com/promotorspt/',
  },
  {
    id: 'fallback-oil',
    categoryPt: 'Revisão',
    categoryEn: 'Service',
    captionPt: 'Mudança de óleo sintético, filtro original e check-up de segurança',
    captionEn: 'Synthetic oil change, OEM filter, and multi-point safety check',
    imageUrl: '/images/work-oil.jpg',
    instagramUrl: 'https://www.instagram.com/promotorspt/',
  },
];
