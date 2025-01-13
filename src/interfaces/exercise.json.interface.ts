type MuscleGroup =
  | 'abdominals'
  | 'abductors'
  | 'adductors'
  | 'biceps'
  | 'calves'
  | 'chest'
  | 'forearms'
  | 'glutes'
  | 'hamstrings'
  | 'lats'
  | 'lower back'
  | 'middle back'
  | 'neck'
  | 'quadriceps'
  | 'shoulders'
  | 'traps'
  | 'triceps'

/**
 * Open Public Domain Exercise Dataset in JSON format, 800+ exercises
 * https://github.com/yuhonas/free-exercise-db/
 */
export interface ExerciseJson {
  id: string
  name: string
  force: 'static' | 'pull' | 'push' | null
  level: 'beginner' | 'intermediate' | 'expert'
  mechanic: 'isolation' | 'compound' | null
  equipment:
    | 'medicine ball'
    | 'dumbbell'
    | 'body only'
    | 'bands'
    | 'kettlebells'
    | 'foam roll'
    | 'cable'
    | 'machine'
    | 'barbell'
    | 'exercise ball'
    | 'e-z curl bar'
    | 'other'
    | null
  primaryMuscles: MuscleGroup[]
  secondaryMuscles: MuscleGroup[]
  instructions: string[]
  category:
    | 'powerlifting'
    | 'strength'
    | 'stretching'
    | 'cardio'
    | 'olympic weightlifting'
    | 'strongman'
    | 'plyometrics'
  images: string[]
}
