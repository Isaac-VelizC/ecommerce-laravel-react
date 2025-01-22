import { SettingInterface } from '@/Interfaces/Settings'
import Authenticated from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import React from 'react'

type Props = {
  data: SettingInterface;
}

export default function Settings({data}: Props) {
  return (
    <Authenticated>
      <Head title='Setting' />
      <div>
        {data.email}
        {data.description}
      </div>
    </Authenticated>
  )
}