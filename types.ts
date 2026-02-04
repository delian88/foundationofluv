
export interface ServiceArea {
  title: string;
  description: string;
  icon: string;
}

export interface Program {
  name: string;
  description: string;
}

export interface RoadmapPhase {
  title: string;
  years: string;
  goals: string[];
  outputs: string[];
}
