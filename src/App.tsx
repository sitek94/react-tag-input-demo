import * as React from 'react';
import { TagsInput } from 'tags-input';

import COUNTRIES from './countries.json';

const App = () => {
  return (
    <div className="mx-auto mt-12 max-w-sm">
      <TagsInput
        selected={['Switzerland', 'Austria']}
        suggestions={COUNTRIES}
      />
    </div>
  );
};

export default App;
