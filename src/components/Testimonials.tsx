import React from 'react';
import { Star, Quotes } from 'phosphor-react';

const Testimonials = () => {
  const testimonials = [
    {
      name: "Raj",
      role: "Software Engineer at Microsoft",
      text: "Career-Buddy's personalized guidance helped me crack interviews at top tech companies.",
      rating: 5
    },
    {
      name: "Netram",
      role: "Full Stack Developer",
      text: "The mentorship program and resources were crucial in my journey to becoming a developer.",
      rating: 5
    },
    {
      name: "Vansh",
      role: "Machine Learning Engineer",
      text: "Thanks to Career-Buddy, I found my passion in AI and landed my dream role.",
      rating: 5
    }
  ];

  return (
    <section className="testimonials-section">
      <h2>Success Stories</h2>
      <div className="testimonials-grid">
        {testimonials.map((testimonial, index) => (
          <div key={index} className="testimonial-card">
            <Quotes size={32} className="quote-icon" />
            <p className="testimonial-text">{testimonial.text}</p>
            <div className="rating">
              {[...Array(testimonial.rating)].map((_, i) => (
                <Star key={i} weight="fill" className="star-icon" />
              ))}
            </div>
            <div className="testimonial-author">
              <h3>{testimonial.name}</h3>
              <p>{testimonial.role}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Testimonials;
