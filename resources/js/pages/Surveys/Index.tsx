// resources/js/Pages/Surveys/Index.tsx

import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, type PaginatedResponse, type Survey , type User } from '@/types';
import { Head, Link, router, useForm } from '@inertiajs/react';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
// Ejemplo combinado (opcional)
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

import { FormEventHandler, useEffect, useRef, useState } from 'react';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '@/components/ui/alert-dialog'; // <-- Importar el diálogo
import { Megaphone, Trash2 } from 'lucide-react';

// Breadcrumbs para la parte superior de la página
const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Encuestas Tecnológicas',
        href: route('surveys.index'),
    },
];

// Componente reutilizable para la paginación
const Pagination = ({ links }: { links: { url: string | null; label: string; active: boolean }[] }) => {
    if (!links || links.length <= 3) {
        return null;
    }
    return (
        <nav className="mt-6 flex justify-center" aria-label="Pagination">
            {links.map((link) => (
                <Link
                    key={link.label}
                    href={link.url || '#'}
                    preserveScroll
                    className={`relative inline-flex items-center px-4 py-2 text-sm font-semibold ring-1 ring-inset ring-gray-300 dark:ring-gray-700 focus:z-20 focus:outline-offset-0 ${
                        link.active
                            ? 'z-10 bg-indigo-600 text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600'
                            : 'text-gray-900 dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-800'
                    } ${
                        !link.url
                            ? 'cursor-default text-gray-400 dark:text-gray-600'
                            : ''
                    } ${
                        link.label.includes('Previous') ? 'rounded-l-md' : ''
                    } ${
                        link.label.includes('Next') ? 'rounded-r-md' : ''
                    }`}
                    dangerouslySetInnerHTML={{ __html: link.label }}
                    as={!link.url ? 'span' : 'a'}
                />
            ))}
        </nav>
    );
};

// Definición de las props que la página espera recibir del controlador
interface IndexPageProps {
    flash: {
        message?: string;
    };
    surveys: PaginatedResponse<Survey>;
    filters: { // La interfaz ya está preparada para recibirlo
        search: string | null;
    };
    auth: {
        user: User; // Aseguramos que use el tipo User
    }
}

export default function Index({ surveys, flash, filters, auth }: IndexPageProps) {
    // Hook de Inertia para manejar el formulario de eliminación
    const { processing, delete: destroy } = useForm();

    // 👇 2. Estado para el campo de búsqueda. Lo inicializamos con el valor que venga del controlador.
    const [search, setSearch] = useState(filters.search || '');

    // 👇 2. AÑADE ESTA LÍNEA AQUÍ 👇
    // Creamos un estado para guardar la encuesta que se va a eliminar.
    // Inicialmente es 'null', por lo que el diálogo estará cerrado.
    const [surveyToDelete, setSurveyToDelete] = useState<Survey | null>(null);

    // 👇 AÑADE LA DEFINICIÓN DE LA FUNCIÓN AQUÍ 👇
    const confirmDeletion = (survey: Survey) => {
        setSurveyToDelete(survey);
    };

    /* // 👇 3. Función para manejar el envío del formulario de búsqueda
    const handleSearch: FormEventHandler = (e) => {
        e.preventDefault();
        // `router.get` hace una visita a la misma página, pero con los nuevos parámetros
        router.get(
            route('surveys.index'),
            { search }, // El objeto con los parámetros a enviar
            {
                preserveState: true, // Mantiene el estado de otros componentes (si los hubiera)
                replace: true,       // Reemplaza la entrada en el historial del navegador
            }
        );
    }; */

    // 👇 2. Referencia para controlar el primer renderizado
    const isInitialMount = useRef(true);

    // 👇 3. El hook mágico para la búsqueda automática
    useEffect(() => {
        // Evitamos que se ejecute en la carga inicial de la página
        if (isInitialMount.current) {
            isInitialMount.current = false;
            return;
        }

        // Usamos router.get para la búsqueda
        const searchAction = () => {
             router.get(
                route('surveys.index'),
                { search },
                {
                    preserveState: true,
                    replace: true,
                }
            );
        }

        // Configuramos el debounce: esperar 500ms después de que el usuario deje de escribir
        const debounceId = setTimeout(searchAction, 500);

        // Función de limpieza: se ejecuta si el usuario vuelve a escribir antes de los 500ms.
        // Cancela el temporizador anterior para que no se hagan peticiones innecesarias.
        return () => clearTimeout(debounceId);

    }, [search]); // Este efecto se ejecuta cada vez que la variable 'search' cambia.

    // Función para manejar el clic en el botón de eliminar
    const handleDelete = () => {
    console.log("Dentro de handleDelete. surveyToDelete es:", surveyToDelete);

    if (!surveyToDelete || surveyToDelete.id === undefined) {
        console.error("ERROR: surveyToDelete es nulo o no tiene ID.");
        return;
    }

    const routeName = "surveys.destroy";
    const surveyId = surveyToDelete.id;
    console.log(`Intentando construir la ruta: route('${routeName}', ${surveyId})`);

    destroy(route(routeName, surveyId), {
        preserveScroll: true,
        onSuccess: () => setSurveyToDelete(null),
    });
};

    // Guardia de seguridad para el caso de que las props no lleguen
    if (!surveys) {
        return (
            <AppLayout breadcrumbs={breadcrumbs}>
                <Head title="Cargando..." />
                <div className="p-8 text-center">Cargando datos de encuestas...</div>
            </AppLayout>
        );
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Encuestas Tecnológicas" />

            <div className='flex justify-between items-center m-4'>
                <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
                    Lista de Encuestas
                </h1>
                <Link href={route('surveys.create')}>
                    <Button>Añadir Encuesta</Button>
                </Link>
            </div>

            {/* Muestra el mensaje de éxito si existe */}
            {flash.message && (
                <div className='m-4'>
                    <Alert className="border-green-500 text-green-700 dark:border-green-600 dark:text-green-300">
                        <Megaphone className="h-4 w-4" />
                        <AlertTitle>¡Éxito!</AlertTitle>
                        <AlertDescription>{flash.message}</AlertDescription>
                    </Alert>
                </div>
            )}

            {/* 👇 4. Simplificamos el formulario, ya no necesita onSubmit ni botón "Buscar" */}
            <div className="m-4">
                <div className="flex items-center gap-2">
                    <Input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Buscar automáticamente..."
                        className="max-w-xs"
                    />
                    {filters.search && (
                        <Link href={route('surveys.index')}>
                             <Button type="button" variant="ghost">Limpiar</Button>
                        </Link>
                    )}
                </div>
            </div>

            {/* Contenedor principal de la tabla y paginación */}
            {surveys.data && surveys.data.length > 0 ? (
                <div className='m-4'>
                    <div className="border rounded-lg dark:border-gray-700 overflow-hidden">
                        <Table>
                            <TableHeader>
                                <TableRow className="bg-gray-50 dark:bg-gray-800/50">
                                    <TableHead className="w-[100px]">Código</TableHead>
                                    <TableHead>Municipio</TableHead>
                                    <TableHead>Proveedor Internet</TableHead>
                                    <TableHead>Total Computadores</TableHead>
                                    <TableHead className="text-center">Acciones</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {surveys.data.map((survey) => (
                                    <TableRow key={survey.id} className="dark:border-gray-700">
                                        <TableCell className="font-medium">{survey.municipality_code}</TableCell>
                                        <TableCell>{survey.municipality_name}</TableCell>
                                        <TableCell>{survey.main_internet_provider || 'N/A'}</TableCell>
                                        <TableCell>{survey.total_computers_count ?? 'N/A'}</TableCell>
                                        <TableCell className="text-center space-x-2">
                                            <Link href={route('surveys.edit', survey.id)}>
                                                <Button variant="outline" className="h-8 px-3">Editar</Button>
                                            </Link>
                                                <Button
                                                    variant="destructive"
                                                    // Usamos una función de flecha para llamar a 'confirmDeletion' con los argumentos correctos
                                                    onClick={() => confirmDeletion(survey)}
                                                    className="h-8 px-3"
                                                >
                                                    <Trash2 className="h-4 w-4 sm:mr-2" />
                                                    <span className="hidden sm:inline">Eliminar</span>
                                                </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>

                    {/* Componente de Paginación */}
                    <Pagination links={surveys.links} />

                </div>
            ) : (
                 <div className="m-4 p-8 text-center bg-gray-100 dark:bg-gray-800 rounded-lg">
                    <p className="text-gray-500 dark:text-gray-400">No se encontraron encuestas para mostrar.</p>
                </div>
            )}

            {/*
            ================================================================
            👇 AQUÍ ES EL LUGAR PERFECTO PARA PONER EL CÓDIGO DEL DIÁLOGO 👇
            ================================================================
            Está dentro del AppLayout, pero fuera del flujo principal del
            contenido de la página.
            */}

            <AlertDialog open={!!surveyToDelete} onOpenChange={(isOpen) => !isOpen && setSurveyToDelete(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>¿Estás absolutely seguro?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Esta acción no se puede deshacer. Se eliminará permanentemente la encuesta del municipio de
                            <strong className="font-semibold text-gray-900 dark:text-gray-100"> {surveyToDelete?.municipality_name}</strong>.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel onClick={() => setSurveyToDelete(null)}>Cancelar</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleDelete}
                            disabled={processing}
                            className="bg-red-600 hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-800"
                        >
                            {processing ? 'Eliminando...' : 'Sí, eliminar'}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>


        </AppLayout>
    );
}
