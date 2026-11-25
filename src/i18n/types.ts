import type { ServiceId } from '../data/services';

export type Locale = 'pt' | 'en';

export interface ServiceCopy {
  title: string;
  shortLabel: string;
  description: string;
}

export interface TranslationDictionary {
  meta: {
    langTag: string;
    title: string;
    description: string;
    ogLocale: string;
  };
  nav: {
    services: string;
    instagram: string;
    booking: string;
    contacts: string;
    partsShop: string;
    bookCta: string;
    openMenu: string;
    closeMenu: string;
    skipToContent: string;
  };
  hero: {
    openNow: string;
    closedNow: string;
    hoursCompact: string;
    headlinePrefix: string;
    headlineAccent: string;
    subtitle: string;
    primaryCta: string;
    secondaryCta: string;
    imageAlt: string;
    trustItems: {
      multibrand: string;
      location: string;
      vehicles: string;
    };
  };
  services: {
    eyebrow: string;
    heading: string;
    subheading: string;
    cardCta: string;
    items: Record<ServiceId, ServiceCopy>;
    partsBannerTitle: string;
    partsBannerSubtitle: string;
    partsBannerCta: string;
  };
  instagram: {
    eyebrow: string;
    heading: string;
    subheading: string;
    followCta: string;
    openPostAria: string;
  };
  booking: {
    eyebrow: string;
    heading: string;
    subheading: string;
    servicesLabel: string;
    servicesHint: string;
    bikeLabel: string;
    bikePlaceholder: string;
    dateLabel: string;
    datePlaceholder: string;
    dateHint: string;
    calendarPrevMonth: string;
    calendarNextMonth: string;
    calendarSaturdayLegend: string;
    calendarSundayLegend: string;
    calendarAriaLabel: string;
    timeSlotLabel: string;
    timeSlotMorning: string;
    timeSlotAfternoon: string;
    saturdayNote: string;
    nameLabel: string;
    namePlaceholder: string;
    phoneLabel: string;
    phonePlaceholder: string;
    emailLabel: string;
    emailPlaceholder: string;
    notesLabel: string;
    notesPlaceholder: string;
    gdprPrefix: string;
    gdprLinkText: string;
    gdprSuffix: string;
    submitCta: string;
    submittingCta: string;
    responseNote: string;
    errors: {
      servicesRequired: string;
      bikeRequired: string;
      dateInvalid: string;
      datePast: string;
      dateSunday: string;
      slotUnavailable: string;
      nameRequired: string;
      phoneInvalid: string;
      emailInvalid: string;
      gdprRequired: string;
      rateLimited: string;
      tooFast: string;
      networkFallbackTitle: string;
      networkFallbackBody: string;
      notConfiguredTitle: string;
      notConfiguredBody: string;
      whatsappFallbackCta: string;
    };
    success: {
      eyebrow: string;
      title: string;
      subtitle: string;
      emailSentNote: string;
      emailPendingNote: string;
      idLabel: string;
      bikeLabel: string;
      servicesLabel: string;
      dateLabel: string;
      whatsappCta: string;
      newBookingCta: string;
    };
  };
  location: {
    eyebrow: string;
    heading: string;
    addressLabel: string;
    hoursLabel: string;
    weekdaysLabel: string;
    weekdaysHours: string;
    saturdayLabel: string;
    saturdayHours: string;
    sundayLabel: string;
    sundayHours: string;
    phoneLabel: string;
    whatsappLabel: string;
    emailLabel: string;
    googleMapsCta: string;
    wazeCta: string;
    mapTitle: string;
  };
  footer: {
    tagline: string;
    privacyLink: string;
    livroReclamacoes: string;
    partsShop: string;
    rights: string;
  };
  privacy: {
    title: string;
    intro: string;
    dataCollectedTitle: string;
    dataCollectedBody: string;
    purposeTitle: string;
    purposeBody: string;
    retentionTitle: string;
    retentionBody: string;
    rightsTitle: string;
    rightsBody: string;
    closeCta: string;
  };
  mobileBar: {
    call: string;
    whatsapp: string;
    book: string;
  };
}
