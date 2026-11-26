export type ServiceId =
  | 'revisao'
  | 'oleo'
  | 'travoes'
  | 'pneus'
  | 'mecanica'
  | 'scooters';

export interface ServiceDefinition {
  id: ServiceId;
  icon: 'wrench' | 'oil' | 'brake' | 'tire' | 'gear' | 'scooter';
}

export const SERVICES: readonly ServiceDefinition[] = [
  { id: 'revisao', icon: 'wrench' },
  { id: 'oleo', icon: 'oil' },
  { id: 'travoes', icon: 'brake' },
  { id: 'pneus', icon: 'tire' },
  { id: 'mecanica', icon: 'gear' },
  { id: 'scooters', icon: 'scooter' },
] as const;

export const VALID_SERVICE_IDS = new Set<string>(SERVICES.map((service) => service.id));
