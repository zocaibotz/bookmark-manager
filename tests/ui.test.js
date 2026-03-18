import { describe, it, expect, beforeEach, vi } from 'vitest';
import { getByLabelText, getByRole, queryByText, fireEvent } from '@testing-library/dom';
import { createBookmarkApp } from '../src/ui.js';

describe('bookmark UI', () => {
  beforeEach(() => {
    document.body.innerHTML = `
      <div id="app"></div>
    `;
  });

  it('renders list rows with title/url/tags and supports search + tag filter', () => {
    const app = createBookmarkApp(document.getElementById('app'), [
      { id: '1', title: 'OpenAI', url: 'https://openai.com', tags: ['ai'] },
      { id: '2', title: 'MDN', url: 'https://developer.mozilla.org', tags: ['docs', 'web'] }
    ]);
    app.render();

    expect(getByRole(document.body, 'link', { name: 'https://openai.com' })).toBeTruthy();
    fireEvent.input(getByLabelText(document.body, /search/i), { target: { value: 'mozilla' } });
    expect(queryByText(document.body, 'OpenAI')).toBeNull();

    fireEvent.click(getByRole(document.body, 'button', { name: 'docs' }));
    expect(queryByText(document.body, 'MDN')).toBeTruthy();
  });

  it('validates add form and deletes only after confirmation', () => {
    const app = createBookmarkApp(document.getElementById('app'), []);
    app.render();

    fireEvent.click(getByRole(document.body, 'button', { name: /add bookmark/i }));
    expect(queryByText(document.body, /title is required/i)).toBeTruthy();
    expect(queryByText(document.body, /valid url/i)).toBeTruthy();

    fireEvent.input(getByLabelText(document.body, /title/i), { target: { value: 'OpenAI' } });
    fireEvent.input(getByLabelText(document.body, /^url/i), { target: { value: 'https://openai.com' } });
    fireEvent.input(getByLabelText(document.body, /tags/i), { target: { value: 'ai, llm' } });
    fireEvent.click(getByRole(document.body, 'button', { name: /add bookmark/i }));

    expect(queryByText(document.body, 'OpenAI')).toBeTruthy();

    const confirmSpy = vi.spyOn(window, 'confirm').mockReturnValue(false);
    fireEvent.click(getByRole(document.body, 'button', { name: /delete openai/i }));
    expect(queryByText(document.body, 'OpenAI')).toBeTruthy();

    confirmSpy.mockReturnValue(true);
    fireEvent.click(getByRole(document.body, 'button', { name: /delete openai/i }));
    expect(queryByText(document.body, 'OpenAI')).toBeNull();

    confirmSpy.mockRestore();
  });
});
