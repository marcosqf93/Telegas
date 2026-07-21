export type OrderStatus = 'Novo' | 'Confirmado' | 'Em preparação' | 'Saiu para entrega' | 'Entregue' | 'Cancelado';

export const orderStatuses: OrderStatus[] = ['Novo', 'Confirmado', 'Em preparação', 'Saiu para entrega', 'Entregue', 'Cancelado'];

export type AdminSection = 'products' | 'prices' | 'units' | 'hours' | 'banners' | 'promotions' | 'reviews' | 'faq' | 'orders' | 'reports';

export type AdminPreparedModel = {
  section: AdminSection;
  note: string;
};

export const adminPreparedModel: AdminPreparedModel[] = [
  { section: 'products', note: 'Gerenciamento de catálogo e disponibilidade.' },
  { section: 'prices', note: 'Preços por unidade e variações locais.' },
  { section: 'units', note: 'Endereços, contatos e áreas atendidas.' },
  { section: 'hours', note: 'Horários de atendimento por unidade.' },
  { section: 'banners', note: 'Faixas promocionais e destaques.' },
  { section: 'promotions', note: 'Campanhas como Chama Premiada.' },
  { section: 'reviews', note: 'Avaliações importadas ou editadas.' },
  { section: 'faq', note: 'Perguntas frequentes gerenciáveis.' },
  { section: 'orders', note: 'Lista e status dos pedidos.' },
  { section: 'reports', note: 'Relatórios básicos de conversão e volume.' }
];
