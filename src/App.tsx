import * as React from 'react'
import { createTags, TagsInput } from 'tags-input/tags-input.controlled'

// import COUNTRIES from './countries.json'

const App = () => {
  const [tags, setTags] = React.useState(createTags(['Switzerland', 'Austria']))

  return (
    <div className="mx-auto mt-12 max-w-sm">
      <TagsInput tags={tags} setTags={setTags} />
      <pre>{JSON.stringify(tags, null, 2)}</pre>
    </div>
  )
}

export default App
