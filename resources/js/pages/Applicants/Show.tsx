import { Head, Link } from '@inertiajs/react';

import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { type Applicant, type BreadcrumbItem } from '@/types';

// 1. DEFINICIÓN DE PROPS: Esperamos recibir un solo 'applicant'.
interface Props {
    applicant: Applicant;
}

// 2. EL COMPONENTE DE VISTA DE DETALLES
export default function Show({ applicant }: Props) {
    // Creamos las migas de pan dinámicamente
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Postulantes', href: route('applicants.index') },
        { title: 'Ver Detalles', href: route('applicants.show', applicant.id) },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Postulante: ${applicant.full_name}`} />

            <div className="space-y-6 rounded-lg border bg-white p-4 shadow-sm sm:p-6 lg:p-8">
                {/* --- Encabezado --- */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold">Detalles del Postulante</h1>
                        <p className="text-muted-foreground">Información de solo lectura.</p>
                    </div>
                    <Button variant="outline" asChild>
                        <Link href={route('applicants.index')}>Volver al Listado</Link>
                    </Button>
                </div>

                {/* --- Lista de Detalles --- */}
                <div className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
                    <div className="space-y-1">
                        <p className="text-sm font-medium text-gray-500">Folio</p>
                        <p className="text-lg font-semibold">{applicant.folio}</p>
                    </div>
                    <div className="space-y-1">
                        <p className="text-sm font-medium text-gray-500">Año de Postulación</p>
                        <p className="text-lg">{applicant.year}</p>
                    </div>
                    <div className="space-y-1 sm:col-span-2">
                        <p className="text-sm font-medium text-gray-500">Nombre Completo</p>
                        <p className="text-lg">{applicant.full_name}</p>
                    </div>
                    <div className="space-y-1">
                        <p className="text-sm font-medium text-gray-500">Institución</p>
                        <p className="text-lg">{applicant.institution.name}</p>
                    </div>
                    <div className="space-y-1">
                        <p className="text-sm font-medium text-gray-500">Puntaje</p>
                        <p className="text-lg">{applicant.score ?? 'No Asignado'}</p>
                    </div>
                    <div className="space-y-1">
                        <p className="text-sm font-medium text-gray-500">Estado Actual</p>
                        <p className="text-lg font-medium text-blue-600">{applicant.status.name}</p>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
