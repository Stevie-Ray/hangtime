'use strict'

import grades from './gradeMap'

export default function(grade, system, desiredGrade) {
  const errors = []

  if (!grade) errors.push('grade')
  if (!system) errors.push('system')

  if (errors.length > 0) {
    throw new Error(`${errors.join(' and ')} are required.`)
  }

  const gradeSet = grades.data.find(gradeSet => gradeSet[system] === grade)

  if (gradeSet) {
    if (desiredGrade) return gradeSet[desiredGrade]
    return gradeSet
  }
}
