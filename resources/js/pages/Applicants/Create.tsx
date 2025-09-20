// resources/js/Pages/Applicants/Create.tsx

import { Head, Link, useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';

import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { type BreadcrumbItem, type Institution, type Status } from '@/types';

// 1. PROPS: Recibimos las listas de instituciones y estados desde el controlador.
interface Props {
    institutions: Institution[];
    statuses: Status[];
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Postulantes', href: route('applicants.index') },
    { title: 'Crear', href: route('applicants.create') },
];

export default function Create({ institutions, statuses }: Props) {
    // 2. useForm: El hook de Inertia para manejar el estado del formulario, los errores y el envío.
    const { data, setData, post, processing, errors } = useForm({
        full_name: '',
        folio: '',
        year: new Date().getFullYear().toString(), // Valor por defecto
        score: '',
        institution_id: '',
        status_id: '',
    });

    // 3. FUNCIÓN DE ENVÍO
    const handleSubmit: FormEventHandler = (e) => {
        e.preventDefault();
        // El método 'post' envía los datos al método 'store' del controlador.
        post(route('applicants.store'));
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Crear Postulante" />
            <div className="mx-auto max-w-2xl rounded-lg border bg-white p-4 shadow-sm sm:p-6 lg:p-8">
                <h1 className="text-2xl font-bold">Nuevo Postulante</h1>
                <p className="text-muted-foreground">Rellena los campos para registrar un nuevo postulante.</p>

                <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                    {/* Campo Nombre Completo */}
                    <div>
                        <Label htmlFor="full_name">Nombre Completo</Label>
                        <Input id="full_name" value={data.full_name} onChange={(e) => setData('full_name', e.target.value)} />
                        {errors.full_name && <p className="mt-1 text-sm text-red-600">{errors.full_name}</p>}
                    </div>

                    {/* Fila para Folio y Año */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <Label htmlFor="folio">Folio</Label>
                            <Input id="folio" type="number" value={data.folio} onChange={(e) => setData('folio', e.target.value)} />
                            {errors.folio && <p className="mt-1 text-sm text-red-600">{errors.folio}</p>}
                        </div>
                        <div>
                            <Label htmlFor="year">Año</Label>
                            <Input id="year" type="number" value={data.year} onChange={(e) => setData('year', e.target.value)} />
                            {errors.year && <p className="mt-1 text-sm text-red-600">{errors.year}</p>}
                        </div>
                    </div>

                    {/* Campo Institución */}
                    <div>
                        <Label htmlFor="institution_id">Institución</Label>
                        <Select onValueChange={(value) => setData('institution_id', value)} value={data.institution_id}>
                            <SelectTrigger><SelectValue placeholder="Selecciona una institución..." /></SelectTrigger>
                            <SelectContent>
                                {institutions.map((institution) => (
                                    <SelectItem key={institution.id} value={String(institution.id)}>{institution.name}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        {errors.institution_id && <p className="mt-1 text-sm text-red-600">{errors.institution_id}</p>}
                    </div>

                    {/* Fila para Puntaje y Estado */}
                    <div className="grid grid-cols-2 gap-4">
                         <div>
                            <Label htmlFor="score">Puntaje</Label>
                            <Input id="score" type="number" value={data.score} onChange={(e) => setData('score', e.target.value)} />
                            {errors.score && <p className="mt-1 text-sm text-red-600">{errors.score}</p>}
                        </div>
                        <div>
                            <Label htmlFor="status_id">Estado</Label>
                            <Select onValueChange={(value) => setData('status_id', value)} value={data.status_id}>
                                <SelectTrigger><SelectValue placeholder="Selecciona un estado..." /></SelectTrigger>
                                <SelectContent>
                                    {statuses.map((status) => (
                                        <SelectItem key={status.id} value={String(status.id)}>{status.name}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {errors.status_id && <p className="mt-1 text-sm text-red-600">{errors.status_id}</p>}
                        </div>
                    </div>

                    {/* Botones de Acción */}
                    <div className="flex items-center justify-end gap-4 pt-4">
                        <Button variant="outline" asChild>
                            <Link href={route('applicants.index')}>Cancelar</Link>
                        </Button>
                        <Button type="submit" disabled={processing}>
                            {processing ? 'Guardando...' : 'Guardar Postulante'}
                        </Button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
