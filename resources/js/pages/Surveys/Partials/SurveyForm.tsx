// resources/js/Pages/Surveys/Partials/SurveyForm.tsx

import { useForm, Link } from '@inertiajs/react';
import { FormEventHandler, InputHTMLAttributes } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { CircleAlert } from 'lucide-react';
import { type Survey } from '@/types';
import InputError from '@/components/input-error';
// 👇 ¡AQUÍ ESTÁ LA NUEVA LÍNEA DE IMPORTACIÓN! 👇
import { municipios } from '@/data/municipios';

// --- COMPONENTES DE AYUDA PARA MANTENER EL CÓDIGO LIMPIO ---
// 👇 ¡AÑADE ESTA LÍNEA AQUÍ! 👇


// Creamos una nueva copia ordenada del array para no modificar el original.
const municipiosOrdenados = [...municipios].sort((a, b) => {
    const nameA = a.name.trim().toLowerCase();
    const nameB = b.name.trim().toLowerCase();
    return nameA.localeCompare(nameB, 'es', { sensitivity: 'base' });
});

// Componente para campos de Input (CORREGIDO)
const InputField = ({ id, label, error, className, ...props }: {
    id: string;
    label: string;
    error?: string;
    className?: string;
} & InputHTMLAttributes<HTMLInputElement>) => ( // <-- ESTA ES LA LÍNEA CLAVE
    <div className="space-y-2">
        <Label htmlFor={id} className="font-semibold">{label}</Label>
        <Input
            id={id}
            className={`${className || ''} ${error ? 'border-red-500 dark:border-red-400' : ''}`}
            {...props} // Pasamos el resto de las props válidas (type, value, onChange, placeholder, etc.)
        />
        <InputError message={error} />
    </div>
);

// CÓDIGO CORREGIDO Y GENÉRICO
const SelectField = ({ id, label, placeholder, options, value, onChange, error }: { id: string; label: string; placeholder: string; options: string[]; value: string; onChange: (value: string) => void; error?: string; }) => (
    <div className="space-y-2">
        <Label htmlFor={id} className="font-semibold">{label}</Label>

        {/* 1. Usamos 'value' para que sea un componente controlado */}
        <Select onValueChange={onChange} value={value}>
            <SelectTrigger id={id} className={error ? 'border-red-500 dark:border-red-400' : ''}>
                <SelectValue placeholder={placeholder} />
            </SelectTrigger>
            <SelectContent>
                {/* 2. Usamos la prop 'options' para que sea reutilizable */}
                {options.map(option => (
                    <SelectItem key={option} value={option}>
                        {option}
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
        <InputError message={error} />
    </div>
);

const RadioField = ({ id, label, value, onChange, error }: { id: string; label: string; value: boolean; onChange: (value: string) => void; error?: string; }) => (
    <div className="space-y-3">
        <Label htmlFor={id} className="font-semibold">{label}</Label>
        <RadioGroup onValueChange={onChange} defaultValue={value ? '1' : '0'} className="flex items-center space-x-4 pt-1">
            <div className="flex items-center space-x-2">
                <RadioGroupItem value="1" id={`${id}_yes`} />
                <Label htmlFor={`${id}_yes`}>Sí</Label>
            </div>
            <div className="flex items-center space-x-2">
                <RadioGroupItem value="0" id={`${id}_no`} />
                <Label htmlFor={`${id}_no`}>No</Label>
            </div>
        </RadioGroup>
        <InputError message={error} />
    </div>
);

// --- FORMULARIO PRINCIPAL ---

interface SurveyFormProps {
    survey?: Survey | null;
    className?: string;
}

export default function SurveyForm({ survey = null, className = '' }: SurveyFormProps) {
    const { data, setData, post, put, processing, errors } = useForm({
        municipality_code: survey?.municipality_code ?? '',
        municipality_name: survey?.municipality_name ?? '',
        upload_speed: survey?.upload_speed ?? '',
        download_speed: survey?.download_speed ?? '',
        old_computers_count: survey?.old_computers_count ?? '',
        computers_purchase_last_year: survey?.computers_purchase_last_year ?? '',
        total_computers_count: survey?.total_computers_count ?? '',
        main_internet_provider: survey?.main_internet_provider ?? '',
        information_system_ownership: survey?.information_system_ownership ?? '',
        external_provider_name: survey?.external_provider_name ?? '',
        electronic_signature_type: survey?.electronic_signature_type ?? '',
        streaming_main_platform: survey?.streaming_main_platform ?? '',
        streaming_channel_name: survey?.streaming_channel_name ?? '',
        streaming_direct_url: survey?.streaming_direct_url ?? '',
        has_accounting_system: survey?.has_accounting_system ?? false,
        has_education_accounting_system: survey?.has_education_accounting_system ?? false,
        has_health_accounting_system: survey?.has_health_accounting_system ?? false,
        has_procurement_system: survey?.has_procurement_system ?? false,
        has_fixed_asset_system: survey?.has_fixed_asset_system ?? false,
        has_bank_reconciliation_system: survey?.has_bank_reconciliation_system ?? false,
        has_document_management_system: survey?.has_document_management_system ?? false,
        has_doc_digital_program: survey?.has_doc_digital_program ?? false,
        manages_internal_docs_platform: survey?.manages_internal_docs_platform ?? false,
        uses_simple_electronic_signature: survey?.uses_simple_electronic_signature ?? false,
        uses_advanced_private_signature: survey?.uses_advanced_private_signature ?? false,
        uses_advanced_segpres_signature: survey?.uses_advanced_segpres_signature ?? false,
        uses_clave_unica_platform: survey?.uses_clave_unica_platform ?? false,
        can_approve_docs_platform: survey?.can_approve_docs_platform ?? false,
        can_track_docs_online: survey?.can_track_docs_online ?? false,
        can_archive_docs_electronically: survey?.can_archive_docs_electronically ?? false,
        has_citizen_interaction_platform: survey?.has_citizen_interaction_platform ?? false,
        has_full_time_it_manager: survey?.has_full_time_it_manager ?? false,
        uses_cloud_servers: survey?.uses_cloud_servers ?? false,
        it_manager_knows_cloud: survey?.it_manager_knows_cloud ?? false,
        has_implemented_law_21180: survey?.has_implemented_law_21180 ?? false,
        council_sessions_are_streamed: survey?.council_sessions_are_streamed ?? false,
        has_electronic_billing_system: survey?.has_electronic_billing_system ?? false,
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        if (survey) {
            put(route('surveys.update', survey.id));
        } else {
            post(route('surveys.store'));
        }
    };

    const speedOptions = ["Menos de 10", "Entre 10 y menos de 20", "Entre 20 y menos de 50", "Entre 50 y menos de 100", "Más de 100", "No recepcionado"];

    return (
        <form onSubmit={submit} className={`space-y-8 ${className}`}>
            {Object.keys(errors).length > 0 && (
                <Alert variant="destructive">
                    <CircleAlert className="h-4 w-4" />
                    <AlertTitle>Error de Validación</AlertTitle>
                    <AlertDescription>Por favor, revisa los campos marcados y corrige los errores.</AlertDescription>
                </Alert>
            )}

            <fieldset className="space-y-6">
                <legend className="text-xl font-bold border-b pb-2 mb-4">Información del Municipio</legend>
                <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                    <div className="md:col-span-8">
                        <Label htmlFor="municipality_select" className="font-semibold">Municipio</Label>
                        <Select
                            // El valor del select será el código del municipio
                            value={String(data.municipality_code)}
                            onValueChange={(value) => {
                                // Buscamos el municipio seleccionado en nuestro array
                                const selectedMunicipio = municipios.find(m => m.code === Number(value));
                                if (selectedMunicipio) {
                                    // Actualizamos AMBOS campos en el estado del formulario
                                    setData({
                                        ...data,
                                        municipality_code: selectedMunicipio.code,
                                        municipality_name: selectedMunicipio.name,
                                    });
                                }
                            }}
                        >
                            <SelectTrigger id="municipality_select" className={errors.municipality_code || errors.municipality_name ? 'border-red-500 dark:border-red-400' : ''}>
                                <SelectValue placeholder="Selecciona un municipio..." />
                            </SelectTrigger>
                            <SelectContent>
                                {municipios.map((municipio) => (
                                    <SelectItem key={municipio.code} value={String(municipio.code)}>
                                        {municipio.name} ({municipio.code})
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        {/* Mostramos cualquiera de los dos errores aquí */}
                        <InputError message={errors.municipality_code || errors.municipality_name} />
                    </div>

                    {/* Mantenemos el campo de código visible pero deshabilitado para que el usuario lo vea */}
                    <div className="md:col-span-4">
                        <InputField
                            id="municipality_code_display"
                            label="Código Seleccionado"
                            type="text"
                            value={data.municipality_code}
                            disabled // El campo está deshabilitado
                            readOnly   // El usuario no puede cambiarlo
                        />
                    </div>
                </div>
            </fieldset>

            <fieldset className="space-y-6">
                <legend className="text-xl font-bold border-b pb-2 mb-4">Conectividad y Equipamiento</legend>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <SelectField id="upload_speed" label="1. Velocidad de Subida (Mbps)" placeholder="Seleccionar velocidad" options={speedOptions} error={errors.upload_speed} value={data.upload_speed} onChange={value => setData('upload_speed', value)} />
                    <SelectField id="download_speed" label="2. Velocidad de Bajada (Mbps)" placeholder="Seleccionar velocidad" options={speedOptions} error={errors.download_speed} value={data.download_speed} onChange={value => setData('download_speed', value)} />
                    <InputField id="main_internet_provider" label="4. Proveedor Principal de Internet" error={errors.main_internet_provider} value={data.main_internet_provider} onChange={e => setData('main_internet_provider', e.target.value)} />
                    <InputField id="total_computers_count" label="6. Total de Computadores" type="number" error={errors.total_computers_count} value={data.total_computers_count} onChange={e => setData('total_computers_count', e.target.value)} />
                    <InputField id="old_computers_count" label="3. Computadores Antiguos (pre-2020)" type="number" error={errors.old_computers_count} value={data.old_computers_count} onChange={e => setData('old_computers_count', e.target.value)} />
                    <InputField id="computers_purchase_last_year" label="5. Última Compra de Computadores" error={errors.computers_purchase_last_year} value={data.computers_purchase_last_year} onChange={e => setData('computers_purchase_last_year', e.target.value)} />
                </div>
            </fieldset>

            <fieldset className="space-y-6">
                <legend className="text-xl font-bold border-b pb-2 mb-4">7. Sistemas de Información Utilizados</legend>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-8">
                    <RadioField id="has_accounting_system" label="7.1 Contabilidad Municipal" error={errors.has_accounting_system} value={data.has_accounting_system} onChange={value => setData('has_accounting_system', value === '1')} />
                    <RadioField id="has_education_accounting_system" label="7.2 Contabilidad Educación" error={errors.has_education_accounting_system} value={data.has_education_accounting_system} onChange={value => setData('has_education_accounting_system', value === '1')} />
                    <RadioField id="has_health_accounting_system" label="7.3 Contabilidad Salud" error={errors.has_health_accounting_system} value={data.has_health_accounting_system} onChange={value => setData('has_health_accounting_system', value === '1')} />
                    <RadioField id="has_procurement_system" label="7.4 Adquisiciones" error={errors.has_procurement_system} value={data.has_procurement_system} onChange={value => setData('has_procurement_system', value === '1')} />
                    <RadioField id="has_fixed_asset_system" label="7.5 Activo Fijo" error={errors.has_fixed_asset_system} value={data.has_fixed_asset_system} onChange={value => setData('has_fixed_asset_system', value === '1')} />
                    <RadioField id="has_bank_reconciliation_system" label="7.6 Conciliación Bancaria" error={errors.has_bank_reconciliation_system} value={data.has_bank_reconciliation_system} onChange={value => setData('has_bank_reconciliation_system', value === '1')} />
                    <RadioField id="has_document_management_system" label="7.7 Sistema Documental" error={errors.has_document_management_system} value={data.has_document_management_system} onChange={value => setData('has_document_management_system', value === '1')} />
                    <RadioField id="has_doc_digital_program" label="8. Programa DOC Digital" error={errors.has_doc_digital_program} value={data.has_doc_digital_program} onChange={value => setData('has_doc_digital_program', value === '1')} />
                    <RadioField id="manages_internal_docs_platform" label="10.1 Gestiona Docs Internos" error={errors.manages_internal_docs_platform} value={data.manages_internal_docs_platform} onChange={value => setData('manages_internal_docs_platform', value === '1')} />
                    <RadioField id="uses_simple_electronic_signature" label="10.2 Usa Firma Simple" error={errors.uses_simple_electronic_signature} value={data.uses_simple_electronic_signature} onChange={value => setData('uses_simple_electronic_signature', value === '1')} />
                    <RadioField id="uses_advanced_private_signature" label="10.3 Usa Firma Avanzada (Privada)" error={errors.uses_advanced_private_signature} value={data.uses_advanced_private_signature} onChange={value => setData('uses_advanced_private_signature', value === '1')} />
                    <RadioField id="uses_advanced_segpres_signature" label="10.4 Usa Firma Avanzada (SEGPRES)" error={errors.uses_advanced_segpres_signature} value={data.uses_advanced_segpres_signature} onChange={value => setData('uses_advanced_segpres_signature', value === '1')} />
                    <RadioField id="uses_clave_unica_platform" label="10.6 Usa Clave Única" error={errors.uses_clave_unica_platform} value={data.uses_clave_unica_platform} onChange={value => setData('uses_clave_unica_platform', value === '1')} />
                    <RadioField id="can_approve_docs_platform" label="10.7 Puede Visar Documentos" error={errors.can_approve_docs_platform} value={data.can_approve_docs_platform} onChange={value => setData('can_approve_docs_platform', value === '1')} />
                    <RadioField id="can_track_docs_online" label="10.8 Puede Dar Seguimiento" error={errors.can_track_docs_online} value={data.can_track_docs_online} onChange={value => setData('can_track_docs_online', value === '1')} />
                    <RadioField id="can_archive_docs_electronically" label="10.9 Puede Archivar Electrónicamente" error={errors.can_archive_docs_electronically} value={data.can_archive_docs_electronically} onChange={value => setData('can_archive_docs_electronically', value === '1')} />
                    <RadioField id="has_citizen_interaction_platform" label="10.10 Plataforma con Ciudadanía" error={errors.has_citizen_interaction_platform} value={data.has_citizen_interaction_platform} onChange={value => setData('has_citizen_interaction_platform', value === '1')} />
                    <RadioField id="has_full_time_it_manager" label="11. Encargado TI Jornada Completa" error={errors.has_full_time_it_manager} value={data.has_full_time_it_manager} onChange={value => setData('has_full_time_it_manager', value === '1')} />
                    <RadioField id="uses_cloud_servers" label="12. Usa Servidores Cloud" error={errors.uses_cloud_servers} value={data.uses_cloud_servers} onChange={value => setData('uses_cloud_servers', value === '1')} />
                    <RadioField id="it_manager_knows_cloud" label="13. Encargado TI Conoce Cloud" error={errors.it_manager_knows_cloud} value={data.it_manager_knows_cloud} onChange={value => setData('it_manager_knows_cloud', value === '1')} />
                    <RadioField id="has_implemented_law_21180" label="14. Implementó Ley 21.180" error={errors.has_implemented_law_21180} value={data.has_implemented_law_21180} onChange={value => setData('has_implemented_law_21180', value === '1')} />
                    <RadioField id="council_sessions_are_streamed" label="15. Transmite Concejos" error={errors.council_sessions_are_streamed} value={data.council_sessions_are_streamed} onChange={value => setData('council_sessions_are_streamed', value === '1')} />
                    <RadioField id="has_electronic_billing_system" label="Facturación Electrónica" error={errors.has_electronic_billing_system} value={data.has_electronic_billing_system} onChange={value => setData('has_electronic_billing_system', value === '1')} />
                </div>
            </fieldset>

            <fieldset className="space-y-6">
                <legend className="text-xl font-bold border-b pb-2 mb-4">Propiedad y Transparencia</legend>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <InputField id="information_system_ownership" label="9. Propiedad de Sistemas" error={errors.information_system_ownership} value={data.information_system_ownership} onChange={e => setData('information_system_ownership', e.target.value)} />
                    <InputField id="external_provider_name" label="9.1 Nombre Proveedor Externo" error={errors.external_provider_name} value={data.external_provider_name} onChange={e => setData('external_provider_name', e.target.value)} />
                    <InputField id="electronic_signature_type" label="10.5 Tipo Firma Electrónica" error={errors.electronic_signature_type} value={data.electronic_signature_type} onChange={e => setData('electronic_signature_type', e.target.value)} />
                    <InputField id="streaming_main_platform" label="16. Plataforma Principal Streaming" error={errors.streaming_main_platform} value={data.streaming_main_platform} onChange={e => setData('streaming_main_platform', e.target.value)} />
                    <InputField id="streaming_channel_name" label="17. Nombre del Canal Streaming" error={errors.streaming_channel_name} value={data.streaming_channel_name} onChange={e => setData('streaming_channel_name', e.target.value)} />
                    <InputField id="streaming_direct_url" label="18. URL Directa del Streaming" error={errors.streaming_direct_url} value={data.streaming_direct_url} onChange={e => setData('streaming_direct_url', e.target.value)} />
                </div>
            </fieldset>

            <div className="flex items-center justify-end gap-4 pt-4 border-t dark:border-gray-700">
                <Link href={route('surveys.index')} className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2">
                    Cancelar
                </Link>
                <Button disabled={processing} type="submit">
                    {processing ? 'Guardando...' : (survey ? 'Actualizar Encuesta' : 'Crear Encuesta')}
                </Button>
            </div>
        </form>
    );
}
