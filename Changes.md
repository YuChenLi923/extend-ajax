# Changes

# 1.2.1

- Fix: the success callback function added before calling the send method can not be called.

# 1.2.0

- Fix: page jump exceptionally when listening to form submission
- Fix: Content-Type cannot be standardized
- Add xhr pool to save xhr when the request end.

# 1.1.5

- Add an option:dev
- Add warn: When the key value of the transmitted data is undefined and options.dev is true, it will send a warn.

# 1.1.4

- Fix: When the key value of the transmitted data is undefined, it will still be sent.

# 1.1.3

- Fix: when Content-Type is 'formData', request will happen wrong.

# 1.1.2

- Fix: global config's convert can't merge with instance's header.

# 1.1.1

- Fix: global config's header can't be standardized.
- Fix: instance's config can affect global config

# 1.1.0
d
- Add two new events: 'start'、'end'

# 1.0.1

- Add method: stop()
- Fix: global config's header can't merge with instance's header.

# 1.0.0

- Add: jsonp
- remove: the 'error' event

# 0.1.0

- Add a new method: ajax.form
- Add: when the request failed, res still have res data.
- Fix: when the way of request is not post and get, it happen error
- Fix: when ajax(url, options) is called, options will be considered as request method

# 0.0.4

- Add:support AMD

# 0.0.3

- Modify: improve 40% performance of cache than previous version.
- Fix: when the size of cache is smaller than the specified size,the lasted cache is remove.

# 0.0.2
- Add:cacheExp
- Modify: improve the performance of cache.
- Fix:when method is 'get', data can't be sent in some cases.
