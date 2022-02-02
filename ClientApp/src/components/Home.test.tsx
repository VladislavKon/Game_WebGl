/**
 * @jest-environment jsdom
 */
import React from 'react';
import { render, unmountComponentAtNode } from 'react-dom';
import Home from './Home';
import {act} from 'react-dom/test-utils';


let container: any = null;
beforeEach(() => {
  // подготавливаем DOM-элемент, куда будем рендерить
  container = document.createElement("div");
  document.body.appendChild(container);
});

afterEach(() => {
  // подчищаем после завершения
  unmountComponentAtNode(container);
  container.remove();
  container = null;
});

it('Render Home component', () => {
    act(() => {
        render(<Home />, container);
    });

    expect(container.textContent).toBe("This is Home Page");
});