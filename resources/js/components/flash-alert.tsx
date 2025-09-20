import { AlertCircle, CheckCircle2, Megaphone, XCircle } from 'lucide-react';

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { type PageProps } from '@/types';

// El componente recibe como "prop" el objeto flash completo.
// Nota: Es importante que ya hayas modificado tus tipos y tu controlador
// para que 'flash' contenga un 'type' y un 'message'.
interface Props {
    flash: PageProps['flash'];
}

export default function FlashAlert({ flash }: Props) {
    // Si no hay mensaje, no renderizamos absolutamente nada.
    if (!flash?.message) {
        return null;
    }

    // Lógica para determinar el estilo, el icono y el título según el 'type'.
    let alertStyles = '';
    let AlertIcon = Megaphone;
    let alertTitle = 'Notificación';

    switch (flash.type) {
        case 'success':
            alertStyles = 'bg-green-100 border-green-400 text-green-700'; // Puedes usar tus clases o las que te propuse
            AlertIcon = CheckCircle2; // Usamos el icono de Check
            alertTitle = '¡Éxito!';
            break;
        case 'error':
            alertStyles = 'border-red-500/50 text-red-600 dark:border-red-600/50 dark:text-red-400';
            AlertIcon = XCircle;
            alertTitle = '¡Error!';
            break;
        case 'danger':
            // Reutilizamos los mismos estilos rojos del error...
            alertStyles = 'border-destructive/50 text-destructive dark:border-destructive [&>svg]:text-destructive';
            // ... pero usamos un ícono diferente (opcional) y un TÍTULO NEUTRO.
            AlertIcon = AlertCircle; // Un ícono de advertencia es perfecto aquí.
            alertTitle = 'Acción Completada'; // ¡El cambio clave!
            break;
        // --- FIN DEL NUEVO CASO ---
    }

    return (
        <Alert className={alertStyles}>
            <AlertIcon className="h-4 w-4" />
            <AlertTitle>{alertTitle}</AlertTitle>
            <AlertDescription>{flash.message}</AlertDescription>
        </Alert>
    );
}
