// resources/js/Pages/Surveys/Edit.tsx

// --- Importaciones ---
import AppLayout from '@/layouts/app-layout';
import { Head } from '@inertiajs/react';
import SurveyForm from './Partials/SurveyForm';
import { type BreadcrumbItem, type Survey } from '@/types'; // Importamos el tipo Survey

// --- Definición de las Props ---
// Definimos explícitamente que esta página espera recibir un objeto 'survey'
interface EditPageProps {
    survey: Survey;
}

// --- Componente Principal de la Página ---
export default function Edit({ survey }: EditPageProps) {

    // Creamos las breadcrumbs dinámicamente para incluir el nombre del municipio
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Encuestas', href: route('surveys.index') },
        { title: `Editar: ${survey.municipality_name}`, href: route('surveys.edit', survey.id) },
    ];

    return (
        // Usamos el layout principal, pasándole las breadcrumbs
        <AppLayout breadcrumbs={breadcrumbs}>

            {/* Establecemos el título de la pestaña del navegador */}
            <Head title={`Editar Encuesta - ${survey.municipality_name}`} />

            {/* Contenedor principal con padding responsivo */}
            <div className="p-4 sm:p-6 lg:p-8">
                {/* Contenedor que centra el contenido y limita su ancho */}
                <div className="max-w-5xl mx-auto">
                    {/* El "panel" que alojará el formulario */}
                    <div className="bg-white dark:bg-gray-800 p-6 sm:p-8 rounded-xl shadow-lg">

                        {/*
                          Aquí está la clave: renderizamos el mismo SurveyForm.
                          - Le pasamos la prop `survey={survey}`.
                          - Esto le indica al SurveyForm que debe estar en modo "edición":
                            1. Rellenar los campos con los datos de la encuesta recibida.
                            2. Al enviarse, hacer un PUT a la ruta `surveys.update`.
                            3. Mostrar "Actualizar Encuesta" en el botón de envío.
                        */}
                        <SurveyForm survey={survey} />

                    </div>
                </div>
            </div>

        </AppLayout>
    );
}
