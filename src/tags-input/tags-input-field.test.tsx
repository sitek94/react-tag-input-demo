import * as React from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { TagsInputField } from 'tags-input/tags-input-field'
import MockedFn = jest.MockedFn

describe('TagsInputField', () => {
  it('should throw when used out of `FormProvider` context', () => {
    // Mock `console.error` to avoid error logs in all the tests output since,
    // we're intentionally throwing error here.
    const consoleErrorSpy = jest
      .spyOn(console, 'error')
      .mockImplementation(jest.fn())

    expect(() => render(<TagsInputField name="test-name" />)).toThrow()

    // Clean up `console.error` mock.
    consoleErrorSpy.mockRestore()
  })

  it('should render `preselectedTags`', () => {
    const { getByText } = setup({
      defaultFieldValue: ['Switzerland', 'France'],
    })

    expect(getByText('Switzerland')).toBeInTheDocument()
    expect(getByText('France')).toBeInTheDocument()
  })

  it('submits the form with preselected tags', async () => {
    const preselectedTags = ['Switzerland', 'France']
    const { submit, getNthSubmittedValue } = setup({
      defaultFieldValue: preselectedTags,
    })

    submit()
    await waitForStateUpdate()

    expect(getNthSubmittedValue(1)).toEqual(preselectedTags)
  })

  it(
    'should submit the form with `preselectedTags` and input value,' +
      'then after confirming the tag, it should submit the form with the same value ',
    async () => {
      const preselectedTags = ['Switzerland', 'France']
      const { submit, getNthSubmittedValue, type } = setup({
        defaultFieldValue: preselectedTags,
      })

      const inputValue = 'Italy'
      const expected = [...preselectedTags, inputValue]

      // First submission, tag is still in the input (not added)
      type(inputValue)
      submit()
      await waitForStateUpdate()
      expect(getNthSubmittedValue(1)).toEqual(expected)

      // Second submission, tag is added after hitting ENTER
      type('{enter}')
      submit()
      await waitForStateUpdate()
      expect(getNthSubmittedValue(2)).toEqual(expected)
    },
  )

  it(`should consecutively submit tags with input value, unless input is empty string`, async () => {
    const tags = ['foo', 'bar']
    const { submit, getNthSubmittedValue, type } = setup({
      defaultFieldValue: tags,
    })

    type('a')
    submit()
    await waitForStateUpdate()
    expect(getNthSubmittedValue(1)).toEqual([...tags, 'a'])

    type('b')
    submit()
    await waitForStateUpdate()
    expect(getNthSubmittedValue(2)).toEqual([...tags, 'ab'])

    type('{backspace}')
    submit()
    await waitForStateUpdate()
    expect(getNthSubmittedValue(3)).toEqual([...tags, 'a'])

    type('{backspace}')
    submit()
    await waitForStateUpdate()
    expect(getNthSubmittedValue(4)).toEqual(tags)
  })

  it('should NOT submit duplicates, when `allowDuplicates=false` (default behavior)', async () => {
    const tags = ['baz']
    const { submit, getNthSubmittedValue, type } = setup({
      defaultFieldValue: tags,
    })

    type('baz')
    submit()
    await waitForStateUpdate()
    expect(getNthSubmittedValue(1)).toEqual(tags)
  })

  it('should allow submitting duplicates, when `allowDuplicates=true`', async () => {
    const tags = ['baz']
    const { submit, getNthSubmittedValue, type } = setup({
      defaultFieldValue: tags,
      allowDuplicates: true,
    })

    type('baz')
    submit()
    await waitForStateUpdate()
    expect(getNthSubmittedValue(1)).toEqual(['baz', 'baz'])
  })
})

const FIELD_NAME = 'my-tags'

function TestForm({
  onSubmit,
  defaultFieldValue,
  allowDuplicates,
}: {
  onSubmit: MockedFn<any>
  defaultFieldValue?: string[]
  allowDuplicates?: boolean
}) {
  const methods = useForm({
    defaultValues: {
      [FIELD_NAME]: defaultFieldValue,
    },
  })

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)}>
        <TagsInputField name={FIELD_NAME} allowDuplicates={allowDuplicates} />
        <button data-testid="submit" type="submit">
          Submit
        </button>
      </form>
    </FormProvider>
  )
}

function setup({
  defaultFieldValue,
  allowDuplicates = false,
}: {
  defaultFieldValue: string[]
  allowDuplicates?: boolean
}) {
  const onSubmit = jest.fn()
  render(
    <TestForm
      onSubmit={onSubmit}
      defaultFieldValue={defaultFieldValue}
      allowDuplicates={allowDuplicates}
    />,
  )

  const submitButton = screen.getByTestId('submit')
  const addButton = screen.getByRole('button', { name: 'Add' })
  const input = screen.getByRole('textbox')

  const clickAddButton = () => userEvent.click(addButton)
  const type = (value: string) => userEvent.type(input, value)
  const clearInput = () => userEvent.clear(input)
  const getByText = (text: string) => screen.getByText(text)
  const submit = () => userEvent.click(submitButton)
  const getNthSubmittedValue = (n: number) =>
    onSubmit.mock.calls[n - 1][0][FIELD_NAME]

  return {
    onSubmit,
    clickAddButton,
    type,
    getByText,
    submit,
    getNthSubmittedValue,
    clearInput,
  }
}

/**
 * Tiny helper to avoid having to wrap `expect` in `await waitFor(() => ...)`
 */
async function waitForStateUpdate() {
  await waitFor(async () => Promise.resolve())
}
