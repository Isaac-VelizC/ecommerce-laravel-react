import { SettingInterface } from "@/Interfaces/Settings";
import {
    createContext,
    useContext,
    useState,
    ReactNode,
    useEffect,
} from "react";
import axios from "axios";

// Definir el tipo del contexto
interface SettingContextType {
    settings: SettingInterface | null;
    updateSettings: (newSettings: SettingInterface) => void;
}

// Crear el contexto
const SettingContext = createContext<SettingContextType | undefined>(undefined);

export const SettingProvider = ({ children }: { children: ReactNode }) => {
    const [settings, setSettings] = useState<SettingInterface | null>(null);

    // Cargar configuración desde el backend
    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        try {
            const response = await axios.get<SettingInterface>(
                route("settings.app")
            );
            setSettings(response.data);
        } catch (error) {
            console.error("Error al obtener configuración:", error);
        }
    };

    // Función para actualizar la configuración
    const updateSettings = (newSettings: SettingInterface) => {
        setSettings(newSettings);
    };

    return (
        <SettingContext.Provider value={{ settings, updateSettings }}>
            {children}
        </SettingContext.Provider>
    );
};

// Hook para usar el contexto
export const useSettings = () => {
    const context = useContext(SettingContext);
    if (!context) {
        throw new Error("useSettings debe usarse dentro de un SettingProvider");
    }
    return context;
};
