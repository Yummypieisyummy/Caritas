import { render, screen } from '@testing-library/react';
import {expect, test} from 'vitest';
import AboutPage from '../pages/AboutPage';

test('AboutPage contains text info', () => {
    render(<AboutPage />);
    const container = screen.getByTestId('about-page-container');
    expect(container).toHaveTextContent('Who is SVCare?');
    expect(container).toHaveTextContent('Started as a capstone project for Saint Vincent College’s computing department, we created Caritas to address needs in our community. Our team (SVCare) of five student developers remains dedicated to fostering genuine, charitable connection grounded in Benedictine values.');
});