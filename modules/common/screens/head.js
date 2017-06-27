import NextHead from 'next/head'

const defaultDescription = ''
const defaultOGURL = ''
// const defaultOGImage = ''

export const Head = (props) => (
  <NextHead>
    <meta content='text/html;charset=utf-8' />
    <title>{props.title || ''}</title>
    <meta name='description' content={props.description || defaultDescription} />
    <meta name='viewport' content='width=device-width,height=device-height,initial-scale=1,maximum-scale=1.0,user-scalable=no' />
    <meta name='apple-mobile-web-app-capable' content='yes' />
    <meta name='apple-mobile-web-app-status-bar-style' content='black' />
    <meta name='format-detection' content='telephne=no' />
    <link rel='icon' href='/static/favicon.ico' />
    <meta property='og:url' content={props.url || defaultOGURL} />
    <meta property='og:title' content={props.title || ''} />
    <meta property='og:description' content={props.description || defaultDescription} />
    {/*<script src='https://code.jquery.com/jquery-3.2.1.min.js'></script>*/}
    {/*<link href='/static/styles/swal2.css' rel='stylesheet' type='text/css' />*/}
    {/*<script src='https://maps.googleapis.com/maps/api/js'></script>*/}
    {/*<script type='text/javascript' src='http://api.map.baidu.com/api?v=2.0&ak='></script>*/}
    {/*<link href='/static/mobiscroll-2.6.2/css/mobiscroll.custom-2.6.2.min.css' rel='stylesheet' type='text/css' />*/}
    {/*<script src='/static/mobiscroll-2.6.2/js/mobiscroll.custom-2.6.2.min.js' type='text/javascript'></script>*/}
  </NextHead>
)

export default Head
