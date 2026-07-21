import { z } from 'zod';

export const orderSchema = z.object({
  city: z.enum(['aquidauana', 'anastacio', 'miranda']),
  productId: z.string().min(1, 'Selecione um produto.'),
  quantity: z.coerce.number().int().min(1, 'Quantidade mínima é 1.'),
  name: z.string().min(2, 'Informe seu nome.'),
  whatsapp: z
    .string()
    .min(10, 'Informe seu WhatsApp.')
    .refine((value) => value.replace(/\D/g, '').length >= 10, 'Informe um WhatsApp válido.'),
  cep: z.string().optional().default(''),
  street: z.string().min(3, 'Informe a rua.'),
  number: z.string().min(1, 'Informe o número.'),
  neighborhood: z.string().min(2, 'Informe o bairro.'),
  complement: z.string().optional().default(''),
  reference: z.string().optional().default(''),
  paymentMethod: z.enum(['PIX', 'Dinheiro', 'Cartão de débito', 'Cartão de crédito', 'Pagamento na entrega']),
  needChange: z.boolean().default(false),
  changeFor: z.string().optional().default(''),
  notes: z.string().optional().default(''),
  storeDataConsent: z.boolean().default(false)
}).superRefine((data, context) => {
  if (data.paymentMethod === 'Dinheiro' && data.needChange && !data.changeFor.trim()) {
    context.addIssue({ code: z.ZodIssueCode.custom, path: ['changeFor'], message: 'Informe o valor para troco.' });
  }
});

export type OrderFormInput = z.input<typeof orderSchema>;
export type OrderFormValues = z.output<typeof orderSchema>;
