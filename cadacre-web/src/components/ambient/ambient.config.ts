export type AmbientTheme = 
  | "hero" 
  | "warm" 
  | "statement" 
  | "technical" 
  | "map" 
  | "property" 
  | "transparency"
  | "65plus"
  | "dark-api" 
  | "neutral" 
  | "cta";

export interface FieldConfig {
  gradient: string;
  opacity: number[];
  x: string[] | number[]; // Update to allow percentages or larger numbers
  y: string[] | number[];
  duration: number;
}

export interface ThemeConfig {
  fields: FieldConfig[];
  showGrid?: boolean;
  showContours?: boolean;
}

export const themes: Record<AmbientTheme, ThemeConfig> = {
  hero: {
    showContours: true,
    fields: [
      {
        gradient: "radial-gradient(ellipse at center, rgba(15,118,110,0.06), rgba(15,118,110,0.02) 40%, transparent 70%)",
        opacity: [0.6, 1.0, 0.8, 0.9, 0.6],
        x: ["0%", "3%", "-2%", "-4%", "0%"],
        y: ["0%", "-2%", "3%", "-1%", "0%"],
        duration: 32,
      },
      {
        gradient: "radial-gradient(ellipse at center, rgba(255,255,255,0.9), transparent 65%)",
        opacity: [0.7, 1.0, 0.8, 0.9, 0.7],
        x: ["0%", "-3%", "2%", "-1%", "0%"],
        y: ["0%", "3%", "-2%", "1%", "0%"],
        duration: 45,
      },
      {
        gradient: "radial-gradient(ellipse at center, rgba(53,106,230,0.04), transparent 70%)",
        opacity: [0.5, 0.9, 0.7, 0.8, 0.5],
        x: ["0%", "4%", "-3%", "3%", "0%"],
        y: ["0%", "-1%", "4%", "-2%", "0%"],
        duration: 38,
      },
      {
        gradient: "radial-gradient(ellipse at center, rgba(15,118,110,0.04), transparent 65%)",
        opacity: [0.4, 0.8, 0.6, 0.7, 0.4],
        x: ["0%", "-3%", "4%", "-2%", "0%"],
        y: ["0%", "-4%", "1%", "3%", "0%"],
        duration: 50,
      }
    ]
  },
  warm: {
    fields: [
      {
        gradient: "radial-gradient(ellipse at center, rgba(220,180,130,0.05), transparent 70%)",
        opacity: [0.5, 0.9, 0.7, 0.9, 0.5],
        x: ["0%", "4%", "-2%", "3%", "0%"],
        y: ["0%", "-3%", "2%", "-1%", "0%"],
        duration: 40,
      },
      {
        gradient: "radial-gradient(ellipse at center, rgba(255,255,255,0.7), transparent 70%)",
        opacity: [0.6, 0.9, 0.7, 0.8, 0.6],
        x: ["0%", "-3%", "2%", "-2%", "0%"],
        y: ["0%", "2%", "-3%", "1%", "0%"],
        duration: 48,
      }
    ]
  },
  statement: {
    fields: [
      {
        gradient: "radial-gradient(ellipse at center, rgba(255,255,255,0.8), transparent 60%)",
        opacity: [0.7, 1.0, 0.8, 0.9, 0.7],
        x: ["0%", "2%", "-2%", "1%", "0%"],
        y: ["0%", "-2%", "2%", "-1%", "0%"],
        duration: 35,
      },
      {
        gradient: "radial-gradient(ellipse at center, rgba(15,118,110,0.04), transparent 70%)",
        opacity: [0.4, 0.8, 0.6, 0.8, 0.4],
        x: ["0%", "-4%", "3%", "-2%", "0%"],
        y: ["0%", "3%", "-2%", "1%", "0%"],
        duration: 42,
      },
      {
        gradient: "radial-gradient(ellipse at center, rgba(100,116,139,0.03), transparent 70%)",
        opacity: [0.4, 0.8, 0.6, 0.5, 0.4],
        x: ["0%", "3%", "-3%", "2%", "0%"],
        y: ["0%", "-1%", "3%", "-2%", "0%"],
        duration: 55,
      }
    ]
  },
  technical: {
    showGrid: true,
    fields: [
      {
        gradient: "radial-gradient(ellipse at center, rgba(53,106,230,0.04), transparent 70%)",
        opacity: [0.5, 0.8, 0.6, 0.8, 0.5],
        x: ["0%", "-3%", "3%", "-2%", "0%"],
        y: ["0%", "2%", "-3%", "1%", "0%"],
        duration: 45,
      },
      {
        gradient: "radial-gradient(ellipse at center, rgba(15,118,110,0.03), transparent 60%)",
        opacity: [0.3, 0.7, 0.5, 0.7, 0.3],
        x: ["0%", "4%", "-2%", "3%", "0%"],
        y: ["0%", "-3%", "2%", "-1%", "0%"],
        duration: 38,
      }
    ]
  },
  map: {
    showContours: true,
    showGrid: true,
    fields: [
      {
        gradient: "radial-gradient(ellipse at center, rgba(15,118,110,0.06), transparent 70%)",
        opacity: [0.6, 1.0, 0.8, 0.9, 0.6],
        x: ["0%", "3%", "-3%", "2%", "0%"],
        y: ["0%", "-2%", "3%", "-1%", "0%"],
        duration: 42,
      },
      {
        gradient: "radial-gradient(ellipse at center, rgba(100,116,139,0.04), transparent 75%)",
        opacity: [0.4, 0.8, 0.6, 0.8, 0.4],
        x: ["0%", "-4%", "2%", "-3%", "0%"],
        y: ["0%", "3%", "-2%", "2%", "0%"],
        duration: 50,
      }
    ]
  },
  property: {
    showContours: true,
    fields: [
      {
        gradient: "radial-gradient(ellipse at center, rgba(255,255,255,0.7), transparent 70%)",
        opacity: [0.6, 0.9, 0.7, 0.9, 0.6],
        x: ["0%", "-2%", "3%", "-2%", "0%"],
        y: ["0%", "3%", "-2%", "1%", "0%"],
        duration: 40,
      },
      {
        gradient: "radial-gradient(ellipse at center, rgba(15,118,110,0.04), transparent 70%)",
        opacity: [0.4, 0.8, 0.6, 0.8, 0.4],
        x: ["0%", "4%", "-3%", "2%", "0%"],
        y: ["0%", "-2%", "4%", "-1%", "0%"],
        duration: 48,
      },
      {
        gradient: "radial-gradient(ellipse at center, rgba(100,116,139,0.03), transparent 60%)",
        opacity: [0.3, 0.7, 0.5, 0.7, 0.3],
        x: ["0%", "-3%", "2%", "-3%", "0%"],
        y: ["0%", "-3%", "3%", "1%", "0%"],
        duration: 55,
      }
    ]
  },
  transparency: {
    fields: [
      {
        gradient: "radial-gradient(ellipse at center, rgba(255,255,255,0.8), transparent 75%)",
        opacity: [0.7, 1.0, 0.8, 0.9, 0.7],
        x: ["0%", "2%", "-2%", "1%", "0%"],
        y: ["0%", "-2%", "2%", "-1%", "0%"],
        duration: 45,
      },
      {
        gradient: "radial-gradient(ellipse at center, rgba(100,116,139,0.03), transparent 60%)",
        opacity: [0.4, 0.7, 0.5, 0.6, 0.4],
        x: ["0%", "-3%", "3%", "-2%", "0%"],
        y: ["0%", "3%", "-2%", "1%", "0%"],
        duration: 60,
      }
    ]
  },
  "65plus": {
    fields: [
      {
        gradient: "radial-gradient(ellipse at center, rgba(15,118,110,0.05), transparent 75%)",
        opacity: [0.5, 0.9, 0.7, 0.8, 0.5],
        x: ["0%", "-3%", "4%", "-2%", "0%"],
        y: ["0%", "-2%", "3%", "-1%", "0%"],
        duration: 40,
      }
    ]
  },
  "dark-api": {
    showGrid: true,
    fields: [
      {
        gradient: "radial-gradient(ellipse at 75% 40%, rgba(15,118,110,0.18), transparent 60%)",
        opacity: [0.6, 0.9, 0.7, 0.8, 0.6],
        x: ["0%", "3%", "-2%", "4%", "0%"],
        y: ["0%", "-1%", "3%", "-2%", "0%"],
        duration: 45,
      },
      {
        gradient: "radial-gradient(ellipse at 30% 60%, rgba(15,118,110,0.12), transparent 70%)",
        opacity: [0.5, 0.8, 0.6, 0.7, 0.5],
        x: ["0%", "-4%", "3%", "-2%", "0%"],
        y: ["0%", "2%", "-3%", "1%", "0%"],
        duration: 52,
      }
    ]
  },
  neutral: {
    fields: [
      {
        gradient: "radial-gradient(ellipse at center, rgba(255,255,255,0.6), transparent 70%)",
        opacity: [0.6, 0.9, 0.7, 0.8, 0.6],
        x: ["0%", "2%", "-1%", "2%", "0%"],
        y: ["0%", "-1%", "2%", "-1%", "0%"],
        duration: 50,
      },
      {
        gradient: "radial-gradient(ellipse at center, rgba(100,116,139,0.02), transparent 60%)",
        opacity: [0.3, 0.6, 0.4, 0.5, 0.3],
        x: ["0%", "-2%", "3%", "-2%", "0%"],
        y: ["0%", "2%", "-2%", "1%", "0%"],
        duration: 60,
      }
    ]
  },
  cta: {
    fields: [
      {
        gradient: "radial-gradient(ellipse at center, rgba(255,255,255,0.8), transparent 70%)",
        opacity: [0.7, 1.0, 0.8, 0.9, 0.7],
        x: ["0%", "-3%", "2%", "-2%", "0%"],
        y: ["0%", "3%", "-2%", "1%", "0%"],
        duration: 40,
      },
      {
        gradient: "radial-gradient(ellipse at center, rgba(15,118,110,0.08), transparent 65%)",
        opacity: [0.6, 0.9, 0.7, 0.8, 0.6],
        x: ["0%", "4%", "-3%", "2%", "0%"],
        y: ["0%", "-2%", "3%", "-1%", "0%"],
        duration: 48,
      },
      {
        gradient: "radial-gradient(ellipse at center, rgba(100,116,139,0.04), transparent 70%)",
        opacity: [0.4, 0.8, 0.6, 0.7, 0.4],
        x: ["0%", "-2%", "3%", "-1%", "0%"],
        y: ["0%", "-3%", "2%", "-2%", "0%"],
        duration: 55,
      }
    ]
  }
};
