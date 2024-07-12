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
    customerId: z.string({ // expects string, throws message for type error (when no customer selected)
        invalid_type_error: 'Please select a customer.',
    }),
    amount: z.coerce // coerce (change) type to number
        .number() 
        .gt(0, { message: 'Please enter an amount greater than $0.' }), // greater than 0
    status: z.enum(['pending', 'paid'], { // expects enum
        invalid_type_error: 'Please select an invoice status.',
    }),
    date: z.string(),
});

/////

const CreateInvoice = FormSchema.omit({ id: true, date: true });

const UpdateInvoice = FormSchema.omit({ id: true, date: true });

/////

export type State = {
    errors?: {
        customerId?: string[];
        amount?: string[];
        status?: string[];
    };
    message?: string | null;
};

export async function createInvoice(prevState: State, formData: FormData) {
    const validatedFields = CreateInvoice.safeParse({
        customerId: formData.get('customerId'),
        amount: formData.get('amount'),
        status: formData.get('status'),
    });

    // If form validation fails, return errors early. Otherwise, continue.
    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: 'Missing Fields. Failed to Create Invoice.',
        };
    }

    // Prepare data for insertion into the database
    const { customerId, amount, status } = validatedFields.data;
    const amountInCents = amount * 100;
    const date = new Date().toISOString().split('T')[0];

    try {
        await sql`
            INSERT INTO invoices (customer_id, amount, status, date)
            VALUES (${customerId}, ${amountInCents}, ${status}, ${date})
        `;
    } 
    catch (error) {
        return { message: 'Database Error: Failed to create invoice' };
    }

    revalidatePath('/dashboard/invoices');
    redirect('/dashboard/invoices');
}

export async function updateInvoice(id: string, prevState: State, formData: FormData) {
    const validatedFields = UpdateInvoice.safeParse({
        customerId: formData.get('customerId'),
        amount: formData.get('amount'),
        status: formData.get('status'),
    });

    // If form validation fails, return errors early. Otherwise, continue.
    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: 'Missing Fields. Failed to Update Invoice.',
        };
    }

    const { customerId, amount, status } = validatedFields.data;
    const amountInCents = amount * 100;
    
    try {
        await sql`
            UPDATE invoices
            SET customer_id = ${customerId}, amount = ${amountInCents}, status = ${status}
            WHERE id = ${id}
        `;
    }
    catch (error) {
        return { message: 'Database Error: Failed to update invoice' };
    }
 
    revalidatePath('/dashboard/invoices');
    redirect('/dashboard/invoices');
}

export async function deleteInvoice(id: string) {
    try {
        await sql`DELETE FROM invoices WHERE id = ${id}`;
        revalidatePath('/dashboard/invoices');
        return { message: 'Deleted invoice' };
    }
    catch (error) {
        return { message: 'Database Error: Failed to delete invoice' };
    }
}