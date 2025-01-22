import { ProductInterface } from '@/Interfaces/Product'
import Authenticated from '@/Layouts/AuthenticatedLayout'
import { Head } from '@inertiajs/react'
import React from 'react'

type Props = {
  products: ProductInterface[];
}

export default function Product({ products }: Props) {
  return (
    <Authenticated>
      <Head title='Product' />
      <div>Products</div>
    </Authenticated>
  )
}