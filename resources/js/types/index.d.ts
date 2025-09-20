import { LucideIcon } from 'lucide-react';
import type { Config } from 'ziggy-js';

export interface Auth {
    user: User;
}

export interface BreadcrumbItem {
    title: string;
    href: string;
}

export interface NavGroup {
    title: string;
    items: NavItem[];
}

export interface NavItem {
    title: string;
    href: string;
    icon?: LucideIcon | null;
    isActive?: boolean;
}

export interface SharedData {
    name: string;
    quote: { message: string; author: string };
    auth: Auth;
    ziggy: Config & { location: string };
    [key: string]: unknown;
}

export interface User {
    id: number;
    name: string;
    email: string;
    avatar?: string;
    email_verified_at: string | null;
    created_at: string;
    updated_at: string;
    [key: string]: unknown; // This allows for additional properties...
}

// Pega esto al final de tu archivo resources/js/types/index.d.ts

// --- TIPOS PARA EL CRUD DE ENCUESTAS ---

// Interfaz para un solo registro de encuesta.
// Asegúrate de que coincida con las columnas de tu migración.
export interface Survey {
    id: number;
    municipality_code: number;
    municipality_name: string;
    upload_speed: string | null;
    download_speed: string | null;
    old_computers_count: number | null;
    computers_purchase_last_year: string | null;
    total_computers_count: number | null;
    main_internet_provider: string | null;
    has_accounting_system: boolean;
    has_education_accounting_system: boolean;
    has_health_accounting_system: boolean;
    has_procurement_system: boolean;
    has_fixed_asset_system: boolean;
    has_bank_reconciliation_system: boolean;
    has_document_management_system: boolean;
    has_doc_digital_program: boolean;
    information_system_ownership: string | null;
    external_provider_name: string | null;
    manages_internal_docs_platform: boolean;
    uses_simple_electronic_signature: boolean;
    uses_advanced_private_signature: boolean;
    uses_advanced_segpres_signature: boolean;
    electronic_signature_type: string | null;
    uses_clave_unica_platform: boolean;
    can_approve_docs_platform: boolean;
    can_track_docs_online: boolean;
    can_archive_docs_electronically: boolean;
    has_citizen_interaction_platform: boolean;
    has_full_time_it_manager: boolean;
    uses_cloud_servers: boolean;
    it_manager_knows_cloud: boolean;
    has_implemented_law_21180: boolean;
    council_sessions_are_streamed: boolean;
    streaming_main_platform: string | null;
    streaming_channel_name: string | null;
    streaming_direct_url: string | null;
    has_electronic_billing_system: boolean;
    created_at: string;
    updated_at: string;
}

// Interfaz para la respuesta paginada que envía Laravel.
// Es genérica, así que servirá para cualquier recurso paginado.
export interface PaginatedResponse<T> {
    data: T[];
    links: {
        first: string;
        last: string;
        prev: string | null;
        next: string | null;
    };
    meta: {
        current_page: number;
        from: number;
        last_page: number;
        links: {
            url: string | null;
            label: string;
            active: boolean;
        }[];
        path: string;
        per_page: number;
        to: number;
        total: number;
    };
}

// =========================================================
// --- INICIO DE LOS TIPOS QUE FALTABAN PARA 'APPLICANTS' ---
// =========================================================

// --- 1. Tipos para los modelos de la base de datos ---
export interface Institution {
    id: number;
    name: string;
}

export interface Status {
    id: number;
    name: string;
    slug: string;
}

export interface Applicant {
    id: number;
    folio: number;
    full_name: string;
    score: number | null;
    year: number;
    institution: Institution; // Depende de la interfaz Institution
    status: Status;         // Depende de la interfaz Status
}

// --- 2. Tipos para la Paginación de Laravel ---
export interface PaginationLink {
    url: string | null;
    label: string;
    active: boolean;
}

// export interface PaginatedResponse<T> {
//     data: T[];
//     links: PaginationLink[];
//     total: number;
//     // ... puedes añadir más campos de paginación aquí si los necesitas
// }

// --- 3. Tipo genérico para las Props de Página de Inertia ---
// Este es el tipo que `usePage` necesita para entender la estructura de tus props.
export type PageProps<T extends Record<string, unknown> = Record<string, unknown>> = T & {
    auth: Auth;
    flash: {
        // --- ANTES ---
        // type: 'success' | 'error' | 'info' | 'warning' | null;

        // --- AHORA: AÑADIMOS EL NUEVO TIPO ---
        type: 'success' | 'error' | 'info' | 'warning' | 'danger' | null;
        message: string | null;
    };
};

// =========================================================
// --- FIN DE LOS TIPOS AÑADIDOS ---
// =========================================================
