import Form from "@/app/ui/invoices/edit-form";
import Breadcrumbs from "@/app/ui/invoices/breadcrumbs";
import { fetchInvoiceById, fetchCustomers } from '@/app/lib/data';
import { notFound } from "next/navigation";

// gets id from URL through params prop! 
// grabs it from the dynamic route [id] 
export default async function Page({ params }: { params: { id: string } }) {
    const id = params.id;
    // `Promise.All` fetches both the invoice + customers in paralel
    const [invoice, customers] = await Promise.all([
       fetchInvoiceById(id),
       fetchCustomers(), 
    ]);

    // if invoice doesn't exist -- invoke notFound()
    if (!invoice) {
        notFound();
    }

    return(
        <main>
            <Breadcrumbs breadcrumbs={[
                { label: 'Invoices', href: '/dashboaard/invoices' },
                {
                    label: 'Edit Invoice',
                    href: `/dashboard/invoices/${id}/edit`,
                    active: true,
                },
            ]}/>
            <Form invoice={invoice} customers={customers} />
        </main>
    );
}