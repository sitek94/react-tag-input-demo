import * as React from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { TagsInputField } from 'tags-input/tags-input-field'

const FIELD_NAME = 'my-tags'

function TestForm({
  onSubmit,
  defaultFieldValue,
  children,
}: {
  onSubmit: any
  defaultFieldValue: any
  children: React.ReactNode
}) {
  const methods = useForm({
    defaultValues: {
      [FIELD_NAME]: defaultFieldValue,
    },
  })
  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)}>{children}</form>
    </FormProvider>
  )
}

function setup({
  defaultFieldValue,
  preselectedTags,
}: {
  defaultFieldValue: string[]
  preselectedTags: string[]
}) {
  const onSubmit = jest.fn()

  render(
    <TestForm onSubmit={onSubmit} defaultFieldValue={defaultFieldValue}>
      <TagsInputField name={FIELD_NAME} preselectedTags={preselectedTags} />
    </TestForm>,
  )

  const addButton = screen.getByRole('button', { name: 'Add' })
  const input = screen.getByRole('textbox')

  const clickAddButton = () => userEvent.click(addButton)
  const typeInInput = (value: string) => userEvent.type(input, value)
  const getByText = (text: string) => screen.getByText(text)

  return { onSubmit, clickAddButton, typeInInput, getByText }
}

describe('TagsInputField', () => {
  it('should throw when used out of `FormProvider` context', () => {
    // Mock `console.error` to avoid error logs in all the tests output since,
    // we're intentionally throwing error here.
    const consoleErrorSpy = jest
      .spyOn(console, 'error')
      .mockImplementation(jest.fn())

    expect(() =>
      render(<TagsInputField name="test-name" preselectedTags={[]} />),
    ).toThrow()

    // Clean up `console.error` mock.
    consoleErrorSpy.mockRestore()
  })

  it('should render `preselectedTags`', () => {
    const { getByText } = setup({
      defaultFieldValue: [],
      preselectedTags: ['Switzerland', 'France'],
    })

    expect(getByText('Switzerland')).toBeInTheDocument()
    expect(getByText('France')).toBeInTheDocument()
  })

  it('should  `preselectedTags`', () => {
    const { getByText } = setup({
      defaultFieldValue: [],
      preselectedTags: ['Switzerland', 'France'],
    })

    expect(getByText('Switzerland')).toBeInTheDocument()
    expect(getByText('France')).toBeInTheDocument()
  })
})
