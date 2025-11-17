export function verifyBirthDate(birthDate: string | Date): boolean {

    const date = new Date(birthDate)
  
    if (isNaN(date.getTime())) return false
  
    const today = new Date()
    if (date > today) return false
  
    const minAge = 12
    const minDate = new Date(today.getFullYear() - minAge, today.getMonth(), today.getDate())
    if (date > minDate) return false
  
    return true
}
  
export function verifyPassword(password: string): boolean {
  
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>_\-+=])[A-Za-z\d!@#$%^&*(),.?":{}|<>_\-+=]{6,}$/
  
    return regex.test(password)
}

export function verifyCPF(cpf: string): boolean {

    const cleanedCPF = cpf.replace(/\D/g, '')
  
    const regex = /^[0-9]{11}$/
  
    return regex.test(cleanedCPF)
}


export function verifyUsername(username: string): boolean {

    if (username.length > 20) {
      return false
    }
  
    const regex = /^[A-Za-z0-9._]+$/
  
    return regex.test(username)
  }
  