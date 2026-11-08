export type IntelligenceRecordType = "threat" | "vulnerability";

export interface IntelligenceReference {
	recordType: IntelligenceRecordType;
	recordId: string;
}
