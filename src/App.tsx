import * as React from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { createTags, TagsInput } from 'tags-input'
import { TagsInputField } from 'tags-input/tags-input-field'

const App = () => {
  const [formData, setFormData] = React.useState()
  const tagsFieldName = 'my-tags'
  const defaultTags = ['Switzerland', 'Austria', 'France']
  const methods = useForm({
    defaultValues: {
      [tagsFieldName]: defaultTags,
    },
  })
  const { handleSubmit } = methods
  const onSubmit = data => setFormData(data)

  const [input, setInput] = React.useState('initial')
  const [tags, setTags] = React.useState(createTags(defaultTags))

  return (
    <div className="mx-auto mt-12 max-w-sm">
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <TagsInputField name="my-tags" allowDuplicates />
          <button
            type="submit"
            className="mt-2 rounded-lg bg-blue-500 p-2 text-white"
          >
            Submit
          </button>
        </form>
      </FormProvider>
      <pre>{JSON.stringify(formData, null, 2)}</pre>
      <hr />
      <TagsInput
        inputValue={input}
        tags={tags}
        onTagsChange={setTags}
        onInputChange={setInput}
      />
    </div>
  )
}

export default App
