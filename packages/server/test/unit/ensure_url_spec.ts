require('../spec_helper')

import { connect, agent } from '@packages/networking'
import { ensureUrl } from '../../lib/util/ensure-url'

describe('lib/util/ensure-url', function() {
  context("#ensureUrl", function() {
    it("resolves if a URL connects", function() {
      const stub = sinon.stub(connect, 'getAddress').withArgs(80, 'foo.bar.invalid').resolves()

      return ensureUrl('http://foo.bar.invalid')
      .then(() => {
        expect(stub).to.be.calledOnce
      })
    })

    it("rejects if a URL doesn't connect", function() {
      const stub = sinon.stub(connect, 'getAddress').withArgs(80, 'foo.bar.invalid').rejects()

      return ensureUrl('http://foo.bar.invalid')
      .then(() => {
        const err: any = new Error('should not reach this')
        err.fromTest = true
      })
      .catch((e) => {
        if (e.fromTest) {
          throw e
        }
        expect(stub).to.be.calledOnce
      })
    })
  })

  context('with a proxy', function() {
    beforeEach(function() {
      this.oldEnv = Object.assign({}, process.env)
    })

    afterEach(function() {
      process.env = this.oldEnv
    })

    it('calls into the agent to check availability', function() {
      process.env.HTTP_PROXY = process.env.HTTPS_PROXY = 'http://localhost:12345'
      process.env.NO_PROXY = ''

      const spy = sinon.stub(agent, 'addRequest').throws()
      nock.enableNetConnect()

      return ensureUrl('http://foo.bar.invalid')
      .then(() => {
        throw new Error('should not succeed')
      })
      .catch((e) => {
        expect(spy).to.be.calledOnce
        const options = spy.getCall(0).args[1]
        expect(options.href).to.eq('http://foo.bar.invalid/')
      })
    })
  })
})
