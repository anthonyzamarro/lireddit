import { ThemeProvider, CSSReset, ChakraProvider } from '@chakra-ui/react';
import theme from '../theme';


function MyApp({ Component, pageProps }: any) {
  return (
    <ThemeProvider theme={theme}>
      <ChakraProvider resetCSS theme={theme}>
          <CSSReset />
          <Component {...pageProps} />
      </ChakraProvider>
    </ThemeProvider>
  )
}

export default MyApp
