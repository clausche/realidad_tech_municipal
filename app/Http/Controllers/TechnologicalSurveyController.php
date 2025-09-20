<?php

namespace App\Http\Controllers;

use App\Models\TechnologicalSurvey;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Redirect;
use Illuminate\Validation\Rule; // <-- AÑADE ESTA LÍNEA


class TechnologicalSurveyController extends Controller
{
    /**
     * Display a listing of the resource.
     * Muestra la tabla principal con los datos paginados.
     */
    public function index(Request $request): Response
    {
        // Iniciar la consulta
        $query = TechnologicalSurvey::query();

        // Aplicar filtro de búsqueda si existe
        if ($request->has('search')) {
            $searchTerm = $request->input('search');
            $query->where('municipality_name', 'like', "%{$searchTerm}%")
                  ->orWhere('municipality_code', 'like', "%{$searchTerm}%");
        }

        // Seleccionar solo las columnas necesarias para la vista de índice para optimizar la carga
        $surveys = $query->select(
                'id',
                'municipality_code',
                'municipality_name',
                'main_internet_provider',
                'total_computers_count'
            )
            ->orderBy('id', 'asc') // Ordenar por ID de forma ascendente

            ->paginate(10) // Paginar los resultados
            ->withQueryString(); // Mantener los parámetros de la URL (como la búsqueda) al cambiar de página

        //dd($surveys); // <--- AÑADE ESTA LÍNEA TEMPORALMENTE

        return Inertia::render('Surveys/Index', [
            'surveys' => $surveys,
            'filters' => $request->only(['search']), // Pasar los filtros a la vista
        ]);
    }

    /**
     * Show the form for creating a new resource.
     * Muestra el formulario para crear un nuevo registro.
     */
    public function create(): Response
    {
        return Inertia::render('Surveys/Create');
    }

    /**
     * Store a newly created resource in storage.
     * Valida y guarda el nuevo registro en la base de datos.
     */
    public function store(Request $request): RedirectResponse
    {
        // Validación de todos los campos que vienen del formulario.
        $validatedData = $request->validate([
        // --- INFORMACIÓN DEL MUNICIPIO ---
        // La regla 'unique' aquí es simple: el código no debe existir en toda la tabla.
        'municipality_code' => 'required|integer|unique:technological_surveys,municipality_code',
        'municipality_name' => 'required|string|max:255',

        // --- CONECTIVIDAD Y EQUIPAMIENTO ---
        'upload_speed' => 'nullable|string|max:255',
        'download_speed' => 'nullable|string|max:255',
        'main_internet_provider' => 'nullable|string|max:255',
        'total_computers_count' => 'nullable|integer|min:0',
        'old_computers_count' => 'nullable|integer|min:0',
        'computers_purchase_last_year' => 'nullable|string|max:255',

        // --- SISTEMAS Y CAPACIDADES (BOOLEANS) ---
        'has_accounting_system' => 'required|boolean',
        'has_education_accounting_system' => 'required|boolean',
        'has_health_accounting_system' => 'required|boolean',
        'has_procurement_system' => 'required|boolean',
        'has_fixed_asset_system' => 'required|boolean',
        'has_bank_reconciliation_system' => 'required|boolean',
        'has_document_management_system' => 'required|boolean',
        'has_doc_digital_program' => 'required|boolean',
        'manages_internal_docs_platform' => 'required|boolean',
        'uses_simple_electronic_signature' => 'required|boolean',
        'uses_advanced_private_signature' => 'required|boolean',
        'uses_advanced_segpres_signature' => 'required|boolean',
        'uses_clave_unica_platform' => 'required|boolean',
        'can_approve_docs_platform' => 'required|boolean',
        'can_track_docs_online' => 'required|boolean',
        'can_archive_docs_electronically' => 'required|boolean',
        'has_citizen_interaction_platform' => 'required|boolean',
        'has_full_time_it_manager' => 'required|boolean',
        'uses_cloud_servers' => 'required|boolean',
        'it_manager_knows_cloud' => 'required|boolean',
        'has_implemented_law_21180' => 'required|boolean',
        'council_sessions_are_streamed' => 'required|boolean',
        'has_electronic_billing_system' => 'required|boolean',

        // --- PROPIEDAD Y TRANSPARENCIA ---
        'information_system_ownership' => 'nullable|string|max:255',
        'external_provider_name' => 'nullable|string|max:255',
        'electronic_signature_type' => 'nullable|string|max:255',
        'streaming_main_platform' => 'nullable|string|max:255',
        'streaming_channel_name' => 'nullable|string|max:255',
        'streaming_direct_url' => 'nullable|string',
    ]);

        TechnologicalSurvey::create($validatedData);

        return Redirect::route('surveys.index')->with('success', 'Encuesta creada exitosamente.');
    }

    /**
     * Display the specified resource.
     * No lo usaremos en un CRUD típico de Inertia, pero lo dejamos por si acaso.
     */
    public function show(TechnologicalSurvey $survey)
    {
        // Podrías redirigir a la vista de edición o crear una vista de solo lectura.
        return Redirect::route('surveys.edit', $survey);
    }

    /**
     * Show the form for editing the specified resource.
     * Muestra el formulario de edición con los datos del registro.
     */
    public function edit(TechnologicalSurvey $survey): Response
    {
        return Inertia::render('Surveys/Edit', [
            'survey' => $survey // Pasamos el modelo completo a la vista
        ]);
    }

    /**
     * Update the specified resource in storage.
     * Valida y actualiza el registro en la base de datos.
     */
    public function update(Request $request, TechnologicalSurvey $survey): RedirectResponse
    {
    // Validación de todos los campos que vienen del formulario.
        $validatedData = $request->validate([
        // --- INFORMACIÓN DEL MUNICIPIO ---
        // La regla 'unique' es la clave aquí: le decimos que ignore el ID del registro actual.
        'municipality_code' => ['required', 'integer', Rule::unique('technological_surveys')->ignore($survey->id)],
        'municipality_name' => 'required|string|max:255',

        // --- CONECTIVIDAD Y EQUIPAMIENTO ---
        'upload_speed' => 'nullable|string|max:255',
        'download_speed' => 'nullable|string|max:255',
        'main_internet_provider' => 'nullable|string|max:255',
        'total_computers_count' => 'nullable|integer|min:0',
        'old_computers_count' => 'nullable|integer|min:0',
        'computers_purchase_last_year' => 'nullable|string|max:255',

        // --- SISTEMAS Y CAPACIDADES (BOOLEANS) ---
        'has_accounting_system' => 'required|boolean',
        'has_education_accounting_system' => 'required|boolean',
        'has_health_accounting_system' => 'required|boolean',
        'has_procurement_system' => 'required|boolean',
        'has_fixed_asset_system' => 'required|boolean',
        'has_bank_reconciliation_system' => 'required|boolean',
        'has_document_management_system' => 'required|boolean',
        'has_doc_digital_program' => 'required|boolean',
        'manages_internal_docs_platform' => 'required|boolean',
        'uses_simple_electronic_signature' => 'required|boolean',
        'uses_advanced_private_signature' => 'required|boolean',
        'uses_advanced_segpres_signature' => 'required|boolean',
        'uses_clave_unica_platform' => 'required|boolean',
        'can_approve_docs_platform' => 'required|boolean',
        'can_track_docs_online' => 'required|boolean',
        'can_archive_docs_electronically' => 'required|boolean',
        'has_citizen_interaction_platform' => 'required|boolean',
        'has_full_time_it_manager' => 'required|boolean',
        'uses_cloud_servers' => 'required|boolean',
        'it_manager_knows_cloud' => 'required|boolean',
        'has_implemented_law_21180' => 'required|boolean',
        'council_sessions_are_streamed' => 'required|boolean',
        'has_electronic_billing_system' => 'required|boolean',

        // --- PROPIEDAD Y TRANSPARENCIA ---
        'information_system_ownership' => 'nullable|string|max:255',
        'external_provider_name' => 'nullable|string|max:255',
        'electronic_signature_type' => 'nullable|string|max:255',
        'streaming_main_platform' => 'nullable|string|max:255',
        'streaming_channel_name' => 'nullable|string|max:255',
        'streaming_direct_url' => 'nullable|string',
        ]);

    // Usamos el método update() del modelo Eloquent.
    // Laravel se encargará de asignar solo los campos que están en la propiedad $fillable de tu modelo.
        $survey->update($validatedData);

    // Redirigimos de vuelta a la página de índice con un mensaje de éxito.
        return Redirect::route('surveys.index')->with('message', 'Encuesta actualizada exitosamente.');
    }

    /**
     * Remove the specified resource from storage.
     * Elimina el registro de la base de datos.
     */
    public function destroy(TechnologicalSurvey $survey): RedirectResponse
    {
        $survey->delete();

        return Redirect::route('surveys.index')->with('success', 'Encuesta eliminada exitosamente.');
    }
}
