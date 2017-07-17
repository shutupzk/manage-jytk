// import 'isomorphic-fetch'
import React from 'react'
import Router from 'next/router'
import { ApolloProvider, getDataFromTree } from 'react-apollo'
import { initClient, initStore } from './store'
import localforage from 'localforage'

export default function (Component) {
  class Auth extends React.Component {
    static async getInitialProps (ctx) {
      console.log(process.browser ? document.cookie : '')
      if (process.browser) {
        const arrStr = document.cookie.split('; ')
        for (let i = 0; i < arrStr.length; i++) {
          window.alert(arrStr[i])
          var temp = arrStr[i].split('=')
          window.alert(temp[0])
          if (temp[0] === 'wechatUserCookie') {
            window.alert(temp[1])
            console.log(JSON.parse(temp[1]))
            window.alert(JSON.parse(temp[1]))
            // console.log((eval('(' + temp[1] + ')')))
          }
        }
      }
      const headers = ctx.req ? ctx.req.headers : {}
      const client = initClient(headers)
      const store = initStore(client, client.initialState)
      const props = {
        url: { query: ctx.query, pathname: ctx.pathname },
        ...await (Component.getInitialProps ? Component.getInitialProps(ctx) : {})
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
      this.state = {token: undefined}
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
      // if (/(iPhone|iPad|iPod|iOS)/i.test(navigator.userAgent)) {
      //   window.alert('这是IOS')
      // } else if (/(Android)/i.test(navigator.userAgent)) {
      //   window.alert('这是Android')
      // } else {
      //   window.alert('这是PC')
      // }
      let token = await localforage.getItem('token')
      this.setState({token})
      // if (this.props.url.pathname !== '/' && this.props.url.pathname !== '/signin' && this.props.url.pathname !== '/signup' && this.props.url.pathname !== '/signup/signup_compelete' && this.props.url.pathname !== '/hospital' && !token) {
      //   Router.push('/signin')
      // }
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
