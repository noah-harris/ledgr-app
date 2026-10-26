export interface Unit {
  idUnit: string;
  UnitType: string;
  Symbol: string;
  UnitAbbreviation: string;
  UnitName: string;
  UnitNamePlural: string;
  ConversionFactor: number;
  isBaseUnit: boolean | null;
  isCurrency: boolean | null;
  Created: string;
  Updated: string;
}
