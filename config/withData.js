// import 'isomorphic-fetch'
import React from 'react'
// import Router from 'next/router'
import { ApolloProvider, getDataFromTree } from 'react-apollo'
import { initClient, initStore } from './store'
import localforage from 'localforage'

export default function (Component) {
  class Auth extends React.Component {
    static async getInitialProps (ctx) {
      const headers = ctx.req ? ctx.req.headers : {}
      const client = initClient(headers)
      const store = initStore(client, client.initialState)
      const props = {
        url: { query: ctx.query, pathname: ctx.pathname },
        ...(await (Component.getInitialProps ? Component.getInitialProps(ctx) : {}))
      }
      if (!process.browser) {
        const app = (
          <ApolloProvider client={client} store={store}>
            <Component {...props} />
          </ApolloProvider>
        )
        await getDataFromTree(app)
      }

      const state = store.getState()

      return {
        initialState: {
          ...state
        },
        headers,
        ...props
      }
    }

    constructor (props) {
      super(props)
      this.client = initClient(this.props.headers, this.props.initialState)
      this.store = initStore(this.client, this.props.initialState)
      this.state = { token: undefined }
    }

    async componentWillMount () {
      const ua = window.navigator.userAgent.toLowerCase()
      if (ua.match(/MicroMessenger/i) === 'micromessenger') {
        // window.alert('在微信里打开')
      } else if (ua.match(/AlipayClient/i) === 'alipayclient') {
        // window.alert('在支付宝里打开')
      } else {
        // window.alert('在浏览器打开')
      }
      let token = await localforage.getItem('token')
      this.setState({ token })
    }

    render () {
      return (
        <ApolloProvider client={this.client} store={this.store}>
          <Component client={this.client} url={this.props.url} />
        </ApolloProvider>
      )
    }
  }
  return Auth
}
