import NextHead from 'next/head'
import { string } from 'prop-types'

const defaultDescription = ''
const defaultOGURL = ''
// const defaultOGImage = ''

export const Head = (props) => (
  <NextHead>
    <meta charSet='UTF-8' />
    <title>{props.title || ''}</title>
    <meta name='description' content={props.description || defaultDescription} />
    <meta name='viewport' content='width=device-width,height=device-height,inital-scale=1.0,maximum-scale=1.0,user-scalable=no;' />
    <meta name='apple-mobile-web-app-capable' content='yes' />
    <meta name='apple-mobile-web-app-status-bar-style' content='black' />
    <meta name='format-detection' content='telephne=no' />
    <link rel='icon' href='/static/favicon.ico' />
    <meta property='og:url' content={props.url || defaultOGURL} />
    <meta property='og:title' content={props.title || ''} />
    <meta property='og:description' content={props.description || defaultDescription} />
  </NextHead>
)

Head.propTypes = {
  title: string,
  description: string,
  url: string
  // ogImage: string
}

export default Head
