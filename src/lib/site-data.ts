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

export type AquidauanaNeighborhood = {
  label: string;
  branchKey: AquidauanaBranch['key'];
};

export type AnastacioBranch = {
  key: '27-de-julho' | 'vila-maior' | 'cristo-rei';
  name: string;
  address: string;
  phoneDisplay: string;
  whatsappDisplay: string;
  mapUrl?: string;
};

export type AnastacioNeighborhood = {
  label: string;
  branchKey: AnastacioBranch['key'];
};

export type MirandaNeighborhood = {
  label: string;
  branchKey: 'miranda';
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
  image?: string;
};

export const brand = {
  name: 'TELE GÁS',
  slogan: 'Seu gás entregue com rapidez e segurança.',
  domain: 'telegasonline.com.br',
  logo: 'https://i.postimg.cc/2S5wb42k/images.png',
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
    hours: 'terça-feira: 06:00-22:00\nquarta-feira: 06:00-22:00\nquinta-feira: 06:00-22:00\nsexta-feira: 06:00-22:00\nsábado: 06:00-22:00\ndomingo: 06:30-20:30\nsegunda-feira: 06:00-22:00',
    mapUrl: 'https://maps.google.com/maps?vet=10CAAQoqAOahcKEwiYhfD5keKVAxUAAAAAHQAAAAAQDA..i&pvq=Cg0vZy8xMWRfZDlnazR2Ig0KB3RlbGVnYXMQAhgD&lqi=Cgd0ZWxlZ2FzSJqJ3cT9rICACFoNEAAYACIHdGVsZWdhc5IBC2dhc19jb21wYW55&fvr=1&cs=1&um=1&ie=UTF-8&fb=1&gl=br&sa=X&ftid=0x947de66f3fcf0dfb:0x9173466e91a7f5db',
    areaServed: ['Aquidauana'],
    featuredNote: 'Unidade principal para atendimento em Aquidauana.',
    image: 'https://lh3.googleusercontent.com/gps-cs-s/AHRPTWn6iYxtriRFvfkwUL2KvUVm5fGbiAYw8mfobpKH86pvi2xU8U1NCb4PosaudDM1bUP0lSnDmSXUOvG06JJGIVM0LlauqgfGHJ-601NbwxAYGZKUnC9nWvM0oWNUZJFq_THmBHGu=s680-w680-h510-rw',
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
    name: 'Tele Gás 27 de Julho',
    address: 'Centro, Anastácio',
    phones: ['(67) 99619-7991'],
    whatsapp: '(67) 99619-7991',
    hours: 'terça-feira: 06:00-22:00\nquarta-feira: 06:00-22:00\nquinta-feira: 06:00-22:00\nsexta-feira: 06:00-22:00\nsábado: 06:00-22:00\ndomingo: 06:30-21:00\nsegunda-feira: 06:00-22:00',
    mapUrl: 'https://maps.app.goo.gl/zZjEAxo6ZCUjGdWLA',
    areaServed: ['Anastácio'],
    featuredNote: 'Atendimento dedicado para a unidade 27 de Julho em Anastácio.',
    image: 'https://lh3.googleusercontent.com/gps-cs-s/AHRPTWnfKSUHtpQ_bsmPUyAp6lonvWBMJ-JXSdUeDYbT1chDyFKwOQXwWSKP4J6C8U4VvUA57DYpiC4_IG79oXWnQTrJljbuCiMfITAIOy51Ae2PxhhnBJAO2O69dcfwuUaYHE7i7FZqcvhi9zeO=s680-w680-h510-rw',
    phoneDisplay: '(67) 99619-7991',
    whatsappDisplay: '(67) 99619-7991',
    googleRating: '5,0',
    googleReviewsCount: '33 avaliações'
  },
  {
    key: 'miranda',
    city: 'Miranda',
    name: 'Tele Gás Miranda',
    address: 'Av. João Pedro Pedrossiam, 521, Centro',
    phones: ['(67) 99695-5220'],
    whatsapp: '(67) 99695-5220',
    hours: 'terça-feira: 06:30-21:00\nquarta-feira: 06:30-21:00\nquinta-feira: 06:30-21:00\nsexta-feira: 06:30-21:00\nsábado: 06:30-21:00\ndomingo: 06:30-21:00\nsegunda-feira: 06:30-21:00',
    mapUrl: 'https://maps.app.goo.gl/ospDPWfYLdshiv9J8',
    areaServed: ['Miranda'],
    featuredNote: 'Cobertura local para pedidos em Miranda.',
    image: 'https://lh3.googleusercontent.com/gps-cs-s/AHRPTWlo147HtcBm3JeFjNZBk22FwFdjBwkYmhjbaUuWnlMg4VZcZHX25Iy4DvreAJyoC8MKQ1E8ttQNd1oleRYBNnyEbrYwn8PfH4q3mSgfB1JDC9ujPgEyj4oLketiTmcYD__0ltvp1g=s680-w680-h510-rw',
    instagramUrl: 'https://www.instagram.com/telegasmiranda/',
    phoneDisplay: '(67) 99695-5220',
    whatsappDisplay: '(67) 99695-5220',
    googleRating: '5,0',
    googleReviewsCount: '6 avaliações'
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

export const aquidauanaNeighborhoods: AquidauanaNeighborhood[] = [
  { label: 'Alto', branchKey: 'matriz' },
  { label: 'Centro', branchKey: 'matriz' },
  { label: 'Cidade Nova', branchKey: 'chapecoense' },
  { label: 'Exposição', branchKey: 'matriz' },
  { label: 'Guanandi', branchKey: 'matriz' },
  { label: 'Nova Aquidauana', branchKey: 'nova-aquidauana' },
  { label: 'Santa Terezinha', branchKey: 'matriz' },
  { label: 'Serraria', branchKey: 'matriz' },
  { label: 'São Francisco', branchKey: 'matriz' },
  { label: 'Trindade', branchKey: 'matriz' },
  { label: 'Vila Pinheiro', branchKey: 'matriz' },
  { label: 'Vila São Pedro', branchKey: 'matriz' },
  { label: 'Vila Icaraí / Icaray', branchKey: 'matriz' },
  { label: 'Vila Paraíso', branchKey: 'matriz' },
  { label: 'Vila Princesa do Sul', branchKey: 'matriz' },
  { label: 'Vila Quarenta / Vila 40', branchKey: 'matriz' },
  { label: 'Vila Dona Nenê', branchKey: 'matriz' },
  { label: 'Vila Previsul / antiga Amospa', branchKey: 'matriz' },
  { label: 'Vila Eliane', branchKey: 'matriz' },
  { label: 'Vila Fragelli', branchKey: 'matriz' },
  { label: 'Vila Edemir', branchKey: 'matriz' },
  { label: 'Vila Bertolino', branchKey: 'matriz' },
  { label: 'Vila Cidade Nova', branchKey: 'chapecoense' },
  { label: 'Vila Santa Terezinha', branchKey: 'matriz' },
  { label: 'Vila Trindade', branchKey: 'matriz' },
  { label: 'Vila São Cristóvão I', branchKey: 'matriz' },
  { label: 'Vila São Cristóvão II', branchKey: 'matriz' },
  { label: 'Vila São Cristóvão III', branchKey: 'matriz' },
  { label: 'Cohab I', branchKey: 'matriz' },
  { label: 'Cohab II', branchKey: 'matriz' },
  { label: 'Cohab III', branchKey: 'matriz' },
  { label: 'Cohab IV', branchKey: 'matriz' },
  { label: 'Jardim Aeroporto I', branchKey: 'nova-aquidauana' },
  { label: 'Jardim Aeroporto II', branchKey: 'nova-aquidauana' },
  { label: 'Jardim Balneário', branchKey: 'nova-aquidauana' },
  { label: 'Jardim Panorama', branchKey: 'nova-aquidauana' },
  { label: 'Jardim Pinheiros', branchKey: 'nova-aquidauana' },
  { label: 'Arara Azul', branchKey: 'nova-aquidauana' },
  { label: 'Chapecoense', branchKey: 'chapecoense' },
  { label: 'Morrinho', branchKey: 'matriz' }
];

export const anastacioBranches: AnastacioBranch[] = [
  {
    key: '27-de-julho',
    name: '27 de Julho',
    address: 'Centro, Anastácio',
    phoneDisplay: '(67) 99619-7991',
    whatsappDisplay: '(67) 99619-7991',
    mapUrl: 'https://maps.app.goo.gl/SM1acqvVnepYj6Xr8'
  },
  {
    key: 'vila-maior',
    name: 'Vila Maior',
    address: 'Vila Maior, Anastácio',
    phoneDisplay: '(67) 99643-1765',
    whatsappDisplay: '(67) 99643-1765',
    mapUrl: 'https://maps.google.com/?q=Vila+Maior,+Anast%C3%A1cio+MS'
  },
  {
    key: 'cristo-rei',
    name: 'Cristo Rei',
    address: 'Rua das Acácias, Quadra E, Lote E1, Sam Rafael',
    phoneDisplay: '(67) 3245-2222',
    whatsappDisplay: '(67) 3245-2222',
    mapUrl: 'https://maps.app.goo.gl/pLai4B2MD2pKgQTv5'
  }
];

export const anastacioNeighborhoods: AnastacioNeighborhood[] = [
  { label: 'Centro', branchKey: '27-de-julho' },
  { label: 'Altos da Cidade', branchKey: '27-de-julho' },
  { label: 'Cristo Rei', branchKey: 'cristo-rei' },
  { label: 'Lydio Barbiere / Lídio Barbier', branchKey: '27-de-julho' },
  { label: 'Jardim Nova Era', branchKey: '27-de-julho' },
  { label: 'Jardim San Diego', branchKey: '27-de-julho' },
  { label: 'Jardim Guanabara', branchKey: '27-de-julho' },
  { label: 'Jardim Estoril', branchKey: '27-de-julho' },
  { label: 'Jardim Vista Alegre', branchKey: '27-de-julho' },
  { label: 'Jardim Curicaca', branchKey: '27-de-julho' },
  { label: 'Jardim Nanamaria / Jardim Nana Maria', branchKey: '27-de-julho' },
  { label: 'Jardim Progresso', branchKey: '27-de-julho' },
  { label: 'Jardim San Rafael', branchKey: 'cristo-rei' },
  { label: 'Jardim Campanário', branchKey: '27-de-julho' },
  { label: 'Jardim Independência', branchKey: '27-de-julho' },
  { label: 'Jardim Mauran / Jardim Moura', branchKey: '27-de-julho' },
  { label: 'Jardim Panorama', branchKey: '27-de-julho' },
  { label: 'Jardim São Francisco', branchKey: '27-de-julho' },
  { label: 'Jardim América', branchKey: '27-de-julho' },
  { label: 'Jardim Integração', branchKey: '27-de-julho' },
  { label: 'Jardim Boa Vista', branchKey: '27-de-julho' },
  { label: 'Jardim Solar', branchKey: '27-de-julho' },
  { label: 'Jardim Candeias', branchKey: '27-de-julho' },
  { label: 'Jardim Itamaraty', branchKey: '27-de-julho' },
  { label: 'Jardim Enedina', branchKey: '27-de-julho' },
  { label: 'Jardim Santa Clara', branchKey: '27-de-julho' },
  { label: 'Jardim Campo Belo', branchKey: '27-de-julho' },
  { label: 'Jardim Bandeirantes', branchKey: '27-de-julho' },
  { label: 'Vila Nossa Senhora de Lourdes', branchKey: '27-de-julho' },
  { label: 'Vila Brasília', branchKey: '27-de-julho' },
  { label: 'Vila Nova', branchKey: '27-de-julho' },
  { label: 'Vila São Benedito', branchKey: '27-de-julho' },
  { label: 'Vila Maria Francisca da Costa', branchKey: '27-de-julho' },
  { label: 'Vila Ipiranga', branchKey: '27-de-julho' },
  { label: 'Vila São Nicolau', branchKey: '27-de-julho' },
  { label: 'Vila Miriam / Vila Mirian', branchKey: '27-de-julho' },
  { label: 'Vila Planalto', branchKey: '27-de-julho' },
  { label: 'Vila Mariana / Vila Mariana 2', branchKey: '27-de-julho' },
  { label: 'Vila São Domingos', branchKey: '27-de-julho' },
  { label: 'Vila São Severino', branchKey: '27-de-julho' },
  { label: 'Vila Santos Dumont', branchKey: '27-de-julho' },
  { label: 'Vila Novo Horizonte', branchKey: '27-de-julho' },
  { label: 'Vila Gonçalves', branchKey: '27-de-julho' },
  { label: 'Vila Flores / Vila Flor', branchKey: '27-de-julho' },
  { label: 'Vila Assoí / Villa Assoí', branchKey: '27-de-julho' },
  { label: 'Vila Santa Maria', branchKey: '27-de-julho' },
  { label: 'Vila Nossa Senhora do Rosário', branchKey: '27-de-julho' },
  { label: 'Vila Morumbi', branchKey: '27-de-julho' },
  { label: 'Vila São Francisco', branchKey: '27-de-julho' },
  { label: 'Vila Souza', branchKey: '27-de-julho' },
  { label: 'Vila Morada da Lua', branchKey: '27-de-julho' },
  { label: 'Vila Alzira', branchKey: '27-de-julho' },
  { label: 'Vila Barbosa', branchKey: '27-de-julho' },
  { label: 'Vila Maior', branchKey: 'vila-maior' },
  { label: 'Vila Rodrigues', branchKey: '27-de-julho' },
  { label: 'Vila Morada do Sol', branchKey: '27-de-julho' },
  { label: 'Vila Municipal', branchKey: '27-de-julho' },
  { label: 'Vila Afonso Paim', branchKey: '27-de-julho' },
  { label: 'Vila Pedreira', branchKey: '27-de-julho' },
  { label: 'Vila Umbelina', branchKey: '27-de-julho' },
  { label: 'Cherogami', branchKey: '27-de-julho' },
  { label: 'Xavier', branchKey: '27-de-julho' },
  { label: 'Residencial Bem-te-vi', branchKey: '27-de-julho' },
  { label: 'Conjunto Habitacional João de Barro', branchKey: '27-de-julho' },
  { label: 'Conjunto Habitacional Arapongas', branchKey: '27-de-julho' },
  { label: 'Conjunto Habitacional Tapuiú', branchKey: '27-de-julho' },
  { label: 'Cohab', branchKey: '27-de-julho' }
];

export const mirandaNeighborhoods: MirandaNeighborhood[] = [
  { label: 'Centro', branchKey: 'miranda' },
  { label: 'Nova Miranda / Vila Nova Miranda', branchKey: 'miranda' },
  { label: 'Vila Alice', branchKey: 'miranda' },
  { label: 'Beira-Rio', branchKey: 'miranda' },
  { label: 'Jardim Carandá / Carandá', branchKey: 'miranda' },
  { label: 'Maria do Rosário', branchKey: 'miranda' },
  { label: 'Morada do Pantanal', branchKey: 'miranda' },
  { label: 'Mondego / Jardim Mondego', branchKey: 'miranda' },
  { label: 'Previsul', branchKey: 'miranda' },
  { label: 'Baiazinha', branchKey: 'miranda' },
  { label: 'Nova Baiazinha', branchKey: 'miranda' },
  { label: 'Nossa Senhora Aparecida / Aparecida', branchKey: 'miranda' },
  { label: 'Vilas Boas', branchKey: 'miranda' },
  { label: 'Laranjeira', branchKey: 'miranda' },
  { label: 'Santa Cruz', branchKey: 'miranda' },
  { label: 'Mutirão I', branchKey: 'miranda' },
  { label: 'Mutirão II', branchKey: 'miranda' },
  { label: 'Alto Mutirão', branchKey: 'miranda' },
  { label: 'Cohab', branchKey: 'miranda' },
  { label: 'Conjunto Habitacional João Pedro Pedrossian', branchKey: 'miranda' },
  { label: 'Conjunto Habitacional José Pedrossian', branchKey: 'miranda' },
  { label: 'Cherogami', branchKey: 'miranda' },
  { label: 'Morar Melhor', branchKey: 'miranda' },
  { label: 'Novo Habitar', branchKey: 'miranda' },
  { label: 'Novo Lar', branchKey: 'miranda' },
  { label: 'Airton de Albuquerque', branchKey: 'miranda' },
  { label: 'Airton de Albuquerque I', branchKey: 'miranda' },
  { label: 'Airton de Albuquerque II', branchKey: 'miranda' },
  { label: 'Jardim Eldorado', branchKey: 'miranda' },
  { label: 'Conjunto Residencial dos Servidores', branchKey: 'miranda' },
  { label: 'Área Apropriada', branchKey: 'miranda' },
  { label: 'Salobra', branchKey: 'miranda' },
  { label: 'Águas do Miranda', branchKey: 'miranda' },
  { label: 'Aldeia Argola', branchKey: 'miranda' },
  { label: 'Aldeia Babaçu', branchKey: 'miranda' },
  { label: 'Aldeia Lagoinha', branchKey: 'miranda' },
  { label: 'Aldeia Lalima', branchKey: 'miranda' },
  { label: 'Aldeia Mãe Terra', branchKey: 'miranda' }
];

export const products: Product[] = [
  {
    id: 'p13',
    name: 'Gás P13',
    slug: 'gas-p13',
    description: 'O botijão mais usado em casas e pequenos comércios.',
    useCase: '',
    image: 'https://rescaroli.com.br/wp-content/uploads/2017/03/botijao-gas-p13-dourado.png',
    available: true,
    featured: true,
    deliveryInfo: '',
    pricesByUnit: { aquidauana: 138, anastacio: 138, miranda: 135 }
  },
  {
    id: 'p20',
    name: 'Gás P20',
    slug: 'gas-p20',
    description: 'Indicado para aplicações comerciais e alguns equipamentos específicos.',
    useCase: '',
    image: 'https://gasemaguaslindas.com.br/wp-content/uploads/2025/11/gas-p20-em-ceilandia.png',
    available: true,
    featured: false,
    deliveryInfo: '',
    pricesByUnit: { aquidauana: 204, anastacio: 204, miranda: 190 }
  },
  {
    id: 'p45',
    name: 'Gás P45',
    slug: 'gas-p45',
    description: 'Solução para consumo maior e operações que exigem mais autonomia.',
    useCase: '',
    image: 'https://static.wixstatic.com/media/48bf7a_522ea4389c5d4bf8a54a6b9552fff093~mv2.png/v1/fill/w_220,h_298,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/botijao-p45.png',
    available: true,
    featured: true,
    deliveryInfo: '',
    pricesByUnit: { aquidauana: 495, anastacio: 495, miranda: 480 }
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
  { year: '2011', title: 'Reconhecimento nacional', text: 'Marco de expansão e consolidação da marca.' },
  { year: '2012', title: 'Expansão para Anastácio', text: 'Ampliação do atendimento para a cidade.' },
  { year: '2017', title: 'Expansão para Miranda', text: 'Nova unidade reforçando a presença regional.' },
  { year: 'Atualidade', title: 'Situação atual', text: 'Operação focada em rapidez, proximidade e conveniência.' }
];

export const reviews: Review[] = [];

export const faq: FaqItem[] = [
  { question: 'Qual é o prazo médio de entrega?', answer: 'Varia por cidade e disponibilidade da rota.' },
  { question: 'A entrega é grátis?', answer: 'Consulte a unidade da sua cidade no momento do pedido.' },
  { question: 'Quais cidades são atendidas?', answer: 'Aquidauana, Anastácio e Miranda.' },
  { question: 'Quais formas de pagamento são aceitas?', answer: 'PIX, dinheiro, cartão de débito, cartão de crédito e pagamento na entrega.' },
  { question: 'Como participar dos sorteios?', answer: 'Consulte a página da campanha Chama Premiada para as regras atualizadas.' },
  { question: 'Quais tipos de botijão estão disponíveis?', answer: 'Gás P13, Gás P20 e Gás P45.' },
  { question: 'Posso fazer pedido para uma empresa?', answer: 'Sim, o fluxo pode receber pedidos para empresas e comércios.' },
  { question: 'Como entrar em contato com uma unidade?', answer: 'Use a página de unidades, o WhatsApp ou o botão de pedido.' }
];

export const promotion = {
  title: 'Chama Premiada',
  description: 'Campanha promocional da Tele Gás com regras, prazos e ganhadores publicados na página oficial.',
  cta: 'Pedir gás e participar'
};

export const contactChannels = {
  phone: '(67) 3241-2222',
  email: 'telegas_aquidauana@outlook.com',
  instagram: 'https://www.instagram.com/telegasaquidauana/',
  googleReview: 'https://www.google.com/maps?cid=0x947de66f3fcf0dfb:0x9173466e91a7f5db'
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
    link: 'https://share.google/3AYfaeNAxekwdBsi5',
    image: 'https://i.postimg.cc/NFNG4Xv1/unnamed.png'
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
    comment: 'Melhor atendimento que a gente tem gosto muito',
    link: 'https://maps.app.goo.gl/zZjEAxo6ZCUjGdWLA'
  },
  {
    name: 'Alan Delon',
    reviewCount: '1 avaliação',
    timeAgo: 'Avaliação do Google',
    rating: 5,
    comment: 'Entrega super rápido! Super recomendo.',
    link: 'https://maps.app.goo.gl/zZjEAxo6ZCUjGdWLA'
  },
  {
    name: 'Caroline Andrade Moraes',
    reviewCount: '1 avaliação',
    timeAgo: 'Avaliação do Google',
    rating: 5,
    comment: 'Bom atendimento entrega rápida e profundo de garantia e qualificado',
    link: 'https://maps.app.goo.gl/zZjEAxo6ZCUjGdWLA'
  },
  {
    name: 'Rosania Larrea',
    reviewCount: '1 avaliação',
    timeAgo: 'Avaliação do Google',
    rating: 5,
    comment: 'Atendimento rápido e de qualidade',
    link: 'https://maps.app.goo.gl/zZjEAxo6ZCUjGdWLA'
  }
];

export const mirandaReviews: UnitReview[] = [
  {
    name: 'Izabella Medina de Andrade',
    reviewCount: '1 avaliação',
    timeAgo: 'Avaliação do Google',
    rating: 5,
    comment: 'Melhor depósito de gás, entrega mais rápida da cidade, melhor atendimento e ainda ganha brinde',
    link: 'https://maps.app.goo.gl/ospDPWfYLdshiv9J8'
  },
  {
    name: 'Francieli Silva',
    reviewCount: '1 avaliação',
    timeAgo: 'Avaliação do Google',
    rating: 5,
    comment: 'Atendimento muitooo topppppp. A entrega é muito rápida, o preço super acessível ❤️🧡 Enfimmmm a Melhor🧡',
    link: 'https://maps.app.goo.gl/ospDPWfYLdshiv9J8'
  },
  {
    name: 'Karina Ramalho',
    reviewCount: '1 avaliação',
    timeAgo: 'Avaliação do Google',
    rating: 5,
    comment: 'Melhor empresa de gás de Miranda MS',
    link: 'https://maps.app.goo.gl/ospDPWfYLdshiv9J8'
  }
];

export const cnpj = '00.462.645/0001-46';
