import * as React from 'react'
import { FormProvider, useForm } from 'react-hook-form'
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

  return (
    <div className="mx-auto mt-12 max-w-sm">
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <TagsInputField name="my-tags" />
          <button
            type="submit"
            className="mt-2 rounded-lg bg-blue-500 p-2 text-white"
          >
            Submit
          </button>
        </form>
      </FormProvider>
      <pre>{JSON.stringify(formData, null, 2)}</pre>
    </div>
  )
}

export default App
