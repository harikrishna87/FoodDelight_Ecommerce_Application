import { Card } from 'react-bootstrap';
interface Testimonial {
    id: number;
    name: string;
    role: string;
    text: string;
    avatar?: string;
}


const testimonials: Testimonial[] = [
    {
        id: 1,
        name: "Harish Kumar",
        role: "Regular Customer",
        text: "The quality of products is exceptional. I've been shopping here for years!"
    },
    {
        id: 2,
        name: "Jaya Krishna",
        role: "Food Critic",
        text: "Their selection never fails to impress. A must-visit for food enthusiasts."
    },
    {
        id: 3,
        name: "Manikanta",
        role: "Chef",
        text: "The freshness and variety of products have transformed my cooking experience."
    },
    {
        id: 4,
        name: "Rasheed",
        role: "Nutritionist",
        text: "I recommend these products to all my clients. Premium quality and great value."
    },
    {
        id: 5,
        name: "Mahesh",
        role: "Food Blogger",
        text: "The flavors are authentic and the service is always exceptional!"
    }
];


const Testimonials: React.FC = () => {

    return (
        <>
            <div className="mb-5">
                <h2 className="text-center mb-4 section-title">What Our Customers Say</h2>
                <div className="marquee-container overflow-hidden position-relative">
                    <div className="marquee-content-slow d-flex">
                        {[...testimonials, ...testimonials].map((testimonial, index) => (
                            <Card
                                key={`${testimonial.id}-${index}`}
                                className="mx-2 shadow-sm"
                                style={{ minWidth: '300px', maxWidth: '300px' }}
                            >
                                <Card.Body>
                                    <div className="mb-3 text-warning">
                                        {[1, 2, 3, 4, 5].map(star => (
                                            <span key={star}>★</span>
                                        ))}
                                    </div>
                                    <Card.Text className="fst-italic">"{testimonial.text}"</Card.Text>
                                    <div className="d-flex align-items-center mt-3">
                                        <div className="rounded-circle bg-success text-white d-flex align-items-center justify-content-center me-3" style={{ width: '40px', height: '40px' }}>
                                            {testimonial.name.charAt(0)}
                                        </div>
                                        <div>
                                            <h6 className="mb-0">{testimonial.name}</h6>
                                            <small className="text-muted">{testimonial.role}</small>
                                        </div>
                                    </div>
                                </Card.Body>
                            </Card>
                        ))}
                    </div>
                </div>
            </div>
        </>
    )
}

export default Testimonials;