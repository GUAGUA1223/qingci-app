export interface VocabWord {
  id: string;
  word: string;
  meaning: string;
  audio?: string;
  category?: string;
}

export interface PreschoolWord {
  word: string;
  meaning: string;
  image: string;
  difficulty?: number;
  category?: string;
}

export interface WordImage {
  name: string;
  require: any;
}
