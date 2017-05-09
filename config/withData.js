import 'isomorphic-fetch'
import React from 'react'
import { ApolloProvider, getDataFromTree } from 'react-apollo'
import { initClient, initStore } from './store'

export default (Component) => (
  class extends React.Component {
    static async getInitialProps (ctx) {
      
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
          ...state,
          apollo: {
            data: client.getInitialState().data
          }
        },
        headers,
        ...props
      }
    }

    constructor (props) {
      super(props)
      this.client = initClient(this.props.headers, this.props.initialState)
      this.store = initStore(this.client, this.props.initialState)
    }

    render () {
      return (
        <ApolloProvider client={this.client} store={this.store}>
          <Component {...this.props} />
        </ApolloProvider>
      )
    }
  }
)

/*import React, { Component } from 'react'
import Expo from 'expo'
import { ApolloProvider } from 'react-apollo'

import { client, store } from './store'

class App extends Component {
  render () {
    return (
      <ApolloProvider store={store} client={client}>
      </ApolloProvider>
    )
  }
}

Expo.registerRootComponent(App)*/

