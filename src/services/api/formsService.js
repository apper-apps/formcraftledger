import formsData from "@/services/mockData/forms.json"

// Simulate API delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

let forms = [...formsData]

export const formsService = {
  async getAll() {
    await delay(300)
    return [...forms]
  },

  async getById(id) {
    await delay(200)
    const form = forms.find(f => f.Id === parseInt(id))
    return form ? { ...form } : null
  },

  async create(formData) {
    await delay(400)
    const newId = Math.max(...forms.map(f => f.Id), 0) + 1
    const newForm = {
      ...formData,
      Id: newId,
      createdAt: new Date().toISOString(),
      publishedUrl: `https://formcraft.app/forms/${newId}`
    }
    forms.push(newForm)
    return { ...newForm }
  },

  async update(id, updates) {
    await delay(350)
    const index = forms.findIndex(f => f.Id === parseInt(id))
    if (index !== -1) {
      forms[index] = { ...forms[index], ...updates }
      return { ...forms[index] }
    }
    return null
  },

  async delete(id) {
    await delay(250)
    const index = forms.findIndex(f => f.Id === parseInt(id))
    if (index !== -1) {
      const deleted = forms.splice(index, 1)[0]
      return { ...deleted }
    }
    return null
  }
}