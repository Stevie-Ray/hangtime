import grades from './gradeMap'

// eslint-disable-next-line consistent-return
export default function(grade, system, desiredGrade) {
  const errors = []

  if (!grade) errors.push('grade')
  if (!system) errors.push('system')

  if (errors.length > 0) {
    throw new Error(`${errors.join(' and ')} are required.`)
  }

  // eslint-disable-next-line no-shadow
  const gradeSet = grades.data.find(gradeSet => gradeSet[system] === grade)

  if (gradeSet) {
    if (desiredGrade) {
      if (gradeSet[desiredGrade].constructor === Array) {
        return gradeSet[desiredGrade].join(' / ')
      }
      return gradeSet[desiredGrade]
    }
    return gradeSet
  }
}
