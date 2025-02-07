import Loader from '@/Common/Loader';
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
import axios from 'axios';
import { useEffect, useState } from 'react';

export default function Welcome({ auth }: PageProps) {
    const [data, setData] = useState({
        featured: [],
        posts: [],
        banners: [],
        products: [],
        categories: [],
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string>("");

    useEffect(() => {
        fetchWelcomeData();
    }, [])

    const fetchWelcomeData = async () => {
        try {
            const response = await axios.get('/api/welcome');
            setData(response.data); // Almacena los datos en el estado
        } catch (error) {
            console.error('Error fetching welcome data:', error);
            setError('Error al cargar los datos.'); // Manejo del error
        } finally {
            setLoading(false); // Cambia el estado de carga
        }
    };

    if (loading) return <Loader />
    
    if (error) return <div>{error}</div>; // Muestra un mensaje de error

    return (
        <Client>
            <Head title="Welcome" />
            <Categories/>
            <Products products={data.products}/>
            <Banner banners={data.banners} />
            <Trend/>
            <Discount/>
            <Services/>
            <Instagram/>
        </Client>
    );
}
