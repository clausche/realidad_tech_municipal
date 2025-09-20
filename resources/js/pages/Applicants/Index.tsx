// 1. IMPORTACIONES (limpiadas)
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { Eye,Pencil, Trash2 } from 'lucide-react'; // Ya no se necesita Megaphone aquí
import { FormEventHandler } from 'react';

// Ya no se necesita Alert, AlertDescription, AlertTitle aquí
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import AppLayout from '@/layouts/app-layout';

// Importa nuestro nuevo componente inteligente
import FlashAlert from '@/components/flash-alert';

// Importamos los tipos (Asegúrate de que ya están actualizados para flash.type)
import { type Applicant, type BreadcrumbItem, type PageProps, type PaginatedResponse } from '@/types';

// 2. DEFINICIÓN DE PROPS (sin cambios)
interface Props {
    applicants: PaginatedResponse<Applicant>;
}

// 3. DATOS ESTÁTICOS (sin cambios)
const breadcrumbs: BreadcrumbItem[] = [{ title: 'Becas 2025', href: route('applicants.index') }];

// 4. EL COMPONENTE PRINCIPAL (ahora más limpio)
export default function Index({ applicants }: Props) {
    const { props: pageProps } = usePage<PageProps>();
    const { delete: destroy, processing } = useForm();

    const handleDelete: (id: number) => FormEventHandler<HTMLFormElement> =
        (id) => (e) => {
            e.preventDefault();
            if (confirm('¿Estás seguro de que quieres eliminar este postulante?')) {
                // Asumiendo que destroy() está configurado en tu controlador para devolver
                // un flash con type: 'error' o 'success'
                destroy(route('applicants.destroy', id));
            }
        };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Postulantes" />
            <div className="space-y-4 p-4 sm:p-6 lg/p-8">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold">Listado de Postulantes</h1>
                    <Button asChild><Link href={route('applicants.create')}>Crear Postulante</Link></Button>
                </div>

                {/* === LA MAGIA ESTÁ AQUÍ === */}
                {/* Reemplazamos todo el bloque anterior por esta única línea */}
                <FlashAlert flash={pageProps.flash} />

                <div className="rounded-md border">
                    <Table>
                        {/* El resto de la tabla se mantiene exactamente igual */}
                        <TableCaption>Una lista de todos los postulantes registrados para el año 2025.</TableCaption>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-[100px]">Folio</TableHead>
                                <TableHead>Nombre Completo</TableHead>
                                <TableHead>Institución</TableHead>
                                <TableHead>Puntaje</TableHead>
                                <TableHead>Estado</TableHead>
                                <TableHead className="text-right">Acciones</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                                {applicants.data.map((applicant) => (
                                    <TableRow key={applicant.id}>
                                        <TableCell className="font-medium">{applicant.folio}</TableCell>
                                        <TableCell>{applicant.full_name}</TableCell>
                                        <TableCell>{applicant.institution?.name}</TableCell>
                                        <TableCell>{applicant.score ?? 'N/A'}</TableCell>
                                        <TableCell>{applicant.status?.name}</TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex justify-end gap-2">
                                                                                        {/* --- NUEVO BOTÓN AÑADIDO --- */}
                                                <Button variant="outline" size="icon" asChild>
                                                    <Link href={route('applicants.show', applicant.id)}>
                                                        <Eye className="h-4 w-4" />
                                                    </Link>
                                                </Button>
                                                {/* --- FIN DEL NUEVO BOTÓN --- */}
                                                <Button variant="outline" size="icon" asChild>
                                                    <Link href={route('applicants.edit', applicant.id)}>
                                                        <Pencil className="h-4 w-4" />
                                                    </Link>
                                                </Button>
                                                <form onSubmit={handleDelete(applicant.id)}>
                                                    <Button variant="destructive" size="icon" type="submit" disabled={processing}>
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </form>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                    </Table>
                </div>

                <div className="flex items-center justify-center space-x-2 pt-4">
                     {/* La paginación se mantiene exactamente igual */}
                    {applicants.links.map((link, index) => (
                        <Button key={index} variant={link.active ? 'default' : 'outline'} size="sm" asChild={!!link.url} disabled={!link.url}>
                            <Link href={link.url ?? ''} dangerouslySetInnerHTML={{ __html: link.label }} />
                        </Button>
                    ))}
                </div>
            </div>
        </AppLayout>
    );
}
