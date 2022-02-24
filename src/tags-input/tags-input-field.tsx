import * as React from 'react'
import { useController, useFormContext } from 'react-hook-form'
import { Tag } from 'react-tag-input'
import { TagsInput } from 'tags-input/tags-input-base'

interface TagsInputFieldProps {
  name: string
  preselectedTags: string[]
}

export function TagsInputField({ name, preselectedTags }: TagsInputFieldProps) {
  const context = useFormContext()
  if (!context) {
    throw new Error('❌ `TagsInputField` must be used within a `FormProvider`')
  }
  const { control } = context
  const { field } = useController({
    name,
    control,
  })

  const [tags, setTags] = React.useState(createTags(field.value))
  const [input, setInput] = React.useState('')

  const handleTagsChange = (tags: Tag[]) => {
    setTags(tags)
    field.onChange(tags.map(tag => tag.id))
  }

  const handleInputChange = (input: string) => {
    // ⚠️ On every input change, update the input state, but also, update the field
    // value. Basically `field.value` should consist of the currently selected tags
    // and the input value. Thanks to this, when user submits the form, the tag that
    // wasn't confirmed by pressing enter will be submitted as well.
    setInput(input)

    // When starting typing, the input value is not yet in the field value, so append it
    // to the end. Then replace the last input value with the new one.
    if (field.value.length === tags.length) {
      field.onChange([...field.value, input])
    } else {
      field.onChange([...field.value.slice(0, -1), input])
    }
  }

  return (
    <TagsInput
      input={input}
      tags={tags}
      onInputChange={handleInputChange}
      onTagsChange={handleTagsChange}
    />
  )
}

export function createTags(suggestions: string[]): Tag[] {
  return suggestions.map(createTag)
}

function createTag(suggestion: string): Tag {
  return {
    id: suggestion,
    text: suggestion,
  }
}
