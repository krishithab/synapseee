export type Language = 'English' | 'Telugu' | 'Hindi';
export type ShareMode = 'Voice' | 'Text';
export type FontSize = 'small' | 'medium' | 'large';

export interface AssessmentState {
  language: Language;
  shareMode: ShareMode;
  fontSize: FontSize;
  selectedBodyPart: string;
  step: number;
  duration?: string;
  symptoms: string[];
  painLevel: number;
  mobility: {
    stiffness: string;
    support: string;
  };
  medicationAdherence: string;
}

export const INITIAL_ASSESSMENT_STATE: AssessmentState = {
  language: 'English',
  shareMode: 'Text',
  fontSize: 'large',
  selectedBodyPart: '',
  step: 1,
  symptoms: [],
  painLevel: 3,
  mobility: {
    stiffness: 'Minimal (less than 15 mins)',
    support: 'None / Independent',
  },
  medicationAdherence: 'Fully Compliant',
};
