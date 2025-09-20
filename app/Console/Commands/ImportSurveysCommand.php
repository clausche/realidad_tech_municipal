<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Imports\TechnologicalSurveyImport;
use Maatwebsite\Excel\Facades\Excel;

class ImportSurveysCommand extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'import:surveys';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Import technological surveys from the specified CSV file';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $filePath = storage_path('app/imports/import_data.csv'); // Asegúrate que el archivo esté aquí

        if (!file_exists($filePath)) {
            $this->error("File not found at: {$filePath}");
            return 1; // Termina con error
        }

        $this->info("Starting import of surveys from {$filePath}...");

        try {
            Excel::import(new TechnologicalSurveyImport, $filePath);
            $this->info('Import completed successfully!');
        } catch (\Maatwebsite\Excel\Validators\ValidationException $e) {
            $this->error('Import failed due to validation errors.');
            $failures = $e->failures();

            foreach ($failures as $failure) {
                $this->line(" - Row: {$failure->row()}. Attribute: {$failure->attribute()}. Error: " . implode(', ', $failure->errors()));
            }
            return 1;
        } catch (\Exception $e) {
            $this->error('An unexpected error occurred during import:');
            $this->error($e->getMessage());
            return 1;
        }

        return 0; // Termina con éxito
    }
}
