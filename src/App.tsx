import * as React from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { createTags, TagsInput } from 'tags-input'
import { TagsInputField } from 'tags-input/tags-input-field'

import COUNTRIES from './countries.json'

const DEFAULT_TAGS = ['Mexico', 'Canada', 'United States']

const App = () => {
  return (
    <main className="mx-auto mt-12 max-w-md space-y-8">
      <div className="prose">
        <h1>React Tags Input Demo</h1>
        <hr />
        <h2>
          <code>TagsInput</code>
        </h2>
        <p>
          Styled version of the example shown in{' '}
          <a
            target="_blank"
            href="https://github.com/react-tags/react-tags"
            rel="noreferrer"
          >
            React tags docs
          </a>
        </p>
      </div>
      <TagsInputExample />
      <hr />
      <div className="prose">
        <h2>
          <code>TagsInputField</code>
        </h2>
        <p>
          <code>TagsInput</code> integrated with{' '}
          <a
            target="_blank"
            href="https://react-hook-form.com/"
            rel="noreferrer"
          >
            React Hook Form
          </a>
        </p>
      </div>
      <TagsInputFieldExample />
    </main>
  )
}

function TagsInputExample() {
  const [input, setInput] = React.useState('')
  const [tags, setTags] = React.useState(createTags(DEFAULT_TAGS))
  return (
    <TagsInput
      inputValue={input}
      tags={tags}
      onTagsChange={setTags}
      onInputChange={setInput}
      suggestions={COUNTRIES}
    />
  )
}

function TagsInputFieldExample() {
  const [formData, setFormData] = React.useState()

  const tagsFieldName = 'my-tags'
  const methods = useForm({
    defaultValues: {
      [tagsFieldName]: DEFAULT_TAGS,
    },
  })

  const onSubmit = data => setFormData(data)

  const currentFormState = methods.watch()

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)}>
        <TagsInputField name="my-tags" allowDuplicates />
        <button
          type="submit"
          className="mt-2 rounded-lg bg-blue-500 p-2 text-white"
        >
          Submit
        </button>
      </form>
      <div className="prose grid grid-cols-2 items-stretch gap-2">
        <div>
          <h3>Current form state</h3>
          <pre>{JSON.stringify(currentFormState, null, 2)}</pre>
        </div>
        <div>
          <h3>Submitted form data</h3>
          <pre>{JSON.stringify(formData, null, 2)}</pre>
        </div>
      </div>
    </FormProvider>
  )
}

export default App
