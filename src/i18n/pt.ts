import type { TranslationDictionary } from './types';

export const pt: TranslationDictionary = {
  meta: {
    langTag: 'pt-PT',
    title: 'Pro Motors — Mecânica de Motos & Scooters no Montijo',
    description:
      'Oficina mecânica de motos e scooters no Montijo. Revisões, mudança de óleo e filtros, travões, pneus, transmissões e manutenção para motos de entregas. Marcação online rápida.',
    ogLocale: 'pt_PT',
  },
  nav: {
    services: 'Serviços',
    instagram: 'Instagram',
    booking: 'Marcação',
    contacts: 'Contactos',
    partsShop: 'Peças',
    bookCta: 'Marcar Serviço',
    openMenu: 'Abrir menu de navegação',
    closeMenu: 'Fechar menu de navegação',
    skipToContent: 'Saltar para o conteúdo principal',
  },
  hero: {
    openNow: 'ABERTO AGORA',
    closedNow: 'FECHADO DE MOMENTO',
    hoursCompact: 'Seg–Sex 09:00–19:00 · Sáb 09:00–13:00',
    headlinePrefix: 'MECÂNICA DE MOTOS & SCOOTERS NO',
    headlineAccent: 'MONTIJO',
    subtitle:
      'Manutenção multimarca, revisões, pneus, travões e serviço ágil para motos e scooters urbanas.',
    primaryCta: 'Marcar Serviço',
    secondaryCta: 'WhatsApp Direto',
    imageAlt: 'Motociclo em cavalete de oficina na Pro Motors Montijo',
    trustItems: {
      multibrand: 'Multimarca',
      location: 'Montijo (Junto à PSP)',
      vehicles: 'Motos & Scooters',
    },
  },
  services: {
    eyebrow: '// SERVIÇOS',
    heading: 'O QUE FAZEMOS PELA SUA MOTO',
    subheading:
      'Selecione qualquer serviço abaixo para o pré-preencher diretamente na sua marcação online.',
    cardCta: 'Marcar',
    items: {
      revisao: {
        title: 'Revisão Geral & Manutenção',
        shortLabel: 'Revisão Geral',
        description:
          'Check-up completo segundo o plano da marca, afinações e diagnóstico para máxima fiabilidade.',
      },
      oleo: {
        title: 'Mudança de Óleo & Filtros',
        shortLabel: 'Óleo & Filtros',
        description:
          'Óleos recomendados, filtros de óleo e ar e verificação de níveis para proteger o motor.',
      },
      travoes: {
        title: 'Travões — Pastilhas, Discos & Maxilas',
        shortLabel: 'Travões',
        description:
          'Substituição de pastilhas, discos, limpeza de pinças e renovação de líquido de travões.',
      },
      pneus: {
        title: 'Pneus — Venda & Montagem',
        shortLabel: 'Pneus',
        description:
          'Aconselhamento, venda, montagem e calibragem de pneus para moto e scooter.',
      },
      mecanica: {
        title: 'Transmissão & Mecânica Geral',
        shortLabel: 'Transmissão & Mecânica',
        description:
          'Kits de transmissão, correias, variadores, embraiagens, suspensão e reparações de motor.',
      },
      scooters: {
        title: 'Scooters & Motas de Entregas',
        shortLabel: 'Scooters / Entregas',
        description:
          'Assistência rápida pensada para quem depende da scooter todos os dias na cidade.',
      },
    },
    partsBannerTitle: 'Procura peças ou acessórios para a sua moto?',
    partsBannerSubtitle:
      'Consulte a nossa loja dedicada a peças, consumíveis e equipamento.',
    partsBannerCta: 'Visitar Pro Motors Parts',
  },
  instagram: {
    eyebrow: '// INSTAGRAM · @PROMOTORSPT',
    heading: 'TRABALHOS RECENTES NA OFICINA',
    subheading:
      'Um olhar real sobre as motos, scooters e revisões que passam pelas nossas bancadas no Montijo.',
    followCta: 'Seguir @promotorspt',
    openPostAria: 'Ver publicação no Instagram',
  },
  booking: {
    eyebrow: '// MARCAÇÃO ONLINE',
    heading: 'AGENDE A SUA VISITA',
    subheading:
      'Preencha os dados em menos de 1 minuto. A marcação fica registada de imediato e recebe confirmação por e-mail.',
    servicesLabel: 'Serviços pretendidos',
    servicesHint: 'Pode selecionar um ou mais serviços.',
    bikeLabel: 'Marca e Modelo da Moto / Scooter',
    bikePlaceholder: 'Ex.: Honda PCX 125, Yamaha MT-07',
    dateLabel: 'Data Preferida',
    datePlaceholder: 'Escolher data no calendário…',
    dateHint: 'Encerrado ao domingo. Sábados apenas de manhã (09:00–13:00).',
    calendarPrevMonth: 'Mês anterior',
    calendarNextMonth: 'Mês seguinte',
    calendarSaturdayLegend: 'Sáb: 09:00–13:00',
    calendarSundayLegend: 'Dom: Encerrado',
    calendarAriaLabel: 'Calendário de seleção de data',
    timeSlotLabel: 'Período Preferido',
    timeSlotMorning: 'Manhã (09:00–13:00)',
    timeSlotAfternoon: 'Tarde (14:00–19:00)',
    saturdayNote: 'Aos sábados a oficina funciona apenas no período da manhã (09:00–13:00).',
    nameLabel: 'O seu Nome',
    namePlaceholder: 'Ex.: João Silva',
    phoneLabel: 'Telemóvel / WhatsApp',
    phonePlaceholder: '+351 9XX XXX XXX',
    emailLabel: 'E-mail (para confirmação)',
    emailPlaceholder: 'nome@exemplo.pt',
    notesLabel: 'Observações / Sintomas (opcional)',
    notesPlaceholder: 'Quilometragem, ruídos, peças específicas ou pedidos adicionais…',
    gdprPrefix: 'Li e aceito a ',
    gdprLinkText: 'Política de Privacidade (RGPD)',
    gdprSuffix: ' para tratamento do meu pedido de marcação.',
    submitCta: 'Confirmar Marcação',
    submittingCta: 'A registar marcação…',
    responseNote:
      'Pedido sujeito a confirmação final de disponibilidade pela oficina.',
    errors: {
      servicesRequired: 'Selecione pelo menos um serviço pretendido.',
      bikeRequired: 'Indique a marca e o modelo da sua moto ou scooter.',
      dateInvalid: 'Escolha uma data válida para a marcação.',
      datePast: 'A data pretendida não pode ser anterior a hoje.',
      dateSunday: 'Estamos encerrados ao domingo. Escolha de segunda a sábado.',
      slotUnavailable: 'Aos sábados apenas temos marcações de manhã (09:00–13:00).',
      nameRequired: 'Indique o seu nome para identificarmos a marcação.',
      phoneInvalid: 'Indique um número de telemóvel ou WhatsApp válido.',
      emailInvalid: 'Indique um endereço de e-mail válido (ex.: nome@exemplo.pt).',
      gdprRequired: 'É necessário aceitar a Política de Privacidade para prosseguir.',
      rateLimited: 'Recebemos vários pedidos seguidos. Aguarde alguns minutos ou contacte-nos no WhatsApp.',
      tooFast: 'Por favor, confirme os dados do formulário e tente novamente.',
      networkFallbackTitle: 'Não foi possível ligar ao servidor da oficina neste momento.',
      networkFallbackBody:
        'Não perdeu os dados preenchidos — pode enviar exatamente esta marcação por WhatsApp com um clique.',
      notConfiguredTitle: 'Registo online temporariamente redirecionado para WhatsApp.',
      notConfiguredBody:
        'Clique abaixo para enviar os dados da sua marcação diretamente para o nosso WhatsApp (+351 968 505 075).',
      whatsappFallbackCta: 'Enviar marcação por WhatsApp',
    },
    success: {
      eyebrow: 'MARCAÇÃO REGISTADA',
      title: 'Recebemos o seu pedido!',
      subtitle:
        'A nossa equipa irá validar a disponibilidade e confirmar o agendamento consigo brevemente.',
      emailSentNote: 'Enviámos um resumo de confirmação para o seu e-mail.',
      emailPendingNote: 'O pedido ficou guardado com segurança na agenda da oficina.',
      idLabel: 'Referência',
      bikeLabel: 'Moto',
      servicesLabel: 'Serviços',
      dateLabel: 'Data & Período',
      whatsappCta: 'Confirmar também no WhatsApp',
      newBookingCta: 'Fazer nova marcação',
    },
  },
  location: {
    eyebrow: '// LOCALIZAÇÃO & CONTACTOS',
    heading: 'OFICINA NO MONTIJO',
    addressLabel: 'Morada',
    hoursLabel: 'Horário de Funcionamento',
    weekdaysLabel: 'Segunda a Sexta',
    weekdaysHours: '09:00 – 19:00',
    saturdayLabel: 'Sábado',
    saturdayHours: '09:00 – 13:00',
    sundayLabel: 'Domingo',
    sundayHours: 'Encerrado',
    phoneLabel: 'Telefone Fixo',
    callCta: 'Ligar',
    whatsappLabel: 'WhatsApp / Telemóvel',
    emailLabel: 'E-mail',
    emailCta: 'Escrever',
    copyPhoneAria: 'Copiar número de telefone +351 212 314 830',
    copyEmailAria: 'Copiar e-mail geral@promotors.pt',
    copiedLabel: 'Copiado',
    copyFailedLabel: 'Erro ao copiar',
    googleMapsCta: 'Abrir no Google Maps',
    wazeCta: 'Navegar com Waze',
    mapTitle: 'Mapa da localização da oficina Pro Motors no Montijo',
  },
  footer: {
    tagline: 'Mecânica de Motos & Scooters · Montijo, Portugal',
    privacyLink: 'Política de Privacidade (RGPD)',
    livroReclamacoes: 'Livro de Reclamações',
    partsShop: 'Loja de Peças',
    rights: 'Todos os direitos reservados.',
  },
  privacy: {
    title: 'Política de Privacidade (RGPD)',
    intro:
      'A Pro Motors respeita a sua privacidade e trata os dados pessoais submetidos neste site em conformidade com o Regulamento Geral sobre a Proteção de Dados (RGPD).',
    dataCollectedTitle: 'Dados recolhidos',
    dataCollectedBody:
      'Apenas recolhemos os dados que fornece voluntariamente no formulário de marcação: nome, telemóvel/WhatsApp, e-mail, modelo da moto/scooter, serviços selecionados, data pretendida e observações.',
    purposeTitle: 'Finalidade e armazenamento',
    purposeBody:
      'Os dados destinam-se exclusivamente à gestão do pedido de marcação, contacto pela oficina e envio do e-mail de confirmação. O registo é armazenado de forma privada na conta Google da Pro Motors (Google Sheets e Gmail) e nunca é vendido ou cedido a terceiros para fins comerciais.',
    retentionTitle: 'Prazo de conservação',
    retentionBody:
      'Os pedidos são conservados apenas pelo período necessário à prestação do serviço de oficina, histórico técnico de manutenção e obrigações legais aplicáveis.',
    rightsTitle: 'Os seus direitos',
    rightsBody:
      'Pode solicitar a qualquer momento o acesso, retificação ou eliminação dos seus dados através do e-mail geral@promotors.pt.',
    closeCta: 'Fechar',
  },
  mobileBar: {
    call: 'Ligar',
    whatsapp: 'WhatsApp',
    book: 'Marcar',
  },
};
