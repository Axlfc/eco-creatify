import { supabase } from "@/integrations/supabase/client";
import { ConflictResolutionData } from "@/integrations/supabase/client";
import { Json } from "@/integrations/supabase/types";

/**
 * Función para crear una nueva resolución de conflicto
 */
export const createConflictResolution = async (data: {
  title: string;
  description: string;
  partyA: string;
  partyB: string;
  positionA: Json;
  positionB: Json;
  progress: Json;
}): Promise<ConflictResolutionData> => {
  // Mapea los nombres de propiedades en camelCase a snake_case para Supabase
  const { data: newResolution, error } = await supabase
    .from("conflict_resolutions")
    .insert({
      title: data.title,
      description: data.description,
      party_a: data.partyA,
      party_b: data.partyB,
      position_a: data.positionA,
      position_b: data.positionB,
      progress: data.progress,
    })
    .select()
    .single();

  if (error) {
    console.error("Error creando resolución de conflicto:", error);
    throw new Error(`Error al crear la resolución de conflicto: ${error.message}`);
  }

  return newResolution;
};

/**
 * Función para obtener una resolución de conflicto por su ID
 */
export const getConflictResolutionById = async (
  id: string
): Promise<ConflictResolutionData | null> => {
  const { data, error } = await supabase
    .from("conflict_resolutions")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    console.error("Error obteniendo resolución de conflicto:", error);
    throw new Error(
      `Error al obtener la resolución de conflicto: ${error.message}`
    );
  }

  return data;
};

/**
 * Función para actualizar una resolución de conflicto existente
 */
export const updateConflictResolution = async (
  id: string,
  updates: Partial<ConflictResolutionData>
): Promise<ConflictResolutionData | null> => {
  // Mapea las propiedades de camelCase a snake_case para la actualización
  const updatesForSupabase: Partial<
    Record<string, any>
  > = {};
  for (const key in updates) {
    if (Object.hasOwn(updates, key)) {
      const snakeCaseKey = key.replace(
        /[A-Z]/g,
        (letter) => `_${letter.toLowerCase()}`
      );
      updatesForSupabase[snakeCaseKey] = updates[key];
    }
  }

  const { data, error } = await supabase
    .from("conflict_resolutions")
    .update(updatesForSupabase)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error("Error actualizando resolución de conflicto:", error);
    throw new Error(
      `Error al actualizar la resolución de conflicto: ${error.message}`
    );
  }

  return data;
};

/**
 * Función para eliminar una resolución de conflicto por su ID
 */
export const deleteConflictResolution = async (
  id: string
): Promise<boolean> => {
  const { error } = await supabase
    .from("conflict_resolutions")
    .delete()
    .eq("id", id);

  if (error) {
    console.error("Error eliminando resolución de conflicto:", error);
    throw new Error(
      `Error al eliminar la resolución de conflicto: ${error.message}`
    );
  }

  return true;
};

/**
 * Función para listar todas las resoluciones de conflicto
 */
export const listConflictResolutions = async (): Promise<
  ConflictResolutionData[]
> => {
  const { data, error } = await supabase
    .from("conflict_resolutions")
    .select("*");

  if (error) {
    console.error("Error listando resoluciones de conflicto:", error);
    throw new Error(
      `Error al listar las resoluciones de conflicto: ${error.message}`
    );
  }

  return data || [];
};
