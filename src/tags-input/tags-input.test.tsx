import { Tag } from 'react-tag-input'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { createTags, TagsInput } from 'tags-input'

describe('TagsInput', () => {
  it('should render TagsInput with input value, and all the tags', () => {
    const inputValue = 'input-value'
    const tags = createTags(['tag-1', 'tag-2'])
    setup({ inputValue, tags })

    expect(screen.getByRole('textbox')).toHaveValue(inputValue)
    for (const tag of tags) {
      expect(screen.getByText(tag.text)).toBeInTheDocument()
    }
  })

  it('should call `onInputChange` when typing in input', () => {
    const { onInputChange, type } = setup()

    const newInputValue = 'abc'
    type(newInputValue)
    expect(onInputChange).toHaveBeenCalledTimes(3)
    expect(onInputChange).toHaveBeenNthCalledWith(1, 'a')
    expect(onInputChange).toHaveBeenNthCalledWith(2, 'b')
    expect(onInputChange).toHaveBeenNthCalledWith(3, 'c')
  })

  it('should call `onTagsChange` when clicking on `Add` button and input is empty', () => {
    const { onTagsChange, clickAddButton } = setup({ inputValue: 'a' })

    clickAddButton()

    expect(onTagsChange).toHaveBeenCalledTimes(1)
    expect(onTagsChange).toHaveBeenCalledWith(createTags(['a']))
  })

  it('should call `onTagsChange` without the tag that delete button was clicked', () => {
    const tags = createTags(['tag-1', 'tag-2', 'tag-3'])
    const [tag1, tag2, tag3] = tags
    const { onTagsChange, clickDeleteButtonAtIndex } = setup({ tags })

    clickDeleteButtonAtIndex(0)
    expect(onTagsChange).toHaveBeenCalledWith([tag2, tag3])

    clickDeleteButtonAtIndex(1)
    expect(onTagsChange).toHaveBeenCalledWith([tag1, tag3])

    clickDeleteButtonAtIndex(2)
    expect(onTagsChange).toHaveBeenCalledWith([tag1, tag2])
  })

  it('should NOT call `onTagsChange` nor `onInputChange`, when clicking on `Add` button and input is empty', () => {
    const { onTagsChange, onInputChange, clickAddButton } = setup({
      inputValue: '',
    })

    clickAddButton()

    expect(onTagsChange).not.toHaveBeenCalled()
    expect(onInputChange).not.toHaveBeenCalled()
  })

  describe('when `allowDuplicates=false`', () => {
    it('should NOT call `onTagsChange` nor `onInputChange`, when clicking on `Add` button and input value is already in tags', () => {
      const { onTagsChange, onInputChange, clickAddButton } = setup({
        inputValue: 'duplicated',
        tags: createTags(['duplicated', 'a', 'b', 'c']),
        allowDuplicates: false,
      })

      clickAddButton()

      expect(onTagsChange).not.toHaveBeenCalled()
      expect(onInputChange).not.toHaveBeenCalled()
    })
  })
})

function setup(params?: {
  inputValue?: string
  tags?: Tag[]
  allowDuplicates?: boolean
}) {
  const { inputValue = '', tags = [], allowDuplicates } = params || {}
  const onInputChange = jest.fn()
  const onTagsChange = jest.fn()

  render(
    <TagsInput
      inputValue={inputValue}
      onInputChange={onInputChange}
      tags={tags}
      onTagsChange={onTagsChange}
      allowDuplicates={allowDuplicates}
    />,
  )

  const input = screen.getByRole('textbox')
  const addButton = screen.getByRole('button', {
    name: /add/i,
  })

  const type = (text: string) => userEvent.type(input, text)
  const clearInput = () => userEvent.clear(input)
  const clickAddButton = () => userEvent.click(addButton)
  const getDeleteButtonAtIndex = (i: number) =>
    screen.getByRole('button', {
      name: new RegExp(`Tag at index ${i}.*`, 'i'),
    })
  const clickDeleteButtonAtIndex = (i: number) =>
    userEvent.click(getDeleteButtonAtIndex(i))

  return {
    addButton,
    clearInput,
    clickAddButton,
    clickDeleteButtonAtIndex,
    input,
    onInputChange,
    onTagsChange,
    type,
  }
}
