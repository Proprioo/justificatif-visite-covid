import 'bootstrap/dist/css/bootstrap.min.css'

import '../css/main.css'

import formData from '../form-data.json'

import { $, appendTo, createElement } from './dom-utils'

const createTitleForm = (titleForm) => {
  return createElement('h3', {
    className: 'sous-titre',
    innerHTML: titleForm,
  })
}

const createFormGroup = ({
  autocomplete = false,
  autofocus = false,
  inputmode,
  label,
  max,
  min,
  maxlength,
  minlength,
  name,
  pattern,
  placeholder = '',
  type = 'text',
}) => {
  const formGroup = createElement('div', { className: 'form-group' })
  const labelAttrs = {
    for: `field-${name}`,
    id: `field-${name}-label`,
    innerHTML: label,
  }
  const labelEl = createElement('label', labelAttrs)

  const inputGroup = createElement('div', {
    className: 'input-group align-items-center',
  })
  const inputAttrs = {
    autocomplete,
    autofocus,
    className: 'form-control',
    id: `field-${name}`,
    inputmode,
    min,
    max,
    minlength,
    maxlength,
    name,
    pattern,
    placeholder,
    required: false,
    type,
  }

  const input = createElement('input', inputAttrs)

  const validityAttrs = {
    className: 'validity',
  }
  const validity = createElement('span', validityAttrs)

  const example = createElement('p', { className: 'exemple  basis-100' })

  const appendToFormGroup = appendTo(formGroup)
  appendToFormGroup(labelEl)
  appendToFormGroup(inputGroup)

  const appendToInputGroup = appendTo(inputGroup)
  appendToInputGroup(input)
  appendToInputGroup(validity)
  appendToInputGroup(example)

  return formGroup
}

export function createForm() {
  const form = $('#form-profile')
  // Évite de recréer le formulaire s'il est déjà créé par react-snap (ou un autre outil de prerender)
  if (form.innerHTML !== '') {
    return
  }

  const appendToForm = appendTo(form)

  const formReduced = formData
    .reduce((acc, group) => {
      const formFields = group
        .filter((field) => field.key !== 'reason')
        .filter((field) => !field.isHidden)
        .map((field, index) => {
          if (field.type === 'title') {
            return createTitleForm(field.key)
          } else {
            const formGroup = createFormGroup({
              autofocus: index === 1,
              ...field,
              name: field.key,
            })

            return formGroup
          }
        })

      acc.push(formFields)
      return acc
    }, [])
    .map((part) => {
      const [first, ...rest] = part
      const line = createElement('section', {
        className: 'row',
      })
      rest.forEach((item, index) => {
        line.appendChild(item)
      })
      return [first, line]
    })

  appendToForm(formReduced.flat(1))
}
