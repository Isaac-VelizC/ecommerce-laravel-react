import { CategoryInterface } from '@/Interfaces/Category'
import Authenticated from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import React from 'react'

type Props = {
  categories: CategoryInterface[];
}

export default function Category({ categories }: Props) {
  return (
    <Authenticated>
      <Head title='Category' />
      <div>Categories</div>
    </Authenticated>
  )
}