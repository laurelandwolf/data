# data

Laurel & Wolf Cowboy Data

![data_star_trek](https://cloud.githubusercontent.com/assets/974723/9012467/fd3ec36e-3769-11e5-8525-a4e9536a533e.jpg)

## Install

```
npm install lw-data --save
```

## Usage

```js
import {sdk, serialize} from 'lw-data';

let api = sdk({
  headers: {
    custom : 'header'
  }
});

api()
  .getProjects()
  .then(res => {

    let resources = serialize.response(res.body);
    console.log(resources);
  });
```

