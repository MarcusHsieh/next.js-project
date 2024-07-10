// marks all exported functions w/n file as Server Actions
// which can then be imported + used in Client + Server components
'use server';

// type validation library
import { z } from 'zod';
// to insert data into database
import { sql } from '@vercel/postgres';
// to tell client-side router cache to update its information from server
import { revalidatePath } from 'next/cache';
// to redirect user to another page (back to `/dashboard/invoices` in this case)
import { redirect } from 'next/navigation';

const FormSchema = z.object({
    id: z.string(),
    customerId: z.string(),
    amount: z.coerce.number(), // coerce (change) type to number
    status: z.enum(['pending', 'paid']),
    date: z.string(),
});

const CreateInvoice = FormSchema.omit({ id: true, date: true });

export async function createInvoice(formData: FormData) {
    const { customerId, amount, status } = CreateInvoice.parse({
        customerId: formData.get('customerId'),
        amount: formData.get('amount'),
        status: formData.get('status'),
    });
    const amountInCents = amount * 100;
    const date = new Date().toISOString().split('T')[0];

    await sql`
        INSERT INTO invoices (customer_id, amount, status, date)
        VALUES (${customerId}, ${amountInCents}, ${status}, ${date})
    `;

    revalidatePath('/dashboard/invoices');
    redirect('/dashboard/invoices');
}