import { BrandInterface } from '@/Interfaces/Brand'
import Authenticated from '@/Layouts/AuthenticatedLayout'
import { Head } from '@inertiajs/react'
import React from 'react'

type Props = {
    brands: BrandInterface[];
}

export default function Brand({ brands }: Props) {
  return (
    <Authenticated>
        <Head title='Brands' />
        <div>Brands</div>
    </Authenticated>
  )
}