# Changes
# 0.1.0

- Add:new method: ajax.form
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
