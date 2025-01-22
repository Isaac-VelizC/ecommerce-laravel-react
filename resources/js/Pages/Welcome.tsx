import Banner from '@/Containers/Banner';
import Categories from '@/Containers/Categories';
import Discount from '@/Containers/Discount';
import Instagram from '@/Containers/Instagram';
import Products from '@/Containers/Products';
import Services from '@/Containers/Services';
import Trend from '@/Containers/Trend';
import Client from '@/Layouts/ClientLayout';
import { PageProps } from '@/types';
import { Head, Link } from '@inertiajs/react';

export default function Welcome({
    auth,
}: PageProps<{ laravelVersion: string; phpVersion: string }>) {

    return (
        <Client>
            <Head title="Welcome" />
            <Categories/>
            <Products/>
            <Banner/>
            <Trend/>
            <Discount/>
            <Services/>
            <Instagram/>
        </Client>
    );
}
