<?php

namespace App\Imports;

use App\Models\TechnologicalSurvey;
use Maatwebsite\Excel\Concerns\ToModel;
use Maatwebsite\Excel\Concerns\WithHeadingRow;
use Maatwebsite\Excel\Concerns\WithValidation;
use Maatwebsite\Excel\Concerns\Importable;

class TechnologicalSurveyImport implements ToModel, WithHeadingRow, WithValidation
{
    use Importable;

    /**
    * @param array $row
    *
    * @return \Illuminate\Database\Eloquent\Model|null
    */
    public function model(array $row)
    {
        // Si el municipio no respondió, no creamos el registro.
        if (strtolower(trim($row['upload_speed'])) === 'no recepcionado') {
            return null; // Saltamos esta fila
        }

        return new TechnologicalSurvey([
            // Mapeo directo si los encabezados del CSV coinciden con los nombres de la BD
            'municipality_code'               => $row['municipality_code'],
            'municipality_name'               => $row['municipality_name'],
            'upload_speed'                    => $row['upload_speed'],
            'download_speed'                  => $row['download_speed'],
            'old_computers_count'             => $this->cleanInteger($row['old_computers_count']),
            'computers_purchase_last_year'    => $row['computers_purchase_last_year'],
            'total_computers_count'           => $this->cleanInteger($row['total_computers_count']),
            'main_internet_provider'          => $row['main_internet_provider'],

            // Transformación de "Si"/"No" a booleano
            'has_accounting_system'           => $this->toBoolean($row['has_accounting_system']),
            'has_education_accounting_system' => $this->toBoolean($row['has_education_accounting_system']),
            'has_health_accounting_system'    => $this->toBoolean($row['has_health_accounting_system']),
            'has_procurement_system'          => $this->toBoolean($row['has_procurement_system']),
            'has_fixed_asset_system'          => $this->toBoolean($row['has_fixed_asset_system']),
            'has_bank_reconciliation_system'  => $this->toBoolean($row['has_bank_reconciliation_system']),
            'has_document_management_system'  => $this->toBoolean($row['has_document_management_system']),
            'has_doc_digital_program'         => $this->toBoolean($row['has_doc_digital_program']),
            'information_system_ownership'    => $row['information_system_ownership'],
            'external_provider_name'          => $row['external_provider_name'],
            'manages_internal_docs_platform'  => $this->toBoolean($row['manages_internal_docs_platform']),
            'uses_simple_electronic_signature'=> $this->toBoolean($row['uses_simple_electronic_signature']),
            'uses_advanced_private_signature' => $this->toBoolean($row['uses_advanced_private_signature']),
            'uses_advanced_segpres_signature' => $this->toBoolean($row['uses_advanced_segpres_signature']),
            'electronic_signature_type'       => $row['electronic_signature_type'],
            'uses_clave_unica_platform'       => $this->toBoolean($row['uses_clave_unica_platform']),
            'can_approve_docs_platform'       => $this->toBoolean($row['can_approve_docs_platform']),
            'can_track_docs_online'           => $this->toBoolean($row['can_track_docs_online']),
            'can_archive_docs_electronically' => $this->toBoolean($row['can_archive_docs_electronically']),
            'has_citizen_interaction_platform'=> $this->toBoolean($row['has_citizen_interaction_platform']),
            'has_full_time_it_manager'        => $this->toBoolean($row['has_full_time_it_manager']),
            'uses_cloud_servers'              => $this->toBoolean($row['uses_cloud_servers']),
            'it_manager_knows_cloud'          => $this->toBoolean($row['it_manager_knows_cloud']),
            'has_implemented_law_21180'       => $this->toBoolean($row['has_implemented_law_21180']),
            'council_sessions_are_streamed'   => $this->toBoolean($row['council_sessions_are_streamed']),
            'streaming_main_platform'         => $row['streaming_main_platform'],
            'streaming_channel_name'          => $row['streaming_channel_name'],
            'streaming_direct_url'            => $row['streaming_direct_url'],
            'has_electronic_billing_system'   => $this->toBoolean($row['has_electronic_billing_system']),
        ]);
    }

    /**
     * Convierte valores como "Si", "No", etc., a boolean.
     */
    private function toBoolean($value): bool
    {
        return strtolower(trim($value)) === 'si';
    }

    /**
     * Limpia y convierte a entero, manejando valores no numéricos.
     */
    private function cleanInteger($value): ?int
    {
        // Extrae solo los números del string. '100 equipos' -> 100
        preg_match('/^\d+/', trim($value), $matches);
        return !empty($matches) ? (int)$matches[0] : null;
    }

    /**
     * Define las reglas de validación para cada fila del CSV.
     */
    public function rules(): array
    {
        return [
            'municipality_code' => 'required|integer|unique:technological_surveys,municipality_code',
            'municipality_name' => 'required|string',
        ];
    }
}
