// resources/js/pages/Applicants/Edit.tsx

import { Head, useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';

// Componentes y tipos
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import AppLayout from '@/layouts/app-layout';
import { type Applicant, type BreadcrumbItem, type Institution, type Status } from '@/types';

// Breadcrumbs para la navegación
const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Postulantes', href: route('applicants.index') },
    { title: 'Editar', href: '#' }, // El href puede ser dinámico si lo deseas
];

// Props que el controlador nos pasa
interface Props {
    applicant: Applicant; // El postulante que estamos editando
    institutions: Institution[];
    statuses: Status[];
}

export default function Edit({ applicant, institutions, statuses }: Props) {
    // Inicializamos el formulario con los datos del 'applicant'
    const { data, setData, put, processing, errors } = useForm({
        folio: applicant.folio.toString(),
        full_name: applicant.full_name,
        score: applicant.score?.toString() ?? '',
        year: applicant.year.toString(),
        institution_id: applicant.institution_id.toString(),
        status_id: applicant.status_id.toString(),
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        // Usamos put para la actualización, pasando el ID del postulante
        put(route('applicants.update', applicant.id));
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Editar ${applicant.full_name}`} />

            <div className="p-4 sm:p-6 lg:p-8">
                <Card className="max-w-2xl mx-auto">
                    <CardHeader>
                        <CardTitle>Editar Postulante</CardTitle>
                        <CardDescription>Modifica los datos del postulante: {applicant.full_name}</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {/* El formulario es casi idéntico al de Create.tsx */}
                        {/* La diferencia principal es el estado inicial del useForm y el método `put` en submit */}
                        <form onSubmit={submit} className="space-y-6">
                            {/* Campo Folio */}
                            <div>
                                <Label htmlFor="folio">Folio</Label>
                                <Input id="folio" type="number" value={data.folio} onChange={(e) => setData('folio', e.target.value)} required />
                                {errors.folio && <p className="text-sm text-red-600 mt-2">{errors.folio}</p>}
                            </div>

                            {/* ... (Copia los otros campos: full_name, year, etc., desde Create.tsx) ... */}
                            {/* Son exactamente iguales. Solo necesitan los valores iniciales del `useForm`. */}

                            {/* Ejemplo del selector de Institución, ahora con defaultValue */}
                            <div>
                                <Label htmlFor="institution_id">Institución</Label>
                                <Select
                                    defaultValue={data.institution_id}
                                    onValueChange={(value) => setData('institution_id', value)}
                                    required
                                >
                                    <SelectTrigger><SelectValue placeholder="Selecciona una institución..." /></SelectTrigger>
                                    <SelectContent>
                                        {institutions.map((inst) => (
                                            <SelectItem key={inst.id} value={inst.id.toString()}>{inst.name}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {errors.institution_id && <p className="text-sm text-red-600 mt-2">{errors.institution_id}</p>}
                            </div>

                            {/* (Haz lo mismo para el selector de Status) */}

                            <div className="flex items-center justify-end gap-4">
                                <Button type="submit" disabled={processing}>
                                    {processing ? 'Actualizando...' : 'Actualizar Postulante'}
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
