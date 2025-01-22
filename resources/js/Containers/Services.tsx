import React from 'react';

type Props = {};

const Services: React.FC<Props> = () => {
    return (
        <section className="services pt-[80px] pb-[50px]">
            <div className="mx-4 sm:mx-10 xl:mx-44">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 gap-y-4">
                    <div className="w-full">
                        <div className="pl-[65px] relative">
                            <i className="fa fa-car text-[#ca1515] text-[36px] absolute left-0 top-[4px]"></i>
                            <h6 className="text-[#111111] font-semibold mb-[5px]">Free Shipping</h6>
                            <p className="mb-0">For all orders over $99</p>
                        </div>
                    </div>
                    <div className="w-full">
                        <div className="pl-[65px] relative">
                            <i className="fa fa-money-bill-1 text-[#ca1515] text-[36px] absolute left-0 top-[4px]"></i>
                            <h6 className="text-[#111111] font-semibold mb-[5px]">Money Back Guarantee</h6>
                            <p className="mb-0">If goods have problems</p>
                        </div>
                    </div>
                    <div className="w-full">
                        <div className="pl-[65px] relative">
                            <i className="fa fa-life-ring text-[#ca1515] text-[36px] absolute left-0 top-[4px]"></i>
                            <h6 className="text-[#111111] font-semibold mb-[5px]">Online Support 24/7</h6>
                            <p className="mb-0">Dedicated support</p>
                        </div>
                    </div>
                    <div className="w-full">
                        <div className="pl-[65px] relative">
                            <i className="fa fa-headphones text-[#ca1515] text-[36px] absolute left-0 top-[4px]"></i>
                            <h6 className="text-[#111111] font-semibold mb-[5px]">Payment Secure</h6>
                            <p className="mb-0">100% secure payment</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Services;
