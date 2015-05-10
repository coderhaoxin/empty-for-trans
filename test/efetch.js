'use strict'

describe('## efetch', function() {
  let host = 'http://localhost:3000'

  it('fetch, efetch should exist', function() {
    expect(typeof window.fetch).toEqual('function')
    expect(typeof window.efetch).toEqual('function')
  })

  it('invalid url', function() {
    try {
      window.efetch()
    } catch (e) {
      expect(e.message).toEqual('invalid url')
    }
  })

  it('efetch()', function(done) {
    window.efetch(host)
      .then(function(res) {
        expect(res.status).toEqual(200)
        expect(res.headers.get('Content-Type')).toEqual('application/json; charset=utf-8')
        return res.json()
      })
      .then(function(json) {
        expect(Object.keys(json)).toEqual(['type', 'body', 'headers', 'method', 'query'])
        done()
      })
      .catch(function(err) {
        done.fail(err)
      })
  })

  describe('# query', function() {
    it('query()', function(done) {
      window
        .efetch(host)
        .query({
          name: 'haoxin',
          pass: 123456
        })
        .query({
          type: 1
        })
        .then(function(res) {
          expect(res.status).toEqual(200)
          expect(res.headers.get('Content-Type')).toEqual('application/json; charset=utf-8')
          return res.json()
        })
        .then(function(json) {
          expect(Object.keys(json.query)).toEqual(['name', 'pass', 'type'])
          done()
        })
        .catch(function(err) {
          done.fail(err)
        })
    })

    it('query() - merge url', function(done) {
      window.efetch(host + '?name=haoxin')
        .query({
          pass: 123456
        })
        .query({
          type: 1
        })
        .then(function(res) {
          expect(res.status).toEqual(200)
          expect(res.headers.get('Content-Type')).toEqual('application/json; charset=utf-8')
          return res.json()
        })
        .then(function(json) {
          expect(Object.keys(json.query)).toEqual(['name', 'pass', 'type'])
          done()
        })
        .catch(function(err) {
          done.fail(err)
        })
    })

    it('json()', function(done) {
      window.efetch(host)
        .query({
          name: 'haoxin',
          pass: 123456
        })
        .query({
          type: 1
        })
        .json()
        .then(function(json) {
          expect(Object.keys(json.query)).toEqual(['name', 'pass', 'type'])
          done()
        }).catch(function(err) {
          done.fail(err)
        })
    })

    it('text()', function(done) {
      window.efetch(host)
        .query({
          name: 'haoxin',
          pass: 123456
        })
        .query({
          type: 1
        })
        .text()
        .then(function(text) {
          expect(typeof text).toEqual('string')
          let json = JSON.parse(text)
          expect(Object.keys(json.query)).toEqual(['name', 'pass', 'type'])
          done()
        }).catch(function(err) {
          done.fail(err)
        })
    })
  })

  describe('# config', function() {
    it('set cookie', function(done) {
      window.efetch(host + '/set-cookie')
        // .config('mode', 'cors')
        // .config('credentials', 'include')
        .then(function(res) {
          expect(res.status).toEqual(200)
          expect(res.headers.get('Content-Type')).toEqual('application/json; charset=utf-8')
          return res.json()
        })
        .then(function(json) {
          console.log(Object.keys(json.headers))
          done()
        })
        .catch(function(err) {
          done.fail(err)
        })
    })

    it('get cookie', function(done) {
      window.efetch(host + '/cookie')
        .config({
          // mode: 'cors',
          // credentials: 'include'
        })
        .then(function(res) {
          expect(res.status).toEqual(200)
          expect(res.headers.get('Content-Type')).toEqual('application/json; charset=utf-8')
          return res.json()
        })
        .then(function(json) {
          console.log(Object.keys(json.headers))
          done()
        })
        .catch(function(err) {
          done.fail(err)
        })
    })
  })

  describe('# send', function() {
    it('json', function(done) {
      window.efetch
        .post(host)
        .send({
          name: 'haoxin',
          pass: 123456
        })
        .send({
          type: 1
        })
        .then(function(res) {
          expect(res.status).toEqual(200)
          expect(res.headers.get('Content-Type')).toEqual('application/json; charset=utf-8')
          return res.json()
        })
        .then(function(json) {
          expect(json.method).toEqual('POST')
          expect(json.type).toEqual('application/json')
          expect(Object.keys(json.body)).toEqual(['name', 'pass', 'type'])
          done()
        })
        .catch(function(err) {
          done.fail(err)
        })
    })

    it('urlencoded', function(done) {
      window.efetch
        .post(host)
        .send('name=haoxin')
        .send('pass=123456')
        .then(function(res) {
          expect(res.status).toEqual(200)
          expect(res.headers.get('Content-Type')).toEqual('application/json; charset=utf-8')
          return res.json()
        })
        .then(function(json) {
          expect(json.method).toEqual('POST')
          expect(json.type).toEqual('application/x-www-form-urlencoded')
          expect(Object.keys(json.body)).toEqual(['name', 'pass'])
          done()
        })
        .catch(function(err) {
          done.fail(err)
        })
    })

    it('get should ignore body', function(done) {
      window.efetch(host)
        .send({
          name: 'haoxin',
          pass: 123456
        })
        .send({
          type: 1
        })
        .then(function(res) {
          expect(res.status).toEqual(200)
          expect(res.headers.get('Content-Type')).toEqual('application/json; charset=utf-8')
          return res.json()
        })
        .then(function(json) {
          expect(json.method).toEqual('GET')
          expect(json.type).toEqual('application/json')
          expect(Object.keys(json.body)).toEqual([])
          done()
        })
        .catch(function(err) {
          done.fail(err)
        })
    })
  })

  describe('# set', function() {
    it('set(key, value)', function(done) {
      window.efetch
        .post(host)
        .set('content-type', 'application/x-www-form-urlencoded')
        .set('x-efetch-test', 'hello')
        .send({
          name: 'haoxin'
        })
        .send({
          pass: 123456
        })
        .then(function(res) {
          expect(res.status).toEqual(200)
          expect(res.headers.get('Content-Type')).toEqual('application/json; charset=utf-8')
          return res.json()
        })
        .then(function(json) {
          expect(json.method).toEqual('POST')
          expect(json.type).toEqual('application/x-www-form-urlencoded')
          expect(json.headers['x-efetch-test']).toEqual('hello')
          expect(Object.keys(json.body)).toEqual(['name', 'pass'])
          done()
        })
        .catch(function(err) {
          done.fail(err)
        })
    })

    it('set(obj)', function(done) {
      window.efetch
        .post(host + '/set')
        .set({
          'content-type': 'application/x-www-form-urlencoded',
          'x-efetch-test': 'hello'
        })
        .send({
          name: 'haoxin'
        })
        .send({
          pass: 123456
        })
        .then(function(res) {
          expect(res.status).toEqual(200)
          expect(res.headers.get('Content-Type')).toEqual('application/json; charset=utf-8')
          return res.json()
        })
        .then(function(json) {
          expect(json.method).toEqual('POST')
          expect(json.type).toEqual('application/x-www-form-urlencoded')
          expect(json.headers['x-efetch-test']).toEqual('hello')
          expect(Object.keys(json.body)).toEqual(['name', 'pass'])
          done()
        })
        .catch(function(err) {
          done.fail(err)
        })
    })
  })

  describe('# append', function() {
    it('append(key, value)', function(done) {
      window.efetch
        .post(host)
        .append('name', 'haoxin')
        .append('desc', new Blob(['<a>me</a>'], {
          type: 'text/html'
        }))
        .then(function(res) {
          expect(res.status).toEqual(200)
          expect(res.headers.get('Content-Type')).toEqual('application/json; charset=utf-8')
          return res.json()
        })
        .then(function(json) {
          expect(json.method).toEqual('POST')
          expect(json.type).toEqual('multipart/form-data')
          expect(Object.keys(json.body)).toEqual(['name'])
          expect(json.body.name).toEqual('haoxin')
          done()
        })
        .catch(function(err) {
          done.fail(err)
        })
    })
  })
})
