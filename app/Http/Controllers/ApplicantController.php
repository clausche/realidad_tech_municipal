<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreApplicantRequest; // <-- Importar la clase
use App\Http\Requests\UpdateApplicantRequest; // <-- Importar la clase
use App\Models\Applicant;
use App\Models\Institution;
use App\Models\Status;

use Illuminate\Http\RedirectResponse;

use Illuminate\Support\Facades\DB; // <-- ¡¡AÑADE ESTA LÍNEA!!
use Illuminate\Support\Facades\Redirect;
use Inertia\Inertia;
use Inertia\Response; // <-- Importar la clase Response

class ApplicantController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    // ApplicantController.php -> método index()
    public function index(): Response
    {
        // REESCRITURA COMPLETA USANDO EL QUERY BUILDER
        // Esto es como escribir SQL directamente. Es imposible que falle si los IDs existen.
        $applicants = Applicant::with(['institution', 'status'])->paginate(10);

        return Inertia::render('Applicants/Index', [
            'applicants' => $applicants,
        ]);
    }
    /**
     * Show the form for creating a new resource.
     */
    public function create(): Response
    {
        // Pasamos las listas de instituciones y estados para los menús <select>
        // del formulario de React.
        return Inertia::render('Applicants/Create', [
            'institutions' => Institution::orderBy('name')->get(['id', 'name']),
            'statuses' => Status::all(['id', 'name']),
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreApplicantRequest $request): RedirectResponse
    {
        Applicant::create($request->validated());

        // Cambiamos 'success' por 'message' para que coincida con el frontend
        return Redirect::route('applicants.index')->with('flash', [
                    'type' => 'success',
                    'message' => 'Postulante creado exitosamente.'
                ]);
    }

    /**
     * Display the specified resource.
     */
    public function show(Applicant $applicant): Response
    {
        // Cargamos las relaciones para asegurarnos de que vienen con el objeto
        $applicant->load(['institution', 'status']);

        // Renderizamos un nuevo componente de React llamado 'Show.tsx'
        // y le pasamos el postulante como un prop.
        return Inertia::render('Applicants/Show', [
            'applicant' => $applicant
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Applicant $applicant): Response
    {
        return Inertia::render('Applicants/Edit', [
            'applicant' => $applicant, // Pasamos el postulante a editar
            'institutions' => Institution::orderBy('name')->get(['id', 'name']),
            'statuses' => Status::all(['id', 'name']),
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateApplicantRequest $request, Applicant $applicant): RedirectResponse
{
    $applicant->update($request->validated());

    // VERIFICA ESTA SECCIÓN CON MUCHO CUIDADO
    return Redirect::route('applicants.index')->with('flash', [
        'type' => 'success',
        'message' => 'Postulante actualizado exitosamente.'
    ]);
}

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Applicant $applicant): RedirectResponse
    {
        // --- LÓGICA DE ELIMINACIÓN ---
        // 1. Gracias al Route-Model Binding, Laravel ya encontró el 'Applicant'
        //    por nosotros. Si no lo encuentra, automáticamente devuelve un error 404.
        //    Esto es mucho más seguro que buscar por `string $id`.

        // 2. Ejecutamos el método para eliminar el registro de la base de datos.
        $applicant->delete();

        // 3. Redirigimos al usuario de vuelta a la lista.
        //    Y adjuntamos un mensaje flash para que sepa que la operación fue exitosa.
        //    Usamos el 'type' => 'error' para que nuestra alerta inteligente se pinte de rojo.
        return Redirect::route('applicants.index')->with('flash', [
            'type' => 'danger', // Puedes usar 'error' o 'success' para distintos colores. 'error' suele usarse para acciones destructivas.
            'message' => 'Postulante eliminado correctamente.'
        ]);
    }
}
