import type { TranslationDictionary } from './types';

export const en: TranslationDictionary = {
  meta: {
    langTag: 'en',
    title: 'Pro Motors — Motorcycle & Scooter Workshop in Montijo',
    description:
      'Multi-brand motorcycle and scooter mechanics in Montijo, Portugal. Full servicing, oil & filters, brakes, tires, drivetrains, and delivery scooter care. Book online in 1 minute.',
    ogLocale: 'en_GB',
  },
  nav: {
    services: 'Services',
    instagram: 'Instagram',
    booking: 'Booking',
    contacts: 'Contacts',
    partsShop: 'Parts',
    bookCta: 'Book Service',
    openMenu: 'Open navigation menu',
    closeMenu: 'Close navigation menu',
    skipToContent: 'Skip to main content',
  },
  hero: {
    openNow: 'OPEN NOW',
    closedNow: 'CURRENTLY CLOSED',
    hoursCompact: 'Mon–Fri 09:00–19:00 · Sat 09:00–13:00',
    headlinePrefix: 'MOTORCYCLE & SCOOTER WORKSHOP IN',
    headlineAccent: 'MONTIJO',
    subtitle:
      'Multi-brand maintenance, scheduled servicing, tires, brakes, and fast-turnaround care for urban bikes and scooters. R. Joaquim de Almeida, 90A.',
    primaryCta: 'Book Service',
    secondaryCta: 'WhatsApp Direct',
    imageAlt: 'Motorcycle on a rear paddock stand inside Pro Motors workshop in Montijo',
    trustItems: {
      multibrand: 'Multi-Brand',
      location: 'Montijo (Next to PSP)',
      vehicles: 'Bikes & Scooters',
    },
  },
  services: {
    eyebrow: '// SERVICES',
    heading: 'WHAT WE DO FOR YOUR BIKE',
    subheading:
      'Click any service below to pre-select it directly in the online booking form.',
    cardCta: 'Book',
    items: {
      revisao: {
        title: 'Full Service & Maintenance',
        shortLabel: 'Full Service',
        description:
          'Complete scheduled check-up, adjustments, and diagnostics to keep your ride reliable.',
      },
      oleo: {
        title: 'Oil & Filter Change',
        shortLabel: 'Oil & Filters',
        description:
          'Manufacturer-spec oils, oil and air filters, and fluid checks to protect your engine.',
      },
      travoes: {
        title: 'Brakes — Pads, Discs & Calipers',
        shortLabel: 'Brakes',
        description:
          'Brake pad and disc replacement, caliper cleaning, and hydraulic brake fluid flush.',
      },
      pneus: {
        title: 'Tires — Sales & Fitting',
        shortLabel: 'Tires',
        description:
          'Tire advice, supply, mounting, and precision wheel balancing for motorcycles and scooters.',
      },
      mecanica: {
        title: 'Drivetrain & General Mechanics',
        shortLabel: 'Drivetrain & Mechanics',
        description:
          'Chain & sprocket kits, belts, variators, clutches, suspension, and engine repairs.',
      },
      scooters: {
        title: 'Scooters & Delivery Fleet Care',
        shortLabel: 'Scooters / Delivery',
        description:
          'Fast, dependable turnaround built for daily commuters and delivery riders.',
      },
    },
    partsBannerTitle: 'Looking for spare parts or accessories?',
    partsBannerSubtitle:
      'Browse our dedicated parts, consumables, and accessories store.',
    partsBannerCta: 'Visit Pro Motors Parts',
  },
  instagram: {
    eyebrow: '// INSTAGRAM · @PROMOTORSPT',
    heading: 'RECENT WORK IN THE GARAGE',
    subheading:
      'A closer look at the bikes, scooters, and mechanical work rolling off our lifts in Montijo.',
    followCta: 'Follow @promotorspt',
    openPostAria: 'Open post on Instagram',
  },
  booking: {
    eyebrow: '// ONLINE BOOKING',
    heading: 'SCHEDULE YOUR VISIT',
    subheading:
      'Complete your request in under a minute. Your booking is logged directly with the workshop and confirmed by email.',
    servicesLabel: 'Requested Services',
    servicesHint: 'Select one or more services.',
    bikeLabel: 'Motorcycle / Scooter Make & Model',
    bikePlaceholder: 'e.g. Honda PCX 125, Yamaha MT-07',
    dateLabel: 'Preferred Date',
    datePlaceholder: 'Pick a date from calendar…',
    dateHint: 'Closed on Sundays. Saturdays morning only (09:00–13:00).',
    calendarPrevMonth: 'Previous month',
    calendarNextMonth: 'Next month',
    calendarSaturdayLegend: 'Sat: 09:00–13:00',
    calendarSundayLegend: 'Sun: Closed',
    calendarAriaLabel: 'Date picker calendar',
    timeSlotLabel: 'Preferred Time Window',
    timeSlotMorning: 'Morning (09:00–13:00)',
    timeSlotAfternoon: 'Afternoon (14:00–19:00)',
    saturdayNote: 'On Saturdays the workshop is open mornings only (09:00–13:00).',
    nameLabel: 'Your Name',
    namePlaceholder: 'e.g. Alex Silva',
    phoneLabel: 'Phone / WhatsApp',
    phonePlaceholder: '+351 9XX XXX XXX',
    emailLabel: 'Email (for confirmation)',
    emailPlaceholder: 'you@example.com',
    notesLabel: 'Notes / Symptoms (optional)',
    notesPlaceholder: 'Mileage, noises, specific parts, or additional requests…',
    gdprPrefix: 'I have read and accept the ',
    gdprLinkText: 'Privacy Policy (GDPR)',
    gdprSuffix: ' so Pro Motors can process my booking request.',
    submitCta: 'Confirm Booking',
    submittingCta: 'Saving booking…',
    responseNote:
      'Request subject to final slot availability confirmation by the workshop.',
    errors: {
      servicesRequired: 'Please select at least one service.',
      bikeRequired: 'Please enter your motorcycle or scooter make and model.',
      dateInvalid: 'Please pick a valid booking date.',
      datePast: 'Preferred date cannot be in the past.',
      dateSunday: 'We are closed on Sundays. Please select Monday to Saturday.',
      slotUnavailable: 'On Saturdays only morning slots (09:00–13:00) are available.',
      nameRequired: 'Please enter your name.',
      phoneInvalid: 'Please enter a valid phone or WhatsApp number.',
      emailInvalid: 'Please enter a valid email address (e.g. you@example.com).',
      gdprRequired: 'Please accept the Privacy Policy to submit your booking.',
      rateLimited: 'Multiple requests detected. Please wait a few minutes or message us on WhatsApp.',
      tooFast: 'Please double-check your details and try submitting again.',
      networkFallbackTitle: 'Could not reach the workshop server right now.',
      networkFallbackBody:
        'Your details are preserved — send this exact booking via WhatsApp in one tap.',
      notConfiguredTitle: 'Online booking is currently routed directly to WhatsApp.',
      notConfiguredBody:
        'Tap below to send your completed booking request straight to our WhatsApp (+351 968 505 075).',
      whatsappFallbackCta: 'Send booking via WhatsApp',
    },
    success: {
      eyebrow: 'BOOKING SAVED',
      title: 'We received your request!',
      subtitle:
        'Our mechanics will review availability and confirm your appointment shortly.',
      emailSentNote: 'A confirmation summary has been sent to your email.',
      emailPendingNote: 'Your request has been safely recorded in our workshop schedule.',
      idLabel: 'Reference',
      bikeLabel: 'Bike',
      servicesLabel: 'Services',
      dateLabel: 'Date & Window',
      whatsappCta: 'Also confirm on WhatsApp',
      newBookingCta: 'Submit another booking',
    },
  },
  location: {
    eyebrow: '// LOCATION & CONTACTS',
    heading: 'WORKSHOP IN MONTIJO',
    addressLabel: 'Address',
    hoursLabel: 'Opening Hours',
    weekdaysLabel: 'Monday to Friday',
    weekdaysHours: '09:00 – 19:00',
    saturdayLabel: 'Saturday',
    saturdayHours: '09:00 – 13:00',
    sundayLabel: 'Sunday',
    sundayHours: 'Closed',
    phoneLabel: 'Landline Phone',
    callCta: 'Call',
    whatsappLabel: 'WhatsApp / Mobile',
    emailLabel: 'Email',
    emailCta: 'Email',
    copyPhoneAria: 'Copy landline phone number +351 212 314 830',
    copyEmailAria: 'Copy email address geral@promotors.pt',
    copiedLabel: 'Copied',
    copyFailedLabel: 'Copy failed',
    googleMapsCta: 'Open in Google Maps',
    wazeCta: 'Navigate with Waze',
    mapTitle: 'Location map for Pro Motors workshop in Montijo',
  },
  footer: {
    tagline: 'Motorcycle & Scooter Mechanics · Montijo, Portugal',
    privacyLink: 'Privacy Policy (GDPR)',
    livroReclamacoes: 'Complaints Book (PT)',
    partsShop: 'Parts Shop',
    rights: 'All rights reserved.',
  },
  privacy: {
    title: 'Privacy Policy (GDPR)',
    intro:
      'Pro Motors respects your privacy and processes personal data submitted on this website in compliance with the EU General Data Protection Regulation (GDPR).',
    dataCollectedTitle: 'Data collected',
    dataCollectedBody:
      'We only collect the information you voluntarily provide in the booking form: name, phone/WhatsApp number, email address, motorcycle/scooter model, requested services, preferred date, and optional notes.',
    purposeTitle: 'Purpose and storage',
    purposeBody:
      'Your data is used solely to manage your booking request, contact you about your appointment, and send a confirmation email. Records are stored privately in Pro Motors’ Google account (Google Sheets and Gmail) and are never sold or shared for third-party marketing.',
    retentionTitle: 'Data retention',
    retentionBody:
      'Booking records are retained only as long as required to deliver workshop services, maintain vehicle service history, and satisfy applicable legal obligations.',
    rightsTitle: 'Your rights',
    rightsBody:
      'You may request access to, correction of, or deletion of your personal data at any time by emailing geral@promotors.pt.',
    closeCta: 'Close',
  },
  mobileBar: {
    call: 'Call',
    whatsapp: 'WhatsApp',
    book: 'Book',
  },
};
