<?php

namespace App\Http\Controllers;

use App\Models\TechnologicalSurvey;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;

class DashboardController extends Controller
{
    public function index()
    {
        // Gráfico 1: Proveedores de Internet (Top 15 para legibilidad)
        $providerData = TechnologicalSurvey::query()
            ->select('main_internet_provider', DB::raw('count(*) as total'))
            ->whereNotNull('main_internet_provider')
            ->where('main_internet_provider', '!=', '')
            ->groupBy('main_internet_provider')
            ->orderBy('total', 'desc')
            ->limit(15)
            ->pluck('total', 'main_internet_provider');

        // Gráfico 2: Uso de Servidores Cloud
        $cloudData = [
            'No usan Cloud' => TechnologicalSurvey::where('uses_cloud_servers', false)->count(),
            'Sí, usan Cloud' => TechnologicalSurvey::where('uses_cloud_servers', true)->count(),
        ];

        // Gráfico 3: Propiedad de Sistemas
        $ownershipData = TechnologicalSurvey::query()
            ->select('information_system_ownership', DB::raw('count(*) as total'))
            ->whereNotNull('information_system_ownership')
            ->where('information_system_ownership', '!=', '')
            ->groupBy('information_system_ownership')
            ->pluck('total', 'information_system_ownership');

        // Gráfico 4: Transmisión de Concejos
        $streamingData = [
            'Transmiten' => TechnologicalSurvey::where('council_sessions_are_streamed', true)->count(),
            'No Transmiten' => TechnologicalSurvey::where('council_sessions_are_streamed', false)->count(),
        ];

        // Pasamos todos los datos a la vista bajo una clave 'stats'
        return Inertia::render('dashboard', [ // Usaremos el Dashboard.tsx que ya existe
            'stats' => [
                'providerData' => $providerData,
                'cloudData' => $cloudData,
                'ownershipData' => $ownershipData,
                'streamingData' => $streamingData,
            ]
        ]);
    }
}
