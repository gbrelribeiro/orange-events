/* types/companion.ts */

export type GenderValue = "MALE" | "FEMALE" | "OTHER";

export type CompanionData = {
  name: string;
  birthdate: string;
  gender: GenderValue;
  document: string;
  identity: string;
  phone?: string;
};

export type SavedCompanion = CompanionData;

export type CompanionType = "adult" | "childOver5" | "childUnder5";