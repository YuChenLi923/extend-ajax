# Changes

# 2.1.3

- fix(index.d.ts): HttpMethod don't support the `Patch` method.

# 2.1.2

- fix(formatData): formData handle error

# 2.1.1

- Add(Ajax.send): Add a support for send data when the method of request is `get`.

# 2.1.0
- Add(AjaxOptions): autoAbort.
- Add(index.d.ts): HttpMethod, EventType, HttpHeader, AjaxOptions, ExtendAjax exports

# 2.0.1

- Fix(index.d.ts): time unit error.
- Refator(test): test demo.

# 1.2.5
- Fix: cache's hash calculation error

# 1.2.4

- Add an option: scope

# 1.2.3

- Add an option: withCredentials

# 1.2.2

- Fix: the jsonp fail

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
