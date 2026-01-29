import { render, screen } from '@testing-library/react';
import {expect, test} from 'vitest';
import AboutPage from '../pages/AboutPage';

test('AboutPage contains text info', () => {
    render(<AboutPage />);
    const container = screen.getByTestId('about-page-container');
    expect(container.textContent).toContain('Who is SVCare?');
    expect(container.textContent).toContain('Started as a capstone project for Saint Vincent College’s computing department, we created Caritas to address needs in our community. Our team (SVCare) of five student developers remains dedicated to fostering genuine, charitable connection grounded in Benedictine values.');
    expect(container.textContent).toContain('Submit feedback, suggestions, or issues directly to our team:');
    expect(container.textContent).toContain("Caritas' Mission");
    expect(container.textContent).toContain('The Latin word “caritas” means a selfless love for humankind or charity.');
    expect(container.textContent).toContain('Caritas is a tool that thoughtfully infuses this definition into its design. Cutting through the confusion of other platforms, Caritas aims to provide a simple avenue for connecting community organizations with charity recipients.');
    expect(container.textContent).toContain('By consulting with local organizations and community members, Caritas prioritizes the charity-focused communication experience. We seek to offer an intuitive, tailored space that improves outreach and connection.');
    expect(container.textContent).toContain('How to Use');
    expect(container.textContent).toContain('Organizations');
    expect(container.textContent).toContain('Post the item donations, services, and other offerings your community organization provides. Sign up to make a customizable profile and start posting.');
    expect(container.textContent).toContain('Recipients');
    expect(container.textContent).toContain('Search and filter for charitable aide types based on your location. Caritas offers account-free browsing for single users, so no need to sign up.');
    expect(container.textContent).toContain('Volunteers');
    expect(container.textContent).toContain('Search and filter for volunteer opportunities in your area. Caritas offers account-free browsing for single users, so no need to sign up.');
    expect(container.textContent).toContain('Reporting');
    expect(container.textContent).toContain("Ensure the continued integrity of Caritas' postings by submitting feedback.");
    expect(container.textContent).toContain('NOTE: Caritas does not handle any monetary transactions or fundraising in-platform.');
});

