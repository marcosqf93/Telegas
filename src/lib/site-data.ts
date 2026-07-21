export type CityKey = 'aquidauana' | 'anastacio' | 'miranda';

export type Unit = {
  key: CityKey;
  city: string;
  name: string;
  address: string;
  phones: string[];
  whatsapp: string;
  hours: string;
  mapUrl: string;
  areaServed: string[];
  featuredNote: string;
  image?: string;
  phoneDisplay?: string;
  whatsappDisplay?: string;
  instagramUrl?: string | null;
  googleRating?: string;
  googleReviewsCount?: string;
  reviewLinks?: string[];
};

export type AquidauanaBranch = {
  key: 'matriz' | 'nova-aquidauana' | 'chapecoense';
  name: string;
  address: string;
  coords: { lat: number; lng: number };
  phoneDisplay: string;
  whatsappDisplay: string;
  mapUrl?: string;
};

export type Product = {
  id: string;
  name: string;
  slug: string;
  description: string;
  useCase: string;
  image: string;
  available: boolean;
  featured: boolean;
  deliveryInfo: string;
  pricesByUnit: Record<CityKey, number | null>;
};

export type Review = {
  name: string;
  rating: number;
  excerpt: string;
  source: 'Google' | 'Cliente';
  verified: boolean;
};

export type FaqItem = {
  question: string;
  answer: string;
};

export type UnitReview = {
  name: string;
  reviewCount: string;
  timeAgo: string;
  rating: number;
  comment: string;
  link?: string;
};

export const brand = {
  name: 'TELE GÁS',
  slogan: 'Seu gás entregue com rapidez e segurança.',
  domain: 'telegasonline.com.br',
  logo: 'https://telegasonline.com.br/paginas/sobre/5jodVBuwOUCQzPoqZOyYPJPzd7YJUgtO6Hhx3nJ7.png',
  heroImage: 'https://lh3.googleusercontent.com/gps-cs-s/AHRPTWngBFtFq7q6cfL0h0VZ5GFov6L7anUKcKq-olH2YVn6C_uPgfQmiwvGhrGUBUV-_O6LJ9-JZsnAI6YMFdYdbL3PdmKqwFDeAX_BM8mDdsBda6DXgE4oWMs0NJJVEJJ3SK_tQb6MKA=s680-w680-h510-rw',
  social: {
    instagram: 'https://instagram.com/',
    googleReview: 'https://g.page/'
  }
};

export const cities: Array<{ key: CityKey; label: string }> = [
  { key: 'aquidauana', label: 'Aquidauana' },
  { key: 'anastacio', label: 'Anastácio' },
  { key: 'miranda', label: 'Miranda' }
];

export const units: Unit[] = [
  {
    key: 'aquidauana',
    city: 'Aquidauana',
    name: 'Tele Gás Aquidauana',
    address: 'Oscar Trindade de Barros, 458, Santa Terezinha',
    phones: ['(67) 3241-2222'],
    whatsapp: '(67) 99619-7991',
    hours: 'Horário a confirmar com o cliente',
    mapUrl: 'https://maps.google.com/maps?vet=10CAAQoqAOahcKEwiYhfD5keKVAxUAAAAAHQAAAAAQDA..i&pvq=Cg0vZy8xMWRfZDlnazR2Ig0KB3RlbGVnYXMQAhgD&lqi=Cgd0ZWxlZ2FzSJqJ3cT9rICACFoNEAAYACIHdGVsZWdhc5IBC2dhc19jb21wYW55&fvr=1&cs=1&um=1&ie=UTF-8&fb=1&gl=br&sa=X&ftid=0x947de66f3fcf0dfb:0x9173466e91a7f5db',
    areaServed: ['Aquidauana'],
    featuredNote: 'Unidade principal para atendimento em Aquidauana.',
    phoneDisplay: '(67) 3241-2222',
    whatsappDisplay: '(67) 99619-7991',
    instagramUrl: 'https://www.instagram.com/telegasaquidauana/',
    googleRating: '5,0',
    googleReviewsCount: '2 mil+ avaliações',
    reviewLinks: [
      'https://share.google/63uoQayFyvNAvnVWB',
      'https://share.google/uX6hZ1N0mG1kWR4el',
      'https://share.google/CPysiZ5OVu8Ruqxku',
      'https://share.google/3AYfaeNAxekwdBsi5',
      'https://share.google/MfCMxVdFMIboPK49o'
    ]
  },
  {
    key: 'anastacio',
    city: 'Anastácio',
    name: 'Tele Gás Anastácio',
    address: 'Acogo, 1486, Setor.',
    phones: ['(67) 99643-1765'],
    whatsapp: '(67) 99643-1765',
    hours: 'Horário a confirmar com o cliente',
    mapUrl: 'https://maps.google.com/?q=Acogo,+1486,+Setor,+Anastacio+MS',
    areaServed: ['Anastácio'],
    featuredNote: 'Atendimento dedicado para a cidade de Anastácio.',
    image: 'https://lh3.googleusercontent.com/gps-cs-s/AHRPTWlfC50msubDSkcTNGS47apVeMw48RKnsTf3DwZ5k-39qf7vMUsV8bS8IMJ0MSBrAiXIv5YK97Uy3P8vU9pLmpSt0oipkkdFgZCu7nrzpIoSGTYKXrDUNDKeyiFLLUt-Ak3aL8JzCA=s680-w680-h510-rw',
    phoneDisplay: '(67) 99643-1765',
    whatsappDisplay: '(67) 99643-1765',
    googleRating: '4,7',
    googleReviewsCount: '4 avaliações'
  },
  {
    key: 'miranda',
    city: 'Miranda',
    name: 'Tele Gás Miranda',
    address: 'Endereço a confirmar com o cliente',
    phones: ['Telefone a confirmar'],
    whatsapp: 'WhatsApp a confirmar',
    hours: 'Horário a confirmar com o cliente',
    mapUrl: 'https://maps.google.com/?q=Miranda+MS',
    areaServed: ['Miranda'],
    featuredNote: 'Cobertura local para pedidos em Miranda.'
  }
];

export const aquidauanaBranches: AquidauanaBranch[] = [
  {
    key: 'matriz',
    name: 'Matriz',
    address: 'Oscar Trindade de Barros, 458, Santa Terezinha',
    coords: { lat: -20.4788, lng: -55.7872 },
    phoneDisplay: '(67) 3241-2222',
    whatsappDisplay: '(67) 99619-7991',
    mapUrl: 'https://maps.google.com/maps?vet=10CAAQoqAOahcKEwiYhfD5keKVAxUAAAAAHQAAAAAQDA..i&pvq=Cg0vZy8xMWRfZDlnazR2Ig0KB3RlbGVnYXMQAhgD&lqi=Cgd0ZWxlZ2FzSJqJ3cT9rICACFoNEAAYACIHdGVsZWdhc5IBC2dhc19jb21wYW55&fvr=1&cs=1&um=1&ie=UTF-8&fb=1&gl=br&sa=X&ftid=0x947de66f3fcf0dfb:0x9173466e91a7f5db'
  },
  {
    key: 'nova-aquidauana',
    name: 'Nova Aquidauana',
    address: 'Av. Mato Grosso do Sul, 576',
    coords: { lat: -20.4696, lng: -55.7949 },
    phoneDisplay: '(67) 3241-2222',
    whatsappDisplay: '(67) 99619-7991',
    mapUrl: 'https://maps.google.com/?q=Av.+Mato+Grosso+do+Sul,+576+Aquidauana+MS'
  },
  {
    key: 'chapecoense',
    name: 'Chapecoense',
    address: 'Francisco Pereira Alves, 873, Cidade Nova',
    coords: { lat: -20.4719, lng: -55.7826 },
    phoneDisplay: '(67) 3241-2222',
    whatsappDisplay: '(67) 99619-7991',
    mapUrl: 'https://maps.google.com/?q=Francisco+Pereira+Alves,+873+Cidade+Nova+Aquidauana+MS'
  }
];

export const products: Product[] = [
  {
    id: 'p13',
    name: 'Gás P13',
    slug: 'gas-p13',
    description: 'O botijão mais usado em casas e pequenos comércios.',
    useCase: 'Uso residencial e rotinas do dia a dia.',
    image: 'https://rescaroli.com.br/wp-content/uploads/2017/03/botijao-gas-p13-dourado.png',
    available: true,
    featured: true,
    deliveryInfo: 'Entrega conforme a unidade selecionada.',
    pricesByUnit: { aquidauana: 138, anastacio: 138, miranda: 138 }
  },
  {
    id: 'p20',
    name: 'Gás P20',
    slug: 'gas-p20',
    description: 'Indicado para aplicações comerciais e alguns equipamentos específicos.',
    useCase: 'Uso comercial e equipamentos compatíveis.',
    image: 'https://gasemaguaslindas.com.br/wp-content/uploads/2025/11/gas-p20-em-ceilandia.png',
    available: true,
    featured: false,
    deliveryInfo: 'Consulte disponibilidade pela cidade.',
    pricesByUnit: { aquidauana: 204, anastacio: 204, miranda: 204 }
  },
  {
    id: 'p45',
    name: 'Gás P45',
    slug: 'gas-p45',
    description: 'Solução para consumo maior e operações que exigem mais autonomia.',
    useCase: 'Uso comercial e operações com maior demanda.',
    image: 'https://static.wixstatic.com/media/48bf7a_522ea4389c5d4bf8a54a6b9552fff093~mv2.png/v1/fill/w_220,h_298,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/botijao-p45.png',
    available: true,
    featured: true,
    deliveryInfo: 'A disponibilidade depende da unidade e da cidade.',
    pricesByUnit: { aquidauana: 495, anastacio: 495, miranda: 495 }
  }
];

export const orderPayments = [
  'PIX',
  'Dinheiro',
  'Cartão de débito',
  'Cartão de crédito',
  'Pagamento na entrega'
];

export const deliveryBenefits = [
  'Entrega grátis',
  'Atendimento todos os dias',
  'Entrega rápida',
  'Revenda autorizada',
  'Entregadores identificados'
];

export const howToOrder = [
  'Escolha sua cidade.',
  'Selecione o botijão e a quantidade.',
  'Informe nome, WhatsApp e endereço.',
  'Revise o resumo e finalize o pedido.'
];

export const timeline = [
  { year: '2004', title: 'Fundação', text: 'Início das operações da Tele Gás.' },
  { year: '2009', title: 'Sede própria e informatização', text: 'Estruturação operacional com sede própria e processos digitais.' },
  { year: '2011', title: 'Reconhecimento nacional', text: 'Marco de reconhecimento informado pela empresa.' },
  { year: '2012', title: 'Expansão para Anastácio', text: 'Ampliação do atendimento para a cidade.' },
  { year: '2017', title: 'Expansão para Miranda', text: 'Nova unidade reforçando a presença regional.' },
  { year: 'Atualidade', title: 'Situação atual', text: 'Operação focada em rapidez, proximidade e conveniência.' }
];

export const reviews: Review[] = [];

export const faq: FaqItem[] = [
  { question: 'Qual é o prazo médio de entrega?', answer: 'Resposta comercial a confirmar com o cliente.' },
  { question: 'A entrega é grátis?', answer: 'Resposta comercial a confirmar com o cliente.' },
  { question: 'Quais cidades são atendidas?', answer: 'Aquidauana, Anastácio e Miranda.' },
  { question: 'Quais formas de pagamento são aceitas?', answer: 'PIX, dinheiro, cartão de débito, cartão de crédito e pagamento na entrega.' },
  { question: 'Como participar dos sorteios?', answer: 'Informações da promoção Chama Premiada devem ser confirmadas e publicadas no conteúdo da campanha.' },
  { question: 'Quais tipos de botijão estão disponíveis?', answer: 'Gás P13, Gás P20 e Gás P45.' },
  { question: 'Posso fazer pedido para uma empresa?', answer: 'Sim, o fluxo pode receber pedidos para empresas e comércios.' },
  { question: 'Como entrar em contato com uma unidade?', answer: 'Use a página de unidades, o WhatsApp ou o botão de pedido.' }
];

export const promotion = {
  title: 'Chama Premiada',
  description: 'Campanha promocional com área reservada para regras, prazos e ganhadores.',
  cta: 'Pedir gás e participar'
};

export const contactChannels = {
  phone: 'Telefone a confirmar',
  email: 'Email a confirmar com o cliente',
  instagram: null as string | null,
  googleReview: null as string | null
};

export const aquidauanaReviews: UnitReview[] = [
  {
    name: 'Ivan Santos',
    reviewCount: '5 avaliações',
    timeAgo: '4 meses atrás',
    rating: 5,
    comment: 'Ótimo atendimento a entrega é rápida muito bom',
    link: 'https://share.google/63uoQayFyvNAvnVWB'
  },
  {
    name: 'Angela Arruda',
    reviewCount: '1 avaliação',
    timeAgo: '3 meses atrás',
    rating: 5,
    comment: 'Excelente atendimento! O pedido pelo WhatsApp foi super rápido e o entregador chegou em menos de 20 minutos. Além disso, ele foi muito atencioso. 👏🏻👏🏻',
    link: 'https://share.google/uX6hZ1N0mG1kWR4el'
  },
  {
    name: 'Maria Guerreiro',
    reviewCount: '1 avaliação',
    timeAgo: '4 meses atrás',
    rating: 5,
    comment: 'Ótimo atendimento e entrega com rapidez. Super recomendo',
    link: 'https://share.google/CPysiZ5OVu8Ruqxku'
  },
  {
    name: 'Daiany Macedo',
    reviewCount: '1 avaliação',
    timeAgo: '2 meses atrás',
    rating: 5,
    comment: 'Ótimo atendimento e entrega super rápido!',
    link: 'https://share.google/3AYfaeNAxekwdBsi5'
  },
  {
    name: 'Ralf Maria',
    reviewCount: '1 avaliação',
    timeAgo: '2 meses atrás',
    rating: 5,
    comment: 'Excelente atendimento e agilidade na entrega muito rápido.',
    link: 'https://share.google/MfCMxVdFMIboPK49o'
  },
  {
    name: 'Daniela De Oliveira',
    reviewCount: '3 avaliações',
    timeAgo: '4 meses atrás',
    rating: 5,
    comment: 'Super rápido atendimento excelente fui muito bem atendida pelo funcionário Luiz super educado e atencioso parabéns pela agilidade e organização dos funcionários.',
    link: 'https://share.google/vrpRKmvIZ7km1KRyw'
  }
];

export const anastacioReviews: UnitReview[] = [
  {
    name: 'Tuani Stefani Santos de Araújo',
    reviewCount: '1 avaliação',
    timeAgo: 'Avaliação do Google',
    rating: 5,
    comment: 'Melhor atendimento que a gente tem gosto muito'
  },
  {
    name: 'Alan Delon',
    reviewCount: '1 avaliação',
    timeAgo: 'Avaliação do Google',
    rating: 5,
    comment: 'Entrega super rápido! Super recomendo.'
  },
  {
    name: 'Caroline Andrade Moraes',
    reviewCount: '1 avaliação',
    timeAgo: 'Avaliação do Google',
    rating: 5,
    comment: 'Bom atendimento entrega rápida e profundo de garantia e qualificado'
  },
  {
    name: 'Rosania Larrea',
    reviewCount: '1 avaliação',
    timeAgo: 'Avaliação do Google',
    rating: 5,
    comment: 'Atendimento rápido e de qualidade'
  }
];

export const cnpj = 'CNPJ a confirmar';
