import { AppProps } from "next/app"
import { globalStyles } from "../styles/global"
import logoImg from "../assets/logo.svg"
/* import homeImg from "../assets/home.jpg" */
import { Container, Header } from "../styles/pages/app";
import Image from "next/future/image"


globalStyles();

export default function App({ Component, pageProps }: AppProps) {

  return (
    <Container>
      <Header>
        {/* <Image src={homeImg} width={400} alt="" /> */}
        <Image src={logoImg} alt="" />
      </Header>

      <Component {...pageProps} />
    </Container>
  )
}