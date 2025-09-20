// resources/js/Pages/Dashboard.tsx

import AppLayout from '@/layouts/app-layout'; // Usa tu layout principal
import { Head } from '@inertiajs/react';
import { type BreadcrumbItem } from '@/types';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement,
} from 'chart.js';
import { Bar, Pie, Doughnut } from 'react-chartjs-2';

// Es necesario registrar los componentes de Chart.js que vamos a usar
ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    ArcElement,
    Title,
    Tooltip,
    Legend
);

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: route('dashboard') },
];

// Componente reutilizable para las tarjetas de los gráficos
const ChartCard = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
        <div className="p-4 sm:p-6 border-b dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">{title}</h3>
        </div>
        <div className="p-4 sm:p-6 h-96 flex items-center justify-center">
            {children}
        </div>
    </div>
);

// Tipado para las estadísticas que recibimos del backend
interface Stats {
    providerData: Record<string, number>;
    cloudData: Record<string, number>;
    ownershipData: Record<string, number>;
    streamingData: Record<string, number>;
}

export default function Dashboard({ stats }: { stats: Stats }) {

    // Datos para el gráfico de barras (Proveedores)
    const providerChartData = {
        labels: Object.keys(stats.providerData),
        datasets: [{
            label: '# de Municipalidades',
            data: Object.values(stats.providerData),
            backgroundColor: 'rgba(59, 130, 246, 0.7)',
            borderColor: 'rgba(59, 130, 246, 1)',
            borderWidth: 1,
        }],
    };

    // Función de ayuda para crear los datos de los gráficos de torta/dona
    const pieDoughnutChartData = (data: Record<string, number>, backgroundColors: string[]) => ({
        labels: Object.keys(data),
        datasets: [{
            data: Object.values(data),
            backgroundColor: backgroundColors,
            borderColor: 'rgba(255, 255, 255, 0.1)',
            borderWidth: 1,
            hoverOffset: 4,
        }],
    });

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />

            <div className="p-4 sm:p-6 lg:p-8">
                <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-6">
                    Dashboard de Realidad Tecnológica Municipal
                </h1>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <ChartCard title="Distribución de Proveedores de Internet (Top 15)">
                        <Bar
                            data={providerChartData}
                            options={{ indexAxis: 'y', responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } } }}
                        />
                    </ChartCard>

                    <ChartCard title="Uso de Servidores en la Nube (Cloud)">
                        <Pie
                            data={pieDoughnutChartData(stats.cloudData, ['rgba(16, 185, 129, 0.7)', 'rgba(239, 68, 68, 0.7)'])}
                            options={{ responsive: true, maintainAspectRatio: false }}
                        />
                    </ChartCard>

                    <ChartCard title="Propiedad de Sistemas de Información">
                        <Doughnut
                             data={pieDoughnutChartData(stats.ownershipData, ['rgba(59, 130, 246, 0.7)', 'rgba(249, 115, 22, 0.7)', 'rgba(139, 92, 246, 0.7)', 'rgba(107, 114, 128, 0.7)'])}
                             options={{ responsive: true, maintainAspectRatio: false }}
                        />
                    </ChartCard>

                     <ChartCard title="Transmisión de Concejos Municipales">
                        <Pie
                            data={pieDoughnutChartData(stats.streamingData, ['rgba(16, 185, 129, 0.7)', 'rgba(239, 68, 68, 0.7)'])}
                            options={{ responsive: true, maintainAspectRatio: false }}
                        />
                    </ChartCard>
                </div>
            </div>
        </AppLayout>
    );
}
