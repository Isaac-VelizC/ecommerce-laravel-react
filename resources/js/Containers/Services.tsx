import React from "react";

type PropsCardService = {
    title: string;
    content: string;
};

const CardService = ({ title, content }: PropsCardService) => {
    return (
        <div className="w-full p-2">
            <div className="flex flex-col items-center justify-center rounded-lg shadow-md p-6 bg-white hover:shadow-lg transition duration-300 ease-in-out">
                <div className="flex items-center justify-center rounded-full w-16 h-16 bg-pink-100 text-pink-500 mb-4">
                    <i className="fa fa-car text-3xl"></i>
                </div>
                <div className="text-center">
                    <h6 className="text-gray-800 font-cookie text-3xl font-semibold mb-2">
                        {title}
                    </h6>
                    <p className="text-gray-600 text-xs">{content}</p>
                </div>
            </div>
        </div>
    );
};

const Services: React.FC = () => {
    return (
        <section className="services pt-[80px] pb-[50px]">
            <div className="mx-4 sm:mx-10 xl:mx-44">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 gap-y-4">
                    <CardService
                        title="Entrega gratuita"
                        content="Disfruta de envío gratuito en todos los pedidos superiores a $999."
                    />
                    <CardService
                        title="Garantía de calidad"
                        content="Si encuentras algún problema con nuestros productos, ¡te ayudamos sin complicaciones!"
                    />
                    <CardService
                        title="Ofertas diarias"
                        content="¡Aprovecha descuentos exclusivos cada día y ahorra en tus compras!"
                    />
                    <CardService
                        title="Pago 100% seguro"
                        content="Realiza tus pagos con total confianza a través de métodos seguros y protegidos."
                    />
                </div>
            </div>
        </section>
    );
};

export default Services;
