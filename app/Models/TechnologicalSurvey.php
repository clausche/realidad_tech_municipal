<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class TechnologicalSurvey extends Model
{
    protected $fillable = [
        'municipality_code',
        'municipality_name',
        'upload_speed',
        'download_speed',
        'old_computers_count',
        'computers_purchase_last_year',
        'total_computers_count',
        'main_internet_provider',
        'has_accounting_system',
        'has_education_accounting_system',
        'has_health_accounting_system',
        'has_procurement_system',
        'has_fixed_asset_system',
        'has_bank_reconciliation_system',
        'has_document_management_system',
        'has_doc_digital_program',
        'information_system_ownership',
        'external_provider_name',
        'manages_internal_docs_platform',
        'uses_simple_electronic_signature',
        'uses_advanced_private_signature',
        'uses_advanced_segpres_signature',
        'electronic_signature_type',
        'uses_clave_unica_platform',
        'can_approve_docs_platform',
        'can_track_docs_online',
        'can_archive_docs_electronically',
        'has_citizen_interaction_platform',
        'has_full_time_it_manager',
        'uses_cloud_servers',
        'it_manager_knows_cloud',
        'has_implemented_law_21180',
        'council_sessions_are_streamed',
        'streaming_main_platform',
        'streaming_channel_name',
        'streaming_direct_url',
        'has_electronic_billing_system',
    ];
}
