import Breadcrumb from '@/Components/Client/Breadcrumb'
import Client from '@/Layouts/ClientLayout'
import { Head } from '@inertiajs/react'
import React from 'react'

type Props = {}

export default function Account({}: Props) {
    const breadcrumbLinks = [
        { href: "/", label: "Home" },
        { href: "#", label: "cuenta" },
    ];
  return (
    <Client>
        <Head title='Cuenta'/>
        <Breadcrumb links={breadcrumbLinks}/>
    </Client>
  )
}