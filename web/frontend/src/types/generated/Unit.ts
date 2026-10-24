export interface Unit {
  idUnit: string;
  UnitType: string;
  Symbol: string;
  UnitAbbreviation: string;
  UnitName: string;
  UnitNamePlural: string;
  ConversionFactor: number;
  isBaseUnit: unknown | null;
  isCurrency: unknown | null;
  Created: string;
  Updated: string;
}
