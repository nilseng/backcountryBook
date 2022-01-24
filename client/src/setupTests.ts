// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import "@testing-library/jest-dom";

// Mocking the following function since jsdom, used in mapbox-gl, does not support it yet
window.URL.createObjectURL = jest.fn();
