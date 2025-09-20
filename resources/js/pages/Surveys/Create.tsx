// resources/js/Pages/Surveys/Create.tsx

// --- Importaciones ---
// Importamos el layout principal de la aplicación.
import AppLayout from '@/layouts/app-layout';
// Importamos el hook Head de Inertia para manejar el <title> de la página.
import { Head } from '@inertiajs/react';
// Importamos nuestro formulario reutilizable.
import SurveyForm from './Partials/SurveyForm';
// Importamos el tipo para las breadcrumbs.
import { type BreadcrumbItem } from '@/types';

// --- Definición de las Breadcrumbs ---
// Creamos la estructura de navegación para la parte superior de la página.
const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Encuestas', href: route('surveys.index') },
    { title: 'Crear Nueva Encuesta', href: route('surveys.create') },
];


// --- Componente Principal de la Página ---
export default function Create() {
    return (
        // Usamos el layout principal, pasándole las breadcrumbs.
        <AppLayout breadcrumbs={breadcrumbs}>

            {/* Establecemos el título de la pestaña del navegador. */}
            <Head title="Crear Encuesta" />

            {/* Contenedor principal con padding responsivo. */}
            <div className="p-4 sm:p-6 lg:p-8">
                {/* Contenedor que centra el contenido y limita su ancho para mejor legibilidad. */}
                <div className="max-w-5xl mx-auto">
                    {/* El "panel" o "tarjeta" que alojará el formulario. */}
                    <div className="bg-white dark:bg-gray-800 p-6 sm:p-8 rounded-xl shadow-lg">

                        {/*
                          Aquí está la clave: renderizamos el SurveyForm.
                          - Al no pasarle una prop `survey`, el formulario sabe que debe:
                            1. Renderizar los campos vacíos o con valores por defecto.
                            2. Al enviarse, hacer un POST a la ruta `surveys.store`.
                            3. Mostrar "Crear Encuesta" en el botón de envío.
                        */}
                        <SurveyForm />

                    </div>
                </div>
            </div>

        </AppLayout>
    );
}
