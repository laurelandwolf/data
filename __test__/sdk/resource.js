import mockFetch from 'mock-fetch'
import {namespace} from 'tessed'

import resource from '../../src/sdk/resource'

let test = namespace('resource')
test.getAll = test.namespace('get all')
test.getAll.next = test.getAll.namespace('NEXT')
test.getOne = test.namespace('get one')
test.getOne.next = test.getOne.namespace('NEXT')
test.creating = test.namespace('creating')
test.creating.next = test.creating.namespace('NEXT')
test.updating = test.namespace('updating')
test.updating.next = test.updating.namespace('NEXT')
test.deleting = test.namespace('deleting')
test.deleting.next = test.deleting.namespace('NEXT')
test.query = test.namespace('query')
test.query.next = test.query.namespace('NEXT')
test.singleton = test.namespace('singleton')
test.singleton.next = test.singleton.namespace('NEXT')

let projects

test.beforeEach(() => {

  mockFetch.mock()

  let projects = resource({
    type: 'projects'
  }, {
    headers: {
      custom: 'header'
    }
  })

  return {
    projects
  }
})

test.afterEach(() => mockFetch.restore())

test('excludes "?" if no query string', ({equal, context}) => {

  return context.projects.getProjects()
    .then((res) => {

      let req = mockFetch.request()

      equal(req.url, '/projects', 'url')
    })
})

test.getAll('no querystring', ({equal, context}) => {

  return context.projects.getProjects()
    .then((res) => {

      let req = mockFetch.request()

      equal(req.url, '/projects', 'url')
      equal(req.method, 'GET', 'method')
    })
})

test.getAll.next('no querystring', ({context, equal}) => {

	let __ = context.projects

	return __
		.projects()
		.get()
		.then(res => {

			let req = mockFetch.request()

			equal(req.url, '/projects', 'url')
			equal(req.method, 'GET', 'method')
		})
})

test.getAll('sends global headers', ({deepEqual, context}) => {

  return context.projects.getProjects().then((res) => {

    let req = mockFetch.request()

    deepEqual(req.headers, {
      custom: 'header'
    }, 'headers')
  })
})

test.getAll.next('sends global headers', ({deepEqual, context}) => {

  return context.projects.projects().get().then(res => {

    let req = mockFetch.request()

    deepEqual(req.headers, {
      custom: 'header'
    }, 'headers')
  })
})

// TODO: implement this if needed
test.getAll.next.skip('passes in options per resource', ({context, deepEqual}) => {

	let __ = context.projects
	let opts = {
		headers: {
			another: 'one'
		}
	}

	return __.projects(opts).get().then(res => {

		let req = mockFetch.request()

		deepEqual(req.headers, {
		  custom: 'header',
		  another: 'one'
		}, 'headers')
	})

})

test.getAll('with relationships', ({context, equal}) => {

  return context.projects
    .getProjects()
    .include('rooms', 'friends', 'rooms.inspirationLinks')
    .include({another: ['thing', 'isHere']})
    .then((res) => {

      let req = mockFetch.request()

      equal(
        req.url,
        '/projects?include=rooms,friends,rooms.inspiration-links,another.thing,another.is-here',
        'url'
      )
    })
})

test.getAll.next('with relationships', ({context, equal}) => {

  return context.projects
    .projects()
    .get()
    .include('rooms', 'friends', 'rooms.inspirationLinks')
    .include({another: ['thing', 'isHere']})
    .then((res) => {

      let req = mockFetch.request()

      equal(
        req.url,
        '/projects?include=rooms,friends,rooms.inspiration-links,another.thing,another.is-here',
        'url'
      )
    })
})

test.getAll('with sparse fieldsets', ({context, equal}) => {

  return context.projects
    .getProjects()
    .fields({'rooms': ['title', 'location']})
    .fields({'rooms': ['test']})
    .fields({'test': ['one']}, {'test': ['two']})
    .then((res) => {

      let req = mockFetch.request()

      equal(
        req.url,
        '/projects?fields[rooms]=title,location,test&fields[test]=one,two',
        'url'
      )
    })
})

test.getAll.next('with sparse fieldsets', ({context, equal}) => {

  return context.projects
    .projects()
    .get()
    .fields({'rooms': ['title', 'location']})
    .fields({'rooms': ['test']})
    .fields({'test': ['one']}, {'test': ['two']})
    .then((res) => {

      let req = mockFetch.request()

      equal(
        req.url,
        '/projects?fields[rooms]=title,location,test&fields[test]=one,two',
        'url'
      )
    })
})

test.getAll('with sparse fieldsets from alternate formatting', ({context, equal}) => {

  return context.projects
    .getProjects()
    .fields('rooms.inspiriationLinks', 'rooms.title')
    .then((res) => {

      let req = mockFetch.request()

      equal(
        req.url,
        '/projects?fields[rooms]=inspiriation-links,title',
        'url'
      )
    })
})

test.getAll.next('with sparse fieldsets from alternate formatting', ({context, equal}) => {

  return context.projects
    .projects()
    .get()
    .fields('rooms.inspiriationLinks', 'rooms.title')
    .then((res) => {

      let req = mockFetch.request()

      equal(
        req.url,
        '/projects?fields[rooms]=inspiriation-links,title',
        'url'
      )
    })
})

test.getAll('snakeCases sparse fieldsets', ({equal, context}) => {

  return context.projects
    .getProjects()
    .fields('testField.testValue')
    .then((res) => {

      let req = mockFetch.request()

      equal(
        req.url,
        '/projects?fields[test-field]=test-value',
        'url'
      )
    })
})

test.getAll.next('snakeCases sparse fieldsets', ({equal, context}) => {

  return context.projects
    .projects()
    .get()
    .fields('testField.testValue')
    .then((res) => {

      let req = mockFetch.request()

      equal(
        req.url,
        '/projects?fields[test-field]=test-value',
        'url'
      )
    })
})

test.getAll('with sort', ({context, equal}) => {

  return context.projects
    .getProjects()
    .sort('-createdAt', 'updatedAt')
    .then((res) => {

      let req = mockFetch.request()

      equal(req.url, '/projects?sort=-created-at,updated-at', 'url')
    })
})

test.getAll.next('with sort', ({context, equal}) => {

  return context.projects
    .projects()
    .get()
    .sort('-createdAt', 'updatedAt')
    .then((res) => {

      let req = mockFetch.request()

      equal(req.url, '/projects?sort=-created-at,updated-at', 'url')
    })
})

test.getOne('no querystring', ({context, equal}) => {

  return context.projects
    .getProject(123)
    .then((res) => {

      let req = mockFetch.request()

      equal(req.url, '/projects/123', 'url')
      equal(req.method, 'GET', 'method')
    })
})

test.getOne.next('no querystring', ({context, equal}) => {

  return context.projects
  	.projects()
    .get(123)
    .then((res) => {

      let req = mockFetch.request()

      equal(req.url, '/projects/123', 'url')
      equal(req.method, 'GET', 'method')
    })
})

test.getOne('sends global headers', ({context, deepEqual}) => {

  return context.projects.getProject(1).then((res) => {

    let req = mockFetch.request()

    deepEqual(req.headers, {
      custom: 'header'
    }, 'headers')
  })
})

test.getOne.next('sends global headers', ({context, deepEqual}) => {

  return context.projects.projects().get(1).then((res) => {

    let req = mockFetch.request()

    deepEqual(req.headers, {
      custom: 'header'
    }, 'headers')
  })
})

test.getOne('with relationships', ({context, equal}) => {

  return context.projects
    .getProject(123)
    .include('rooms', 'friends')
    .then((res) => {

      let req = mockFetch.request()

      equal(req.url, '/projects/123?include=rooms,friends', 'url')
    })
})

test.getOne.next('with relationships', ({context, equal}) => {

  return context.projects
  	.projects()
    .get(123)
    .include('rooms', 'friends')
    .then((res) => {

      let req = mockFetch.request()

      equal(req.url, '/projects/123?include=rooms,friends', 'url')
    })
})

test.getOne('with sparse fieldsets', ({context, equal}) => {

  return context.projects
    .getProject(123)
    .fields({'rooms': ['title', 'location']})
    .then((res) => {

      let req = mockFetch.request()

      equal(req.url, '/projects/123?fields[rooms]=title,location', 'url')
    })
})

test.getOne.next('with sparse fieldsets', ({context, equal}) => {

  return context.projects
  	.projects()
    .get(123)
    .fields({'rooms': ['title', 'location']})
    .then((res) => {

      let req = mockFetch.request()

      equal(req.url, '/projects/123?fields[rooms]=title,location', 'url')
    })
})

test.getOne('with sort', ({context, equal}) => {

  return context.projects
    .getProject(123)
    .sort('-createdAt', 'updatedAt')
    .then((res) => {

      let req = mockFetch.request()
      equal(req.url, '/projects/123?sort=-created-at,updated-at', 'url')
    })
})

test.getOne.next('with sort', ({context, equal}) => {

  return context.projects
  	.projects()
    .get(123)
    .sort('-createdAt', 'updatedAt')
    .then((res) => {

      let req = mockFetch.request()
      equal(req.url, '/projects/123?sort=-created-at,updated-at', 'url')
    })
})

test.creating('uses POST method', ({context, equal}) => {

  return context.projects.createProject({
    title: 'My Project',
    location: 'Room'
  })
    .then(() => {

      let req = mockFetch.request()
      equal(req.method, 'POST', 'method')
    })
})

test.creating.next('uses POST method', ({context, equal}) => {

  return context.projects
  	.projects()
	  .create({
	    title: 'My Project',
	    location: 'Room'
	  })
    .then(() => {

      let req = mockFetch.request()
      equal(req.method, 'POST', 'method')
    })
})

test.creating('sends global headers', ({context, deepEqual}) => {

  return context.projects.createProject({}).then((res) => {

    let req = mockFetch.request()
    deepEqual(req.headers, {
      custom: 'header'
    }, 'headers')
  })
})

test.creating.next('sends global headers', ({context, deepEqual}) => {

  return context.projects
  	.projects()
	  .create({})
	  .then((res) => {

	    let req = mockFetch.request()
	    deepEqual(req.headers, {
	      custom: 'header'
	    }, 'headers')
	  })
})

test.creating('new', ({equal, context}) => {

  return context.projects.createProject({
    title: 'My Project',
    location: 'Room'
  })
    .then((res) => {

      let req = mockFetch.request()

      equal(req.body, JSON.stringify({
        data: {
          type: 'projects',
          attributes: {
            title: 'My Project',
            location: 'Room'
          }
        }
      }), 'body')
    })
})

test.creating.next('new', ({equal, context}) => {

  return context.projects.projects().create({
    title: 'My Project',
    location: 'Room'
  })
    .then((res) => {

      let req = mockFetch.request()

      equal(req.body, JSON.stringify({
        data: {
          type: 'projects',
          attributes: {
            title: 'My Project',
            location: 'Room'
          }
        }
      }), 'body')
    })
})

test.creating('with relationships', ({context, deepEqual}) => {

  return context.projects
    .createProject({
      title: 'My Project'
    })
    .relatedTo({
      user: 123,
      something: {
        type: 'test',
        id: 456
      }
    })
      .then((res) => {

        let req = mockFetch.request()

        deepEqual(JSON.parse(req.body), {
          data: {
            type: 'projects',
            attributes: {
              title: 'My Project'
            },
            relationships: {
              user: {
                data: {
                  type: 'users',
                  id: 123
                }
              },
              something: {
                data: {
                  type: 'test',
                  id: 456
                }
              }
            }
          }
        }, 'request body')
      })
})

test.creating.next('with relationships', ({context, deepEqual}) => {

  return context.projects
  	.projects()
    .create({
      title: 'My Project'
    })
    .relatedTo({
      user: 123,
      something: {
        type: 'test',
        id: 456
      }
    })
      .then((res) => {

        let req = mockFetch.request()

        deepEqual(JSON.parse(req.body), {
          data: {
            type: 'projects',
            attributes: {
              title: 'My Project'
            },
            relationships: {
              user: {
                data: {
                  type: 'users',
                  id: 123
                }
              },
              something: {
                data: {
                  type: 'test',
                  id: 456
                }
              }
            }
          }
        }, 'request body')
      })
})

test.creating('relationship with id as a string', function ({context, deepEqual}) {

  return context.projects
    .createProject({
      title: 'My Project'
    })
    .relatedTo({
      project: '123'
    })
      .then((res) => {

        let req = mockFetch.request()

        deepEqual(JSON.parse(req.body), {
          data: {
            type: 'projects',
            attributes: {
              title: 'My Project'
            },
            relationships: {
              project: {
                data: {
                  type: 'projects',
                  id: '123'
                }
              }
            }
          }
        }, 'request body')
      })
})

test.creating.next('relationship with id as a string', function ({context, deepEqual}) {

  return context.projects
  	.projects()
    .create({
      title: 'My Project'
    })
    .relatedTo({
      project: '123'
    })
      .then((res) => {

        let req = mockFetch.request()

        deepEqual(JSON.parse(req.body), {
          data: {
            type: 'projects',
            attributes: {
              title: 'My Project'
            },
            relationships: {
              project: {
                data: {
                  type: 'projects',
                  id: '123'
                }
              }
            }
          }
        }, 'request body')
      })
})

test.creating('bulk and with relationships', function ({equal, deepEqual}) {

  let thing = resource({
    type: 'submission-style-board-tags'
  }, {
    bulk: true
  })

  return thing
    .createSubmissionStyleBoardTags([
      {body: 'body1', position: '1'},
      {body: 'body2', position: '2'}
    ])
    .relatedTo({
      submission: {type: 'submission-style-boards', id: '123'}
    })
      .then(res => {

        let responseBody = JSON.parse(res.body.body)

        equal(responseBody.data.length, 2, 'data is an array')
        deepEqual(responseBody.data[0].attributes, {
          body: 'body1',
          position: '1'
        }, 'first resource attributes')
        deepEqual(responseBody.data[0].relationships, {
          submission: {
            data: {type: 'submission-style-boards', id: '123'}
          }
        }, 'first resource relationships')
        equal(responseBody.data[1].type, 'submission-style-board-tags', 'second resource type')
      })
})

test.creating.next('bulk and with relationships', function ({equal, deepEqual}) {

  let thing = resource({
    type: 'submission-style-board-tags'
  }, {
    bulk: true
  })

  return thing
  	.submissionStyleBoardTags()
    .create([
      {body: 'body1', position: '1'},
      {body: 'body2', position: '2'}
    ])
    .relatedTo({
      submission: {type: 'submission-style-boards', id: '123'}
    })
      .then(res => {

        let responseBody = JSON.parse(res.body.body)

        equal(responseBody.data.length, 2, 'data is an array')
        deepEqual(responseBody.data[0].attributes, {
          body: 'body1',
          position: '1'
        }, 'first resource attributes')
        deepEqual(responseBody.data[0].relationships, {
          submission: {
            data: {type: 'submission-style-boards', id: '123'}
          }
        }, 'first resource relationships')
        equal(responseBody.data[1].type, 'submission-style-board-tags', 'second resource type')
      })
})

test.creating('bulk and with relationships shorthand', function ({equal, deepEqual}) {

  let thing = resource({
    type: 'submission-style-board-tags'
  }, {
    bulk: true
  })

  return thing
    .createSubmissionStyleBoardTags([
      {body: 'body1', position: '1'},
      {body: 'body2', position: '2'}
    ])
    .relatedTo({
      submission: '123'
    }).
      then(res => {

        let responseBody = JSON.parse(res.body.body)
        deepEqual(responseBody.data[0].relationships, {
          submission: {
            data: {type: 'submissions', id: '123'}
          }
        }, 'first resource relationships')
      })
})

test.creating.next('bulk and with relationships shorthand', function ({equal, deepEqual}) {

  let thing = resource({
    type: 'submission-style-board-tags'
  }, {
    bulk: true
  })

  return thing
  	.submissionStyleBoardTags()
    .create([
      {body: 'body1', position: '1'},
      {body: 'body2', position: '2'}
    ])
    .relatedTo({
      submission: '123'
    }).
      then(res => {

        let responseBody = JSON.parse(res.body.body)
        deepEqual(responseBody.data[0].relationships, {
          submission: {
            data: {type: 'submissions', id: '123'}
          }
        }, 'first resource relationships')
      })
})

test.updating('uses PATCH method', ({context, equal}) => {

  return context.projects.updateProject(1, {}).then((res) => {

    let req = mockFetch.request()
    equal(req.method, 'PATCH', 'method')
  })
})

test.updating.next('uses PATCH method', ({context, equal}) => {

  return context.projects.projects().update(1, {}).then((res) => {

    let req = mockFetch.request()
    equal(req.method, 'PATCH', 'method')
  })
})

test.updating('sends global headers', ({context, deepEqual}) => {

  return context.projects.updateProject(1, {}).then((res) => {

    let req = mockFetch.request()
    deepEqual(req.headers, {
      custom: 'header'
    }, 'headers')
  })
})

test.updating.next('sends global headers', ({context, deepEqual}) => {

  return context.projects.projects().update(1, {}).then((res) => {

    let req = mockFetch.request()
    deepEqual(req.headers, {
      custom: 'header'
    }, 'headers')
  })
})

test.updating('updates', ({context, equal}) => {

  return context.projects.updateProject(1, {
    name: 'test'
  })
    .then((res) => {


      let req = mockFetch.request()

      equal(req.body, JSON.stringify({
        data: {
          type: 'projects',
          id: 1,
          attributes: {
            name: 'test'
          }
        }
      }), 'body')
    })
})

test.updating.next('updates', ({context, equal}) => {

  return context.projects.projects().update(1, {
    name: 'test'
  })
    .then((res) => {


      let req = mockFetch.request()

      equal(req.body, JSON.stringify({
        data: {
          type: 'projects',
          id: 1,
          attributes: {
            name: 'test'
          }
        }
      }), 'body')
    })
})

test.updating('with relationships', ({context, equal}) => {

  return context.projects
    .updateProject(1)
    .relatedTo({
      user: 2
    })
      .then(() => {

        let req = mockFetch.request()
        equal(req.body, JSON.stringify({
          data: {
            type: 'projects',
            id: 1,
            relationships: {
              user: {
                data: {
                  type: 'users',
                  id: 2
                }
              }
            }
          }
        }), 'body')
      })
})

test.updating.next('with relationships', ({context, equal}) => {

  return context.projects
  	.projects()
    .update(1)
    .relatedTo({
      user: 2
    })
      .then(() => {

        let req = mockFetch.request()
        equal(req.body, JSON.stringify({
          data: {
            type: 'projects',
            id: 1,
            relationships: {
              user: {
                data: {
                  type: 'users',
                  id: 2
                }
              }
            }
          }
        }), 'body')
      })
})

test.updating('bulk and with relationships', function ({equal, deepEqual}) {

  let thing = resource({
    type: 'submission-style-board-tags'
  }, {
    bulk: true
  })

  return thing
    .updateSubmissionStyleBoardTags([
      {body: 'body1', position: '1'},
      {body: 'body2', position: '2'}
    ])
    .relatedTo({
      submission: {type: 'submission-style-boards', id: '123'}
    })
      .then(res => {

        let responseBody = JSON.parse(res.body.body)

        equal(responseBody.data.length, 2, 'data is an array')
        deepEqual(responseBody.data[0].attributes, {
          body: 'body1',
          position: '1'
        }, 'first resource attributes')
        deepEqual(responseBody.data[0].relationships, {
          submission: {
            data: {type: 'submission-style-boards', id: '123'}
          }
        }, 'first resource relationships')
        equal(responseBody.data[1].type, 'submission-style-board-tags', 'second resource type')
      })
})

test.updating.next('bulk and with relationships', function ({equal, deepEqual}) {

  let thing = resource({
    type: 'submission-style-board-tags'
  }, {
    bulk: true
  })

  return thing
  	.submissionStyleBoardTags()
    .update([
      {body: 'body1', position: '1'},
      {body: 'body2', position: '2'}
    ])
    .relatedTo({
      submission: {type: 'submission-style-boards', id: '123'}
    })
      .then(res => {

        let responseBody = JSON.parse(res.body.body)

        equal(responseBody.data.length, 2, 'data is an array')
        deepEqual(responseBody.data[0].attributes, {
          body: 'body1',
          position: '1'
        }, 'first resource attributes')
        deepEqual(responseBody.data[0].relationships, {
          submission: {
            data: {type: 'submission-style-boards', id: '123'}
          }
        }, 'first resource relationships')
        equal(responseBody.data[1].type, 'submission-style-board-tags', 'second resource type')
      })
})

test.deleting('uses DELETE method', ({context, equal}) => {

  return context.projects.deleteProject(1)
    .then(() => {

      let req = mockFetch.request()
      equal(req.method, 'DELETE', 'method')
    })
})

test.deleting.next('uses DELETE method', ({context, equal}) => {

  return context.projects.projects().delete(1)
    .then(() => {

      let req = mockFetch.request()
      equal(req.method, 'DELETE', 'method')
    })
})

test.deleting('sends global headers', ({deepEqual, context}) => {

  return context.projects.deleteProject(1).then((res) => {

    let req = mockFetch.request()
    deepEqual(req.headers, {
      custom: 'header'
    }, 'headers')
  })
})

test.deleting.next('sends global headers', ({deepEqual, context}) => {

  return context.projects.projects().delete(1).then((res) => {

    let req = mockFetch.request()
    deepEqual(req.headers, {
      custom: 'header'
    }, 'headers')
  })
})

test.deleting('deletes', ({context, equal}) => {

  return context.projects.deleteProject(1)
    .then(() => {

      let req = mockFetch.request()
      equal(req.url, '/projects/1', 'url')
    })
})

test.deleting.next('deletes', ({context, equal}) => {

  return context.projects.projects().delete(1)
    .then(() => {

      let req = mockFetch.request()
      equal(req.url, '/projects/1', 'url')
    })
})

test.deleting('correctly handles 204 status code', ({context, equal}) => {

  mockFetch.restore()
  mockFetch.mock({
    response: {
      status: 204
    }
  })

  return context.projects.deleteProject(1)
    .then((res) => {

      equal(res.body, undefined, 'no body returned')
    })
})

test.deleting.next('correctly handles 204 status code', ({context, equal}) => {

  mockFetch.restore()
  mockFetch.mock({
    response: {
      status: 204
    }
  })

  return context.projects.projects().delete(1)
    .then((res) => {

      equal(res.body, undefined, 'no body returned')
    })
})

// TODO: implement bulk deleting
test.deleting.skip('bulk', function ({equal, deepEqual}) {

  let thing = resource({
    type: 'submission-style-board-tags'
  }, {
    bulk: true
  })

  return thing
    .deleteSubmissionStyleBoardTags([1, 2])
      .then(res => {

        // let responseBody = JSON.parse(res.body.body)

        // equal(responseBody.data.length, 2, 'data is an array')
        // deepEqual(responseBody.data[0].attributes, {
        //   body: 'body1',
        //   position: '1'
        // }, 'first resource attributes')
        // equal(responseBody.data[1].type, 'submission-style-board-tags', 'second resource type')
      })
})

test.query('encodes special characters for URIs', ({context, equal}) => {

  return context.projects
    .getProject(123)
    .query('foo bar', 'baz%bat')
    .then(res => {

      let req = mockFetch.request()
      equal(req.url, '/projects/123?foo%20bar=baz%25bat', 'url')
    })
})

test.query.next('encodes special characters for URIs', ({context, equal}) => {

  return context.projects
  	.projects()
    .get(123)
    .query('foo bar', 'baz%bat')
    .then(res => {

      let req = mockFetch.request()
      equal(req.url, '/projects/123?foo%20bar=baz%25bat', 'url')
    })
})

test.query('with string arguments converts query arguments as strings into query string', ({context, equal}) => {

  return context.projects
    .getProject(123)
    .query('foo', 'bar')
    .then((res) => {

      let req = mockFetch.request()
      equal(req.url, '/projects/123?foo=bar', 'url')
    })
})

test.query.next('with string arguments converts query arguments as strings into query string', ({context, equal}) => {

  return context.projects
  	.projects()
    .get(123)
    .query('foo', 'bar')
    .then((res) => {

      let req = mockFetch.request()
      equal(req.url, '/projects/123?foo=bar', 'url')
    })
})

test.query('with string arguments combines query params with params from built-in functions', ({context, equal}) => {

  return context.projects
    .getProject(123)
    .sort('-createdAt', 'updatedAt')
    .query('foo', 'bar')
    .then((res) => {

      let req = mockFetch.request()
      equal(req.url, '/projects/123?sort=-created-at,updated-at&foo=bar', 'url')
    })
})

test.query.next('with string arguments combines query params with params from built-in functions', ({context, equal}) => {

  return context.projects
  	.projects()
    .get(123)
    .sort('-createdAt', 'updatedAt')
    .query('foo', 'bar')
    .then((res) => {

      let req = mockFetch.request()
      equal(req.url, '/projects/123?sort=-created-at,updated-at&foo=bar', 'url')
    })
})

test.query('with an object argument supports string values', ({context, equal}) => {

  return context.projects
    .getProject(123)
    .query({foo: 'bar'})
    .then((res) => {

      let req = mockFetch.request()
      equal(req.url, '/projects/123?foo=bar', 'url')
    })
})

test.query.next('with an object argument supports string values', ({context, equal}) => {

  return context.projects
  	.projects()
    .get(123)
    .query({foo: 'bar'})
    .then((res) => {

      let req = mockFetch.request()
      equal(req.url, '/projects/123?foo=bar', 'url')
    })
})

test.query('with an object argument supports array values (unkeyed)', ({context, equal}) => {

  return context.projects
    .getProject(123)
    .query({foo: ['bar', 'baz']})
    .then((res) => {

      let req = mockFetch.request()
      equal(req.url, '/projects/123?foo%5B%5D=bar&foo%5B%5D=baz', 'url')
    })
})

test.query.next('with an object argument supports array values (unkeyed)', ({context, equal}) => {

  return context.projects
  	.projects()
    .get(123)
    .query({foo: ['bar', 'baz']})
    .then((res) => {

      let req = mockFetch.request()
      equal(req.url, '/projects/123?foo%5B%5D=bar&foo%5B%5D=baz', 'url')
    })
})

test.query('with an object argument supports object values', ({context, equal}) => {

  return context.projects
    .getProject(123)
    .query({foo: {bar: 'baz', bat: 'bing'}})
    .then((res) => {

      let req = mockFetch.request()
      equal(req.url, '/projects/123?foo%5Bbar%5D=baz&foo%5Bbat%5D=bing', 'url')
    })
})

test.query.next('with an object argument supports object values', ({context, equal}) => {

  return context.projects
  	.projects()
    .get(123)
    .query({foo: {bar: 'baz', bat: 'bing'}})
    .then((res) => {

      let req = mockFetch.request()
      equal(req.url, '/projects/123?foo%5Bbar%5D=baz&foo%5Bbat%5D=bing', 'url')
    })
})

test.query('with an object argument supports object values with arrays as their values', ({context, equal}) => {

  return context.projects
    .getProject(123)
    .query({foo: {bar: ['baz', 'bat']}})
    .then((res) => {

      let req = mockFetch.request()
      equal(req.url, '/projects/123?foo%5Bbar%5D%5B%5D=baz&foo%5Bbar%5D%5B%5D=bat', 'url')
    })
})

test.query.next('with an object argument supports object values with arrays as their values', ({context, equal}) => {

  return context.projects
  	.projects()
    .get(123)
    .query({foo: {bar: ['baz', 'bat']}})
    .then((res) => {

      let req = mockFetch.request()
      equal(req.url, '/projects/123?foo%5Bbar%5D%5B%5D=baz&foo%5Bbar%5D%5B%5D=bat', 'url')
    })
})

test.singleton.beforeEach(() => {

  let r = resource({
    type: 'recipient',
    singleton: true
  })

  return {resource: r}
})

test.singleton('GET', ({context, equal}) => {

  return context.resource.getRecipient()
    .then((res) => {

      let req = mockFetch.request()
      equal(req.method, 'GET', 'GET request')
      equal(req.url, '/recipient', 'recipient URL')
    })
})

test.singleton.next('GET', ({context, equal}) => {

  return context.resource.recipient().get()
    .then((res) => {

      let req = mockFetch.request()
      equal(req.method, 'GET', 'GET request')
      equal(req.url, '/recipient', 'recipient URL')
    })
})

test.singleton('PATCH', ({context, equal, deepEqual}) => {

  return context.resource.updateRecipient({taxId: '000000000'})
    .then((res) => {

      let req = mockFetch.request()
      equal(req.method, 'PATCH', 'PATCH request')
      equal(req.url, '/recipient', 'recipient URL')
      deepEqual(JSON.parse(req.body), {
        data: {
          type: 'recipient',
          attributes: {
            taxId: '000000000'
          }
        }
      })
    })
})

test.singleton.next('PATCH', ({context, equal, deepEqual}) => {

  return context.resource.recipient().update({taxId: '000000000'})
    .then((res) => {

      let req = mockFetch.request()
      equal(req.method, 'PATCH', 'PATCH request')
      equal(req.url, '/recipient', 'recipient URL')
      deepEqual(JSON.parse(req.body), {
        data: {
          type: 'recipient',
          attributes: {
            taxId: '000000000'
          }
        }
      })
    })
})

test.singleton('POST', ({context, equal}) => {

  return context.resource.createRecipient({taxId: '000000000'})
    .then((res) => {

      let req = mockFetch.request()
      equal(req.method, 'POST', 'POST request')
      equal(req.url, '/recipient', 'recipient URL')
    })
})

test.singleton.next('POST', ({context, equal}) => {

  return context.resource.recipient().create({taxId: '000000000'})
    .then((res) => {

      let req = mockFetch.request()
      equal(req.method, 'POST', 'POST request')
      equal(req.url, '/recipient', 'recipient URL')
    })
})

test.singleton('DELETE', ({context, equal}) => {

  return context.resource.deleteRecipient()
    .then((res) => {

      let req = mockFetch.request()
      equal(req.method, 'DELETE', 'DELETE request')
      equal(req.url, '/recipient', 'recipient URL')
    })
})

test.singleton.next('DELETE', ({context, equal}) => {

  return context.resource.recipient().delete()
    .then((res) => {

      let req = mockFetch.request()
      equal(req.method, 'DELETE', 'DELETE request')
      equal(req.url, '/recipient', 'recipient URL')
    })
})

test.singleton('GET (collection)', ({context, equal}) => {

  equal(context.resource.getRecipients, undefined, 'should not be present')
})

test.singleton.next('GET (collection)', ({context, equal}) => {

  equal(context.resource.recipients, undefined, 'should not be present')
})
