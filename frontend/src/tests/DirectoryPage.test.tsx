import { render, screen } from '@testing-library/react';
import {expect, test} from 'vitest';
import DirectoryPage from '../pages/DirectoryPage';

test('DirectoryPage contains text info', () => {
    render(<DirectoryPage />);
    const container = screen.getByTestId('directory-page-container');
    expect(container.textContent).toContain('Local Charity Posts');
});