<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {

            // database/migrations/xxxx_xx_xx_xxxxxx_create_technological_surveys_table.php

        Schema::create('technological_surveys', function (Blueprint $table) {
            $table->id();
            $table->integer('municipality_code')->unique()->comment('CODIGO');
            $table->string('municipality_name')->comment('MUNICIPIO');

            // 1 & 2. Velocidad de Internet
            $table->string('upload_speed')->nullable()->comment('1. Velocidad de subida');
            $table->string('download_speed')->nullable()->comment('2. Velocidad de bajada');

            // 3 & 6. Computadores
            $table->integer('old_computers_count')->nullable()->comment('3. Computadores pre-2020');
            $table->string('computers_purchase_last_year')->nullable()->comment('5. Último año y cantidad de compra');
            $table->integer('total_computers_count')->nullable()->comment('6. Total computadores');

            // 4. Proveedor
            $table->string('main_internet_provider')->nullable()->comment('4. Proveedor principal de internet');

            // 7. Sistemas Utilizados (booleanos para Si/No)
            $table->boolean('has_accounting_system')->default(false)->comment('7.1. Contabilidad Municipal');
            $table->boolean('has_education_accounting_system')->default(false)->comment('7.2. Contabilidad Educación');
            $table->boolean('has_health_accounting_system')->default(false)->comment('7.3. Contabilidad Salud');
            $table->boolean('has_procurement_system')->default(false)->comment('7.4. Adquisiciones');
            $table->boolean('has_fixed_asset_system')->default(false)->comment('7.5. Activo Fijo');
            $table->boolean('has_bank_reconciliation_system')->default(false)->comment('7.6. Conciliación Bancaria');
            $table->boolean('has_document_management_system')->default(false)->comment('7.7. Sistema Documental');

            // 8 & 9. Propiedad de Sistemas
            $table->boolean('has_doc_digital_program')->default(false)->comment('8. Tiene DOC Digital');
            $table->string('information_system_ownership')->nullable()->comment('9. Propiedad (Propio o Externo)');
            $table->string('external_provider_name')->nullable()->comment('9.1. Nombre empresa proveedora');

            // 10. Acciones Tecnológicas (muchos booleanos)
            $table->boolean('manages_internal_docs_platform')->default(false)->comment('10.1. Gestiona docs internos con plataforma');
            $table->boolean('uses_simple_electronic_signature')->default(false)->comment('10.2. Usa Firma electrónica simple');
            $table->boolean('uses_advanced_private_signature')->default(false)->comment('10.3. Usa Firma Electrónica Avanzada (privada)');
            $table->boolean('uses_advanced_segpres_signature')->default(false)->comment('10.4. Usa Firma Electrónica Avanzada (SEGPRES)');
            $table->string('electronic_signature_type')->nullable()->comment('10.5. Tipo de Firma (GOB o PRIVADA)');
            $table->boolean('uses_clave_unica_platform')->default(false)->comment('10.6. Plataforma usa clave única');
            $table->boolean('can_approve_docs_platform')->default(false)->comment('10.7. Puede visar documentos en plataforma');
            $table->boolean('can_track_docs_online')->default(false)->comment('10.8. Puede dar seguimiento online a visaciones');
            $table->boolean('can_archive_docs_electronically')->default(false)->comment('10.9. Puede archivar documentos electrónicos');
            $table->boolean('has_citizen_interaction_platform')->default(false)->comment('10.10. Plataforma interactúa con ciudadanía');

            // 11-14. Personal y Cloud
            $table->boolean('has_full_time_it_manager')->default(false)->comment('11. Encargado TI jornada completa');
            $table->boolean('uses_cloud_servers')->default(false)->comment('12. Usa servidores Cloud');
            $table->boolean('it_manager_knows_cloud')->default(false)->comment('13. Encargado TI conoce Cloud');
            $table->boolean('has_implemented_law_21180')->default(false)->comment('14. Implementado Ley 21.180');

            // 15-18. Streaming
            $table->boolean('council_sessions_are_streamed')->default(false)->comment('15. Sesiones de concejo se transmiten');
            $table->string('streaming_main_platform')->nullable()->comment('16. Plataforma principal de streaming');
            $table->string('streaming_channel_name')->nullable()->comment('17. Nombre del canal o usuario');
            $table->text('streaming_direct_url')->nullable()->comment('18. Link directo (URL)');

            // Final. Facturación
            $table->boolean('has_electronic_billing_system')->default(false)->comment('¿Cuenta con sistema de facturación electrónico?');

            $table->timestamps();
        });

    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('technological_surveys');
    }
};
