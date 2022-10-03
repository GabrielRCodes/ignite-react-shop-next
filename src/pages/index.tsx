import Image from "next/future/image"

import { useKeenSlider } from "keen-slider/react"

import { HomeContainer, Product } from "../styles/pages/home";

import "keen-slider/keen-slider.min.css";
import { Stripe } from "stripe"
import { stripe } from "../lib/stripe";
import { GetStaticProps } from "next";
import Link from "next/link";

interface HomeProps {
  products: {
    id: string;
    name: string;
    imageUrl: string;
    price: number;
  }[]
}

export default function Home({ products }: HomeProps) {

  const [ sliderRef ] = useKeenSlider({
    slides: {
      perView: 3,
      spacing: 48,
    }
  })

  return (
    <HomeContainer ref={sliderRef} className="keen-slider">

      {products.map(product => {
        return (
          <Link key={product.id} href={`/product/${product.id}`} >
            <Product 
              className="keen-slider__slide"
            >
              <Image src={product.imageUrl} width={520} height={480} alt={""}></Image>
              <footer>
                <strong>{product.name}</strong>
                <span>{product.price}</span>
              </footer>
            </Product>
          </Link>
        )
      })}

    </HomeContainer>
  )
}

/* GetStatisProps serve apenas para páginas que terão alterações para TODOS os usuários, não para páginas de usuários personalizadas, etc. */
/* GetServerSideProps sempre executará, enqunto GetServerSideProps armazenará informações no cache */
/* GetStaticProps não dá acesso a req, res, ou seja, não da para ver usuário logado, cookies, etc */
/* Não utilizar para todas as chamadas API, apenas para dados CRUCIAIS */
/* CÓDIGO NÃO VISÍVEL AO CLIENTE */

export const getStaticProps: GetStaticProps = async () => {

  const response = await stripe.products.list({
    expand: ["data.default_price"]
  })

  const products = response.data.map(product => {

    const price = product.default_price as Stripe.Price

    return {
      id: product.id,
      name: product.name,
      imageUrl: product.images[0],
      price: new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL",
      }).format(price.unit_amount / 100),
    }
  })

  return {
    props: {
      products,
    },
    revalidate: 60 * 60 * 2, // 2 horas
  }
}
